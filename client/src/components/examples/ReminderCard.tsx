import { useState } from "react";
import ReminderCard from "../ReminderCard";

export default function ReminderCardExample() {
  const [periodReminder, setPeriodReminder] = useState(true);
  const [ovulationReminder, setOvulationReminder] = useState(true);
  const [pmsReminder, setPmsReminder] = useState(false);

  return (
    <div className="p-4 space-y-3">
      <ReminderCard
        title="Period Approaching"
        description="Get notified 2 days before your expected period"
        enabled={periodReminder}
        onToggle={setPeriodReminder}
        onConfigure={() => console.log("Configure period reminder")}
      />
      <ReminderCard
        title="Ovulation Window"
        description="Track your fertile days"
        enabled={ovulationReminder}
        onToggle={setOvulationReminder}
      />
      <ReminderCard
        title="PMS Alert"
        description="Gentle reminder during PMS phase"
        enabled={pmsReminder}
        onToggle={setPmsReminder}
      />
    </div>
  );
}
