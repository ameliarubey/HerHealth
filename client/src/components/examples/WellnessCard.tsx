import WellnessCard from "../WellnessCard";
import meditationImage from "@assets/generated_images/Meditation_wellness_space_photo_27c997a8.png";

export default function WellnessCardExample() {
  return (
    <div className="p-4 grid md:grid-cols-2 gap-4">
      <WellnessCard
        title="Morning Meditation"
        description="Start your day with a calming 10-minute meditation to set positive intentions."
        image={meditationImage}
        category="Meditation"
        duration="10 min"
        onStart={() => console.log("Starting meditation")}
      />
      <WellnessCard
        title="Gentle Yoga Flow"
        description="A soothing yoga sequence perfect for your luteal phase."
        category="Exercise"
        duration="20 min"
        onStart={() => console.log("Starting yoga")}
      />
    </div>
  );
}
