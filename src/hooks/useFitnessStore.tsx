import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

export interface FitnessData {
  calories: number;
  water: number;
  steps: number;
  sleep: number;
  lastUpdated: string;
  waterEntries: Array<{
    amount: number;
    time: string;
  }>;
}

export const selectIsSyncing = (state: FitnessState) => state.isLoading;

export interface FitnessState {
  data: FitnessData;
  isLoading: boolean;
  goals: typeof DEFAULT_GOALS;
  updateMetric: (metric: keyof Omit<FitnessData, 'lastUpdated'>, value: number) => void;
  addToMetric: (metric: keyof Omit<FitnessData, 'lastUpdated'>, amount: number) => void;
  logMeal: (calories: number) => void;
  addWater: (cups?: number) => void;
  logSleep: (hours: number) => void;
  addSteps: (steps: number) => void;
  getProgress: (metric: keyof Omit<FitnessData, 'lastUpdated'>) => number;
  getLastResetTime: () => string;
  checkDailyReset: (data: FitnessData) => boolean;
}

const STORAGE_KEY = 'fitpulse_fitness_data';
const DEFAULT_GOALS = {
  calories: 2200,
  water: 8, // cups
  steps: 10000,
  sleep: 8 // hours
};

export const useFitnessStore = () => {
  console.log('🔍 DEBUG: useFitnessStore hook called');
  const [fitnessData, setFitnessData] = useState<FitnessData>({
    calories: 0,
    water: 0,
    steps: 0,
    sleep: 0,
    lastUpdated: '',
    waterEntries: []
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
        lastUpdated: today,
        waterEntries: []
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
          lastUpdated: today,
          waterEntries: []
        };
        saveData(initialData);
        setFitnessData(initialData);
      }
      
      setIsLoading(false);
    };

    initializeData();
  }, [loadData, saveData, getTodayString, checkDailyReset]);

  // Update a specific metric
  const updateMetric = useCallback((metric: keyof Omit<FitnessData, 'lastUpdated' | 'waterEntries'>, value: number) => {
    console.log('🔍 DEBUG: Updating metric:', metric, 'to value:', value);
    setFitnessData(prev => {
      const updated = {
        ...prev,
        [metric]: value,
        lastUpdated: new Date().toISOString() // Force update on lastUpdated
      };
      console.log('🔍 DEBUG: Updated state:', updated);
      saveData(updated);
      return updated;
    });
  }, [saveData]);

  // Add to a metric (increment)
  const addToMetric = useCallback((metric: keyof Omit<FitnessData, 'lastUpdated' | 'waterEntries'>, amount: number) => {
    console.log('🔍 DEBUG addToMetric called:', { metric, amount });
    setFitnessData(prev => {
      console.log('🔍 DEBUG Previous state:', prev);
      const updated = {
        ...prev,
        [metric]: prev[metric] + amount,
        lastUpdated: new Date().toISOString() // Force update on lastUpdated
      };
      console.log('🔍 DEBUG Updated state:', updated);
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
    console.log('🔍 DEBUG addWater called with:', cups);
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
  const getProgress = useCallback((metric: keyof Omit<FitnessData, 'lastUpdated' | 'waterEntries'>) => {
    const current = Number(fitnessData[metric]);
    const goal = Number(DEFAULT_GOALS[metric]);
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
    data: fitnessData, // Changed to match the expected property name
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