import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { User, Lock, Bell, Palette, Trash2, Save, AlertCircle, Sun, Moon, Monitor } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useUser } from "@/hooks/useUser";
import { useTheme } from "@/hooks/useTheme";
import { PageTransition } from "@/components/ui/page-transition";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { ThemeAudit } from "@/components/ThemeAudit";

const Settings = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, updateProfile, logout } = useUser();
  const { theme, setTheme } = useTheme();
  
  // Local state for form inputs (controlled components)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    age: '',
    height: '',
    weight: '',
  });

  // Load user data into form when component mounts
  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        age: user.age?.toString() || '',
        height: user.height?.toString() || '',
        weight: user.weight?.toString() || '',
      });
    }
  }, [user]);

  // Notification settings
  const [notifications, setNotifications] = useLocalStorage('notificationSettings', {
    waterReminders: true,
    workoutReminders: true,
    sleepReminders: false,
    emailUpdates: true,
  });

  // Password change state
  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  // Loading states
  const [isUpdating, setIsUpdating] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Handle form input changes (controlled component pattern)
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle profile update
  const handleProfileUpdate = async () => {
    if (!user) {
      toast({
        title: "Authentication Error",
        description: "Please log in to update your profile.",
        variant: "destructive",
      });
      return;
    }

    setIsUpdating(true);
    
    try {
      // Prepare data for update
      const updateData: Record<string, string | number> = {};
      
      if (formData.firstName !== user.firstName) updateData.firstName = formData.firstName;
      if (formData.lastName !== user.lastName) updateData.lastName = formData.lastName;
      if (formData.email !== user.email) updateData.email = formData.email;
      if (formData.age !== user.age?.toString()) updateData.age = parseInt(formData.age) || user.age;
      if (formData.height !== user.height?.toString()) updateData.height = parseInt(formData.height) || user.height;
      if (formData.weight !== user.weight?.toString()) updateData.weight = parseInt(formData.weight) || user.weight;

      // Update profile using user management system
      updateProfile(updateData);

      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully.",
      });
    } catch (error) {
      console.error('Profile update error:', error);
      toast({
        title: "Update Failed",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  // Handle password change
  const handlePasswordChange = async () => {
    if (passwords.new !== passwords.confirm) {
      toast({
        title: "Passwords Don't Match",
        description: "New password and confirmation must match.",
        variant: "destructive",
      });
      return;
    }
    
    if (passwords.new.length < 6) {
      toast({
        title: "Password Too Short",
        description: "Password must be at least 6 characters long.",
        variant: "destructive",
      });
      return;
    }

    setIsChangingPassword(true);
    
    try {
      // In a real app, this would be an API call with authentication
      // For now, we'll simulate the process
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Password Changed",
        description: "Your password has been updated successfully.",
      });
      
      setPasswords({ current: "", new: "", confirm: "" });
    } catch (error) {
      toast({
        title: "Password Change Failed",
        description: "Failed to change password. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsChangingPassword(false);
    }
  };

  // Handle account deletion
  const handleDeleteAccount = async () => {
    if (!confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      return;
    }

    try {
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      logout();
      toast({
        title: "Account Deleted",
        description: "Your account has been permanently deleted.",
      });
      
      navigate("/");
    } catch (error) {
      toast({
        title: "Deletion Failed",
        description: "Failed to delete account. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Check if form has changes
  const hasChanges = () => {
    if (!user) return false;
    return (
      formData.firstName !== (user.firstName || '') ||
      formData.lastName !== (user.lastName || '') ||
      formData.email !== (user.email || '') ||
      formData.age !== (user.age?.toString() || '') ||
      formData.height !== (user.height?.toString() || '') ||
      formData.weight !== (user.weight?.toString() || '')
    );
  };

  if (!user) {
    return (
      <PageTransition>
        <div className="text-center py-12">
          <AlertCircle className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
          <h1 className="text-2xl font-bold mb-4">Authentication Required</h1>
          <p className="text-muted-foreground mb-6">Please log in to access your settings.</p>
          <Button onClick={() => navigate('/login')}>
            Go to Login
          </Button>
        </div>
      </PageTransition>
    );
  }

  const cardVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-gradient-subtle py-8">
        <motion.div
          className="max-w-4xl mx-auto px-4"
          initial="hidden"
          animate="visible"
          transition={{ staggerChildren: 0.1 }}
        >
          <motion.div
            className="mb-8"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
          >
            <h1 className="text-3xl font-bold mb-2">Settings</h1>
            <p className="text-muted-foreground">Manage your account and preferences</p>
          </motion.div>

          <div className="grid gap-6">
            {/* Profile Settings */}
            <motion.div variants={cardVariants}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Profile Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        value={formData.firstName}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                        className="hover-neon focus:shadow-glow"
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        value={formData.lastName}
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                        className="hover-neon focus:shadow-glow"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="hover-neon focus:shadow-glow"
                    />
                  </div>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="age">Age</Label>
                      <Input
                        id="age"
                        type="number"
                        min="13"
                        max="120"
                        value={formData.age}
                        onChange={(e) => handleInputChange('age', e.target.value)}
                        className="hover-neon focus:shadow-glow"
                      />
                    </div>
                    <div>
                      <Label htmlFor="height">Height ({user.unitSystem === 'metric' ? 'cm' : 'in'})</Label>
                      <Input
                        id="height"
                        type="number"
                        min="100"
                        max="250"
                        value={formData.height}
                        onChange={(e) => handleInputChange('height', e.target.value)}
                        className="hover-neon focus:shadow-glow"
                      />
                    </div>
                    <div>
                      <Label htmlFor="weight">Weight ({user.unitSystem === 'metric' ? 'kg' : 'lbs'})</Label>
                      <Input
                        id="weight"
                        type="number"
                        min="30"
                        max="300"
                        value={formData.weight}
                        onChange={(e) => handleInputChange('weight', e.target.value)}
                        className="hover-neon focus:shadow-glow"
                      />
                    </div>
                  </div>
                  <Button 
                    onClick={handleProfileUpdate} 
                    disabled={!hasChanges() || isUpdating}
                    className="bg-gradient-primary"
                  >
                    {isUpdating ? (
                      <>
                        <Save className="w-4 h-4 mr-2 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Update Profile
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            {/* Security Settings */}
            <motion.div variants={cardVariants}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lock className="h-5 w-5" />
                    Security
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Input
                      id="currentPassword"
                      type="password"
                      value={passwords.current}
                      onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      value={passwords.new}
                      onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={passwords.confirm}
                      onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                    />
                  </div>
                  <Button 
                    onClick={handlePasswordChange} 
                    variant="outline"
                    disabled={isChangingPassword || !passwords.current || !passwords.new || !passwords.confirm}
                  >
                    {isChangingPassword ? "Changing..." : "Change Password"}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            {/* Theme Settings */}
            <motion.div variants={cardVariants}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Palette className="h-5 w-5" />
                    Appearance
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-base font-medium mb-4 block">Theme Selection</Label>
                    <p className="text-sm text-muted-foreground mb-4">
                      Choose your preferred theme. Light mode is optimized for bright environments, while dark mode is perfect for low-light conditions.
                    </p>
                    <div className="grid gap-3">
                      <div 
                        className={`flex items-center justify-between p-3 rounded-lg border-2 cursor-pointer transition-all ${
                          theme === 'light' 
                            ? 'border-primary bg-primary/5' 
                            : 'border-border hover:border-primary/50'
                        }`}
                        onClick={() => setTheme('light')}
                      >
                        <div className="flex items-center gap-3">
                          <Sun className="h-5 w-5 text-primary" />
                          <div>
                            <p className="font-medium">Light Mode</p>
                            <p className="text-sm text-muted-foreground">Ultra pale gray background for bright environments</p>
                          </div>
                        </div>
                        {theme === 'light' && (
                          <div className="w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                          </div>
                        )}
                      </div>
                      
                      <div 
                        className={`flex items-center justify-between p-3 rounded-lg border-2 cursor-pointer transition-all ${
                          theme === 'dark' 
                            ? 'border-primary bg-primary/5' 
                            : 'border-border hover:border-primary/50'
                        }`}
                        onClick={() => setTheme('dark')}
                      >
                        <div className="flex items-center gap-3">
                          <Moon className="h-5 w-5 text-primary" />
                          <div>
                            <p className="font-medium">Dark Mode</p>
                            <p className="text-sm text-muted-foreground">Deep charcoal background for low-light conditions</p>
                          </div>
                        </div>
                        {theme === 'dark' && (
                          <div className="w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                          </div>
                        )}
                      </div>
                      
                      <div 
                        className={`flex items-center justify-between p-3 rounded-lg border-2 cursor-pointer transition-all ${
                          theme === 'system' 
                            ? 'border-primary bg-primary/5' 
                            : 'border-border hover:border-primary/50'
                        }`}
                        onClick={() => setTheme('system')}
                      >
                        <div className="flex items-center gap-3">
                          <Monitor className="h-5 w-5 text-primary" />
                          <div>
                            <p className="font-medium">System Default</p>
                            <p className="text-sm text-muted-foreground">Follows your device's theme preference</p>
                          </div>
                        </div>
                        {theme === 'system' && (
                          <div className="w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Theme Audit */}
            <motion.div variants={cardVariants}>
              <ThemeAudit />
            </motion.div>

            {/* Notification Settings */}
            <motion.div variants={cardVariants}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5" />
                    Notifications
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Water Reminders</p>
                        <p className="text-sm text-muted-foreground">Get reminded to drink water</p>
                      </div>
                      <Switch
                        checked={notifications.waterReminders}
                        onCheckedChange={(checked) =>
                          setNotifications({ ...notifications, waterReminders: checked })
                        }
                      />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Workout Reminders</p>
                        <p className="text-sm text-muted-foreground">Get reminded to exercise</p>
                      </div>
                      <Switch
                        checked={notifications.workoutReminders}
                        onCheckedChange={(checked) =>
                          setNotifications({ ...notifications, workoutReminders: checked })
                        }
                      />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Sleep Reminders</p>
                        <p className="text-sm text-muted-foreground">Get reminded about bedtime</p>
                      </div>
                      <Switch
                        checked={notifications.sleepReminders}
                        onCheckedChange={(checked) =>
                          setNotifications({ ...notifications, sleepReminders: checked })
                        }
                      />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Email Updates</p>
                        <p className="text-sm text-muted-foreground">Receive weekly progress emails</p>
                      </div>
                      <Switch
                        checked={notifications.emailUpdates}
                        onCheckedChange={(checked) =>
                          setNotifications({ ...notifications, emailUpdates: checked })
                        }
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Danger Zone */}
            <motion.div variants={cardVariants}>
              <Card className="border-destructive">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-destructive">
                    <Trash2 className="h-5 w-5" />
                    Danger Zone
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Once you delete your account, there is no going back. Please be certain.
                    </p>
                    <Button
                      onClick={handleDeleteAccount}
                      variant="destructive"
                      className="w-full md:w-auto"
                    >
                      Delete Account
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </PageTransition>
  );
};

export default Settings;