import { useState } from "react";
import SymptomLogger from "../SymptomLogger";

export default function SymptomLoggerExample() {
  const [symptoms, setSymptoms] = useState<string[]>(["Cramps", "Bloating"]);

  return (
    <div className="p-4">
      <SymptomLogger selectedSymptoms={symptoms} onSymptomsChange={setSymptoms} />
    </div>
  );
}
