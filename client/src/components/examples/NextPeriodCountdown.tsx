import NextPeriodCountdown from "../NextPeriodCountdown";
import { addDays } from "date-fns";

export default function NextPeriodCountdownExample() {
  return (
    <div className="p-4">
      <NextPeriodCountdown daysUntil={7} nextPeriodDate={addDays(new Date(), 7)} />
    </div>
  );
}
