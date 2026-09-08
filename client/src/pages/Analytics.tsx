import { useMemo } from "react";

import StatsCard from "@/components/StatsCard";
import CycleAnalyticsChart from "@/components/CycleAnalyticsChart";

import {
  Calendar,
  Activity,
  TrendingUp,
  Download,
  Sparkles,
  BarChart3,
  Heart,
} from "lucide-react";

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

      return periodsData
        .filter((p: any) => p.startDate)
        .sort(
          (a: any, b: any) =>
            new Date(a.startDate).getTime() -
            new Date(b.startDate).getTime()
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

    const cycleLengths: number[] = [];

    for (let i = 1; i < periods.length; i++) {
      const prevStart = parse(
        periods[i - 1].startDate,
        "yyyy-MM-dd",
        new Date()
      );

      const currStart = parse(
        periods[i].startDate,
        "yyyy-MM-dd",
        new Date()
      );

      const cycleLength = differenceInDays(currStart, prevStart);

      cycleLengths.push(cycleLength);
    }

    const avgCycleLength = Math.round(
      cycleLengths.reduce((a, b) => a + b, 0) / cycleLengths.length
    );

    const periodDurations = periods
      .filter((p: any) => p.endDate)
      .map((p: any) => {
        const start = parse(p.startDate, "yyyy-MM-dd", new Date());
        const end = parse(p.endDate, "yyyy-MM-dd", new Date());

        return differenceInDays(end, start) + 1;
      });

    const avgPeriodDuration =
      periodDurations.length > 0
        ? Math.round(
            periodDurations.reduce((a, b) => a + b, 0) /
              periodDurations.length
          )
        : 5;

    const variance =
      cycleLengths.reduce((sum, len) => {
        return sum + Math.pow(len - avgCycleLength, 2);
      }, 0) / cycleLengths.length;

    const stdDev = Math.sqrt(variance);

    const regularityScore = Math.max(
      0,
      Math.min(100, 100 - stdDev * 10)
    );

    const cycleLengthData = periods.slice(1).map(
      (period: any, i: number) => {
        const prevStart = parse(
          periods[i].startDate,
          "yyyy-MM-dd",
          new Date()
        );

        const currStart = parse(
          period.startDate,
          "yyyy-MM-dd",
          new Date()
        );

        return {
          cycle: format(currStart, "MMM"),
          length: differenceInDays(currStart, prevStart),
        };
      }
    );

    const symptomsByMonth: Record<string, number> = {};

    dailyLogs.forEach((log: any) => {
      if (log.symptoms && log.symptoms.length > 0) {
        const month = format(
          parse(log.date, "yyyy-MM-dd", new Date()),
          "MMM"
        );

        symptomsByMonth[month] =
          (symptomsByMonth[month] || 0) + log.symptoms.length;
      }
    });

    const symptomData = Object.entries(symptomsByMonth).map(
      ([cycle, length]) => ({
        cycle,
        length,
      })
    );

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

      doc.setFontSize(20);
      doc.text("HerHealth - Cycle Analytics Report", 14, 20);

      doc.setFontSize(10);
      doc.text(
        `Generated: ${format(new Date(), "MMMM dd, yyyy")}`,
        14,
        28
      );

      doc.setFontSize(14);
      doc.text("Summary Statistics", 14, 40);

      doc.setFontSize(10);

      doc.text(
        `Average Cycle Length: ${
          analytics.avgCycleLength > 0
            ? analytics.avgCycleLength
            : "N/A"
        } days`,
        14,
        48
      );

      doc.text(
        `Average Period Duration: ${analytics.avgPeriodDuration} days`,
        14,
        54
      );

      doc.text(
        `Regularity Score: ${analytics.regularityScore}%`,
        14,
        60
      );

      if (periods.length > 0) {
        doc.setFontSize(14);
        doc.text("Period History", 14, 72);

        const periodTableData = periods.map((p: any) => [
          format(
            parse(p.startDate, "yyyy-MM-dd", new Date()),
            "MMM dd, yyyy"
          ),
          p.endDate
            ? format(
                parse(p.endDate, "yyyy-MM-dd", new Date()),
                "MMM dd, yyyy"
              )
            : "In progress",
          p.endDate
            ? `${
                differenceInDays(
                  parse(p.endDate, "yyyy-MM-dd", new Date()),
                  parse(p.startDate, "yyyy-MM-dd", new Date())
                ) + 1
              } days`
            : "N/A",
        ]);

        autoTable(doc, {
          startY: 78,
          head: [["Start Date", "End Date", "Duration"]],
          body: periodTableData,
          theme: "striped",
          headStyles: {
            fillColor: [219, 112, 147],
          },
        });
      }

      if (analytics.cycleLengthData.length > 0) {
        const finalY =
          (doc as any).lastAutoTable?.finalY || 78;

        doc.setFontSize(14);
        doc.text(
          "Cycle Length Trends",
          14,
          finalY + 15
        );

        const cycleLengthTableData =
          analytics.cycleLengthData.map((d: any) => [
            d.cycle,
            `${d.length} days`,
          ]);

        autoTable(doc, {
          startY: finalY + 20,
          head: [["Month", "Cycle Length"]],
          body: cycleLengthTableData,
          theme: "striped",
          headStyles: {
            fillColor: [219, 112, 147],
          },
        });
      }

      doc.save(
        `herhealth-analytics-${format(
          new Date(),
          "yyyy-MM-dd"
        )}.pdf`
      );

      toast({
        title: "PDF Exported!",
        description:
          "Your cycle analytics report has been downloaded",
      });
    } catch (error: any) {
      toast({
        title: "Export Failed",
        description:
          error.message || "Failed to generate PDF",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-transparent">
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-sm">
              <BarChart3 className="h-6 w-6 animate-pulse text-rose-400" />
            </div>

            <p className="text-sm text-slate-500">
              Reading your cycle patterns...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (periods.length < 2) {
    return (
      <div className="min-h-screen bg-transparent">
        <div className="mx-auto max-w-7xl space-y-8 p-6 lg:p-8">

          <section className="relative overflow-hidden rounded-[2rem] border border-rose-100 bg-white/85 px-7 py-8 shadow-sm md:px-10 md:py-10">
            <div className="absolute -right-16 -top-20 h-52 w-52 rounded-full bg-rose-100/60 blur-3xl" />
            <div className="absolute -bottom-20 right-32 h-40 w-40 rounded-full bg-violet-100/50 blur-3xl" />

            <div className="relative">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-rose-50 px-3.5 py-2 text-xs font-semibold text-rose-700">
                <Sparkles className="h-3.5 w-3.5" />
                Your insights
              </div>

              <h1 className="text-3xl font-semibold tracking-tight text-slate-800 md:text-4xl">
                Your cycle story,
                <span className="text-rose-500"> over time.</span>
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500 md:text-base">
                Track your patterns and discover helpful insights as you
                continue logging your cycle.
              </p>
            </div>
          </section>

          <div className="rounded-[1.75rem] border border-rose-100 bg-white/85 px-6 py-14 text-center shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-rose-50 to-violet-50">
              <BarChart3 className="h-7 w-7 text-rose-400" />
            </div>

            <h2 className="mt-5 text-xl font-semibold text-slate-800">
              Your insights are just getting started
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              Log at least two periods to unlock cycle trends,
              regularity insights, and symptom patterns.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent">
      <div className="mx-auto max-w-7xl space-y-8 p-6 lg:p-8">

        {/* Hero */}
        <section className="relative overflow-hidden rounded-[2rem] border border-rose-100 bg-white/85 px-7 py-8 shadow-sm backdrop-blur md:px-10 md:py-9">
          <div className="absolute -right-20 -top-24 h-60 w-60 rounded-full bg-rose-100/60 blur-3xl" />
          <div className="absolute -bottom-24 right-28 h-48 w-48 rounded-full bg-violet-100/50 blur-3xl" />

          <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-rose-50 px-3.5 py-2 text-xs font-semibold text-rose-700">
                <Sparkles className="h-3.5 w-3.5" />
                Your insights
              </div>

              <h1 className="text-3xl font-semibold tracking-tight text-slate-800 md:text-4xl">
                Your cycle story,
                <span className="text-rose-500"> over time.</span>
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500 md:text-base">
                Understand your patterns, spot trends, and learn more about
                what your cycle data is telling you.
              </p>
            </div>

            <Button
              onClick={handleExportPDF}
              className="relative w-full gap-2 rounded-xl bg-rose-500 px-5 text-white shadow-sm hover:bg-rose-600 md:w-auto"
              data-testid="button-export"
            >
              <Download className="h-4 w-4" />
              Export report
            </Button>
          </div>
        </section>

        {/* Stats */}
        <section>
          <div className="mb-4 flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-rose-400" />
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
              At a glance
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            <StatsCard
              title="Average Cycle Length"
              value={
                analytics.avgCycleLength > 0
                  ? `${analytics.avgCycleLength} days`
                  : "N/A"
              }
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
        </section>

        {/* Charts */}
        <section>
          <div className="mb-5">
            <p className="mb-1 text-xs font-semibold uppercase tracking-[0.16em] text-rose-400">
              Patterns & trends
            </p>

            <h2 className="text-2xl font-semibold tracking-tight text-slate-800">
              See how your cycle changes
            </h2>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <CycleAnalyticsChart
              data={analytics.cycleLengthData}
              title="Cycle Length Trends"
            />

            <CycleAnalyticsChart
              data={
                analytics.symptomData.length > 0
                  ? analytics.symptomData
                  : [{ cycle: "No data", length: 0 }]
              }
              title="Symptom Frequency"
            />
          </div>
        </section>

        {/* Insight card */}
        <section className="overflow-hidden rounded-[1.75rem] border border-rose-100/80 bg-gradient-to-r from-white/90 via-rose-50/70 to-violet-50/60 p-6 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white shadow-sm">
              <Heart className="h-5 w-5 text-rose-400" />
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-rose-400">
                A gentle reminder
              </p>

              <h3 className="mt-1 font-semibold text-slate-800">
                Your data is a guide, not a diagnosis
              </h3>

              <p className="mt-1 max-w-3xl text-sm leading-6 text-slate-500">
                Cycle patterns can naturally vary from month to month.
                Continue logging consistently to build a clearer picture of
                your personal patterns.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
