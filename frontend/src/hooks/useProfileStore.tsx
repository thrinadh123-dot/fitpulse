import { useLocalStorage } from './useLocalStorage';

export interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  age: string;
  gender: string;
  height: string;
  weight: string;
  goal: string;
  healthIssues: string;
  joinDate: string;
}

const defaultProfile: UserProfile = {
  firstName: '',
  lastName: '',
  email: '',
  age: '',
  gender: '',
  height: '',
  weight: '',
  goal: '',
  healthIssues: '',
  joinDate: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
};

export function useProfileStore() {
  const [profile, setProfile] = useLocalStorage<UserProfile>('userProfile', defaultProfile);

  const updateProfile = (updates: Partial<UserProfile>) => {
    setProfile(prev => ({ ...prev, ...updates }));
  };

  const getDisplayName = () => {
    if (profile.firstName && profile.lastName) {
      return `${profile.firstName} ${profile.lastName}`;
    }
    return profile.firstName || profile.email || 'User';
  };

  const getGoalDisplay = (goal: string) => {
    switch (goal) {
      case 'muscle-gain':
        return { label: 'Muscle Gain', color: 'bg-blue-500' };
      case 'weight-loss':
        return { label: 'Weight Loss', color: 'bg-green-500' };
      case 'weight-gain':
        return { label: 'Weight Gain', color: 'bg-orange-500' };
      case 'maintain-fitness':
        return { label: 'Maintain Fitness', color: 'bg-pink-500' };
      default:
        return { label: 'Not Set', color: 'bg-gray-500' };
    }
  };

  const getBMI = () => {
    if (profile.height && profile.weight) {
      const heightInMeters = parseFloat(profile.height) / 100;
      const weightInKg = parseFloat(profile.weight);
      return (weightInKg / (heightInMeters ** 2)).toFixed(1);
    }
    return '0.0';
  };

  return {
    profile,
    setProfile,
    updateProfile,
    getDisplayName,
    getGoalDisplay,
    getBMI
  };
}