import { Card } from "@/components/ui/card";
import { getPhaseInfo, type CyclePhase } from "@/lib/cycle-utils";
import { Flower2, Moon, Sparkles, Sun } from "lucide-react";

interface CyclePhaseCardProps {
  phase: CyclePhase;
  cycleDay: number;
}

const phaseIcons = {
  menstrual: Moon,
  follicular: Sparkles,
  ovulatory: Flower2,
  luteal: Sun,
};

export default function CyclePhaseCard({ phase, cycleDay }: CyclePhaseCardProps) {
  const phaseInfo = getPhaseInfo(phase);
  const Icon = phaseIcons[phase];

  return (
    <Card className="p-6">
      <div className="flex items-start gap-4">
        <div className={`p-3 rounded-xl bg-gradient-to-br ${phaseInfo.bgGradient}`}>
          <Icon className="h-6 w-6" style={{ color: phaseInfo.color }} />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-lg font-semibold">{phaseInfo.name}</h3>
            <span className="text-sm text-muted-foreground">Day {cycleDay}</span>
          </div>
          <p className="text-sm text-muted-foreground">{phaseInfo.description}</p>
        </div>
      </div>
    </Card>
  );
}
