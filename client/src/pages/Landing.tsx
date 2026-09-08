import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Heart, Calendar, BarChart3, Sparkles, Shield, Bell } from "lucide-react";
import { useLocation } from "wouter";
import heroImage from "@assets/generated_images/Hero_meditation_sunrise_scene_13fe6095.png";

export default function Landing() {
  const [, setLocation] = useLocation();

  const features = [
    {
      icon: Calendar,
      title: "Smart Cycle Tracking",
      description: "AI-powered predictions that learn from your unique patterns",
    },
    {
      icon: BarChart3,
      title: "Detailed Analytics",
      description: "Visualize trends and export reports for your healthcare provider",
    },
    {
      icon: Sparkles,
      title: "Wellness Zone",
      description: "Personalized meditation, workouts, and nutrition for each phase",
    },
    {
      icon: Bell,
      title: "Smart Reminders",
      description: "Never miss important dates with customizable notifications",
    },
    {
      icon: Heart,
      title: "Partner Mode",
      description: "Share your timeline with loved ones while maintaining privacy",
    },
    {
      icon: Shield,
      title: "Private & Secure",
      description: "Your data is encrypted and completely under your control",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-black/50 to-black/70 z-10" />
        <img
          src={heroImage}
          alt="Peaceful wellness"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="relative z-20 max-w-4xl mx-auto px-6 text-center text-white">
          <div className="flex items-center justify-center gap-4 mb-6">
            <Heart className="h-16 w-16 fill-current" />
            <h1 className="text-6xl font-bold">HerHealth</h1>
          </div>
          <p className="text-2xl mb-4 text-white/95">
            Your caring companion for menstrual health
          </p>
          <p className="text-lg mb-8 text-white/80 max-w-2xl mx-auto">
            Track your cycle, understand your body, and embrace wellness at every phase. 
            AI-powered insights, personalized care, and complete privacy.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button
              size="lg"
              className="gap-2 text-lg px-8 py-6 backdrop-blur-sm"
              onClick={() => setLocation("/auth")}
              data-testid="button-get-started"
            >
              Get Started Free
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="gap-2 text-lg px-8 py-6 backdrop-blur-sm bg-white/10 border-white/20 text-white hover:bg-white/20"
              onClick={() => setLocation("/auth")}
              data-testid="button-login"
            >
              Login
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-card">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Everything you need for menstrual wellness</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              From cycle predictions to personalized wellness tips, HerHealth supports you every step of the way
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="p-6 hover-elevate">
                <div className="p-3 rounded-xl bg-primary/10 w-fit mb-4">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to take control of your health?</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Join thousands of women who trust HerHealth for their menstrual wellness
          </p>
          <Button
            size="lg"
            className="gap-2 text-lg px-8 py-6"
            onClick={() => setLocation("/auth")}
            data-testid="button-signup-cta"
          >
            Sign Up Now
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-border">
        <div className="max-w-7xl mx-auto text-center text-sm text-muted-foreground">
          <p>© 2024 HerHealth. Your health, your data, your control.</p>
        </div>
      </footer>
    </div>
  );
}
