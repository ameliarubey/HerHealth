import EducationalArticleCard from "../EducationalArticleCard";
import nutritionImage from "@assets/generated_images/Nutrition_wellness_food_photo_47ab70cc.png";

export default function EducationalArticleCardExample() {
  return (
    <div className="p-4 grid md:grid-cols-2 gap-4">
      <EducationalArticleCard
        title="Foods to Ease Period Cramps Naturally"
        excerpt="Discover nutrient-rich foods that can help reduce menstrual pain and support your body during your period."
        image={nutritionImage}
        category="Nutrition"
        source="NHS"
        readTime="5 min read"
        onClick={() => console.log("Article clicked")}
      />
      <EducationalArticleCard
        title="Understanding Your Menstrual Cycle Phases"
        excerpt="Learn about the four phases of your cycle and how hormones affect your mood, energy, and overall wellbeing."
        category="Health"
        source="Office on Women's Health"
        readTime="7 min read"
        onClick={() => console.log("Article clicked")}
      />
    </div>
  );
}
