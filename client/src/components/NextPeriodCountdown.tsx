import { Card } from "@/components/ui/card";
import { Calendar } from "lucide-react";
import { format } from "date-fns";

interface NextPeriodCountdownProps {
  daysUntil: number;
  nextPeriodDate: Date;
}

export default function NextPeriodCountdown({ daysUntil, nextPeriodDate }: NextPeriodCountdownProps) {
  // Validate date before formatting
  const isValidDate = nextPeriodDate && !isNaN(new Date(nextPeriodDate).getTime());
  
  return (
    <Card className="p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-lg bg-primary/10">
          <Calendar className="h-5 w-5 text-primary" />
        </div>
        <h3 className="text-lg font-semibold">Next Period</h3>
      </div>
      <div className="text-center space-y-2">
        <div className="text-5xl font-bold text-primary">{daysUntil}</div>
        <div className="text-sm text-muted-foreground">
          {daysUntil === 1 ? "day" : "days"} away
        </div>
        {isValidDate && (
          <div className="text-xs text-muted-foreground">
            Expected: {format(nextPeriodDate, "MMM d, yyyy")}
          </div>
        )}
      </div>
    </Card>
  );
}
