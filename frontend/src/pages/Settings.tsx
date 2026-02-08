import { useState } from "react";
import { 
  User, Bell, Moon, Sun, Smartphone, Shield, 
  LogOut, ChevronRight, Mail, Lock, Globe
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "@/hooks/useTheme";
import { useUser } from "@/hooks/useUser";
import { useToast } from "@/hooks/use-toast";

const Settings = () => {
  const { theme, setTheme } = useTheme();
  const { user, logout } = useUser();
  const { toast } = useToast();
  
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    weekly_report: false,
    workout_reminders: true
  });

  const handleNotificationToggle = (key: keyof typeof notifications) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
    toast({
      title: "Settings updated",
      description: "Your notification preferences have been saved."
    });
  };

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged out",
      description: "You have been successfully logged out."
    });
  };

  return (
    <div className="container mx-auto p-4 md:p-6 space-y-8 max-w-4xl pb-24">
      <div className="space-y-2">
        <h1 className="text-page-heading">Settings</h1>
        <p className="text-body-text text-muted-foreground">
          Manage your account settings and preferences.
        </p>
      </div>

      <div className="grid gap-6">
        {/* Profile Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-section-heading flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              Profile Information
            </CardTitle>
            <CardDescription className="text-body-text">
              Update your personal details and public profile.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-primary text-2xl font-bold">
                {user?.firstName?.charAt(0) || "U"}
              </div>
              <div className="space-y-1">
                <h3 className="text-card-title">{user?.firstName} {user?.lastName}</h3>
                <p className="text-body-text text-muted-foreground">{user?.email || "user@example.com"}</p>
              </div>
              <Button variant="outline" className="ml-auto text-body-text">Edit Profile</Button>
            </div>
          </CardContent>
        </Card>

        {/* Appearance Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-section-heading flex items-center gap-2">
              <Sun className="h-5 w-5 text-primary" />
              Appearance
            </CardTitle>
            <CardDescription className="text-body-text">
              Customize how the app looks and feels.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <label className="text-card-title">Theme</label>
                <p className="text-body-text text-muted-foreground">
                  Select your preferred theme for the application.
                </p>
              </div>
              <div className="flex items-center gap-2 bg-muted p-1 rounded-full">
                <Button
                  variant={theme === 'light' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setTheme('light')}
                  className="rounded-full px-3"
                >
                  <Sun className="h-4 w-4 mr-2" />
                  Light
                </Button>
                <Button
                  variant={theme === 'dark' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setTheme('dark')}
                  className="rounded-full px-3"
                >
                  <Moon className="h-4 w-4 mr-2" />
                  Dark
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notifications Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-section-heading flex items-center gap-2">
              <Bell className="h-5 w-5 text-primary" />
              Notifications
            </CardTitle>
            <CardDescription className="text-body-text">
              Configure how you want to be notified.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <label className="text-card-title">Push Notifications</label>
                <p className="text-body-text text-muted-foreground">
                  Receive push notifications on your device.
                </p>
              </div>
              <Switch 
                checked={notifications.push}
                onCheckedChange={() => handleNotificationToggle('push')}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <label className="text-card-title">Workout Reminders</label>
                <p className="text-body-text text-muted-foreground">
                  Get reminded about your scheduled workouts.
                </p>
              </div>
              <Switch 
                checked={notifications.workout_reminders}
                onCheckedChange={() => handleNotificationToggle('workout_reminders')}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <label className="text-card-title">Weekly Report</label>
                <p className="text-body-text text-muted-foreground">
                  Receive a weekly summary of your progress.
                </p>
              </div>
              <Switch 
                checked={notifications.weekly_report}
                onCheckedChange={() => handleNotificationToggle('weekly_report')}
              />
            </div>
          </CardContent>
        </Card>

        {/* Security Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-section-heading flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Security
            </CardTitle>
            <CardDescription className="text-body-text">
              Manage your password and account security.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-2 hover:bg-muted/50 rounded-lg cursor-pointer transition-colors">
              <div className="flex items-center gap-3">
                <Lock className="h-5 w-5 text-muted-foreground" />
                <div className="space-y-0.5">
                  <p className="text-card-title">Change Password</p>
                  <p className="text-body-text text-muted-foreground">Update your password securely.</p>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="border-red-200 dark:border-red-900/50">
          <CardHeader>
            <CardTitle className="text-section-heading text-red-500 flex items-center gap-2">
              <LogOut className="h-5 w-5" />
              Account Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button 
              variant="destructive" 
              className="w-full sm:w-auto text-body-text"
              onClick={handleLogout}
            >
              Log Out
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
