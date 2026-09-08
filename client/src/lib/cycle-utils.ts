import { differenceInDays, addDays, format, startOfDay } from "date-fns";

export type CyclePhase = "menstrual" | "follicular" | "ovulatory" | "luteal";

export interface CycleData {
  lastPeriodStart: Date;
  averageCycleLength: number;
  averagePeriodDuration: number;
}

export function getCurrentCycleDay(cycleData: CycleData): number {
  // Validate cycleData
  if (!cycleData.lastPeriodStart || isNaN(new Date(cycleData.lastPeriodStart).getTime())) {
    return 1; // Default to day 1
  }
  if (!cycleData.averageCycleLength || cycleData.averageCycleLength <= 0) {
    return 1;
  }
  
  const today = startOfDay(new Date());
  const daysSinceStart = differenceInDays(today, startOfDay(cycleData.lastPeriodStart));
  
  // Clamp negative values (future-dated periods)
  if (daysSinceStart < 0) {
    return 1;
  }
  
  return (daysSinceStart % cycleData.averageCycleLength) + 1;
}

export function getDaysUntilNextPeriod(cycleData: CycleData): number {
  // Validate cycleData
  if (!cycleData.lastPeriodStart || isNaN(new Date(cycleData.lastPeriodStart).getTime())) {
    return 0; // Return 0 if invalid
  }
  if (!cycleData.averageCycleLength || cycleData.averageCycleLength <= 0) {
    return 0;
  }
  
  const today = startOfDay(new Date());
  const daysSinceStart = differenceInDays(today, startOfDay(cycleData.lastPeriodStart));
  
  // Clamp negative values (future-dated periods)
  if (daysSinceStart < 0) {
    return Math.abs(daysSinceStart); // Return days until the future period starts
  }
  
  const daysRemaining = cycleData.averageCycleLength - (daysSinceStart % cycleData.averageCycleLength);
  return Math.max(0, daysRemaining); // Ensure never negative
}

export function getNextPeriodDate(cycleData: CycleData): Date {
  // Validate cycleData before calculations
  if (!cycleData.lastPeriodStart || isNaN(new Date(cycleData.lastPeriodStart).getTime())) {
    return new Date(); // Return today if invalid
  }
  
  const daysUntil = getDaysUntilNextPeriod(cycleData);
  return addDays(new Date(), daysUntil);
}

export function getCurrentPhase(cycleDay: number, cycleData: CycleData): CyclePhase {
  if (cycleDay <= cycleData.averagePeriodDuration) {
    return "menstrual";
  }
  
  const ovulationDay = Math.round(cycleData.averageCycleLength / 2);
  
  if (cycleDay < ovulationDay - 2) {
    return "follicular";
  }
  
  if (cycleDay >= ovulationDay - 2 && cycleDay <= ovulationDay + 2) {
    return "ovulatory";
  }
  
  return "luteal";
}

export function getPhaseInfo(phase: CyclePhase) {
  const phaseData = {
    menstrual: {
      name: "Menstrual Phase",
      description: "Your body is shedding the uterine lining. Rest and self-care are important.",
      color: "hsl(240 60% 60%)",
      bgGradient: "from-blue-500/10 to-purple-500/10",
    },
    follicular: {
      name: "Follicular Phase",
      description: "Energy levels rise as your body prepares for ovulation. Great time for new activities!",
      color: "hsl(340 70% 55%)",
      bgGradient: "from-pink-500/10 to-rose-500/10",
    },
    ovulatory: {
      name: "Ovulatory Phase",
      description: "Peak fertility window. You may feel more confident and energetic.",
      color: "hsl(30 90% 55%)",
      bgGradient: "from-orange-500/10 to-amber-500/10",
    },
    luteal: {
      name: "Luteal Phase",
      description: "Progesterone rises. You might feel more introspective. PMS may occur near the end.",
      color: "hsl(280 60% 60%)",
      bgGradient: "from-purple-500/10 to-violet-500/10",
    },
  };
  
  return phaseData[phase];
}

export function getFertileWindow(cycleData: CycleData): { start: Date; end: Date } {
  const ovulationDay = Math.round(cycleData.averageCycleLength / 2);
  const cycleStart = cycleData.lastPeriodStart;
  
  return {
    start: addDays(cycleStart, ovulationDay - 5),
    end: addDays(cycleStart, ovulationDay + 1),
  };
}
