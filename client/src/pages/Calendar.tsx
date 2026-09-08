import { useState, useMemo } from "react";
import CalendarView from "@/components/CalendarView";
import { addDays, subDays, parse, differenceInDays, eachDayOfInterval } from "date-fns";
import { useAuth } from "@/lib/auth-context";
import { getPeriods, getDailyLogs } from "@/lib/firebase";
import { useQuery } from "@tanstack/react-query";

export default function Calendar() {
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const { user } = useAuth();

  // Fetch user's periods
  const { data: periods = [] } = useQuery<any[]>({
    queryKey: ["/api/periods", user?.uid],
    enabled: !!user,
    queryFn: async () => {
      if (!user) return [];
      const periodsData = await getPeriods(user.uid);
      return periodsData.filter((p: any) => p.startDate);
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

  // Calculate period days from actual logged periods
  const periodDays = useMemo(() => {
    const allPeriodDays: Date[] = [];
    
    periods.forEach((period: any) => {
      const startDate = parse(period.startDate, "yyyy-MM-dd", new Date());
      
      if (period.endDate) {
        const endDate = parse(period.endDate, "yyyy-MM-dd", new Date());
        const days = eachDayOfInterval({ start: startDate, end: endDate });
        allPeriodDays.push(...days);
      } else {
        // If no end date, assume 5 days (default period duration)
        for (let i = 0; i < 5; i++) {
          allPeriodDays.push(addDays(startDate, i));
        }
      }
    });
    
    return allPeriodDays;
  }, [periods]);

  // Calculate ovulation and fertile window from most recent period
  const { ovulationDay, fertileDays } = useMemo(() => {
    if (periods.length === 0) {
      return { ovulationDay: null, fertileDays: [] };
    }

    // Sort periods by start date
    const sortedPeriods = [...periods].sort((a: any, b: any) => 
      new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
    );

    const lastPeriod = sortedPeriods[0];
    const lastPeriodStart = parse(lastPeriod.startDate, "yyyy-MM-dd", new Date());
    
    // Ovulation typically occurs 14 days before next period (day 14 of 28-day cycle)
    const ovulation = addDays(lastPeriodStart, 14);
    
    // Fertile window: 5 days before ovulation + ovulation day
    const fertile = [
      addDays(ovulation, -5),
      addDays(ovulation, -4),
      addDays(ovulation, -3),
      addDays(ovulation, -2),
      addDays(ovulation, -1),
      ovulation,
    ];
    
    return { ovulationDay: ovulation, fertileDays: fertile };
  }, [periods]);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-4xl font-bold mb-2">Calendar</h1>
          <p className="text-muted-foreground">Track your cycle and view predictions</p>
        </div>

        <CalendarView
          selectedMonth={selectedMonth}
          onMonthChange={setSelectedMonth}
          onDayClick={(date) => console.log("Day clicked:", date)}
          periodDays={periodDays}
          ovulationDay={ovulationDay || undefined}
          fertileDays={fertileDays}
        />
      </div>
    </div>
  );
}
