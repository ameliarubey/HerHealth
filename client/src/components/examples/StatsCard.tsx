import StatsCard from "../StatsCard";
import { Calendar, Activity, TrendingUp } from "lucide-react";

export default function StatsCardExample() {
  return (
    <div className="p-4 grid md:grid-cols-3 gap-4">
      <StatsCard
        title="Average Cycle Length"
        value="28 days"
        icon={Calendar}
        trend={{ value: "+2%", isPositive: true }}
      />
      <StatsCard
        title="Period Duration"
        value="5 days"
        subtitle="Last 3 cycles"
        icon={Activity}
      />
      <StatsCard
        title="Regularity Score"
        value="95%"
        icon={TrendingUp}
        trend={{ value: "+5%", isPositive: true }}
      />
    </div>
  );
}
