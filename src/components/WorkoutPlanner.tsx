import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Calendar, Target, CheckCircle, Play, Timer, 
  ChevronDown, ChevronUp, Trophy, Flame, Zap,
  Clock, Star, TrendingUp, Award, Lightbulb, Video
} from "lucide-react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useToast } from "@/hooks/use-toast";
import workoutsData from "@/data/workouts.json";
import { WorkoutVideos, WorkoutPlan, Exercise } from "@/types/workout";

// Define our workout videos with specific exercises and videos for each day
const workoutVideos: WorkoutVideos = {
  "Monday": { 
    title: "Chest + Triceps", 
    info: "3 exercises • Chest, Triceps",
    video: "hkaHHE0AbXo?si=BZt4OgCdewiVtzg8",
    muscleGroups: ["Chest", "Triceps"],
    exercises: 3 
  },
  "Tuesday": { 
    title: "Back + Biceps", 
    info: "4 exercises • Back, Biceps",
    video: "N3Z1nvNduos?si=K1rh2DAx09ZhSdrZ",
    muscleGroups: ["Back", "Biceps"],
    exercises: 4 
  },
  "Wednesday": { 
    title: "Legs", 
    info: "5 exercises • Quads, Hamstrings",
    video: "H6mRkx1x77k?si=fwApOJ__KpPNtiID",
    muscleGroups: ["Quads", "Hamstrings", "Calves"],
    exercises: 5 
  },
  "Thursday": { 
    title: "Shoulders + Abs", 
    info: "4 exercises • Shoulders, Core",
    video: "MTcY_9ekCJk?si=gxr-KdPlCjsImTXJ",
    muscleGroups: ["Shoulders", "Core"],
    exercises: 4 
  },
  "Friday": { 
    title: "Full Body + Cardio", 
    info: "6 exercises • Full Body",
    video: "dHx7xO4Nlms?si=DvY1O9StL38pSp2e",
    muscleGroups: ["Full Body", "Cardio"],
    exercises: 6 
  },
  "Saturday": { 
    title: "Yoga / Optional", 
    info: "Flexibility & Relaxation",
    video: "dAqQqmaI9vY?si=E0Q9aGbkBydZIGEb",
    muscleGroups: ["Flexibility"],
    exercises: 0 
  },
  "Sunday": { 
    title: "Rest Day", 
    info: "No exercises today",
    video: "",
    muscleGroups: [],
    exercises: 0 
  }
};

