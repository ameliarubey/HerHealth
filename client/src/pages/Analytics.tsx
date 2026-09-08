import { useMemo } from "react";
import StatsCard from "@/components/StatsCard";
import CycleAnalyticsChart from "@/components/CycleAnalyticsChart";
import { Calendar, Activity, TrendingUp, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";
import { getPeriods, getDailyLogs } from "@/lib/firebase";
import { useQuery } from "@tanstack/react-query";
import { differenceInDays, parse, format } from "date-fns";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useToast } from "@/hooks/use-toast";

export default function Analytics() {
  const { user } = useAuth();
  const { toast } = useToast();

  // Fetch user's periods
  const { data: periods = [], isLoading } = useQuery<any[]>({
    queryKey: ["/api/periods", user?.uid],
    enabled: !!user,
    queryFn: async () => {
      if (!user) return [];
      const periodsData = await getPeriods(user.uid);
      return periodsData.filter((p: any) => p.startDate).sort((a: any, b: any) => 
        new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
      );
    },
  });

  // Fetch user's daily logs
  const { data: dailyLogs = [] } = useQuery<any[]>({
    queryKey: ["/api/dailyLogs", user?.uid],
    enabled: !!user,
    queryFn: async () => {
      if (!user) return [];
      const logsData = await getDailyLogs(user.uid);
      return logsData;
    },
  });

  // Calculate analytics from real data
  const analytics = useMemo(() => {
    if (periods.length < 2) {
      return {
        avgCycleLength: 0,
        avgPeriodDuration: 0,
        regularityScore: 0,
        cycleLengthData: [],
        symptomData: [],
      };
    }

    // Calculate cycle lengths
    const cycleLengths: number[] = [];
    for (let i = 1; i < periods.length; i++) {
      const prevStart = parse(periods[i - 1].startDate, "yyyy-MM-dd", new Date());
      const currStart = parse(periods[i].startDate, "yyyy-MM-dd", new Date());
      const cycleLength = differenceInDays(currStart, prevStart);
      cycleLengths.push(cycleLength);
    }

    const avgCycleLength = Math.round(
      cycleLengths.reduce((a, b) => a + b, 0) / cycleLengths.length
    );

    // Calculate period durations
    const periodDurations = periods
      .filter((p: any) => p.endDate)
      .map((p: any) => {
        const start = parse(p.startDate, "yyyy-MM-dd", new Date());
        const end = parse(p.endDate, "yyyy-MM-dd", new Date());
        return differenceInDays(end, start) + 1;
      });

    const avgPeriodDuration = periodDurations.length > 0
      ? Math.round(periodDurations.reduce((a, b) => a + b, 0) / periodDurations.length)
      : 5; // Default to 5 days if no end dates

    // Calculate regularity score (based on variance in cycle lengths)
    const variance = cycleLengths.reduce((sum, len) => {
      return sum + Math.pow(len - avgCycleLength, 2);
    }, 0) / cycleLengths.length;
    const stdDev = Math.sqrt(variance);
    const regularityScore = Math.max(0, Math.min(100, 100 - stdDev * 10));

    // Prepare chart data for cycle lengths
    const cycleLengthData = periods.slice(1).map((period: any, i: number) => {
      const prevStart = parse(periods[i].startDate, "yyyy-MM-dd", new Date());
      const currStart = parse(period.startDate, "yyyy-MM-dd", new Date());
      return {
        cycle: format(currStart, "MMM"),
        length: differenceInDays(currStart, prevStart),
      };
    });

    // Calculate symptom frequency by month
    const symptomsByMonth: Record<string, number> = {};
    dailyLogs.forEach((log: any) => {
      if (log.symptoms && log.symptoms.length > 0) {
        const month = format(parse(log.date, "yyyy-MM-dd", new Date()), "MMM");
        symptomsByMonth[month] = (symptomsByMonth[month] || 0) + log.symptoms.length;
      }
    });

    const symptomData = Object.entries(symptomsByMonth).map(([cycle, length]) => ({
      cycle,
      length,
    }));

    return {
      avgCycleLength,
      avgPeriodDuration,
      regularityScore: Math.round(regularityScore),
      cycleLengthData,
      symptomData,
    };
  }, [periods, dailyLogs]);

  const handleExportPDF = () => {
    try {
      const doc = new jsPDF();
      
      // Add title
      doc.setFontSize(20);
      doc.text("HerHealth - Cycle Analytics Report", 14, 20);
      
      // Add date
      doc.setFontSize(10);
      doc.text(`Generated: ${format(new Date(), "MMMM dd, yyyy")}`, 14, 28);
      
      // Add summary stats
      doc.setFontSize(14);
      doc.text("Summary Statistics", 14, 40);
      doc.setFontSize(10);
      doc.text(`Average Cycle Length: ${analytics.avgCycleLength > 0 ? analytics.avgCycleLength : "N/A"} days`, 14, 48);
      doc.text(`Average Period Duration: ${analytics.avgPeriodDuration} days`, 14, 54);
      doc.text(`Regularity Score: ${analytics.regularityScore}%`, 14, 60);
      
      // Add period history table
      if (periods.length > 0) {
        doc.setFontSize(14);
        doc.text("Period History", 14, 72);
        
        const periodTableData = periods.map((p: any) => [
          format(parse(p.startDate, "yyyy-MM-dd", new Date()), "MMM dd, yyyy"),
          p.endDate ? format(parse(p.endDate, "yyyy-MM-dd", new Date()), "MMM dd, yyyy") : "In progress",
          p.endDate ? `${differenceInDays(parse(p.endDate, "yyyy-MM-dd", new Date()), parse(p.startDate, "yyyy-MM-dd", new Date())) + 1} days` : "N/A"
        ]);
        
        autoTable(doc, {
          startY: 78,
          head: [["Start Date", "End Date", "Duration"]],
          body: periodTableData,
          theme: "striped",
          headStyles: { fillColor: [219, 112, 147] }
        });
      }
      
      // Add cycle length trends
      if (analytics.cycleLengthData.length > 0) {
        const finalY = (doc as any).lastAutoTable?.finalY || 78;
        doc.setFontSize(14);
        doc.text("Cycle Length Trends", 14, finalY + 15);
        
        const cycleLengthTableData = analytics.cycleLengthData.map((d: any) => [
          d.cycle,
          `${d.length} days`
        ]);
        
        autoTable(doc, {
          startY: finalY + 20,
          head: [["Month", "Cycle Length"]],
          body: cycleLengthTableData,
          theme: "striped",
          headStyles: { fillColor: [219, 112, 147] }
        });
      }
      
      // Save the PDF
      doc.save(`herhealth-analytics-${format(new Date(), "yyyy-MM-dd")}.pdf`);
      
      toast({
        title: "PDF Exported!",
        description: "Your cycle analytics report has been downloaded",
      });
    } catch (error: any) {
      toast({
        title: "Export Failed",
        description: error.message || "Failed to generate PDF",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (periods.length < 2) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto p-6 space-y-6">
          <div>
            <h1 className="text-4xl font-bold mb-2">Analytics</h1>
            <p className="text-muted-foreground">Insights and trends from your cycle data</p>
          </div>
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              Log at least two periods to see analytics and insights
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">Analytics</h1>
            <p className="text-muted-foreground">Insights and trends from your cycle data</p>
          </div>
          <Button variant="outline" className="gap-2" onClick={handleExportPDF} data-testid="button-export">
            <Download className="h-4 w-4" />
            Export PDF
          </Button>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <StatsCard
            title="Average Cycle Length"
            value={analytics.avgCycleLength > 0 ? `${analytics.avgCycleLength} days` : "N/A"}
            icon={Calendar}
          />
          <StatsCard
            title="Period Duration"
            value={`${analytics.avgPeriodDuration} days`}
            subtitle="Average"
            icon={Activity}
          />
          <StatsCard
            title="Regularity Score"
            value={`${analytics.regularityScore}%`}
            icon={TrendingUp}
          />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <CycleAnalyticsChart 
            data={analytics.cycleLengthData} 
            title="Cycle Length Trends" 
          />
          <CycleAnalyticsChart 
            data={analytics.symptomData.length > 0 ? analytics.symptomData : [{ cycle: "No data", length: 0 }]} 
            title="Symptom Frequency" 
          />
        </div>
      </div>
    </div>
  );
}
