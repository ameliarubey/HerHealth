import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, ArrowRight } from "lucide-react";

interface EducationalArticleCardProps {
  title: string;
  excerpt: string;
  image?: string;
  category: string;
  readTime: string;
  onClick: () => void;
}

export default function EducationalArticleCard({
  title,
  excerpt,
  image,
  category,
  readTime,
  onClick,
}: EducationalArticleCardProps) {
  return (
    <Card 
      className="overflow-hidden cursor-pointer hover-elevate active-elevate-2 group" 
      onClick={onClick}
      data-testid="card-article"
    >
      {image && (
        <div className="aspect-video overflow-hidden">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover transition-transform group-hover:scale-105"
          />
        </div>
      )}
      <div className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <Badge variant="secondary" className="text-xs">
            {category}
          </Badge>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            <span>{readTime}</span>
          </div>
        </div>
        <h4 className="font-semibold mb-2 line-clamp-2">{title}</h4>
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{excerpt}</p>
        <div className="flex items-center gap-1 text-sm text-primary font-medium">
          Read more
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </div>
      </div>
    </Card>
  );
}
