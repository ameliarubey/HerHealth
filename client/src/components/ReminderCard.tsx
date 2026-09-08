import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Bell } from "lucide-react";

interface ReminderCardProps {
  title: string;
  description: string;
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
  onConfigure?: () => void;
}

export default function ReminderCard({
  title,
  description,
  enabled,
  onToggle,
  onConfigure,
}: ReminderCardProps) {
  return (
    <Card className="p-4">
      <div className="flex items-start gap-4">
        <div className="p-2 rounded-lg bg-primary/10 mt-1">
          <Bell className="h-4 w-4 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4 mb-1">
            <div className="flex-1">
              <h4 className="font-medium mb-1">{title}</h4>
              <p className="text-sm text-muted-foreground">{description}</p>
            </div>
            <Switch
              checked={enabled}
              onCheckedChange={onToggle}
              data-testid={`switch-reminder-${title.toLowerCase().replace(/\s+/g, "-")}`}
            />
          </div>
          {onConfigure && enabled && (
            <Button
              variant="ghost"
              size="sm"
              className="mt-2 h-auto py-1 px-2 text-xs"
              onClick={onConfigure}
              data-testid="button-configure-reminder"
            >
              Configure
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}