const WorkoutPlanner = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<string>("");
  const [selectedDay, setSelectedDay] = useState<string>("");
  const [showExerciseDialog, setShowExerciseDialog] = useState(false);
  const [currentExercises, setCurrentExercises] = useState<Exercise[]>([]);
  const [currentDay, setCurrentDay] = useState<string>("");
  const [playingVideo, setPlayingVideo] = useState<string | null>(null);
  const [showVideo, setShowVideo] = useState(false);
  
  const { toast } = useToast();
  
  const [workoutPlan, setWorkoutPlan] = useLocalStorage<WorkoutPlan>('workoutPlan', {
    userGoal: "",
    weeklySplit: {},
    exercises: {},
    streak: 0,
    xp: 0,
    completedWorkouts: {},
    completedExercises: {},
    notes: {},
    intensity: {}
  });

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
  const goals = workoutsData.goals;

  // Initialize workout plan when goal is selected
  const selectGoal = (goalKey: string) => {
    const goal = goals[goalKey as keyof typeof goals];
    if (!goal) return;

    // Create a properly typed version of the weekly split data
    const typedWeeklySplit: WorkoutPlan['weeklySplit'] = {};
    
    Object.entries(goal.weeklySplit).forEach(([day, data]) => {
      typedWeeklySplit[day] = {
        focus: data.focus,
        muscleGroups: data.muscleGroups,
        intensity: (data.intensity === 'high' || 
                   data.intensity === 'moderate' || 
                   data.intensity === 'low' || 
                   data.intensity === 'rest') ? data.intensity : 'moderate'
      };
    });

    setSelectedGoal(goalKey);
    setWorkoutPlan(prev => ({
      ...prev,
      userGoal: goalKey,
      weeklySplit: typedWeeklySplit,
      exercises: workoutsData.exercises as WorkoutPlan['exercises']
    }));
  };

  // Get exercises for a specific day
  const getDayExercises = (day: string) => {
    if (!workoutPlan.weeklySplit[day]) return [];
    
    const muscleGroups = workoutPlan.weeklySplit[day].muscleGroups;
    const exercises: Exercise[] = [];
    
    muscleGroups.forEach((group: string) => {
      if (workoutPlan.exercises[group]) {
        exercises.push(...workoutPlan.exercises[group]);
      }
    });
    
    return exercises;
  };

  // We now use workoutVideos from the top of the file

  // Handle play button click for workout videos
  const handlePlayWorkout = (day: string) => {
    const workout = workoutVideos[day];
    if (workout && workout.video) {
      setPlayingVideo(day);
      setShowVideo(true);
      toast({
        title: "Workout Started",
        description: `Starting ${workout.title} workout video.`,
      });
    } else {
      toast({
        title: "Rest Day",
        description: "No workout video for today!",
        variant: "destructive"
      });
    }
  };

  // Mark exercise as completed
  const toggleExercise = (day: string, exerciseIndex: number) => {
    setWorkoutPlan(prev => {
      const dayKey = `${day}_${new Date().toDateString()}`;
      const completedExercises = { ...prev.completedExercises };
      
      if (!completedExercises[dayKey]) {
        completedExercises[dayKey] = [];
      }
      
      completedExercises[dayKey][exerciseIndex] = !completedExercises[dayKey][exerciseIndex];
      
      // Check if all exercises for the day are completed
      const dayExercises = getDayExercises(day);
      const allCompleted = dayExercises.every((_, index) => completedExercises[dayKey][index]);
      
      const completedWorkouts = { ...prev.completedWorkouts };
      if (allCompleted) {
        completedWorkouts[dayKey] = true;
        // Award XP for completing workout
        const xpGained = workoutPlan.weeklySplit[day].intensity === 'high' ? 50 : 
                        workoutPlan.weeklySplit[day].intensity === 'moderate' ? 30 : 20;
        
        return {
          ...prev,
          completedExercises,
          completedWorkouts,
          xp: prev.xp + xpGained,
          streak: prev.streak + 1
        };
      }
      
      return {
        ...prev,
        completedExercises,
        completedWorkouts
      };
    });
  };

  // Add note to workout
  const addNote = (day: string, note: string) => {
    const dayKey = `${day}_${new Date().toDateString()}`;
    setWorkoutPlan(prev => ({
      ...prev,
      notes: { ...prev.notes, [dayKey]: note }
    }));
  };

  // Rate workout intensity
  const rateIntensity = (day: string, rating: number) => {
    const dayKey = `${day}_${new Date().toDateString()}`;
    setWorkoutPlan(prev => ({
      ...prev,
      intensity: { ...prev.intensity, [dayKey]: rating }
    }));
  };

  // Open exercise dialog
  const openExerciseDialog = (day: string) => {
    setCurrentDay(day);
    setCurrentExercises(getDayExercises(day));
    setShowExerciseDialog(true);
  };

  // Get completion status for a day
  const getDayCompletionStatus = (day: string) => {
    const dayKey = `${day}_${new Date().toDateString()}`;
    const completedExercises = workoutPlan.completedExercises[dayKey] || [];
    const dayExercises = getDayExercises(day);
    
    if (dayExercises.length === 0) return 0;
    return (completedExercises.filter(Boolean).length / dayExercises.length) * 100;
  };

  // Get intensity color
  const getIntensityColor = (intensity: string) => {
    switch (intensity) {
      case 'high': return 'text-red-500 bg-red-50 border-red-200';
      case 'moderate': return 'text-orange-500 bg-orange-50 border-orange-200';
      case 'low': return 'text-green-500 bg-green-50 border-green-200';
      case 'rest': return 'text-gray-500 bg-gray-50 border-gray-200';
      default: return 'text-gray-500 bg-gray-50 border-gray-200';
    }
  };

  // Get intensity icon
  const getIntensityIcon = (intensity: string) => {
    switch (intensity) {
      case 'high': return <Flame className="h-4 w-4" />;
      case 'moderate': return <Zap className="h-4 w-4" />;
      case 'low': return <Star className="h-4 w-4" />;
      case 'rest': return <Clock className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <Card className="shadow-lg border-0 bg-gradient-to-br from-card to-card/80">
      <CardHeader>
        <motion.div
          className="flex items-center justify-between cursor-pointer"
          onClick={() => setIsExpanded(!isExpanded)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <CardTitle className="text-xl flex items-center space-x-2">
            <Calendar className="h-6 w-6 text-primary" />
            <span>📅 Workout Planner</span>
          </CardTitle>
          {isExpanded ? (
            <ChevronUp className="h-5 w-5 text-muted-foreground" />
          ) : (
            <ChevronDown className="h-5 w-5 text-muted-foreground" />
          )}
        </motion.div>
        {!isExpanded && (
          <p className="text-sm text-muted-foreground">
            Plan your weekly workouts and track your progress
          </p>
        )}
      </CardHeader>
      
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <CardContent className="space-y-6">
              {/* Goal Selection */}
              {!selectedGoal ? (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center space-x-2">
                    <Target className="h-5 w-5 text-primary" />
                    <span>Select Your Fitness Goal</span>
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(goals).map(([key, goal]) => (
                      <motion.div
                        key={key}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button
                          variant="outline"
                          className="w-full h-auto p-4 flex flex-col items-start space-y-2 hover:bg-accent/50"
                          onClick={() => selectGoal(key)}
                        >
                          <div className="text-2xl">{goal.name.split(' ')[0]}</div>
                          <div className="text-left">
                            <div className="font-medium">{goal.name}</div>
                            <div className="text-sm text-muted-foreground">{goal.description}</div>
                          </div>
                        </Button>
                      </motion.div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Current Goal & Stats */}
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">{goals[selectedGoal as keyof typeof goals].name}</h3>
                      <p className="text-sm text-muted-foreground">{goals[selectedGoal as keyof typeof goals].description}</p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary">{workoutPlan.streak}</div>
                        <div className="text-xs text-muted-foreground">Day Streak</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-500">{workoutPlan.xp}</div>
                        <div className="text-xs text-muted-foreground">XP Earned</div>
                      </div>
                    </div>
                  </div>

                  {/* Weekly Schedule */}
                  <div className="space-y-4">
                    <h4 className="font-semibold flex items-center space-x-2">
                      <Calendar className="h-4 w-4" />
                      <span>Weekly Schedule</span>
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
                      {Object.entries(workoutPlan.weeklySplit).map(([day, workout]) => {
                        const isToday = day === today;
                        const completionStatus = getDayCompletionStatus(day);
                        const dayKey = `${day}_${new Date().toDateString()}`;
                        const isCompleted = workoutPlan.completedWorkouts[dayKey];
                        
                        return (
                          <motion.div
                            key={day}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <Button
                              variant={isToday ? "default" : "outline"}
                              className={`w-full h-auto p-3 flex flex-col items-center space-y-2 ${
                                isToday ? "bg-primary text-primary-foreground" : ""
                              } ${isCompleted ? "border-green-500 bg-green-50" : ""}`}
                              onClick={() => openExerciseDialog(day)}
                            >
                              <div className="text-sm font-medium">{day.slice(0, 3)}</div>
                              <div className="text-xs text-center">{workout.focus}</div>
                              <div className={`text-xs px-2 py-1 rounded-full border ${getIntensityColor(workout.intensity)}`}>
                                {getIntensityIcon(workout.intensity)}
                              </div>
                              {completionStatus > 0 && (
                                <div className="w-full bg-gray-200 rounded-full h-1">
                                  <div 
                                    className="bg-green-500 h-1 rounded-full transition-all duration-300"
                                    style={{ width: `${completionStatus}%` }}
                                  />
                                </div>
                              )}
                              {isCompleted && (
                                <CheckCircle className="h-4 w-4 text-green-500" />
                              )}
                            </Button>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Today's Workout Highlight */}
                  {workoutPlan.weeklySplit[today] && (
                    <div className="p-4 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg border">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold flex items-center space-x-2">
                          <Play className="h-4 w-4 text-primary" />
                          <span>Today's Workout: {workoutPlan.weeklySplit[today].focus}</span>
                        </h4>
                        <div className="flex items-center space-x-2">
                          <Badge className={getIntensityColor(workoutPlan.weeklySplit[today].intensity)}>
                            {getIntensityIcon(workoutPlan.weeklySplit[today].intensity)}
                            {workoutPlan.weeklySplit[today].intensity}
                          </Badge>
                          <Button
                            size="sm"
                            onClick={() => handlePlayWorkout(today)}
                            className="bg-green-500 hover:bg-green-600"
                          >
                            <Play className="h-4 w-4 mr-1" />
                            Play
                          </Button>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        {getDayExercises(today).length} exercises • {workoutPlan.weeklySplit[today].muscleGroups.join(', ')}
                      </p>
                      <div className="flex space-x-2">
                        <Button 
                          onClick={() => openExerciseDialog(today)}
                          className="flex-1"
                        >
                          <Play className="h-4 w-4 mr-2" />
                          Start Today's Workout
                        </Button>
                        <Button 
                          variant="outline"
                          onClick={() => handlePlayWorkout(today)}
                        >
                          <Video className="h-4 w-4 mr-2" />
                          Watch Video
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Progress Insights */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-3 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-lg border">
                      <Trophy className="h-6 w-6 text-blue-500 mx-auto mb-2" />
                      <div className="text-lg font-bold">{workoutPlan.streak}</div>
                      <div className="text-xs text-muted-foreground">Day Streak</div>
                    </div>
                    <div className="text-center p-3 bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-lg border">
                      <TrendingUp className="h-6 w-6 text-green-500 mx-auto mb-2" />
                      <div className="text-lg font-bold">{workoutPlan.xp}</div>
                      <div className="text-xs text-muted-foreground">Total XP</div>
                    </div>
                    <div className="text-center p-3 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-lg border">
                      <Award className="h-6 w-6 text-purple-500 mx-auto mb-2" />
                      <div className="text-lg font-bold">
                        {Object.values(workoutPlan.completedWorkouts).filter(Boolean).length}
                      </div>
                      <div className="text-xs text-muted-foreground">Workouts Done</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Exercise Dialog */}
              <Dialog open={showExerciseDialog} onOpenChange={setShowExerciseDialog}>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="flex items-center space-x-2">
                      <Play className="h-5 w-5 text-primary" />
                      <span>{currentDay} Workout</span>
                    </DialogTitle>
                  </DialogHeader>
                  
                  {currentExercises.length > 0 ? (
                    <div className="space-y-4">
                      {/* Play Button for Workout Video */}
                      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg border">
                        <div>
                          <h4 className="font-semibold">{workoutVideos[currentDay]?.title || workoutPlan.weeklySplit[currentDay]?.focus}</h4>
                          <p className="text-sm text-muted-foreground">
                            {workoutVideos[currentDay]?.info || `${currentExercises.length} exercises • ${workoutPlan.weeklySplit[currentDay]?.muscleGroups?.join(', ')}`}
                          </p>
                        </div>
                        <Button
                          onClick={() => handlePlayWorkout(currentDay)}
                          className="bg-green-500 hover:bg-green-600"
                        >
                          <Play className="h-4 w-4 mr-2" />
                          Play Workout Video
                        </Button>
                      </div>
      
                      {/* Video Player (if playing) */}
                      <AnimatePresence>
                        {showVideo && playingVideo === currentDay && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="overflow-hidden rounded-lg border"
                          >
                            
                            <iframe
                              id="workout-video"
                              width="100%"
                              height="315"
                              src={showVideo && playingVideo === currentDay ? `https://www.youtube.com/embed/${workoutVideos[currentDay]?.video}?autoplay=1` : ""}
                              title="Workout Video"
                              frameBorder="0"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                            ></iframe>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {currentExercises.map((exercise, index) => {
                        const dayKey = `${currentDay}_${new Date().toDateString()}`;
                        const isCompleted = workoutPlan.completedExercises[dayKey]?.[index] || false;
                        
                        return (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className={`p-4 border rounded-lg transition-all duration-200 ${
                              isCompleted ? 'bg-green-50 border-green-200' : 'bg-card hover:bg-accent/50'
                            }`}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-2">
                                  <h4 className="font-medium">{exercise.name}</h4>
                                  <Badge variant="outline" className="text-xs">{exercise.difficulty}</Badge>
                                  <Badge variant="outline" className="text-xs">{exercise.equipment}</Badge>
                                </div>
                                <p className="text-sm text-muted-foreground mb-2">
                                  <strong>Sets:</strong> {exercise.sets} • <strong>Muscle Group:</strong> {exercise.muscleGroup}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  {exercise.instructions}
                                </p>
                              </div>
                              <Button
                                variant={isCompleted ? "default" : "outline"}
                                size="sm"
                                onClick={() => toggleExercise(currentDay, index)}
                                className={`ml-4 ${isCompleted ? 'bg-green-500 hover:bg-green-600' : ''}`}
                              >
                                {isCompleted ? (
                                  <CheckCircle className="h-4 w-4" />
                                ) : (
                                  <Play className="h-4 w-4" />
                                )}
                              </Button>
                            </div>
                          </motion.div>
                        );
                      })}
                      
                      {/* Workout Notes & Rating */}
                      <div className="space-y-3 pt-4 border-t">
                        <h4 className="font-medium flex items-center space-x-2">
                          <Lightbulb className="h-4 w-4" />
                          <span>Workout Notes</span>
                        </h4>
                        <textarea
                          placeholder="Add notes about your workout..."
                          className="w-full p-3 border rounded-lg resize-none"
                          rows={3}
                          defaultValue={workoutPlan.notes[`${currentDay}_${new Date().toDateString()}`] || ''}
                          onChange={(e) => addNote(currentDay, e.target.value)}
                        />
                        
                        <div className="flex items-center space-x-2">
                          <span className="text-sm">Rate intensity:</span>
                          {[1, 2, 3, 4, 5].map((rating) => (
                            <Button
                              key={rating}
                              variant="outline"
                              size="sm"
                              onClick={() => rateIntensity(currentDay, rating)}
                              className={`w-8 h-8 p-0 ${
                                workoutPlan.intensity[`${currentDay}_${new Date().toDateString()}`] === rating
                                  ? 'bg-primary text-primary-foreground'
                                  : ''
                              }`}
                            >
                              {rating}
                            </Button>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">No exercises planned for this day</p>
                    </div>
                  )}
                </DialogContent>
              </Dialog>
            </CardContent>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
};

export default WorkoutPlanner; 

