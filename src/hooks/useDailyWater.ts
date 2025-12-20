// hooks/useDailyWater.ts
import { useEffect } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";

export interface WaterEntry {
  time: string;
  amount: number; // ml
}

export const useDailyWater = () => {
  const [entries, setEntries] = useLocalStorage<WaterEntry[]>("waterEntries", []);
  const today = new Date().toDateString();

  // Auto reset at day change
  useEffect(() => {
    const lastEntryDate = entries[0]?.time
      ? new Date(entries[0].time).toDateString()
      : today;

    if (lastEntryDate !== today) {
      setEntries([]);
    }
  }, [today]);

  const todayEntries = entries.filter(
    e => new Date(e.time).toDateString() === today
  );

  const totalMl = todayEntries.reduce((s, e) => s + e.amount, 0);

  const addEntry = (entry: WaterEntry) => {
    setEntries(prev => [entry, ...prev]);
  };

  const getLastDrinkTime = () => {
    return todayEntries.length > 0 ? todayEntries[0].time : null;
  };

  return { 
    entries, 
    todayEntries, 
    totalMl, 
    setEntries, 
    addEntry, 
    getLastDrinkTime 
  };
};