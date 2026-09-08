import { Card } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface CycleAnalyticsChartProps {
  data: Array<{ cycle: string; length: number }>;
  title: string;
}

export default function CycleAnalyticsChart({
  data,
  title,
}: CycleAnalyticsChartProps) {
  const isSymptomChart = title.toLowerCase().includes("symptom");

  return (
    <Card className="overflow-hidden rounded-[1.75rem] border border-rose-100/80 bg-white/90 p-6 shadow-sm">
      <div className="mb-6 flex items-start justify-between">
        <div>
          <p className="mb-1 text-xs font-semibold uppercase tracking-[0.16em] text-rose-400">
            {isSymptomChart ? "Patterns" : "Cycle history"}
          </p>

          <h3 className="text-lg font-semibold tracking-tight text-slate-800">
            {title}
          </h3>
        </div>

        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-50">
          <div className="h-2.5 w-2.5 rounded-full bg-rose-400" />
        </div>
      </div>

      <ResponsiveContainer width="100%" height={260}>
        <LineChart
          data={data}
          margin={{ top: 8, right: 12, left: -12, bottom: 4 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="rgba(226, 202, 210, 0.45)"
            vertical={false}
          />

          <XAxis
            dataKey="cycle"
            tick={{
              fontSize: 12,
              fill: "#94a3b8",
            }}
            axisLine={false}
            tickLine={false}
          />

          <YAxis
            tick={{
              fontSize: 12,
              fill: "#94a3b8",
            }}
            axisLine={false}
            tickLine={false}
            width={35}
          />

          <Tooltip
            contentStyle={{
              backgroundColor: "#ffffff",
              border: "1px solid #f3dce4",
              borderRadius: "14px",
              boxShadow: "0 8px 25px rgba(190, 120, 145, 0.12)",
              padding: "10px 12px",
            }}
            labelStyle={{
              color: "#334155",
              fontWeight: 600,
              marginBottom: "4px",
            }}
            itemStyle={{
              color: "#e85d7f",
              fontSize: "13px",
            }}
          />

          <Line
            type="monotone"
            dataKey="length"
            stroke="#e85d7f"
            strokeWidth={3}
            dot={{
              fill: "#ffffff",
              stroke: "#e85d7f",
              strokeWidth: 2,
              r: 4,
            }}
            activeDot={{
              fill: "#e85d7f",
              stroke: "#ffffff",
              strokeWidth: 2,
              r: 6,
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
}
