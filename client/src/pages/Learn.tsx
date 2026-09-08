import { useState } from "react";

import EducationalArticleCard from "@/components/EducationalArticleCard";

import nutritionImage from "@assets/generated_images/Nutrition_wellness_food_photo_47ab70cc.png";
import yogaImage from "@assets/generated_images/Gentle_yoga_wellness_photo_1b96e555.png";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

import {
  ArrowUpRight,
  BookOpen,
  ExternalLink,
  Heart,
  Sparkles,
} from "lucide-react";

interface Article {
  title: string;
  excerpt: string;
  image?: string;
  category: string;
  readTime: string;
  source: string;
  url: string;
}

export default function Learn() {
  const [selectedArticle, setSelectedArticle] =
    useState<Article | null>(null);

  const articles: Article[] = [
    {
      title: "Understanding Your Menstrual Cycle",
      excerpt:
        "Learn how the menstrual cycle works, what happens during each phase, and what is considered typical.",
      category: "Cycle Health",
      readTime: "5 min read",
      source: "Office on Women's Health",
      url: "https://womenshealth.gov/menstrual-cycle/your-menstrual-cycle",
    },
    {
      title: "PMS: Symptoms & Things You Can Try",
      excerpt:
        "Explore common PMS symptoms, lifestyle changes, and when symptoms may be worth discussing with a healthcare professional.",
      image: yogaImage,
      category: "PMS",
      readTime: "6 min read",
      source: "NHS",
      url: "https://www.nhs.uk/conditions/pre-menstrual-syndrome/",
    },
    {
      title: "Period Pain: What's Normal?",
      excerpt:
        "Understand common causes of period pain and when pain or other symptoms may need medical attention.",
      category: "Period Health",
      readTime: "5 min read",
      source: "NHS",
      url: "https://www.nhs.uk/symptoms/period-pain/",
    },
    {
      title: "Menstrual Cycle: What's Typical?",
      excerpt:
        "A practical guide to tracking your cycle and noticing changes such as missed periods or unusual bleeding.",
      category: "Cycle Health",
      readTime: "7 min read",
      source: "Mayo Clinic",
      url: "https://www.mayoclinic.org/healthy-lifestyle/womens-health/in-depth/menstrual-cycle/art-20047186",
    },
    {
      title: "PMS: Understanding the Symptoms",
      excerpt:
        "Learn about the physical and emotional symptoms associated with PMS and the ways they can be managed.",
      image: nutritionImage,
      category: "Wellbeing",
      readTime: "6 min read",
      source: "Cleveland Clinic",
      url: "https://my.clevelandclinic.org/health/diseases/24288-pms-premenstrual-syndrome",
    },
    {
      title: "Understanding Endometriosis",
      excerpt:
        "Learn about common symptoms of endometriosis, how it can affect daily life, and when to seek medical advice.",
      category: "Women's Health",
      readTime: "8 min read",
      source: "Mayo Clinic",
      url: "https://www.mayoclinic.org/diseases-conditions/endometriosis/symptoms-causes/syc-20354656",
    },
  ];

  return (
    <div className="min-h-screen bg-transparent">
      <div className="mx-auto max-w-7xl space-y-8 p-6 lg:p-8">

        {/* Hero */}
        <section className="relative overflow-hidden rounded-[2rem] border border-rose-100 bg-white/85 px-7 py-8 shadow-sm backdrop-blur md:px-10 md:py-10">
          <div className="absolute -right-16 -top-20 h-52 w-52 rounded-full bg-rose-100/60 blur-3xl" />
          <div className="absolute -bottom-20 right-32 h-40 w-40 rounded-full bg-violet-100/50 blur-3xl" />

          <div className="relative max-w-3xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-rose-50 px-3.5 py-2 text-xs font-semibold text-rose-700">
              <Sparkles className="h-3.5 w-3.5" />
              Women's health library
            </div>

            <h1 className="text-3xl font-semibold tracking-tight text-slate-800 md:text-4xl">
              Learn more about
              <span className="text-rose-500"> your body.</span>
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500 md:text-base">
              Explore trusted health information about periods, cycle health,
              PMS, symptoms, and conditions that affect women's health.
            </p>
          </div>

          <div className="absolute bottom-7 right-8 hidden h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-rose-100 to-violet-100 md:flex">
            <BookOpen className="h-8 w-8 text-rose-400" />
          </div>
        </section>

        {/* Resource heading */}
        <section>
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <p className="mb-1 text-xs font-semibold uppercase tracking-[0.18em] text-rose-400">
                Curated resources
              </p>

              <h2 className="text-2xl font-semibold tracking-tight text-slate-800">
                Start exploring
              </h2>
            </div>

            <span className="hidden text-sm text-slate-400 sm:block">
              {articles.length} resources
            </span>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {articles.map((article, index) => (
              <EducationalArticleCard
                key={index}
                {...article}
                onClick={() => setSelectedArticle(article)}
              />
            ))}
          </div>
        </section>

        {/* Trusted sources */}
        <section className="overflow-hidden rounded-[1.75rem] border border-rose-100/80 bg-gradient-to-r from-white/90 via-rose-50/70 to-violet-50/60 p-6 shadow-sm">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white shadow-sm">
                <Heart className="h-5 w-5 text-rose-400" />
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.15em] text-rose-400">
                  Trusted information
                </p>

                <h3 className="mt-1 font-semibold text-slate-800">
                  Your health deserves reliable sources.
                </h3>

                <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-500">
                  HerHealth links you to established medical organizations
                  rather than presenting placeholder medical advice.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {["NHS", "Mayo Clinic", "Cleveland Clinic", "Johns Hopkins"].map(
                (source) => (
                  <span
                    key={source}
                    className="rounded-full bg-white px-3 py-1.5 text-xs font-medium text-slate-600 shadow-sm"
                  >
                    {source}
                  </span>
                )
              )}
            </div>
          </div>
        </section>

        {/* Reader Dialog */}
        <Dialog
          open={selectedArticle !== null}
          onOpenChange={(open) =>
            !open && setSelectedArticle(null)
          }
        >
          <DialogContent
            className="max-w-2xl rounded-[1.75rem] border-rose-100 p-0"
            data-testid="dialog-article-reader"
          >
            <div className="p-6">
              <DialogHeader>
                <div className="mb-3 flex items-center gap-2">
                  <span className="rounded-full bg-rose-50 px-3 py-1.5 text-xs font-medium text-rose-700">
                    {selectedArticle?.category}
                  </span>

                  <span className="text-sm text-slate-400">
                    {selectedArticle?.readTime}
                  </span>
                </div>

                <DialogTitle className="text-2xl text-slate-800">
                  {selectedArticle?.title}
                </DialogTitle>

                <DialogDescription className="pt-2 leading-6">
                  {selectedArticle?.excerpt}
                </DialogDescription>
              </DialogHeader>

              <ScrollArea className="mt-6 max-h-[35vh] pr-4">
                <div className="rounded-2xl bg-rose-50/70 p-5">
                  <div className="flex gap-3">
                    <BookOpen className="mt-0.5 h-5 w-5 shrink-0 text-rose-400" />

                    <div>
                      <h4 className="font-semibold text-slate-800">
                        Read the full resource
                      </h4>

                      <p className="mt-1 text-sm leading-6 text-slate-500">
                        This resource is hosted by{" "}
                        <span className="font-medium text-slate-700">
                          {selectedArticle?.source}
                        </span>
                        . Open the original source for the complete,
                        up-to-date information.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-5 rounded-2xl border border-slate-100 p-5">
                  <p className="text-sm leading-6 text-slate-500">
                    HerHealth is designed to help you track and understand
                    your cycle. Information from external health organizations
                    is provided for educational purposes and is not a
                    substitute for personalized medical advice.
                  </p>
                </div>
              </ScrollArea>

              <DialogFooter className="mt-6 flex-col gap-2 border-t border-slate-100 pt-5 sm:flex-row sm:justify-between">
                <Button
                  variant="ghost"
                  onClick={() => setSelectedArticle(null)}
                  data-testid="button-close-article"
                  className="rounded-xl"
                >
                  Close
                </Button>

                {selectedArticle?.url && (
                  <Button
                    asChild
                    className="rounded-xl bg-rose-500 text-white hover:bg-rose-600"
                  >
                    <a
                      href={selectedArticle.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Read full resource
                      <ArrowUpRight className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                )}
              </DialogFooter>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
