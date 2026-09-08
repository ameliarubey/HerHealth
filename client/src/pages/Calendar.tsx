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
    <div className="min-h-screen bg-gradient-to-br from-rose-50/60 via-background to-pink-50/30 dark:from-background dark:via-background dark:to-rose-950/10">
      <div className="max-w-6xl mx-auto px-4 py-6 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="relative overflow-hidden rounded-3xl border bg-background/80 backdrop-blur-sm shadow-sm mb-6">
          <div className="absolute -right-12 -top-16 h-40 w-40 rounded-full bg-primary/10 blur-2xl" />
          <div className="absolute -left-10 bottom-[-60px] h-36 w-36 rounded-full bg-rose-200/30 blur-2xl dark:bg-rose-900/20" />

          <div className="relative px-6 py-7 sm:px-8">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-2xl">
                🌸
              </div>

              <div>
                <p className="text-sm font-medium text-primary mb-1">
                  Your cycle, beautifully organized
                </p>

                <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
                  Cycle Calendar
                </h1>

                <p className="mt-2 text-sm sm:text-base text-muted-foreground max-w-xl">
                  Track your period, fertile window, and cycle patterns all in
                  one place.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Calendar */}
        <div className="rounded-3xl border bg-background/90 shadow-sm overflow-hidden">
          <div className="px-5 pt-5 sm:px-7 sm:pt-7">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold">Your cycle</h2>
                <p className="text-sm text-muted-foreground">
                  Tap a day to view your cycle information.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <span className="h-3 w-3 rounded-full bg-primary" />
                  Period
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="h-3 w-3 rounded-full bg-pink-200 dark:bg-pink-900" />
                  Fertile window
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="h-3 w-3 rounded-full border-2 border-primary" />
                  Ovulation
                </div>
              </div>
            </div>
          </div>

          <div className="px-2 pb-4 sm:px-5 sm:pb-6">
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

        {/* Small educational note */}
        <div className="mt-5 rounded-2xl border bg-primary/[0.04] px-5 py-4">
          <div className="flex gap-3">
            <span className="text-lg">💗</span>
            <div>
              <p className="text-sm font-medium">A note about predictions</p>
              <p className="mt-1 text-xs sm:text-sm text-muted-foreground leading-5">
                Cycle predictions are estimates based on the information you
                log. Keep tracking regularly to help HerHealth understand
                your personal cycle patterns.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
