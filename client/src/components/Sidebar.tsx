import { Home, Calendar, BarChart3, Heart, BookOpen, Settings, LogOut } from "lucide-react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default function Sidebar() {
  const [location] = useLocation();

  const navItems = [
    { icon: Home, label: "Home", path: "/home" },
    { icon: Calendar, label: "Calendar", path: "/calendar" },
    { icon: BarChart3, label: "Analytics", path: "/analytics" },
    { icon: Heart, label: "Wellness", path: "/wellness" },
    { icon: BookOpen, label: "Learn", path: "/learn" },
    { icon: Settings, label: "Settings", path: "/settings" },
  ];

  const handleLogout = async () => {
    try {
      const { logOut } = await import("@/lib/firebase");
      await logOut();
      window.location.href = "/";
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <div className="w-64 h-screen bg-card border-r border-card-border flex flex-col p-4">
      <div className="flex items-center gap-3 mb-8 px-2">
        <Heart className="h-8 w-8 fill-primary text-primary" />
        <span className="text-2xl font-bold">HerHealth</span>
      </div>

      <nav className="flex-1 space-y-1">
        {navItems.map(({ icon: Icon, label, path }) => {
          const isActive = location === path;
          return (
            <Link key={path} href={path}>
              <Button
                variant={isActive ? "secondary" : "ghost"}
                className={`w-full justify-start gap-3 ${isActive ? "toggle-elevate toggle-elevated" : ""}`}
                data-testid={`nav-${label.toLowerCase()}`}
              >
                <Icon className="h-5 w-5" />
                {label}
              </Button>
            </Link>
          );
        })}
      </nav>

      <Separator className="my-4" />

      <Button
        variant="ghost"
        className="w-full justify-start gap-3 text-destructive hover:text-destructive"
        onClick={handleLogout}
        data-testid="button-logout"
      >
        <LogOut className="h-5 w-5" />
        Logout
      </Button>
    </div>
  );
}
