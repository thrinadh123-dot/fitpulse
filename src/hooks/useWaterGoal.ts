// hooks/useWaterGoal.ts
import { useLocalStorage } from "@/hooks/useLocalStorage";

export const useWaterGoal = () => {
  const [goalMl, setGoalMl] = useLocalStorage<number>("waterGoalMl", 3000);

  return {
    goalMl,
    setGoalMl
  };
};