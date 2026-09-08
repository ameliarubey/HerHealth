import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Smile, Activity, Droplet, StickyNote, Calendar } from "lucide-react";

interface QuickLogButtonsProps {
  onLogMood: () => void;
  onLogSymptoms: () => void;
  onLogFlow: () => void;
  onAddNote: () => void;
  onLogPeriod: () => void;
}

export default function QuickLogButtons({
  onLogMood,
  onLogSymptoms,
  onLogFlow,
  onAddNote,
  onLogPeriod,
}: QuickLogButtonsProps) {
  const buttons = [
    { icon: Calendar, label: "Period", onClick: onLogPeriod, testId: "button-log-period", featured: true },
    { icon: Smile, label: "Mood", onClick: onLogMood, testId: "button-log-mood" },
    { icon: Activity, label: "Symptoms", onClick: onLogSymptoms, testId: "button-log-symptoms" },
    { icon: Droplet, label: "Flow", onClick: onLogFlow, testId: "button-log-flow" },
    { icon: StickyNote, label: "Note", onClick: onAddNote, testId: "button-add-note" },
  ];

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Quick Log</h3>
      <div className="grid grid-cols-2 gap-3">
        {buttons.map(({ icon: Icon, label, onClick, testId, featured }) => (
          <Button
            key={label}
            variant={featured ? "default" : "outline"}
            className={`h-auto py-4 flex-col gap-2 ${featured ? '' : 'hover-elevate active-elevate-2'}`}
            onClick={onClick}
            data-testid={testId}
          >
            <Icon className="h-5 w-5" />
            <span className="text-sm">{label}</span>
          </Button>
        ))}
      </div>
    </Card>
  );
}
