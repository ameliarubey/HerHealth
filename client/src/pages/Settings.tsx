import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ReminderCard from "@/components/ReminderCard";
import { User, Bell, Palette, Shield } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/lib/auth-context";
import { getUserProfile, updateUserProfile, changePassword, deleteAccount } from "@/lib/firebase";
import { useQuery } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useLocation } from "wouter";

export default function Settings() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [saving, setSaving] = useState(false);

  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [cycleLength, setCycleLength] = useState("28");
  const [periodDuration, setPeriodDuration] = useState("5");
  const [periodReminder, setPeriodReminder] = useState(true);
  const [ovulationReminder, setOvulationReminder] = useState(true);
  const [pmsReminder, setPmsReminder] = useState(false);

  // Dialog states
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);
  const [deleteAccountOpen, setDeleteAccountOpen] = useState(false);
  const [configureReminderOpen, setConfigureReminderOpen] = useState(false);
  const [partnerAccessOpen, setPartnerAccessOpen] = useState(false);

  // Password change states
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);

  // Delete account states
  const [deletePassword, setDeletePassword] = useState("");
  const [deleting, setDeleting] = useState(false);

  // Reminder configuration states
  const [reminderDaysBefore, setReminderDaysBefore] = useState("2");
  const [reminderTime, setReminderTime] = useState("09:00");

  // Theme state
  const [selectedTheme, setSelectedTheme] = useState("rose");

  // Fetch user profile
  const { data: profile, isLoading } = useQuery({
    queryKey: ["/api/profile", user?.uid],
    enabled: !!user,
    queryFn: async () => {
      if (!user) return null;
      return await getUserProfile(user.uid);
    },
  });

  // Update form when profile loads
  useEffect(() => {
    if (profile) {
      setName(profile.name || "");
      setAge(profile.age?.toString() || "");
      setCycleLength(profile.cycleData?.averageCycleLength?.toString() || "28");
      setPeriodDuration(profile.cycleData?.averagePeriodDuration?.toString() || "5");
      setPeriodReminder(profile.reminders?.period ?? true);
      setOvulationReminder(profile.reminders?.ovulation ?? true);
      setPmsReminder(profile.reminders?.pms ?? false);
    }
  }, [profile]);

  const handleSave = async () => {
    if (!user) return;
    
    // Validate numeric inputs
    const parsedCycleLength = parseInt(cycleLength);
    const parsedPeriodDuration = parseInt(periodDuration);
    const parsedAge = age ? parseInt(age) : undefined;

    if (isNaN(parsedCycleLength) || parsedCycleLength < 21 || parsedCycleLength > 35) {
      toast({
        title: "Invalid Input",
        description: "Cycle length must be between 21 and 35 days",
        variant: "destructive",
      });
      return;
    }

    if (isNaN(parsedPeriodDuration) || parsedPeriodDuration < 2 || parsedPeriodDuration > 10) {
      toast({
        title: "Invalid Input",
        description: "Period duration must be between 2 and 10 days",
        variant: "destructive",
      });
      return;
    }

    if (parsedAge !== undefined && (isNaN(parsedAge) || parsedAge < 10 || parsedAge > 100)) {
      toast({
        title: "Invalid Input",
        description: "Please enter a valid age",
        variant: "destructive",
      });
      return;
    }
    
    setSaving(true);
    try {
      await updateUserProfile(user.uid, {
        name,
        age: parsedAge,
        cycleData: {
          averageCycleLength: parsedCycleLength,
          averagePeriodDuration: parsedPeriodDuration,
        },
        reminders: {
          period: periodReminder,
          ovulation: ovulationReminder,
          pms: pmsReminder,
        },
      });

      queryClient.invalidateQueries({ queryKey: ["/api/profile", user.uid] });

      toast({
        title: "Settings saved",
        description: "Your preferences have been updated successfully",
      });
    } catch (error) {
      console.error("Error saving settings:", error);
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleReminderToggle = async (type: "period" | "ovulation" | "pms", value: boolean) => {
    if (!user) return;

    const updatedReminders = {
      period: periodReminder,
      ovulation: ovulationReminder,
      pms: pmsReminder,
      [type]: value,
    };

    // Update state immediately
    if (type === "period") setPeriodReminder(value);
    if (type === "ovulation") setOvulationReminder(value);
    if (type === "pms") setPmsReminder(value);

    // Save to Firestore
    try {
      await updateUserProfile(user.uid, {
        reminders: updatedReminders,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/profile", user.uid] });
    } catch (error) {
      console.error("Error updating reminders:", error);
    }
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure your new passwords match",
        variant: "destructive",
      });
      return;
    }

    if (newPassword.length < 6) {
      toast({
        title: "Password too short",
        description: "Password must be at least 6 characters",
        variant: "destructive",
      });
      return;
    }

    setChangingPassword(true);
    try {
      await changePassword(currentPassword, newPassword);
      toast({
        title: "Password changed",
        description: "Your password has been updated successfully",
      });
      setChangePasswordOpen(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to change password",
        variant: "destructive",
      });
    } finally {
      setChangingPassword(false);
    }
  };

  const handleDeleteAccount = async () => {
    setDeleting(true);
    try {
      await deleteAccount(deletePassword);
      toast({
        title: "Account deleted",
        description: "Your account has been permanently deleted",
      });
      setLocation("/auth");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete account",
        variant: "destructive",
      });
      setDeleting(false);
    }
  };

  const handleConfigureReminder = () => {
    toast({
      title: "Reminder configured",
      description: `Reminder set for ${reminderDaysBefore} days before at ${reminderTime}`,
    });
    setConfigureReminderOpen(false);
  };

  const handleThemeChange = (theme: string) => {
    setSelectedTheme(theme);
    const root = document.documentElement;

    // Theme color mappings (hue values)
    const themes: Record<string, number> = {
      rose: 340, // Rose Gold (pinkish)
      moonlight: 240, // Moonlight (blue/lavender)
      teal: 180, // Calm Teal (teal/cyan)
    };

    const hue = themes[theme] || 340;

    // Update CSS custom properties for light mode
    root.style.setProperty('--primary', `${hue} 72% 48%`);
    root.style.setProperty('--primary-foreground', `${hue} 20% 98%`);
    root.style.setProperty('--ring', `${hue} 72% 48%`);
    
    toast({
      title: "Theme updated",
      description: `Theme changed to ${theme === 'rose' ? 'Rose Gold' : theme === 'moonlight' ? 'Moonlight' : 'Calm Teal'}`,
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <div>
          <h1 className="text-4xl font-bold mb-2">Settings</h1>
          <p className="text-muted-foreground">Manage your profile and preferences</p>
        </div>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <User className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold">Profile</h2>
          </div>
          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input 
                  id="name" 
                  placeholder="Your name" 
                  data-testid="input-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="age">Age</Label>
                <Input 
                  id="age" 
                  type="number" 
                  placeholder="25" 
                  data-testid="input-age"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                />
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="cycle-length">Average Cycle Length (days)</Label>
                <Input 
                  id="cycle-length" 
                  type="number" 
                  placeholder="28" 
                  data-testid="input-cycle-length"
                  value={cycleLength}
                  onChange={(e) => setCycleLength(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="period-duration">Average Period Duration (days)</Label>
                <Input 
                  id="period-duration" 
                  type="number" 
                  placeholder="5" 
                  data-testid="input-period-duration"
                  value={periodDuration}
                  onChange={(e) => setPeriodDuration(e.target.value)}
                />
              </div>
            </div>
            <div className="flex justify-end">
              <Button 
                onClick={handleSave} 
                disabled={saving}
                data-testid="button-save-profile"
              >
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <Bell className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold">Reminders</h2>
          </div>
          <div className="space-y-3">
            <ReminderCard
              title="Period Approaching"
              description="Get notified 2 days before your expected period"
              enabled={periodReminder}
              onToggle={(value) => handleReminderToggle("period", value)}
              onConfigure={() => setConfigureReminderOpen(true)}
            />
            <ReminderCard
              title="Ovulation Window"
              description="Track your fertile days"
              enabled={ovulationReminder}
              onToggle={(value) => handleReminderToggle("ovulation", value)}
            />
            <ReminderCard
              title="PMS Alert"
              description="Gentle reminder during PMS phase"
              enabled={pmsReminder}
              onToggle={(value) => handleReminderToggle("pms", value)}
            />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <Palette className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold">Appearance</h2>
          </div>
          <div className="space-y-4">
            <div>
              <Label>Theme</Label>
              <div className="grid grid-cols-3 gap-3 mt-2">
                <Button 
                  variant={selectedTheme === "rose" ? "default" : "outline"} 
                  className="hover-elevate active-elevate-2" 
                  data-testid="button-theme-rose"
                  onClick={() => handleThemeChange("rose")}
                >
                  Rose Gold
                </Button>
                <Button 
                  variant={selectedTheme === "moonlight" ? "default" : "outline"} 
                  className="hover-elevate active-elevate-2" 
                  data-testid="button-theme-moonlight"
                  onClick={() => handleThemeChange("moonlight")}
                >
                  Moonlight
                </Button>
                <Button 
                  variant={selectedTheme === "teal" ? "default" : "outline"} 
                  className="hover-elevate active-elevate-2" 
                  data-testid="button-theme-teal"
                  onClick={() => handleThemeChange("teal")}
                >
                  Calm Teal
                </Button>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <Shield className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold">Privacy & Security</h2>
          </div>
          <div className="space-y-4">
            <Button 
              variant="outline" 
              className="w-full justify-start hover-elevate active-elevate-2" 
              data-testid="button-change-password"
              onClick={() => setChangePasswordOpen(true)}
            >
              Change Password
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start hover-elevate active-elevate-2" 
              data-testid="button-partner-mode"
              onClick={() => setPartnerAccessOpen(true)}
            >
              Manage Partner Access
            </Button>
            <Separator />
            <Button 
              variant="destructive" 
              className="w-full" 
              data-testid="button-delete-account"
              onClick={() => setDeleteAccountOpen(true)}
            >
              Delete Account
            </Button>
          </div>
        </Card>

        {/* Change Password Dialog */}
        <Dialog open={changePasswordOpen} onOpenChange={setChangePasswordOpen}>
          <DialogContent data-testid="dialog-change-password">
            <DialogHeader>
              <DialogTitle>Change Password</DialogTitle>
              <DialogDescription>
                Enter your current password and choose a new one
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="current-password">Current Password</Label>
                <Input
                  id="current-password"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  data-testid="input-current-password"
                />
              </div>
              <div>
                <Label htmlFor="new-password">New Password</Label>
                <Input
                  id="new-password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  data-testid="input-new-password"
                />
              </div>
              <div>
                <Label htmlFor="confirm-password">Confirm New Password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  data-testid="input-confirm-password"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setChangePasswordOpen(false)}
                data-testid="button-cancel-password"
              >
                Cancel
              </Button>
              <Button
                onClick={handleChangePassword}
                disabled={changingPassword || !currentPassword || !newPassword || !confirmPassword}
                data-testid="button-save-password"
              >
                {changingPassword ? "Changing..." : "Change Password"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Account Dialog */}
        <AlertDialog open={deleteAccountOpen} onOpenChange={setDeleteAccountOpen}>
          <AlertDialogContent data-testid="dialog-delete-account">
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your account and remove all your data from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="my-4">
              <Label htmlFor="delete-password">Enter your password to confirm</Label>
              <Input
                id="delete-password"
                type="password"
                value={deletePassword}
                onChange={(e) => setDeletePassword(e.target.value)}
                placeholder="Password"
                data-testid="input-delete-password"
              />
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel data-testid="button-cancel-delete">Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteAccount}
                disabled={deleting || !deletePassword}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                data-testid="button-confirm-delete"
              >
                {deleting ? "Deleting..." : "Delete Account"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Configure Reminder Dialog */}
        <Dialog open={configureReminderOpen} onOpenChange={setConfigureReminderOpen}>
          <DialogContent data-testid="dialog-configure-reminder">
            <DialogHeader>
              <DialogTitle>Configure Reminder</DialogTitle>
              <DialogDescription>
                Set when and how you'd like to be reminded
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="days-before">Days Before Period</Label>
                <Input
                  id="days-before"
                  type="number"
                  min="1"
                  max="7"
                  value={reminderDaysBefore}
                  onChange={(e) => setReminderDaysBefore(e.target.value)}
                  data-testid="input-days-before"
                />
              </div>
              <div>
                <Label htmlFor="reminder-time">Time of Day</Label>
                <Input
                  id="reminder-time"
                  type="time"
                  value={reminderTime}
                  onChange={(e) => setReminderTime(e.target.value)}
                  data-testid="input-reminder-time"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setConfigureReminderOpen(false)}
                data-testid="button-cancel-reminder"
              >
                Cancel
              </Button>
              <Button
                onClick={handleConfigureReminder}
                data-testid="button-save-reminder"
              >
                Save Settings
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Partner Access Dialog */}
        <Dialog open={partnerAccessOpen} onOpenChange={setPartnerAccessOpen}>
          <DialogContent data-testid="dialog-partner-access">
            <DialogHeader>
              <DialogTitle>Partner Access</DialogTitle>
              <DialogDescription>
                Share your cycle information with a partner
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Partner access allows you to safely share selected cycle information with a trusted partner. They can view your cycle phase, upcoming period dates, and mood trends to better understand and support you.
              </p>
              <div className="p-4 rounded-lg bg-muted">
                <p className="text-sm font-medium mb-2">Coming Soon</p>
                <p className="text-sm text-muted-foreground">
                  This feature is currently in development. You'll be able to generate a secure sharing link and control exactly what information is visible to your partner.
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button
                onClick={() => setPartnerAccessOpen(false)}
                data-testid="button-close-partner"
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
