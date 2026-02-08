import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { toast } from '@/hooks/use-toast';

// Types and Interfaces
export interface WaterEntry {
  time: string;
  amount: number; // in ml
}

export interface WorkoutEntry {
  id: string;
  name: string;
  type: string;
  duration: number;
  calories: number;
  notes?: string;
  date: string;
  intensity?: 'high' | 'moderate' | 'low';
}

export interface SleepEntry {
  id: string;
  date: string;
  bedtime: string;
  wakeTime: string;
  duration: number;
  quality: string;
}

export interface DailySummary {
  date: string;
  calories: number;
  steps: number;
  water: number; // in ml
  sleep: number; // in hours
  workouts: number; // count
}

export interface MealEntry {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  date: string;
}

export interface FitnessData {
  calories: number;
  water: number; // in ml
  waterHistory: WaterEntry[];
  workouts: WorkoutEntry[];
  sleepHistory: SleepEntry[];
  history: DailySummary[]; // Historical daily summaries
  steps: number;
  sleep: number;
  lastUpdated: string;
  // Nutrition totals for today
  protein: number;
  carbs: number;
  fat: number;
  meals: MealEntry[];
}

export interface FitnessGoals {
  calories: number;
  water: number; // in ml
  steps: number;
  sleep: number;
  workouts: number; // weekly target
  activeMinutes: number; // weekly target
}

export interface FitnessAction {
  type: 'water/add' | 'calories/add' | 'steps/add' | 'sleep/set' | 'workout/add' | 'sleep/add' | 'data/reset' | 'data/load' | 'meal/add' | 'meal/delete';
  payload: {
    amount?: number;
    unit?: string;
    data?: FitnessData;
    workout?: WorkoutEntry;
    sleepEntry?: SleepEntry;
    meal?: MealEntry;
    id?: string;
  };
}

interface FitnessState {
  // State
  data: FitnessData;
  goals: FitnessGoals;
  isLoading: boolean;
  isSyncing: boolean;
  lastSyncError: string | null;
  
  // Actions
  dispatch: (action: FitnessAction) => Promise<void>;
  
  // Selectors
  getProgress: (metric: keyof Omit<FitnessData, 'lastUpdated' | 'waterHistory' | 'workouts' | 'sleepHistory' | 'history' | 'meals' | 'protein' | 'carbs' | 'fat'>) => number;
  getLastResetTime: () => string;
  
  // Quick Actions
  addWater: (ml: number) => Promise<void>;
  addCalories: (calories: number) => Promise<void>;
  addSteps: (steps: number) => Promise<void>;
  setSleep: (hours: number) => Promise<void>;
  addWorkout: (workout: Omit<WorkoutEntry, 'id' | 'date'>) => Promise<void>;
  addSleep: (entry: Omit<SleepEntry, 'id'>) => Promise<void>;
  addMeal: (meal: Omit<MealEntry, 'id' | 'date'>) => Promise<void>;
  deleteMeal: (id: string) => Promise<void>;
  
  // Data Management
  loadData: () => Promise<void>;
  syncWithBackend: () => Promise<void>;
  resetDaily: () => Promise<void>;
}

// Default values
const DEFAULT_GOALS: FitnessGoals = {
  calories: 2200,
  water: 2500, // ml (10 cups)
  steps: 10000,
  sleep: 8, // hours
  workouts: 5, // 5 workouts per week
  activeMinutes: 150 // 150 minutes per week
};

const INITIAL_DATA: FitnessData = {
  calories: 0,
  water: 0,
  waterHistory: [],
  workouts: [],
  sleepHistory: [],
  history: [],
  steps: 0,
  sleep: 0,
  lastUpdated: '',
  protein: 0,
  carbs: 0,
  fat: 0,
  meals: []
};

const STORAGE_KEY = 'fitpulse_fitness_data';

// Utility Functions
const getTodayString = (): string => {
  return new Date().toISOString().split('T')[0];
};

const saveToLocalStorage = (data: FitnessData): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('❌ Error saving to localStorage:', error);
  }
};

const loadFromLocalStorage = (): FitnessData | null => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored) as FitnessData;
    }
  } catch (error) {
    console.error('❌ Error loading from localStorage:', error);
  }
  return null;
};

