import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useUser } from "@/hooks/useUser";
import { useToast } from "@/hooks/use-toast";
import { User, Save } from "lucide-react";

interface ProfileFormData {
  name: string;
  email: string;
  age: number;
  gender: string;
  height: number;
  weight: number;
  goal: string;
}

const ProfileEditForm = () => {
  const { toast } = useToast();
  const { user, updateProfile } = useUser();
  
  const [formData, setFormData] = useState<ProfileFormData>({
    name: '',
    email: '',
    age: 0,
    gender: '',
    height: 0,
    weight: 0,
    goal: ''
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
        email: user.email || '',
        age: user.age || 0,
        gender: user.gender || '',
        height: user.height || 0,
        weight: user.weight || 0,
        goal: user.goal || ''
      });
    }
  }, [user]);

  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field: keyof ProfileFormData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const [firstName, ...lastNameParts] = formData.name.split(' ');
    const lastName = lastNameParts.join(' ');

    updateProfile({
      firstName,
      lastName,
      email: formData.email,
      age: formData.age,
      gender: formData.gender,
      height: formData.height,
      weight: formData.weight,
      goal: formData.goal
    });
    
    setIsLoading(false);
    
    toast({
      title: "Profile Updated! ✨",
      description: "Your changes have been saved successfully. Keep up the great work!",
      duration: 4000,
    });
  };

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="text-card-title flex items-center space-x-2">
          <User className="h-5 w-5 text-primary" />
          <span>Edit Profile</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-form-label">Full Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Your name"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email" className="text-form-label">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="Your email"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="age" className="text-form-label">Age</Label>
            <Input
              id="age"
              type="number"
              value={formData.age}
              onChange={(e) => handleInputChange('age', parseInt(e.target.value) || 0)}
              placeholder="25"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="gender" className="text-form-label">Gender</Label>
            <Select 
              value={formData.gender} 
              onValueChange={(value) => handleInputChange('gender', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="height" className="text-form-label">Height (cm)</Label>
            <Input
              id="height"
              type="number"
              value={formData.height}
              onChange={(e) => handleInputChange('height', parseInt(e.target.value) || 0)}
              placeholder="175"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="weight" className="text-form-label">Weight (kg)</Label>
            <Input
              id="weight"
              type="number"
              value={formData.weight}
              onChange={(e) => handleInputChange('weight', parseInt(e.target.value) || 0)}
              placeholder="70"
            />
          </div>
          
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="goal" className="text-form-label">Primary Goal</Label>
            <Select 
              value={formData.goal} 
              onValueChange={(value) => handleInputChange('goal', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select goal" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="lose_weight">Lose Weight</SelectItem>
                <SelectItem value="build_muscle">Build Muscle</SelectItem>
                <SelectItem value="improve_stamina">Improve Stamina</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="flex justify-end pt-4">
          <Button onClick={handleSave} disabled={isLoading} className="bg-primary text-primary-foreground hover:bg-primary/90">
            {isLoading ? (
              "Saving..."
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileEditForm;
