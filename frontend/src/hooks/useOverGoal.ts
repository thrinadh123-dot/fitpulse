// hooks/useOverGoal.ts
export const useOverGoal = (currentMl: number, goalMl: number) => {
  if (currentMl <= goalMl) return null;

  return {
    extraMl: currentMl - goalMl,
    message: "🎉 Goal achieved! Extra hydration counts."
  };
};