// API Functions (simulated - replace with actual API calls)
const apiService = {
  async saveData(data: FitnessData): Promise<void> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Simulate API call (replace with actual implementation)
    console.log('🌐 API: Saving data to backend:', data);
  },
  
  async loadData(): Promise<FitnessData | null> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Simulate API call (replace with actual implementation)
    console.log('🌐 API: Loading data from backend');
    
    // For demo purposes, we'll load from localStorage
    return loadFromLocalStorage();
  }
};

// Zustand Store
export const useFitnessStore = create<FitnessState>()(
  subscribeWithSelector((set, get) => ({
    // Initial State
    data: INITIAL_DATA,
    goals: DEFAULT_GOALS,
    isLoading: true,
    isSyncing: false,
    lastSyncError: null,

    // Core Dispatch Function
    dispatch: async (action: FitnessAction) => {
      console.log('🚀 Dispatching action:', action);
      
      const state = get();
      const currentData = state.data;
      let newData: FitnessData;
      
      // Reducer Logic
      switch (action.type) {
        case 'water/add':
          const amountToAdd = action.payload.amount || 250; // default to 250ml
          newData = {
            ...currentData,
            water: currentData.water + amountToAdd,
            waterHistory: [
              ...currentData.waterHistory,
              { time: new Date().toISOString(), amount: amountToAdd }
            ],
            lastUpdated: getTodayString()
          };
          break;
          
        case 'calories/add':
          newData = {
            ...currentData,
            calories: currentData.calories + (action.payload.amount || 0),
            lastUpdated: getTodayString()
          };
          break;
          
        case 'steps/add':
          newData = {
            ...currentData,
            steps: currentData.steps + (action.payload.amount || 0),
            lastUpdated: getTodayString()
          };
          break;
          
        case 'sleep/set':
          newData = {
            ...currentData,
            sleep: Math.max(0, Math.min(24, action.payload.amount || 0)),
            lastUpdated: getTodayString()
          };
          break;

        case 'sleep/add':
          if (!action.payload.sleepEntry) {
             newData = currentData;
             break;
          }
          newData = {
            ...currentData,
            sleepHistory: [action.payload.sleepEntry, ...currentData.sleepHistory],
            // Also update today's sleep total if the entry is for today
            sleep: action.payload.sleepEntry.date === getTodayString() 
              ? action.payload.sleepEntry.duration 
              : currentData.sleep,
            lastUpdated: getTodayString()
          };
          break;
          
        case 'workout/add':
          if (!action.payload.workout) {
             newData = currentData;
             break;
          }
          newData = {
            ...currentData,
            workouts: [action.payload.workout, ...currentData.workouts],
            lastUpdated: getTodayString()
          };
          break;

        case 'data/load':
          newData = action.payload.data || INITIAL_DATA;
          // Ensure structure compatibility if loading old data
          if (!newData.history) newData.history = [];
          if (!newData.meals) newData.meals = [];
          if (!newData.sleepHistory) newData.sleepHistory = [];
          if (!newData.workouts) newData.workouts = [];
          if (!newData.waterHistory) newData.waterHistory = [];
          if (newData.protein === undefined) newData.protein = 0;
          if (newData.carbs === undefined) newData.carbs = 0;
          if (newData.fat === undefined) newData.fat = 0;
          break;
          
        case 'meal/add':
          if (!action.payload.meal) {
             newData = currentData;
             break;
          }
          // Only add if it's for today
          if (action.payload.meal.date !== getTodayString()) {
             newData = {
               ...currentData,
               meals: [action.payload.meal, ...currentData.meals],
               lastUpdated: getTodayString()
             };
          } else {
             newData = {
               ...currentData,
               calories: currentData.calories + action.payload.meal.calories,
               protein: (currentData.protein || 0) + action.payload.meal.protein,
               carbs: (currentData.carbs || 0) + action.payload.meal.carbs,
               fat: (currentData.fat || 0) + action.payload.meal.fat,
               meals: [action.payload.meal, ...currentData.meals],
               lastUpdated: getTodayString()
             };
          }
          break;

        case 'meal/delete':
          if (!action.payload.id) {
            newData = currentData;
            break;
          }
          const mealToDelete = currentData.meals.find(m => m.id === action.payload.id);
          if (!mealToDelete) {
            newData = currentData;
            break;
          }
          // Only subtract if it was logged for today
          if (mealToDelete.date === getTodayString()) {
             newData = {
               ...currentData,
               calories: Math.max(0, currentData.calories - mealToDelete.calories),
               protein: Math.max(0, (currentData.protein || 0) - mealToDelete.protein),
               carbs: Math.max(0, (currentData.carbs || 0) - mealToDelete.carbs),
               fat: Math.max(0, (currentData.fat || 0) - mealToDelete.fat),
               meals: currentData.meals.filter(m => m.id !== action.payload.id),
               lastUpdated: getTodayString()
             };
          } else {
             newData = {
               ...currentData,
               meals: currentData.meals.filter(m => m.id !== action.payload.id),
               lastUpdated: getTodayString()
             };
          }
          break;

        case 'data/reset':
          // Create a summary for the previous day (or whatever day was last tracked)
          const lastDate = currentData.lastUpdated || getTodayString();
          // If the last update was NOT today, we should archive it.
          // But 'data/reset' is called when we detect a new day.
          // So 'currentData' holds yesterday's (or older) data.
          
          const summary: DailySummary = {
            date: lastDate,
            calories: currentData.calories,
            steps: currentData.steps,
            water: currentData.water,
            sleep: currentData.sleep,
            workouts: currentData.workouts.filter(w => w.date.startsWith(lastDate)).length
          };
          
          newData = {
            ...INITIAL_DATA,
            // Preserve history and add new summary
            history: [...currentData.history, summary],
            // Preserve arrays that are historical logs themselves, but we might want to filter?
            // Actually, workouts/sleep/waterHistory are already historical logs.
            // But we need to reset the *daily counters*.
            waterHistory: currentData.waterHistory, // Keep history
            workouts: currentData.workouts, // Keep history
            sleepHistory: currentData.sleepHistory, // Keep history
            meals: currentData.meals, // Keep history
            lastUpdated: getTodayString()
          };
          break;
          
        default:
          console.warn('Unknown action type:', action.type);
          return;
      }
      
      // Optimistic UI Update
      set({ data: newData });
      
      // Save to localStorage immediately
      saveToLocalStorage(newData);
      
      // Background API sync
      if (action.type !== 'data/load') {
        set({ isSyncing: true, lastSyncError: null });
        
        try {
          await apiService.saveData(newData);
          set({ isSyncing: false });
          console.log('✅ Data synced successfully');
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Sync failed';
          set({ isSyncing: false, lastSyncError: errorMessage });
          console.error('❌ Sync failed:', error);
          
          // Show error toast
          toast({
            title: "Sync Error",
            description: "Failed to sync data to server. Changes saved locally.",
            variant: "destructive"
          });
        }
      }
    },

    // Selectors
    getProgress: (metric: keyof Omit<FitnessData, 'lastUpdated' | 'waterHistory' | 'workouts' | 'sleepHistory' | 'history' | 'meals' | 'protein' | 'carbs' | 'fat'>) => {
      const current = get().data[metric];
      const goal = get().goals[metric];
      return Math.min((current / goal) * 100, 100);
    },

    getLastResetTime: () => {
      const lastUpdated = get().data.lastUpdated;
      if (!lastUpdated) return 'Never';
      
      const date = new Date(lastUpdated);
      return `Today at ${date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      })}`;
    },

    // Quick Action Methods
    addWater: async (ml: number = 250) => {
      await get().dispatch({
        type: 'water/add',
        payload: { amount: ml, unit: 'ml' }
      });
      
      const cups = Math.round(ml / 250);
      toast({
        title: "💧 Water Added",
        description: `Added ${ml}ml (${cups} cup${cups !== 1 ? 's' : ''}) of water`
      });
    },

    addCalories: async (calories: number) => {
      await get().dispatch({
        type: 'calories/add',
        payload: { amount: calories, unit: 'kcal' }
      });
      
      toast({
        title: "🍽️ Meal Logged",
        description: `Added ${calories} calories to your daily total`
      });
    },

    addSteps: async (steps: number) => {
      await get().dispatch({
        type: 'steps/add',
        payload: { amount: steps, unit: 'steps' }
      });
      
      toast({
        title: "👟 Steps Added",
        description: `Added ${steps.toLocaleString()} steps`
      });
    },

    setSleep: async (hours: number) => {
      await get().dispatch({
        type: 'sleep/set',
        payload: { amount: hours, unit: 'hours' }
      });
      
      toast({
        title: "😴 Sleep Logged",
        description: `Logged ${hours} hours of sleep`
      });
    },

    addWorkout: async (workout: Omit<WorkoutEntry, 'id' | 'date'>) => {
      const fullWorkout: WorkoutEntry = {
        ...workout,
        id: Date.now().toString(),
        date: new Date().toISOString()
      };

      await get().dispatch({
        type: 'workout/add',
        payload: { workout: fullWorkout }
      });
      
      toast({
        title: "💪 Workout Added",
        description: `Added ${workout.name} (${workout.duration} min)`
      });
    },

    addSleep: async (entry: Omit<SleepEntry, 'id'>) => {
      const fullEntry: SleepEntry = {
        ...entry,
        id: Date.now().toString(),
      };

      await get().dispatch({
        type: 'sleep/add',
        payload: { sleepEntry: fullEntry }
      });

      toast({
        title: "😴 Sleep Logged",
        description: `Logged ${entry.duration} hours of sleep`
      });
    },

    addMeal: async (meal) => {
      const mealEntry: MealEntry = {
        ...meal,
        id: Math.random().toString(36).substring(7),
        date: getTodayString()
      };
      await get().dispatch({
        type: 'meal/add',
        payload: { meal: mealEntry }
      });
    },

    deleteMeal: async (id: string) => {
      await get().dispatch({
        type: 'meal/delete',
        payload: { id }
      });
    },

    // Data Management
    loadData: async () => {
      set({ isLoading: true });
      
      try {
        // Try to load from API first, then fallback to localStorage
        let data = await apiService.loadData();
        
        if (!data) {
          data = loadFromLocalStorage();
        }
        
        if (data) {
          // Check if daily reset is needed
          const today = getTodayString();
          if (data.lastUpdated !== today) {
            // Daily reset needed
            await get().dispatch({
              type: 'data/reset',
              payload: {}
            });
            
            toast({
              title: "📅 Daily Stats Refreshed",
              description: "Your fitness tracking has been reset for today!"
            });
          } else {
            await get().dispatch({
              type: 'data/load',
              payload: { data }
            });
          }
        } else {
          // First time user
          await get().dispatch({
            type: 'data/reset',
            payload: {}
          });
        }
      } catch (error) {
        console.error('❌ Error loading data:', error);
        // Fallback to localStorage
        const localData = loadFromLocalStorage();
        if (localData) {
          await get().dispatch({
            type: 'data/load',
            payload: { data: localData }
          });
        }
      } finally {
        set({ isLoading: false });
      }
    },

    syncWithBackend: async () => {
      const data = get().data;
      set({ isSyncing: true });
      
      try {
        await apiService.saveData(data);
        set({ isSyncing: false, lastSyncError: null });
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Sync failed';
        set({ isSyncing: false, lastSyncError: errorMessage });
        throw error;
      }
    },

    resetDaily: async () => {
      await get().dispatch({
        type: 'data/reset',
        payload: {}
      });
      
      toast({
        title: "🔄 Daily Reset",
        description: "All daily stats have been reset to zero"
      });
    }
  }))
);

// Selectors for specific data pieces
export const selectWaterAmount = (state: FitnessState) => state.data.water;
export const selectCaloriesAmount = (state: FitnessState) => state.data.calories;
export const selectStepsAmount = (state: FitnessState) => state.data.steps;
export const selectSleepAmount = (state: FitnessState) => state.data.sleep;
export const selectIsLoading = (state: FitnessState) => state.isLoading;
export const selectIsSyncing = (state: FitnessState) => state.isSyncing;
export const selectFitnessData = (state: FitnessState) => state.data;
export const selectFitnessGoals = (state: FitnessState) => state.goals;

// Initialize store on app start
export const initializeFitnessStore = async () => {
  const store = useFitnessStore.getState();
  await store.loadData();
};
