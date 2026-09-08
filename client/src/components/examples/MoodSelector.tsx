import { useState } from "react";
import MoodSelector from "../MoodSelector";

export default function MoodSelectorExample() {
  const [selectedMood, setSelectedMood] = useState<string>();

  return (
    <div className="p-4">
      <MoodSelector selectedMood={selectedMood} onMoodSelect={setSelectedMood} />
    </div>
  );
}
