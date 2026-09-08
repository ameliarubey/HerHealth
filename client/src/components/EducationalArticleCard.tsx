import { Card } from "@/components/ui/card";
import { ArrowUpRight, Clock, ExternalLink } from "lucide-react";

interface EducationalArticleCardProps {
  title: string;
  excerpt: string;
  image?: string;
  category: string;
  readTime: string;
  source: string;
  onClick: () => void;
}

export default function EducationalArticleCard({
  title,
  excerpt,
  image,
  category,
  readTime,
  source,
  onClick,
}: EducationalArticleCardProps) {
  return (
    <Card
      className="group overflow-hidden rounded-[1.75rem] border border-rose-100/80 bg-white/90 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-rose-100/30 cursor-pointer"
      onClick={onClick}
      data-testid="card-article"
    >
      {image && (
        <div className="relative aspect-[16/9] overflow-hidden">
          <img
            src={image}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />

          <div className="absolute left-4 top-4">
            <span className="rounded-full bg-white/90 px-3 py-1.5 text-xs font-medium text-rose-700 shadow-sm backdrop-blur">
              {category}
            </span>
          </div>
        </div>
      )}

      <div className="p-5">
        {!image && (
          <div className="mb-4">
            <span className="rounded-full bg-rose-50 px-3 py-1.5 text-xs font-medium text-rose-700">
              {category}
            </span>
          </div>
        )}

        <div className="mb-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <Clock className="h-3.5 w-3.5" />
            {readTime}
          </div>

          <ExternalLink className="h-4 w-4 text-slate-300 transition-colors group-hover:text-rose-400" />
        </div>

        <h3 className="mb-2 line-clamp-2 text-lg font-semibold tracking-tight text-slate-800">
          {title}
        </h3>

        <p className="mb-4 line-clamp-3 text-sm leading-6 text-slate-500">
          {excerpt}
        </p>

        <div className="flex items-center justify-between border-t border-slate-100 pt-4">
          <div>
            <p className="text-[11px] uppercase tracking-[0.14em] text-slate-400">
              Trusted source
            </p>
            <p className="mt-0.5 text-sm font-medium text-slate-600">
              {source}
            </p>
          </div>

          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-rose-50 text-rose-500 transition-all group-hover:bg-rose-100">
            <ArrowUpRight className="h-4 w-4" />
          </div>
        </div>
      </div>
    </Card>
  );
}
