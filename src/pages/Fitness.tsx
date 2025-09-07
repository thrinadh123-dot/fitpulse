import { Activity, Plus, Timer, Flame, Target, TrendingUp, Play, Clock, Zap, Heart } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { WorkoutEntryForm } from "@/components/TrackingForms";
import WorkoutPlanner from "@/components/WorkoutPlanner";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

interface WorkoutEntry {
  id: string;
  name: string;
  type: string;
  duration: number;
  calories: number;
  notes: string;
  date: string;
}

const Fitness = () => {
  const [workouts, setWorkouts] = useLocalStorage<WorkoutEntry[]>('workouts', []);
  const [weeklyGoals] = useLocalStorage('weeklyGoals', {
    workouts: { current: 4, target: 5 },
    minutes: { current: 180, target: 250 },
  });
  
  // State for workout modals and animations
  const [selectedWorkout, setSelectedWorkout] = useState<any>(null);
  const [showWorkoutModal, setShowWorkoutModal] = useState(false);
  const [currentStreak, setCurrentStreak] = useState(3);
  const [progressAnimation, setProgressAnimation] = useState(false);
  const { toast } = useToast();
  
  // Weekly activity data
  const [weeklyActivity] = useState({
    calories: [320, 450, 380, 520, 410, 480, 350],
    workouts: [1, 2, 1, 3, 2, 2, 1]
  });

  const today = new Date().toDateString();
  const thisWeek = new Date();
  thisWeek.setDate(thisWeek.getDate() - 7);

  const todayWorkouts = workouts.filter(w => 
    new Date(w.date).toDateString() === today
  );
  const weekWorkouts = workouts.filter(w => 
    new Date(w.date) >= thisWeek
  );

  const todayStats = {
    workouts: todayWorkouts.length,
    duration: todayWorkouts.reduce((sum, w) => sum + w.duration, 0),
    calories: todayWorkouts.reduce((sum, w) => sum + w.calories, 0),
    steps: 8543, // Would come from device integration
  };

  const weeklyStats = {
    workouts: { current: weekWorkouts.length, target: weeklyGoals.workouts.target },
    minutes: { 
      current: weekWorkouts.reduce((sum, w) => sum + w.duration, 0), 
      target: weeklyGoals.minutes.target 
    },
  };

  const addWorkout = (workout: { name: string; type: string; duration: number; calories: number; notes: string }) => {
    const newWorkout: WorkoutEntry = {
      id: Date.now().toString(),
      ...workout,
      date: new Date().toISOString()
    };
    setWorkouts(prev => [newWorkout, ...prev]);
  };

  const recentWorkouts = workouts.slice(0, 5);
  
  const workoutTypeCounts = workouts.reduce((acc, workout) => {
    acc[workout.type] = (acc[workout.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const workoutTypes = [
    { name: "Cardio", icon: "🏃", count: workoutTypeCounts.cardio || 0 },
    { name: "Strength", icon: "💪", count: workoutTypeCounts.strength || 0 },
    { name: "Flexibility", icon: "🧘", count: workoutTypeCounts.flexibility || 0 },
    { name: "HIIT", icon: "⚡", count: workoutTypeCounts.hiit || 0 },
  ];

  const getIntensityColor = (intensity: string) => {
    switch (intensity.toLowerCase()) {
      case "high": return "text-destructive";
      case "moderate": return "text-primary";
      case "low": return "text-secondary";
      default: return "text-muted-foreground";
    }
  };

  const getIntensityBadge = (intensity: string) => {
    switch (intensity.toLowerCase()) {
      case "high": return "destructive";
      case "moderate": return "default";
      case "low": return "secondary";
      default: return "outline";
    }
  };

  // Quick start workout data
  const quickStartWorkouts = [
    {
      id: 'quick-run',
      name: 'Quick Run',
      icon: '🏃',
      duration: '15-30 min',
      focus: 'Cardio & Endurance',
      intensity: 'Moderate',
      calories: 200,
      steps: [
        '5 min warm-up walk',
        '20 min jog/run',
        '5 min cool-down walk'
      ],
      description: 'Perfect for a quick cardio session to boost your energy and burn calories.'
    },
    {
      id: 'strength',
      name: 'Strength Training',
      icon: '💪',
      duration: '30-45 min',
      focus: 'Muscle Building',
      intensity: 'High',
      calories: 300,
      steps: [
        '10 min warm-up',
        '3 sets of push-ups (10-15 reps)',
        '3 sets of squats (15-20 reps)',
        '3 sets of lunges (10 each leg)',
        '3 sets of planks (30-60 sec)',
        '5 min cool-down'
      ],
      description: 'Build strength and muscle with this comprehensive bodyweight workout.'
    },
    {
      id: 'yoga',
      name: 'Yoga Flow',
      icon: '🧘',
      duration: '20-60 min',
      focus: 'Flexibility & Mindfulness',
      intensity: 'Low',
      calories: 150,
      steps: [
        '5 min meditation',
        'Sun Salutation A (3 rounds)',
        'Sun Salutation B (3 rounds)',
        'Standing poses sequence',
        'Seated poses & twists',
        '5 min relaxation'
      ],
      description: 'Improve flexibility, reduce stress, and find your inner peace.'
    },
    {
      id: 'hiit',
      name: 'HIIT Circuit',
      icon: '⚡',
      duration: '15-20 min',
      focus: 'Cardio & Strength',
      intensity: 'High',
      calories: 250,
      steps: [
        '5 min warm-up',
        '30 sec high knees',
        '30 sec rest',
        '30 sec burpees',
        '30 sec rest',
        '30 sec mountain climbers',
        '30 sec rest',
        'Repeat 4-5 times',
        '5 min cool-down'
      ],
      description: 'High-intensity interval training for maximum calorie burn and fitness gains.'
    }
  ];

  // Handle workout selection
  const handleWorkoutSelect = (workout: any) => {
    setSelectedWorkout(workout);
    setShowWorkoutModal(true);
  };

  // Start workout function
  const startWorkout = (workout: any) => {
    // Add workout to today's workouts
    const newWorkout: WorkoutEntry = {
      id: Date.now().toString(),
      name: workout.name,
      type: workout.focus.split(' ')[0].toLowerCase(),
      duration: parseInt(workout.duration.split('-')[0]),
      calories: workout.calories,
      notes: `Quick start: ${workout.description}`,
      date: new Date().toISOString()
    };
    setWorkouts(prev => [newWorkout, ...prev]);
    setShowWorkoutModal(false);
    setSelectedWorkout(null);
    
    // Show success feedback
    toast({
      title: "Workout Started!",
      description: `${workout.name} has been added to your fitness log.`,
    });
  };

  // Quick start workout function
  const startQuickWorkout = (workout: any) => {
    const newWorkout: WorkoutEntry = {
      id: Date.now().toString(),
      name: workout.name,
      type: workout.focus.split(' ')[0].toLowerCase(),
      duration: parseInt(workout.duration.split('-')[0]),
      calories: workout.calories,
      notes: `Quick start: ${workout.description}`,
      date: new Date().toISOString()
    };
    setWorkouts(prev => [newWorkout, ...prev]);
    
    // Show success feedback
    toast({
      title: "Quick Workout Started!",
      description: `${workout.name} has been logged. Keep up the great work!`,
    });
  };

  // Trigger progress animation on mount
  useEffect(() => {
    setProgressAnimation(true);
  }, []);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Fitness Tracker</h1>
          <p className="text-muted-foreground">Track your workouts and stay active</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-gradient-primary hover:shadow-glow transition-all duration-300">
              <Plus className="h-4 w-4 mr-2" />
              Log Workout
            </Button>
          </DialogTrigger>
          <DialogContent>
            <WorkoutEntryForm onAdd={addWorkout} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Today's Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="shadow-card hover:shadow-glow transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Workouts</CardTitle>
            <Activity className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {todayStats.workouts}
            </div>
            <p className="text-xs text-muted-foreground">completed today</p>
          </CardContent>
        </Card>

        <Card className="shadow-card hover:shadow-glow transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Duration</CardTitle>
            <Timer className="h-4 w-4 text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {todayStats.duration}m
            </div>
            <p className="text-xs text-muted-foreground">total active time</p>
          </CardContent>
        </Card>

        <Card className="shadow-card hover:shadow-glow transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Calories</CardTitle>
            <Flame className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {todayStats.calories}
            </div>
            <p className="text-xs text-muted-foreground">burned today</p>
          </CardContent>
        </Card>

        <Card className="shadow-card hover:shadow-glow transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Steps</CardTitle>
            <Activity className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {todayStats.steps.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">steps taken</p>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Goals & Streak */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target className="h-5 w-5 text-primary" />
              <span>Weekly Workout Goal</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Workouts completed</span>
                  <span>{weeklyStats.workouts.current} / {weeklyStats.workouts.target}</span>
                </div>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: progressAnimation ? `${(weeklyStats.workouts.current / weeklyStats.workouts.target) * 100}%` : 0 }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className="h-2 bg-primary rounded-full"
                />
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Active minutes</span>
                  <span>{weeklyStats.minutes.current} / {weeklyStats.minutes.target}</span>
                </div>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: progressAnimation ? `${(weeklyStats.minutes.current / weeklyStats.minutes.target) * 100}%` : 0 }}
                  transition={{ duration: 1.5, delay: 0.3, ease: "easeOut" }}
                  className="h-2 bg-secondary rounded-full"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Zap className="h-5 w-5 text-secondary" />
              <span>Workout Streak</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center space-y-4">
              <motion.div
                animate={{ 
                  scale: [1, 1.1, 1],
                  filter: ["brightness(1)", "brightness(1.2)", "brightness(1)"]
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity, 
                  ease: "easeInOut" 
                }}
                className="text-4xl"
              >
                🔥
              </motion.div>
              <div>
                <div className="text-3xl font-bold text-foreground">
                  {currentStreak}
                </div>
                <div className="text-sm text-muted-foreground">
                  Day Streak
                </div>
              </div>
              <div className="text-xs text-muted-foreground">
                Keep it up! Consistency is key to fitness success.
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-secondary" />
              <span>Workout Types</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {workoutTypes.map((type, index) => (
                <div key={index} className="text-center p-3 bg-gradient-card rounded-lg">
                  <div className="text-2xl mb-2">{type.icon}</div>
                  <div className="font-medium text-sm">{type.name}</div>
                  <div className="text-xs text-muted-foreground">{type.count} logged</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Workouts */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Activity className="h-5 w-5 text-primary" />
            <span>Recent Workouts</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentWorkouts.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No workouts logged yet. Start your fitness journey!
              </p>
            ) : (
              recentWorkouts.map((workout) => (
                <div
                  key={workout.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center">
                      <Activity className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-medium">{workout.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {new Date(workout.date).toLocaleDateString()}
                      </p>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {workout.type}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{workout.duration} min</div>
                    <div className="text-sm text-muted-foreground">{workout.calories} cal</div>
                  </div>
                </div>
              ))
            )}
            
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Add New Workout
                </Button>
              </DialogTrigger>
              <DialogContent>
                <WorkoutEntryForm onAdd={addWorkout} />
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>

      {/* Workout Planner */}
      <WorkoutPlanner />

      {/* Quick Start Workouts */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Quick Start Workouts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickStartWorkouts.map((workout, index) => (
              <motion.div
                key={workout.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Button 
                  variant="outline" 
                  className="h-20 w-full flex-col space-y-2 hover:bg-accent transition-colors hover:shadow-lg"
                  onClick={() => startQuickWorkout(workout)}
                >
                  <div className="text-2xl">{workout.icon}</div>
                  <span className="text-sm">{workout.name}</span>
                  <span className="text-xs text-muted-foreground">{workout.duration}</span>
                </Button>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Workout Detail Modal */}
      <Dialog open={showWorkoutModal} onOpenChange={setShowWorkoutModal}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-3">
              <span className="text-3xl">{selectedWorkout?.icon}</span>
              <div>
                <div className="text-xl font-bold">{selectedWorkout?.name}</div>
                <div className="text-sm text-muted-foreground">{selectedWorkout?.focus}</div>
              </div>
            </DialogTitle>
          </DialogHeader>
          
          {selectedWorkout && (
            <div className="space-y-6">
              {/* Workout Info */}
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <Clock className="h-6 w-6 text-primary mx-auto mb-2" />
                  <div className="font-semibold">{selectedWorkout.duration}</div>
                  <div className="text-sm text-muted-foreground">Duration</div>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <Flame className="h-6 w-6 text-destructive mx-auto mb-2" />
                  <div className="font-semibold">{selectedWorkout.calories} cal</div>
                  <div className="text-sm text-muted-foreground">Calories</div>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <Zap className="h-6 w-6 text-secondary mx-auto mb-2" />
                  <div className="font-semibold">{selectedWorkout.intensity}</div>
                  <div className="text-sm text-muted-foreground">Intensity</div>
                </div>
              </div>

              {/* Description */}
              <div>
                <h4 className="font-semibold mb-2">Description</h4>
                <p className="text-muted-foreground">{selectedWorkout.description}</p>
              </div>

              {/* Workout Steps */}
              <div>
                <h4 className="font-semibold mb-3">Workout Steps</h4>
                <div className="space-y-2">
                  {selectedWorkout.steps.map((step: string, index: number) => (
                    <div key={index} className="flex items-start space-x-3 p-3 bg-muted/30 rounded-lg">
                      <div className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-xs font-bold">
                        {index + 1}
                      </div>
                      <span className="text-sm">{step}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3">
                <Button 
                  onClick={() => startWorkout(selectedWorkout)}
                  className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:shadow-lg"
                >
                  <Play className="h-4 w-4 mr-2" />
                  Start Now
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowWorkoutModal(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Fitness;