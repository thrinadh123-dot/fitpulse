import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useUser } from "@/hooks/useUser";
import { PageTransition } from "@/components/ui/page-transition";
import { User, Calendar, Ruler, Weight, Target, Settings } from "lucide-react";

const Profile = () => {
  const { user } = useUser();

  if (!user) {
    return (
      <PageTransition>
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold mb-4">Profile Not Found</h1>
          <p className="text-muted-foreground">Please log in to view your profile.</p>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="space-y-8">
        {/* Profile Header */}
        <div className="text-center">
          <div className="w-24 h-24 mx-auto mb-4 bg-primary/20 rounded-full flex items-center justify-center">
            <User className="w-12 h-12 text-primary" />
          </div>
          <h1 className="text-3xl font-bold mb-2">
            {user.firstName} {user.lastName}
          </h1>
          <p className="text-muted-foreground mb-4">{user.email}</p>
          <Badge variant="secondary" className="text-sm">
            {user.onboardingComplete ? 'Profile Complete' : 'Profile Incomplete'}
          </Badge>
        </div>

        {/* Profile Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5 text-primary" />
                <span>Personal Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">First Name</span>
                <span className="font-medium">{user.firstName || 'Not set'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Last Name</span>
                <span className="font-medium">{user.lastName || 'Not set'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Email</span>
                <span className="font-medium">{user.email || 'Not set'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Age</span>
                <span className="font-medium">
                  {user.age ? `${user.age} years` : 'Not set'}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="h-5 w-5 text-secondary" />
                <span>Fitness Goals</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Primary Goal</span>
                <span className="font-medium">{user.goal || 'Not set'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Unit System</span>
                <span className="font-medium capitalize">
                  {user.unitSystem || 'Not set'}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Ruler className="h-5 w-5 text-primary" />
                <span>Physical Measurements</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Height</span>
                <span className="font-medium">
                  {user.height ? `${user.height} ${user.unitSystem === 'metric' ? 'cm' : 'in'}` : 'Not set'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Weight</span>
                <span className="font-medium">
                  {user.weight ? `${user.weight} ${user.unitSystem === 'metric' ? 'kg' : 'lbs'}` : 'Not set'}
                </span>
              </div>
              {user.height && user.weight && (
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">BMI</span>
                  <span className="font-medium">
                    {calculateBMI(user.height, user.weight, user.unitSystem).toFixed(1)}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="h-5 w-5 text-secondary" />
                <span>Account Settings</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Profile Status</span>
                <Badge variant={user.onboardingComplete ? "default" : "secondary"}>
                  {user.onboardingComplete ? 'Complete' : 'Incomplete'}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Member Since</span>
                <span className="font-medium">
                  {user.id ? new Date(parseInt(user.id)).toLocaleDateString() : 'Unknown'}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center space-x-4">
          <Button variant="outline" className="px-8">
            Edit Profile
          </Button>
          <Button className="px-8 bg-gradient-primary hover:shadow-glow">
            Update Goals
          </Button>
        </div>
      </div>
    </PageTransition>
  );
};

// Helper function to calculate BMI
const calculateBMI = (height: number, weight: number, unitSystem: 'metric' | 'imperial'): number => {
  if (unitSystem === 'imperial') {
    // Convert inches to meters and pounds to kg
    const heightInMeters = height * 0.0254;
    const weightInKg = weight * 0.453592;
    return weightInKg / (heightInMeters * heightInMeters);
  } else {
    // Height in cm, weight in kg
    const heightInMeters = height / 100;
    return weight / (heightInMeters * heightInMeters);
  }
};

export default Profile;