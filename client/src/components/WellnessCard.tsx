import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, Clock, Sparkles } from "lucide-react";

interface WellnessCardProps {
  title: string;
  description: string;
  image?: string;
  category: string;
  duration?: string;
  onStart: () => void;
}

export default function WellnessCard({
  title,
  description,
  image,
  category,
  duration,
  onStart,
}: WellnessCardProps) {
  return (
    <Card className="group overflow-hidden rounded-[1.75rem] border border-rose-100/70 bg-white/90 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-rose-100/40">
      {image && (
        <div className="relative aspect-[16/10] overflow-hidden">
          <img
            src={image}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />

          <div className="absolute left-4 top-4 flex items-center gap-2">
            <span className="rounded-full bg-white/90 px-3 py-1.5 text-xs font-medium text-rose-700 shadow-sm backdrop-blur">
              {category}
            </span>

            {duration && (
              <span className="flex items-center gap-1 rounded-full bg-white/90 px-3 py-1.5 text-xs font-medium text-slate-600 shadow-sm backdrop-blur">
                <Clock className="h-3 w-3" />
                {duration}
              </span>
            )}
          </div>
        </div>
      )}

      <div className="p-5">
        {!image && (
          <div className="mb-4 flex items-center gap-2">
            <span className="rounded-full bg-rose-50 px-3 py-1.5 text-xs font-medium text-rose-700">
              {category}
            </span>

            {duration && (
              <span className="flex items-center gap-1 rounded-full bg-slate-50 px-3 py-1.5 text-xs text-slate-500">
                <Clock className="h-3 w-3" />
                {duration}
              </span>
            )}
          </div>
        )}

        <div className="mb-3 flex items-start justify-between gap-3">
          <h3 className="text-lg font-semibold tracking-tight text-slate-800">
            {title}
          </h3>

          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-rose-50 text-rose-500 transition-colors group-hover:bg-rose-100">
            <Sparkles className="h-4 w-4" />
          </div>
        </div>

        <p className="mb-5 text-sm leading-6 text-slate-500">
          {description}
        </p>

        <Button
          onClick={onStart}
          variant="ghost"
          className="group/button h-10 w-full justify-between rounded-xl bg-rose-50 px-4 font-medium text-rose-700 transition-all hover:bg-rose-100 hover:text-rose-800"
          data-testid="button-start-wellness"
        >
          <span>Explore activity</span>
          <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover/button:translate-x-0.5 group-hover/button:-translate-y-0.5" />
        </Button>
      </div>
    </Card>
  );
}
