import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Activity } from "lucide-react";

const symptoms = [
  "Cramps", "Bloating", "Headache", "Acne", "Fatigue",
  "Tender Breasts", "Back Pain", "Nausea", "Cravings",
  "Mood Swings", "Insomnia", "Constipation",
];

interface SymptomLoggerProps {
  selectedSymptoms?: string[];
  onSymptomsChange: (symptoms: string[]) => void;
}

export default function SymptomLogger({ selectedSymptoms = [], onSymptomsChange }: SymptomLoggerProps) {
  const toggleSymptom = (symptom: string) => {
    if (selectedSymptoms.includes(symptom)) {
      onSymptomsChange(selectedSymptoms.filter(s => s !== symptom));
    } else {
      onSymptomsChange([...selectedSymptoms, symptom]);
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center gap-3 mb-4">
        <Activity className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold">Log Symptoms</h3>
      </div>
      <div className="flex flex-wrap gap-2">
        {symptoms.map((symptom) => {
          const isSelected = selectedSymptoms.includes(symptom);
          return (
            <Badge
              key={symptom}
              variant={isSelected ? "default" : "outline"}
              className={`cursor-pointer px-3 py-1.5 ${isSelected ? "toggle-elevate toggle-elevated" : "hover-elevate active-elevate-2"}`}
              onClick={() => toggleSymptom(symptom)}
              data-testid={`badge-symptom-${symptom.toLowerCase().replace(" ", "-")}`}
            >
              {symptom}
            </Badge>
          );
        })}
      </div>
    </Card>
  );
}
