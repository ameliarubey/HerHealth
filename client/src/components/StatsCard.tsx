import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: string;
    isPositive: boolean;
  };
}

export default function StatsCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
}: StatsCardProps) {
  return (
    <Card className="group relative overflow-hidden rounded-[1.5rem] border border-rose-100/80 bg-white/90 p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-rose-100/30">
      <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-rose-50 opacity-70 transition-transform duration-500 group-hover:scale-125" />

      <div className="relative flex items-start justify-between">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-rose-50 to-violet-50">
          <Icon className="h-5 w-5 text-rose-500" />
        </div>

        {trend && (
          <span
            className={`rounded-full px-2.5 py-1 text-xs font-medium ${
              trend.isPositive
                ? "bg-emerald-50 text-emerald-600"
                : "bg-rose-50 text-rose-600"
            }`}
          >
            {trend.value}
          </span>
        )}
      </div>

      <div className="relative mt-5">
        <div className="text-3xl font-semibold tracking-tight text-slate-800">
          {value}
        </div>

        <div className="mt-1 text-sm font-medium text-slate-600">
          {title}
        </div>

        {subtitle && (
          <div className="mt-1 text-xs text-slate-400">
            {subtitle}
          </div>
        )}
      </div>
    </Card>
  );
}
