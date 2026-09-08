import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Droplet } from "lucide-react";

const intensityLabels = ["None", "Spotting", "Light", "Medium", "Heavy"];

interface FlowIntensitySliderProps {
  intensity: number;
  onIntensityChange: (value: number) => void;
}

export default function FlowIntensitySlider({ intensity, onIntensityChange }: FlowIntensitySliderProps) {
  return (
    <Card className="p-6">
      <div className="flex items-center gap-3 mb-4">
        <Droplet className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold">Flow Intensity</h3>
      </div>
      <div className="space-y-4">
        <Slider
          value={[intensity]}
          onValueChange={(values) => onIntensityChange(values[0])}
          max={4}
          step={1}
          className="w-full"
          data-testid="slider-flow-intensity"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          {intensityLabels.map((label, index) => (
            <span
              key={label}
              className={index === intensity ? "text-foreground font-medium" : ""}
            >
              {label}
            </span>
          ))}
        </div>
        <div className="text-center">
          <div className="text-2xl font-semibold">{intensityLabels[intensity]}</div>
        </div>
      </div>
    </Card>
  );
}
