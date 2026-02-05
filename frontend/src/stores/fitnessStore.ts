import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { toast } from '@/hooks/use-toast';

// Types and Interfaces
export interface FitnessData {
  calories: number;
  water: number;
  steps: number;
  sleep: number;
  lastUpdated: string;
}

export interface FitnessGoals {
  calories: number;
  water: number;
  steps: number;
  sleep: number;
}

export interface FitnessAction {
  type: 'water/add' | 'calories/add' | 'steps/add' | 'sleep/set' | 'data/reset' | 'data/load';
  payload: {
    amount?: number;
    unit?: string;
    data?: FitnessData;
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
  getProgress: (metric: keyof Omit<FitnessData, 'lastUpdated'>) => number;
  getLastResetTime: () => string;
  
  // Quick Actions
  addWater: (cups: number) => Promise<void>;
  addCalories: (calories: number) => Promise<void>;
  addSteps: (steps: number) => Promise<void>;
  setSleep: (hours: number) => Promise<void>;
  
  // Data Management
  loadData: () => Promise<void>;
  syncWithBackend: () => Promise<void>;
  resetDaily: () => Promise<void>;
}

// Default values
const DEFAULT_GOALS: FitnessGoals = {
  calories: 2200,
  water: 8, // cups
  steps: 10000,
  sleep: 8 // hours
};

const INITIAL_DATA: FitnessData = {
  calories: 0,
  water: 0,
  steps: 0,
  sleep: 0,
  lastUpdated: ''
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
    
    // For demo purposes, we'll just save to localStorage
    // In real implementation, this would be:
    // const response = await fetch('/api/fitness/daily/USER_ID', {
    //   method: 'PUT',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(data)
    // });
    // if (!response.ok) throw new Error('Failed to save data');
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
          newData = {
            ...currentData,
            water: currentData.water + (action.payload.amount || 1),
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
          
        case 'data/load':
          newData = action.payload.data || INITIAL_DATA;
          break;
          
        case 'data/reset':
          newData = {
            ...INITIAL_DATA,
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
    getProgress: (metric: keyof Omit<FitnessData, 'lastUpdated'>) => {
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
    addWater: async (cups: number = 1) => {
      await get().dispatch({
        type: 'water/add',
        payload: { amount: cups, unit: 'cups' }
      });
      
      toast({
        title: "💧 Water Added",
        description: `Added ${cups} cup${cups > 1 ? 's' : ''} of water`
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