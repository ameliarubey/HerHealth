import { useState } from "react";
import FlowIntensitySlider from "../FlowIntensitySlider";

export default function FlowIntensitySliderExample() {
  const [intensity, setIntensity] = useState(2);

  return (
    <div className="p-4">
      <FlowIntensitySlider intensity={intensity} onIntensityChange={setIntensity} />
    </div>
  );
}
