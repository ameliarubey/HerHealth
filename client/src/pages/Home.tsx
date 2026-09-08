import { useState, useEffect } from "react";
import CyclePhaseCard from "@/components/CyclePhaseCard";
import NextPeriodCountdown from "@/components/NextPeriodCountdown";
import QuickLogButtons from "@/components/QuickLogButtons";
import { getCurrentCycleDay, getCurrentPhase, getDaysUntilNextPeriod, getNextPeriodDate, type CycleData } from "@/lib/cycle-utils";
import { subDays, format, parse } from "date-fns";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { Card } from "@/components/ui/card";
import MoodSelector from "@/components/MoodSelector";
import SymptomLogger from "@/components/SymptomLogger";
import FlowIntensitySlider from "@/components/FlowIntensitySlider";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/auth-context";
import { logDailyEntry, getPeriods, getUserProfile, logPeriod } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";

export default function Home() {
  const [dialogOpen, setDialogOpen] = useState<string | null>(null);
  const [selectedMood, setSelectedMood] = useState<string>();
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [flowIntensity, setFlowIntensity] = useState(0);
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);
  const [periodStartDate, setPeriodStartDate] = useState<Date | undefined>(new Date());
  
  const { user } = useAuth();
  const { toast } = useToast();

  // Fetch user's periods to calculate cycle data
  const { data: periods = [], isLoading, error: periodsError } = useQuery<any[]>({
    queryKey: ["/api/periods", user?.uid],
    enabled: !!user,
    queryFn: async () => {
      if (!user) return [];
      try {
        const periodsData = await getPeriods(user.uid);
        return periodsData.filter((p: any) => p.startDate); // Filter out any invalid entries
      } catch (error) {
        console.error("Error fetching periods:", error);
        throw error;
      }
    },
  });

  // Fetch user profile for cycle preferences
  const { data: profile } = useQuery({
    queryKey: ["/api/profile", user?.uid],
    enabled: !!user,
    queryFn: async () => {
      if (!user) return null;
      return await getUserProfile(user.uid);
    },
  });

  // Calculate cycle data from periods
  const cycleData: CycleData = (() => {
    if (periods.length === 0) {
      // Default for new users
      return {
        lastPeriodStart: subDays(new Date(), 15),
        averageCycleLength: profile?.cycleData?.averageCycleLength || 28,
        averagePeriodDuration: profile?.cycleData?.averagePeriodDuration || 5,
      };
    }

    // Sort periods by start date
    const sortedPeriods = [...periods].sort((a: any, b: any) => 
      new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
    );

    const lastPeriod = sortedPeriods[0];
    
    // Calculate average cycle length from last few cycles
    let totalCycleLength = 0;
    let cycleCount = 0;
    for (let i = 0; i < sortedPeriods.length - 1 && i < 3; i++) {
      const current = parse(sortedPeriods[i].startDate, "yyyy-MM-dd", new Date());
      const next = parse(sortedPeriods[i + 1].startDate, "yyyy-MM-dd", new Date());
      
      // Validate dates before calculating difference
      if (isNaN(current.getTime()) || isNaN(next.getTime())) {
        continue;
      }
      
      const diff = Math.abs(current.getTime() - next.getTime());
      totalCycleLength += Math.ceil(diff / (1000 * 60 * 60 * 24));
      cycleCount++;
    }
    
    const averageCycleLength = cycleCount > 0 
      ? Math.round(totalCycleLength / cycleCount)
      : profile?.cycleData?.averageCycleLength || 28;

    // Parse the last period start date properly
    const lastPeriodStart = parse(lastPeriod.startDate, "yyyy-MM-dd", new Date());

    return {
      lastPeriodStart: isNaN(lastPeriodStart.getTime()) ? new Date() : lastPeriodStart,
      averageCycleLength,
      averagePeriodDuration: profile?.cycleData?.averagePeriodDuration || 5,
    };
  })();

  const cycleDay = getCurrentCycleDay(cycleData);
  const phase = getCurrentPhase(cycleDay, cycleData);
  const daysUntil = getDaysUntilNextPeriod(cycleData);
  const nextPeriodDate = getNextPeriodDate(cycleData);

  const handleSaveLog = async () => {
    if (!user) return;

    setSaving(true);
    try {
      const today = format(new Date(), "yyyy-MM-dd");
      
      await logDailyEntry(user.uid, {
        date: today,
        mood: dialogOpen === "mood" ? selectedMood : undefined,
        symptoms: dialogOpen === "symptoms" ? selectedSymptoms : undefined,
        flowIntensity: dialogOpen === "flow" ? flowIntensity : undefined,
        note: dialogOpen === "note" ? note : undefined,
      });

      toast({
        title: "Saved!",
        description: "Your log has been saved successfully",
      });

      // Reset form
      setSelectedMood(undefined);
      setSelectedSymptoms([]);
      setFlowIntensity(0);
      setNote("");
      setDialogOpen(null);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save log",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleLogPeriod = async () => {
    if (!user || !periodStartDate) return;

    setSaving(true);
    try {
      await logPeriod(user.uid, {
        startDate: format(periodStartDate, "yyyy-MM-dd"),
      });

      toast({
        title: "Period logged!",
        description: "Your period has been recorded",
      });

      // Invalidate and refetch periods
      queryClient.invalidateQueries({ queryKey: ["/api/periods", user.uid] });
      
      setPeriodStartDate(new Date());
      setDialogOpen(null);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to log period",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your cycle data...</p>
        </div>
      </div>
    );
  }

  if (periodsError) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-destructive mb-4">Failed to load cycle data</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    );
  }

  // Show onboarding if no periods logged
  if (periods.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-3xl mx-auto p-6">
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
            <div className="space-y-4">
              <h1 className="text-4xl font-bold">Welcome to HerHealth!</h1>
              <p className="text-lg text-muted-foreground max-w-md">
                Start tracking your menstrual cycle to gain insights into your health and wellness.
              </p>
            </div>
            
            <Card className="p-8 max-w-md w-full">
              <div className="space-y-4">
                <div className="p-4 rounded-full bg-primary/10 w-16 h-16 flex items-center justify-center mx-auto">
                  <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-semibold">Log Your First Period</h2>
                <p className="text-muted-foreground">
                  Track your cycle to get personalized insights, predictions, and health recommendations.
                </p>
                <Button
                  className="w-full"
                  size="lg"
                  onClick={() => setDialogOpen("period")}
                  data-testid="button-log-first-period"
                >
                  Get Started
                </Button>
              </div>
            </Card>

            {/* Period logging dialog for first-time users */}
            <Dialog open={dialogOpen === "period"} onOpenChange={(open) => !open && setDialogOpen(null)}>
              <DialogContent data-testid="dialog-log-period">
                <DialogHeader>
                  <DialogTitle>Log Your First Period</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label>When did your period start?</Label>
                    <div className="flex justify-center mt-4">
                      <Calendar
                        mode="single"
                        selected={periodStartDate}
                        onSelect={setPeriodStartDate}
                        className="rounded-md border"
                        data-testid="calendar-period-start"
                      />
                    </div>
                  </div>
                  <Button
                    className="w-full"
                    onClick={handleLogPeriod}
                    disabled={saving || !periodStartDate}
                    data-testid="button-save-period"
                  >
                    {saving ? "Saving..." : "Log Period"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50/70 via-background to-pink-50/40 dark:from-background dark:via-background dark:to-rose-950/10">
      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 space-y-8">

        {/* Dashboard header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-medium text-primary mb-2">
              Your personal wellness space
            </p>
            <h1 className="herhealth-editorial text-3xl sm:text-4xl">
              Welcome back
            </h1>
            <p className="text-muted-foreground mt-2">
              Here's a gentle overview of your cycle today.
            </p>
          </div>

          <div className="rounded-2xl border bg-white/70 backdrop-blur px-4 py-3 shadow-sm">
            <p className="text-xs text-muted-foreground">Today</p>
            <p className="font-semibold">{format(new Date(), "EEEE, MMM d")}</p>
          </div>
        </div>

        {/* Cycle overview */}
        <section className="space-y-3">
          <div>
            <h2 className="text-lg font-semibold">Cycle overview</h2>
            <p className="text-sm text-muted-foreground">
              Understand where you are in your cycle at a glance.
            </p>
          </div>

          <div className="grid gap-5 lg:grid-cols-2">
            <div className="rounded-3xl bg-gradient-to-br from-primary/15 via-primary/5 to-background p-[1px] shadow-sm">
              <div className="h-full rounded-[23px] bg-card">
                <CyclePhaseCard phase={phase} cycleDay={cycleDay} />
              </div>
            </div>

            <div className="rounded-3xl bg-gradient-to-br from-rose-200/60 via-pink-100/40 to-background dark:from-rose-950/40 dark:via-background p-[1px] shadow-sm">
              <div className="h-full rounded-[23px] bg-card">
                <NextPeriodCountdown
                  daysUntil={daysUntil}
                  nextPeriodDate={nextPeriodDate}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Quick logging */}
        <section className="space-y-3">
          <div>
            <h2 className="text-lg font-semibold">How are you feeling?</h2>
            <p className="text-sm text-muted-foreground">
              Keep your health journal updated in a few taps.
            </p>
          </div>

          <div className="rounded-3xl border bg-white/80 backdrop-blur shadow-sm overflow-hidden">
            <QuickLogButtons
              onLogPeriod={() => setDialogOpen("period")}
              onLogMood={() => setDialogOpen("mood")}
              onLogSymptoms={() => setDialogOpen("symptoms")}
              onLogFlow={() => setDialogOpen("flow")}
              onAddNote={() => setDialogOpen("note")}
            />
          </div>
        </section>

        {/* Wellness insight */}
        <section className="rounded-3xl border bg-gradient-to-r from-primary/10 via-background to-rose-50/60 dark:from-primary/10 dark:via-background dark:to-rose-950/10 p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="max-w-2xl">
              <p className="text-sm font-medium text-primary mb-2">
                A little reminder
              </p>
              <h2 className="text-2xl font-semibold tracking-tight">
                Your body is giving you information every day.
              </h2>
              <p className="text-sm text-muted-foreground mt-2 leading-6">
                Logging your mood, symptoms, flow, and notes can help you notice
                patterns across your cycle and understand your wellbeing better.
              </p>
            </div>

            <div className="shrink-0 rounded-2xl bg-primary/10 px-5 py-4 text-center">
              <div className="text-2xl font-bold text-primary">{cycleDay}</div>
              <div className="text-xs text-muted-foreground mt-1">Cycle day</div>
            </div>
          </div>
        </section>

        {/* Period dialog */}
        <Dialog open={dialogOpen === "period"} onOpenChange={(open) => !open && setDialogOpen(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Log Period Start Date</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>When did your period start?</Label>
                <div className="flex justify-center mt-4">
                  <Calendar
                    mode="single"
                    selected={periodStartDate}
                    onSelect={setPeriodStartDate}
                    className="rounded-md border"
                    data-testid="calendar-period-start"
                  />
                </div>
              </div>
              <Button
                onClick={handleLogPeriod}
                disabled={saving || !periodStartDate}
                className="w-full"
                data-testid="button-save-period"
              >
                {saving ? "Saving..." : "Log Period"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Mood dialog */}
        <Dialog open={dialogOpen === "mood"} onOpenChange={(open) => !open && setDialogOpen(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Log Your Mood</DialogTitle>
            </DialogHeader>
            <MoodSelector selectedMood={selectedMood} onMoodSelect={setSelectedMood} />
            <Button onClick={handleSaveLog} disabled={saving || !selectedMood} data-testid="button-save-mood">
              {saving ? "Saving..." : "Save"}
            </Button>
          </DialogContent>
        </Dialog>

        {/* Symptoms dialog */}
        <Dialog open={dialogOpen === "symptoms"} onOpenChange={(open) => !open && setDialogOpen(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Log Symptoms</DialogTitle>
            </DialogHeader>
            <SymptomLogger
              selectedSymptoms={selectedSymptoms}
              onSymptomsChange={setSelectedSymptoms}
            />
            <Button
              onClick={handleSaveLog}
              disabled={saving || selectedSymptoms.length === 0}
              data-testid="button-save-symptoms"
            >
              {saving ? "Saving..." : "Save"}
            </Button>
          </DialogContent>
        </Dialog>

        {/* Flow dialog */}
        <Dialog open={dialogOpen === "flow"} onOpenChange={(open) => !open && setDialogOpen(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Log Flow Intensity</DialogTitle>
            </DialogHeader>
            <FlowIntensitySlider
              intensity={flowIntensity}
              onIntensityChange={setFlowIntensity}
            />
            <Button onClick={handleSaveLog} disabled={saving} data-testid="button-save-flow">
              {saving ? "Saving..." : "Save"}
            </Button>
          </DialogContent>
        </Dialog>

        {/* Note dialog */}
        <Dialog open={dialogOpen === "note"} onOpenChange={(open) => !open && setDialogOpen(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add a Note</DialogTitle>
            </DialogHeader>
            <Textarea
              placeholder="How are you feeling today? Any thoughts or observations..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="min-h-32"
              data-testid="input-note"
            />
            <Button onClick={handleSaveLog} disabled={saving || !note.trim()} data-testid="button-save-note">
              {saving ? "Saving..." : "Save"}
            </Button>
          </DialogContent>
        </Dialog>

      </div>
    </div>

  );
}
