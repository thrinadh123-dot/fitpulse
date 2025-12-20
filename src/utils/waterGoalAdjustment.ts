// utils/waterGoalAdjustment.ts
export const adjustWaterGoal = (
  baseGoalMl: number,
  workoutDone: boolean,
  workoutIntensity?: 'low' | 'medium' | 'high'
) => {
  let adjustment = 0;
  
  if (workoutDone) {
    switch (workoutIntensity) {
      case 'low': adjustment = 250; break;
      case 'medium': adjustment = 500; break;
      case 'high': adjustment = 750; break;
      default: adjustment = 500; break;
    }
  }
  
  return baseGoalMl + adjustment;
};