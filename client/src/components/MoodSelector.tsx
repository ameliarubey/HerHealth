import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Smile, Frown, Meh, Angry, Heart, Zap, Cloud } from "lucide-react";

const moods = [
  { id: "happy", label: "Happy", icon: Smile, color: "text-yellow-500" },
  { id: "energized", label: "Energized", icon: Zap, color: "text-orange-500" },
  { id: "calm", label: "Calm", icon: Heart, color: "text-pink-500" },
  { id: "neutral", label: "Neutral", icon: Meh, color: "text-gray-500" },
  { id: "tired", label: "Tired", icon: Cloud, color: "text-blue-500" },
  { id: "sad", label: "Sad", icon: Frown, color: "text-blue-600" },
  { id: "anxious", label: "Anxious", icon: Angry, color: "text-purple-500" },
];

interface MoodSelectorProps {
  selectedMood?: string;
  onMoodSelect: (moodId: string) => void;
}

export default function MoodSelector({ selectedMood, onMoodSelect }: MoodSelectorProps) {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">How are you feeling?</h3>
      <div className="grid grid-cols-4 gap-3">
        {moods.map(({ id, label, icon: Icon, color }) => (
          <Button
            key={id}
            variant={selectedMood === id ? "secondary" : "outline"}
            className={`h-auto py-4 flex-col gap-2 ${selectedMood === id ? "toggle-elevate toggle-elevated" : "hover-elevate active-elevate-2"}`}
            onClick={() => onMoodSelect(id)}
            data-testid={`button-mood-${id}`}
          >
            <Icon className={`h-6 w-6 ${color}`} />
            <span className="text-xs">{label}</span>
          </Button>
        ))}
      </div>
    </Card>
  );
}
