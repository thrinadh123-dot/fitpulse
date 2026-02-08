import { useUser } from "@/hooks/useUser";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Mail, Ruler, Weight, Calendar, Activity, HeartPulse } from "lucide-react";
import { Link } from "react-router-dom";

const Profile = () => {
  const { user } = useUser();

  const getBMI = () => {
    if (user?.height && user?.weight) {
      // Assuming metric (cm, kg) for now based on typical implementation, 
      // but should ideally check unitSystem. 
      // Formula: kg / (m^2)
      const heightInMeters = user.height / 100;
      return (user.weight / (heightInMeters * heightInMeters)).toFixed(1);
    }
    return "N/A";
  };

  return (
    <div className="container mx-auto p-4 md:p-6 space-y-8 max-w-4xl pb-24">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-page-heading">My Profile</h1>
          <p className="text-body-text text-muted-foreground">
            View and manage your personal health profile.
          </p>
        </div>
        <Link to="/settings">
          <Button variant="outline" className="text-body-text">Edit Profile</Button>
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Personal Info */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-section-heading flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-6 md:grid-cols-2">
            <div className="flex items-center gap-4 p-4 rounded-lg bg-muted/30">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-primary font-bold text-xl">
                  {user?.firstName?.charAt(0) || "U"}
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Full Name</p>
                <p className="text-card-title">{user?.firstName} {user?.lastName}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 p-4 rounded-lg bg-muted/30">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Mail className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Email</p>
                <p className="text-card-title">{user?.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 rounded-lg bg-muted/30">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Calendar className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Age</p>
                <p className="text-card-title">{user?.age || "Not set"}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 rounded-lg bg-muted/30">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Gender</p>
                <p className="text-card-title capitalize">{user?.gender || "Not set"}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Physical Stats */}
        <Card>
          <CardHeader>
            <CardTitle className="text-section-heading flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              Body Stats
            </CardTitle>
            <CardDescription className="text-body-text">
              Your physical measurements and calculated metrics.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 border-b">
              <div className="flex items-center gap-3">
                <Ruler className="h-4 w-4 text-muted-foreground" />
                <span className="text-body-text">Height</span>
              </div>
              <span className="text-card-title">{user?.height ? `${user.height} cm` : "Not set"}</span>
            </div>
            <div className="flex items-center justify-between p-3 border-b">
              <div className="flex items-center gap-3">
                <Weight className="h-4 w-4 text-muted-foreground" />
                <span className="text-body-text">Weight</span>
              </div>
              <span className="text-card-title">{user?.weight ? `${user.weight} kg` : "Not set"}</span>
            </div>
            <div className="flex items-center justify-between p-3">
              <div className="flex items-center gap-3">
                <Activity className="h-4 w-4 text-muted-foreground" />
                <span className="text-body-text">BMI</span>
              </div>
              <span className="text-card-title">{getBMI()}</span>
            </div>
          </CardContent>
        </Card>

        {/* Health Goals */}
        <Card>
          <CardHeader>
            <CardTitle className="text-section-heading flex items-center gap-2">
              <HeartPulse className="h-5 w-5 text-primary" />
              Health Goals
            </CardTitle>
            <CardDescription className="text-body-text">
              Your primary fitness objectives and considerations.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <span className="text-sm font-medium text-muted-foreground">Primary Goal</span>
              <div className="p-3 bg-primary/5 rounded-lg border border-primary/10">
                <p className="text-card-title capitalize">{user?.goal?.replace('-', ' ') || "No goal set"}</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <span className="text-sm font-medium text-muted-foreground">Health Considerations</span>
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-body-text text-muted-foreground">
                  {user?.healthIssues || "No reported health issues"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
