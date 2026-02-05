export interface Exercise {
  name: string;
  sets: string;
  muscleGroup: string;
  difficulty: string;
  equipment: string;
  instructions: string;
}

export interface WorkoutVideo {
  title: string;
  info: string;
  video: string;
  muscleGroups: string[];
  exercises: number;
}

export interface WorkoutVideos {
  [key: string]: WorkoutVideo;
}

export interface WorkoutPlan {
  userGoal: string;
  weeklySplit: {
    [key: string]: {
      focus: string;
      muscleGroups: string[];
      intensity: 'high' | 'moderate' | 'low' | 'rest';
    };
  };
  exercises: {
    [key: string]: Exercise[];
  };
  streak: number;
  xp: number;
  completedWorkouts: Record<string, boolean>;
  completedExercises: Record<string, boolean[]>;
  notes: Record<string, string>;
  intensity: Record<string, number>;
}

export interface WorkoutSectionProps {
  currentDay: string;
  currentExercises: Exercise[];
  workoutPlan: WorkoutPlan;
}
