// utils/waterStats.ts
import { WaterEntry } from "@/hooks/useDailyWater";

export const calculateWeeklyAverage = (): number => {
  // In a real app, you'd calculate from actual data
  // For now, return mock data
  return 7.2;
};

export const getWeeklyData = (entries: WaterEntry[]) => {
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    return date.toDateString();
  });

  return last7Days.map(day => {
    const dayEntries = entries.filter(
      e => new Date(e.time).toDateString() === day
    );
    return {
      date: day,
      totalMl: dayEntries.reduce((s, e) => s + e.amount, 0)
    };
  });
};