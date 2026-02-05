// utils/waterLogic.ts - NEW FILE
export const calculateWaterLogic = (currentMl: number, goalMl: number) => {
  // Visual fill caps at 100%
  const visualFillPercentage = Math.min((currentMl / goalMl) * 100, 100);
  
  // Progress for bars also caps at 100%
  const progressPercentage = Math.min((currentMl / goalMl) * 100, 100);
  
  const remainingMl = Math.max(0, goalMl - currentMl);
  const extraMl = Math.max(0, currentMl - goalMl);
  
  return {
    visualFillPercentage, // For the bowl (0-100)
    progressPercentage,   // For progress bars (0-100)
    remainingMl,
    extraMl,
    isOverGoal: currentMl > goalMl,
  };
};