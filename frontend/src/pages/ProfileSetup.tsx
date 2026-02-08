import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useUser } from "@/hooks/useUser";

const ProfileSetup = () => {
  const navigate = useNavigate();
  const { updateProfile } = useUser();
  const [formData, setFormData] = useState({
    height: "",
    weight: "",
    healthIssues: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Save profile data to UserContext
    updateProfile({
      height: Number(formData.height),
      weight: Number(formData.weight),
      // Note: healthIssues is not currently in UserProfile interface in useUser.tsx
      // We might need to add it if we want to persist it, or just ignore for now
    });
    
    console.log("Profile setup data:", formData);
    
    // Redirect to goal selection
    navigate("/goal-selection");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-hero px-4">
      <Card className="w-full max-w-md shadow-glow animate-slide-up">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Activity className="h-8 w-8 text-primary" />
            <span className="text-page-heading bg-gradient-primary bg-clip-text text-transparent">
              FitPulse
            </span>
          </div>
          <CardTitle className="text-page-heading">Complete Your Profile</CardTitle>
          <p className="text-body-text text-muted-foreground">Help us personalize your fitness journey</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="height" className="text-card-title">Height (cm)</Label>
              <Input
                id="height"
                type="number"
                placeholder="170"
                value={formData.height}
                onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                required
                className="text-body-text"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="weight" className="text-card-title">Weight (kg)</Label>
              <Input
                id="weight"
                type="number"
                placeholder="70"
                value={formData.weight}
                onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                required
                className="text-body-text"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="healthIssues" className="text-card-title">Health Issues/Disorders (Optional)</Label>
              <Textarea
                id="healthIssues"
                placeholder="Any health conditions we should know about..."
                value={formData.healthIssues}
                onChange={(e) => setFormData({ ...formData, healthIssues: e.target.value })}
                className="min-h-[80px] text-body-text"
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-primary hover:shadow-glow transition-all duration-300 text-card-title uppercase"
            >
              Continue to Goal Selection
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileSetup;
