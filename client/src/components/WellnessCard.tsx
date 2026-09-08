import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, ArrowRight } from "lucide-react";

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
    <Card className="overflow-hidden hover-elevate group">
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
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-medium text-primary">{category}</span>
          {duration && (
            <>
              <span className="text-xs text-muted-foreground">•</span>
              <span className="text-xs text-muted-foreground">{duration}</span>
            </>
          )}
        </div>
        <h4 className="font-semibold mb-2">{title}</h4>
        <p className="text-sm text-muted-foreground mb-4">{description}</p>
        <Button
          variant="outline"
          className="w-full gap-2 hover-elevate active-elevate-2"
          onClick={onStart}
          data-testid={`button-start-wellness`}
        >
          <Play className="h-4 w-4" />
          Start
        </Button>
      </div>
    </Card>
  );
}
