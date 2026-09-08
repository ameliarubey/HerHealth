import { useState } from "react";

import WellnessCard from "@/components/WellnessCard";

import meditationImage from "@assets/generated_images/Meditation_wellness_space_photo_27c997a8.png";
import yogaImage from "@assets/generated_images/Gentle_yoga_wellness_photo_1b96e555.png";
import nutritionImage from "@assets/generated_images/Nutrition_wellness_food_photo_47ab70cc.png";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowUpRight, Heart, Sparkles } from "lucide-react";

interface WellnessActivity {
  title: string;
  description: string;
  image?: string;
  category: string;
  duration?: string;
  resourceUrl?: string;
}

export default function Wellness() {
  const [selectedActivity, setSelectedActivity] =
    useState<WellnessActivity | null>(null);

  const wellnessItems: WellnessActivity[] = [
    {
      title: "Morning Meditation",
      description:
        "Start your day with a calming 10-minute meditation to set positive intentions.",
      image: meditationImage,
      category: "Mindfulness",
      duration: "10 min",
      resourceUrl:
        "https://www.nhs.uk/conditions/pre-menstrual-syndrome/",
    },
    {
      title: "Gentle Yoga Flow",
      description:
        "A soothing movement session designed to help you slow down, stretch, and reconnect with your body.",
      image: yogaImage,
      category: "Movement",
      duration: "20 min",
      resourceUrl:
        "https://health.clevelandclinic.org/how-to-stop-period-cramps",
    },
    {
      title: "Anti-Inflammatory Smoothie",
      description:
        "A simple nourishing recipe idea for days when you want something refreshing and easy to prepare.",
      image: nutritionImage,
      category: "Nutrition",
      duration: "5 min",
      resourceUrl:
        "https://my.clevelandclinic.org/health/diseases/24288-pms-premenstrual-syndrome",
    },
    {
      title: "Evening Wind-Down",
      description:
        "Create a calmer evening routine with gentle breathing and mindfulness to help you transition toward rest.",
      image: meditationImage,
      category: "Mindfulness",
      duration: "15 min",
      resourceUrl:
        "https://www.nhs.uk/conditions/pre-menstrual-syndrome/",
    },
    {
      title: "Light Stretching",
      description:
        "Gentle stretches to ease tension and help your body feel more comfortable throughout your cycle.",
      image: yogaImage,
      category: "Movement",
      duration: "10 min",
      resourceUrl:
        "https://health.clevelandclinic.org/how-to-stop-period-cramps",
    },
    {
      title: "Energy Boosting Foods",
      description:
        "Explore simple nutrition ideas that can support balanced meals when you're feeling low on energy.",
      image: nutritionImage,
      category: "Nutrition",
      duration: "3 min",
      resourceUrl:
        "https://my.clevelandclinic.org/health/diseases/24288-pms-premenstrual-syndrome",
    },
  ];

  return (
    <div className="min-h-screen bg-transparent">
      <div className="mx-auto max-w-7xl space-y-8 p-6 lg:p-8">

        {/* Hero */}
        <section className="relative overflow-hidden rounded-[2rem] border border-rose-100 bg-white/80 px-7 py-8 shadow-sm backdrop-blur md:px-10 md:py-10">
          <div className="absolute -right-16 -top-20 h-52 w-52 rounded-full bg-rose-100/60 blur-3xl" />
          <div className="absolute -bottom-20 right-32 h-40 w-40 rounded-full bg-violet-100/50 blur-3xl" />

          <div className="relative max-w-3xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-rose-50 px-3.5 py-2 text-xs font-semibold text-rose-700">
              <Sparkles className="h-3.5 w-3.5" />
              Wellness, your way
            </div>

            <h1 className="text-3xl font-semibold tracking-tight text-slate-800 md:text-4xl">
              A little more care for
              <span className="text-rose-500"> you.</span>
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500 md:text-base">
              Explore gentle practices, movement, and nourishing ideas designed
              to support you through every phase of your cycle.
            </p>
          </div>

          <div className="absolute bottom-7 right-8 hidden h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-rose-100 to-violet-100 md:flex">
            <Heart className="h-8 w-8 text-rose-400" />
          </div>
        </section>

        {/* Section heading */}
        <section>
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <p className="mb-1 text-xs font-semibold uppercase tracking-[0.18em] text-rose-400">
                Self-care library
              </p>
              <h2 className="text-2xl font-semibold tracking-tight text-slate-800">
                Find what feels good today
              </h2>
            </div>

            <span className="hidden text-sm text-slate-400 sm:block">
              {wellnessItems.length} activities
            </span>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {wellnessItems.map((item, index) => (
              <WellnessCard
                key={index}
                {...item}
                onStart={() => setSelectedActivity(item)}
              />
            ))}
          </div>
        </section>

        {/* Gentle reminder */}
        <section className="rounded-[1.75rem] border border-rose-100/80 bg-gradient-to-r from-white/90 via-rose-50/70 to-violet-50/60 p-6 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white shadow-sm">
              <Heart className="h-5 w-5 text-rose-400" />
            </div>

            <div>
              <h3 className="font-semibold text-slate-800">
                Listen to your body
              </h3>
              <p className="mt-1 text-sm leading-6 text-slate-500">
                Your cycle experience is personal. Use these activities as
                gentle suggestions and choose what feels comfortable for you.
              </p>
            </div>
          </div>
        </section>

        {/* Activity Dialog */}
        <Dialog
          open={selectedActivity !== null}
          onOpenChange={(open) =>
            !open && setSelectedActivity(null)
          }
        >
          <DialogContent
            className="max-w-lg overflow-hidden rounded-[1.75rem] border-rose-100 p-0"
            data-testid="dialog-wellness-activity"
          >
            {selectedActivity?.image && (
              <div className="relative aspect-video overflow-hidden">
                <img
                  src={selectedActivity.image}
                  alt={selectedActivity.title}
                  className="h-full w-full object-cover"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/25 to-transparent" />
              </div>
            )}

            <div className="p-6">
              <DialogHeader>
                <div className="mb-3 flex items-center gap-2">
                  <Badge className="rounded-full bg-rose-50 text-rose-700 hover:bg-rose-50">
                    {selectedActivity?.category}
                  </Badge>

                  {selectedActivity?.duration && (
                    <span className="text-sm text-muted-foreground">
                      {selectedActivity.duration}
                    </span>
                  )}
                </div>

                <DialogTitle className="text-2xl text-slate-800">
                  {selectedActivity?.title}
                </DialogTitle>

                <DialogDescription className="pt-2 text-sm leading-6">
                  {selectedActivity?.description}
                </DialogDescription>
              </DialogHeader>

              <div className="mt-5 rounded-2xl bg-rose-50/70 p-4">
                <p className="text-sm leading-6 text-slate-600">
                  Take this as a gentle starting point rather than a rule.
                  Wellness looks different for everyone, so adjust the
                  activity to your own comfort level.
                </p>
              </div>

              <DialogFooter className="mt-6 gap-2 sm:justify-between">
                {selectedActivity?.resourceUrl && (
                  <Button
                    asChild
                    variant="outline"
                    className="rounded-xl border-rose-200 text-rose-700 hover:bg-rose-50"
                  >
                    <a
                      href={selectedActivity.resourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Learn more
                      <ArrowUpRight className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                )}

                <Button
                  onClick={() => setSelectedActivity(null)}
                  className="rounded-xl bg-rose-500 text-white hover:bg-rose-600"
                  data-testid="button-close-activity"
                >
                  Close
                </Button>
              </DialogFooter>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
