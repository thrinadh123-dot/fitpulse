import { useState, useEffect, createContext, useContext } from 'react';
import usersData from '@/data/users.json';

interface UserProfile {
  id?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  age?: number;
  height?: number;
  weight?: number;
  unitSystem?: 'metric' | 'imperial';
  goal?: string;
  onboardingComplete?: boolean;
}

interface UserContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: Partial<UserProfile>) => Promise<boolean>;
  logout: () => void;
  updateProfile: (data: Partial<UserProfile>) => void;
  saveOnboardingData: (data: Record<string, unknown>) => void;
  getOnboardingData: () => Record<string, unknown> | null;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

// In-memory store for users, initialized from users.json
let users = [...usersData];

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Initialize user state from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('userProfile');
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      setUser(userData);
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const foundUser = users.find(u => u.email === email && u.password === password);

      if (foundUser) {
        const userProfile: UserProfile = { ...foundUser };
        delete (userProfile as any).password; // Don't store password in state

        setUser(userProfile);
        setIsAuthenticated(true);
        localStorage.setItem('userProfile', JSON.stringify(userProfile));
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const register = async (userData: Partial<UserProfile>): Promise<boolean> => {
    try {
      if (users.some(u => u.email === userData.email)) {
        throw new Error('User with this email already exists.');
      }

      const newUser: UserProfile = {
        id: Date.now().toString(),
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        email: userData.email || '',
        onboardingComplete: false,
      };

      // Add password to the user object for our mock DB
      const newUserWithPassword = {
        ...newUser,
        password: userData.password, // Assuming password is provided in userData
      };

      users.push(newUserWithPassword as any);
      
      setUser(newUser);
      setIsAuthenticated(true);
      localStorage.setItem('userProfile', JSON.stringify(newUser));
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      // Propagate the error message to the component
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('userProfile');
    localStorage.removeItem('onboardingData');
    localStorage.removeItem('onboardingComplete');
  };

  const updateProfile = (data: Partial<UserProfile>) => {
    if (user) {
      const updatedUser = { ...user, ...data };
      setUser(updatedUser);
      localStorage.setItem('userProfile', JSON.stringify(updatedUser));

      // Update the in-memory users array as well
      const userIndex = users.findIndex(u => u.id === user.id);
      if (userIndex !== -1) {
        users[userIndex] = { ...users[userIndex], ...updatedUser };
      }
    }
  };

  const saveOnboardingData = (data: Record<string, unknown>) => {
    if (user) {
      const updatedUser: UserProfile = {
        ...user,
        age: data.age as number,
        height: data.height as number,
        weight: data.weight as number,
        unitSystem: data.unitSystem as 'metric' | 'imperial',
        goal: data.goal as string,
        onboardingComplete: true,
      };
      updateProfile(updatedUser);
    }
  };

  const getOnboardingData = () => {
    const data = localStorage.getItem('onboardingData');
    return data ? JSON.parse(data) : null;
  };

  const value: UserContextType = {
    user,
    isAuthenticated,
    login,
    register,
    logout,
    updateProfile,
    saveOnboardingData,
    getOnboardingData,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};
