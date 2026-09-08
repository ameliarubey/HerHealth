import { useState } from "react";
import WellnessCard from "@/components/WellnessCard";
import meditationImage from "@assets/generated_images/Meditation_wellness_space_photo_27c997a8.png";
import yogaImage from "@assets/generated_images/Gentle_yoga_wellness_photo_1b96e555.png";
import nutritionImage from "@assets/generated_images/Nutrition_wellness_food_photo_47ab70cc.png";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface WellnessActivity {
  title: string;
  description: string;
  image?: string;
  category: string;
  duration?: string;
}

export default function Wellness() {
  const [selectedActivity, setSelectedActivity] = useState<WellnessActivity | null>(null);
  const wellnessItems = [
    {
      title: "Morning Meditation",
      description: "Start your day with a calming 10-minute meditation to set positive intentions.",
      image: meditationImage,
      category: "Meditation",
      duration: "10 min",
    },
    {
      title: "Gentle Yoga Flow",
      description: "A soothing yoga sequence perfect for your luteal phase.",
      image: yogaImage,
      category: "Exercise",
      duration: "20 min",
    },
    {
      title: "Anti-Inflammatory Smoothie",
      description: "Nutritious recipe to reduce bloating and support your body during menstruation.",
      image: nutritionImage,
      category: "Nutrition",
      duration: "5 min",
    },
    {
      title: "Evening Wind-Down",
      description: "Relaxing meditation to improve sleep quality during your cycle.",
      image: meditationImage,
      category: "Meditation",
      duration: "15 min",
    },
    {
      title: "Light Stretching",
      description: "Gentle stretches to ease cramps and tension.",
      image: yogaImage,
      category: "Exercise",
      duration: "10 min",
    },
    {
      title: "Energy Boosting Foods",
      description: "Foods rich in iron and B vitamins to combat fatigue.",
      image: nutritionImage,
      category: "Nutrition",
      duration: "3 min",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <div>
          <h1 className="text-4xl font-bold mb-2">Wellness Zone</h1>
          <p className="text-muted-foreground">Self-care activities tailored to your cycle phase</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {wellnessItems.map((item, index) => (
            <WellnessCard
              key={index}
              {...item}
              onStart={() => setSelectedActivity(item)}
            />
          ))}
        </div>

        {/* Activity Dialog */}
        <Dialog open={selectedActivity !== null} onOpenChange={(open) => !open && setSelectedActivity(null)}>
          <DialogContent data-testid="dialog-wellness-activity">
            <DialogHeader>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="secondary">{selectedActivity?.category}</Badge>
                {selectedActivity?.duration && (
                  <span className="text-sm text-muted-foreground">{selectedActivity.duration}</span>
                )}
              </div>
              <DialogTitle>{selectedActivity?.title}</DialogTitle>
              <DialogDescription>
                {selectedActivity?.description}
              </DialogDescription>
            </DialogHeader>
            {selectedActivity?.image && (
              <div className="aspect-video overflow-hidden rounded-lg">
                <img
                  src={selectedActivity.image}
                  alt={selectedActivity.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                This is a placeholder for the full activity content. In a complete version, this would include step-by-step instructions, video guidance, or detailed recipes.
              </p>
            </div>
            <DialogFooter>
              <Button
                onClick={() => setSelectedActivity(null)}
                data-testid="button-close-activity"
              >
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
