import { useState } from "react";
import EducationalArticleCard from "@/components/EducationalArticleCard";
import nutritionImage from "@assets/generated_images/Nutrition_wellness_food_photo_47ab70cc.png";
import yogaImage from "@assets/generated_images/Gentle_yoga_wellness_photo_1b96e555.png";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Article {
  title: string;
  excerpt: string;
  image?: string;
  category: string;
  readTime: string;
}

export default function Learn() {
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const articles = [
    {
      title: "Foods to Ease Period Cramps Naturally",
      excerpt: "Discover nutrient-rich foods that can help reduce menstrual pain and support your body during your period.",
      image: nutritionImage,
      category: "Nutrition",
      readTime: "5 min read",
    },
    {
      title: "Understanding Your Menstrual Cycle Phases",
      excerpt: "Learn about the four phases of your cycle and how hormones affect your mood, energy, and overall wellbeing.",
      category: "Health",
      readTime: "7 min read",
    },
    {
      title: "Exercise Tips for Each Phase of Your Cycle",
      excerpt: "Optimize your workouts by aligning them with your menstrual cycle for better results and energy.",
      image: yogaImage,
      category: "Fitness",
      readTime: "6 min read",
    },
    {
      title: "Managing PMS: A Complete Guide",
      excerpt: "Practical strategies to reduce PMS symptoms and feel your best during the luteal phase.",
      category: "Wellness",
      readTime: "8 min read",
    },
    {
      title: "Tracking Ovulation: Signs and Methods",
      excerpt: "Learn to identify ovulation signs and choose the best tracking method for your needs.",
      category: "Fertility",
      readTime: "6 min read",
    },
    {
      title: "Sleep and Your Menstrual Cycle",
      excerpt: "How hormonal changes affect your sleep patterns and tips for better rest throughout your cycle.",
      category: "Sleep",
      readTime: "5 min read",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <div>
          <h1 className="text-4xl font-bold mb-2">Learn</h1>
          <p className="text-muted-foreground">Educational content about menstrual health and wellness</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {articles.map((article, index) => (
            <EducationalArticleCard
              key={index}
              {...article}
              onClick={() => setSelectedArticle(article)}
            />
          ))}
        </div>

        {/* Article Reader Dialog */}
        <Dialog open={selectedArticle !== null} onOpenChange={(open) => !open && setSelectedArticle(null)}>
          <DialogContent className="max-w-3xl max-h-[80vh]" data-testid="dialog-article-reader">
            <DialogHeader>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="secondary">{selectedArticle?.category}</Badge>
                <span className="text-sm text-muted-foreground">{selectedArticle?.readTime}</span>
              </div>
              <DialogTitle className="text-2xl">{selectedArticle?.title}</DialogTitle>
            </DialogHeader>
            <ScrollArea className="h-full pr-4">
              <div className="space-y-4">
                {selectedArticle?.image && (
                  <div className="aspect-video overflow-hidden rounded-lg mb-6">
                    <img
                      src={selectedArticle.image}
                      alt={selectedArticle.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <p className="text-base leading-relaxed">{selectedArticle?.excerpt}</p>
                
                <div className="space-y-4 pt-4">
                  <p className="text-sm text-muted-foreground">
                    This is a placeholder for the full article content. In a complete version, this would include the full article text, images, and interactive elements.
                  </p>
                  
                  <div className="p-4 rounded-lg bg-muted">
                    <h4 className="font-semibold mb-2">Key Takeaways</h4>
                    <ul className="space-y-2 text-sm list-disc list-inside">
                      <li>Understanding your body's needs during different cycle phases</li>
                      <li>Practical tips you can implement immediately</li>
                      <li>Evidence-based recommendations from health experts</li>
                    </ul>
                  </div>
                </div>
              </div>
            </ScrollArea>
            <div className="flex justify-end pt-4 border-t">
              <Button
                onClick={() => setSelectedArticle(null)}
                data-testid="button-close-article"
              >
                Close
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
