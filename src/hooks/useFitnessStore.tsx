import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

export interface FitnessData {
  calories: number;
  water: number;
  steps: number;
  sleep: number;
  lastUpdated: string;
}

const STORAGE_KEY = 'fitpulse_fitness_data';
const DEFAULT_GOALS = {
  calories: 2200,
  water: 8, // cups
  steps: 10000,
  sleep: 8 // hours
};

export const useFitnessStore = () => {
  const [fitnessData, setFitnessData] = useState<FitnessData>({
    calories: 0,
    water: 0,
    steps: 0,
    sleep: 0,
    lastUpdated: ''
  });
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Get today's date in YYYY-MM-DD format
  const getTodayString = useCallback(() => {
    return new Date().toISOString().split('T')[0];
  }, []);

  // Load data from localStorage
  const loadData = useCallback(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return parsed as FitnessData;
      }
    } catch (error) {
      console.error('Error loading fitness data:', error);
    }
    return null;
  }, []);

  // Save data to localStorage
  const saveData = useCallback((data: FitnessData) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Error saving fitness data:', error);
    }
  }, []);

  // Check if daily reset is needed
  const checkDailyReset = useCallback((data: FitnessData) => {
    const today = getTodayString();
    const lastUpdated = data.lastUpdated;

    if (lastUpdated !== today) {
      // Daily reset needed
      const resetData: FitnessData = {
        calories: 0,
        water: 0,
        steps: 0,
        sleep: 0,
        lastUpdated: today
      };

      saveData(resetData);
      setFitnessData(resetData);
      
      toast({
        title: "Daily Stats Refreshed",
        description: "Your fitness tracking has been reset for today!",
      });

      return true;
    }
    return false;
  }, [getTodayString, saveData, toast]);

  // Initialize data on mount
  useEffect(() => {
    const initializeData = () => {
      setIsLoading(true);
      
      const storedData = loadData();
      const today = getTodayString();

      if (storedData) {
        // Check if we need a daily reset
        const wasReset = checkDailyReset(storedData);
        
        if (!wasReset) {
          setFitnessData(storedData);
        }
      } else {
        // First time user - initialize with today's date
        const initialData: FitnessData = {
          calories: 0,
          water: 0,
          steps: 0,
          sleep: 0,
          lastUpdated: today
        };
        saveData(initialData);
        setFitnessData(initialData);
      }
      
      setIsLoading(false);
    };

    initializeData();
  }, [loadData, saveData, getTodayString, checkDailyReset]);

  // Update a specific metric
  const updateMetric = useCallback((metric: keyof Omit<FitnessData, 'lastUpdated'>, value: number) => {
    setFitnessData(prev => {
      const updated = {
        ...prev,
        [metric]: value
      };
      saveData(updated);
      return updated;
    });
  }, [saveData]);

  // Add to a metric (increment)
  const addToMetric = useCallback((metric: keyof Omit<FitnessData, 'lastUpdated'>, amount: number) => {
    setFitnessData(prev => {
      const updated = {
        ...prev,
        [metric]: prev[metric] + amount
      };
      saveData(updated);
      return updated;
    });
  }, [saveData]);

  // Quick action functions
  const logMeal = useCallback((calories: number) => {
    addToMetric('calories', calories);
    toast({
      title: "Meal Logged",
      description: `Added ${calories} calories to your daily total`,
    });
  }, [addToMetric, toast]);

  const addWater = useCallback((cups: number = 1) => {
    addToMetric('water', cups);
    toast({
      title: "Water Added",
      description: `Added ${cups} cup${cups > 1 ? 's' : ''} of water`,
    });
  }, [addToMetric, toast]);

  const logSleep = useCallback((hours: number) => {
    updateMetric('sleep', hours);
    toast({
      title: "Sleep Logged",
      description: `Logged ${hours} hours of sleep`,
    });
  }, [updateMetric, toast]);

  const addSteps = useCallback((steps: number) => {
    addToMetric('steps', steps);
    toast({
      title: "Steps Added",
      description: `Added ${steps.toLocaleString()} steps`,
    });
  }, [addToMetric, toast]);

  // Get progress percentage for a metric
  const getProgress = useCallback((metric: keyof Omit<FitnessData, 'lastUpdated'>) => {
    const current = fitnessData[metric];
    const goal = DEFAULT_GOALS[metric];
    return Math.min((current / goal) * 100, 100);
  }, [fitnessData]);

  // Get formatted last reset time
  const getLastResetTime = useCallback(() => {
    if (!fitnessData.lastUpdated) return 'Never';
    
    const date = new Date(fitnessData.lastUpdated);
    return `Today at ${date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    })}`;
  }, [fitnessData.lastUpdated]);

  return {
    fitnessData,
    isLoading,
    goals: DEFAULT_GOALS,
    updateMetric,
    addToMetric,
    logMeal,
    addWater,
    logSleep,
    addSteps,
    getProgress,
    getLastResetTime,
    checkDailyReset
  };
}; 