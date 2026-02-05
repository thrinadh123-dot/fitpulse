import { Activity, Plus, Timer, Flame, Target, TrendingUp, Play, Clock, Zap, Heart } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { WorkoutEntryForm } from "@/components/features/TrackingForms";
import WorkoutPlanner from "@/components/features/WorkoutPlanner";
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
      {/* Header - Improved Typography */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground tracking-[0.06em] uppercase font-['Bebas_Neue']">
            FITNESS TRACKER
          </h1>
          <p className="text-muted-foreground tracking-[0.02em] font-['Inter'] leading-relaxed">
            Track your workouts and stay active
          </p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-gradient-primary hover:shadow-glow transition-all duration-300 tracking-[0.03em] font-['Inter']">
              <Plus className="h-4 w-4 mr-2" />
              Log Workout
            </Button>
          </DialogTrigger>
          <DialogContent>
            <WorkoutEntryForm onAdd={addWorkout} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Today's Stats - Improved Alignment */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="shadow-card hover:shadow-glow transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-sm font-medium tracking-[0.04em] uppercase text-muted-foreground font-['Inter']">
              Workouts
            </CardTitle>
            <Activity className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-3xl font-bold text-foreground font-mono tracking-tight">
              {todayStats.workouts}
            </div>
            <p className="text-xs text-muted-foreground tracking-[0.01em] font-['Inter']">
              completed today
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-card hover:shadow-glow transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-sm font-medium tracking-[0.04em] uppercase text-muted-foreground font-['Inter']">
              Duration
            </CardTitle>
            <Timer className="h-4 w-4 text-secondary" />
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-3xl font-bold text-foreground font-mono tracking-tight">
              {todayStats.duration}m
            </div>
            <p className="text-xs text-muted-foreground tracking-[0.01em] font-['Inter']">
              total active time
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-card hover:shadow-glow transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-sm font-medium tracking-[0.04em] uppercase text-muted-foreground font-['Inter']">
              Calories
            </CardTitle>
            <Flame className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-3xl font-bold text-foreground font-mono tracking-tight">
              {todayStats.calories}
            </div>
            <p className="text-xs text-muted-foreground tracking-[0.01em] font-['Inter']">
              burned today
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-card hover:shadow-glow transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-sm font-medium tracking-[0.04em] uppercase text-muted-foreground font-['Inter']">
              Steps
            </CardTitle>
            <Activity className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-3xl font-bold text-foreground font-mono tracking-tight">
              {todayStats.steps.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground tracking-[0.01em] font-['Inter']">
              steps taken
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Goals & Streak - Improved Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Workout Goal */}
        <Card className="shadow-card lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center space-x-3 tracking-[0.06em] uppercase font-['Bebas_Neue']">
              <Target className="h-5 w-5 text-primary" />
              <span>WEEKLY WORKOUT GOAL</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="flex justify-between text-sm mb-3 items-center">
                <span className="tracking-[0.02em] font-['Inter']">Workouts completed</span>
                <span className="font-mono tracking-tight">
                  {weeklyStats.workouts.current} / {weeklyStats.workouts.target}
                </span>
              </div>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: progressAnimation ? `${(weeklyStats.workouts.current / weeklyStats.workouts.target) * 100}%` : 0 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="h-2.5 bg-primary rounded-full"
              />
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-3 items-center">
                <span className="tracking-[0.02em] font-['Inter']">Active minutes</span>
                <span className="font-mono tracking-tight">
                  {weeklyStats.minutes.current} / {weeklyStats.minutes.target}
                </span>
              </div>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: progressAnimation ? `${(weeklyStats.minutes.current / weeklyStats.minutes.target) * 100}%` : 0 }}
                transition={{ duration: 1.5, delay: 0.3, ease: "easeOut" }}
                className="h-2.5 bg-secondary rounded-full"
              />
            </div>
          </CardContent>
        </Card>

        {/* Workout Streak */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-3 tracking-[0.06em] uppercase font-['Bebas_Neue']">
              <Zap className="h-5 w-5 text-secondary" />
              <span>WORKOUT STREAK</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center space-y-5">
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
                <div className="text-4xl font-bold text-foreground font-mono tracking-tight">
                  {currentStreak}
                </div>
                <div className="text-sm text-muted-foreground tracking-[0.02em] font-['Inter'] uppercase">
                  Day Streak
                </div>
              </div>
              <div className="text-xs text-muted-foreground tracking-[0.01em] font-['Inter'] leading-relaxed">
                Keep it up! Consistency is key to fitness success.
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Workout Types */}
        <Card className="shadow-card lg:col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center space-x-3 tracking-[0.06em] uppercase font-['Bebas_Neue']">
              <TrendingUp className="h-5 w-5 text-secondary" />
              <span>WORKOUT TYPES</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
              {workoutTypes.map((type, index) => (
                <div key={index} className="text-center p-5 bg-gradient-card rounded-xl">
                  <div className="text-3xl mb-3">{type.icon}</div>
                  <div className="font-semibold tracking-[0.03em] uppercase font-['Inter'] text-sm mb-1">
                    {type.name}
                  </div>
                  <div className="text-xs text-muted-foreground tracking-[0.01em] font-['Inter']">
                    {type.count} logged
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Workouts - Improved Alignment */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-3 tracking-[0.06em] uppercase font-['Bebas_Neue']">
            <Activity className="h-5 w-5 text-primary" />
            <span>RECENT WORKOUTS</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentWorkouts.length === 0 ? (
              <p className="text-center text-muted-foreground py-10 tracking-[0.02em] font-['Inter']">
                No workouts logged yet. Start your fitness journey!
              </p>
            ) : (
              recentWorkouts.map((workout) => (
                <div
                  key={workout.id}
                  className="flex items-center justify-between p-4 border rounded-xl hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center">
                      <Activity className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold tracking-[0.02em] font-['Inter']">{workout.name}</h4>
                      <p className="text-sm text-muted-foreground tracking-[0.01em] font-['Inter']">
                        {new Date(workout.date).toLocaleDateString()}
                      </p>
                      <div className="flex items-center space-x-2 mt-2">
                        <Badge variant="outline" className="text-xs tracking-[0.02em] font-['Inter']">
                          {workout.type}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold tracking-tight font-mono">{workout.duration} min</div>
                    <div className="text-sm text-muted-foreground tracking-[0.01em] font-['Inter']">
                      {workout.calories} cal
                    </div>
                  </div>
                </div>
              ))
            )}
            
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full tracking-[0.03em] font-['Inter']">
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
          <CardTitle className="tracking-[0.06em] uppercase font-['Bebas_Neue']">
            QUICK START WORKOUTS
          </CardTitle>
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
                  className="h-20 w-full flex-col space-y-2 hover:bg-accent transition-colors hover:shadow-lg tracking-[0.02em] font-['Inter']"
                  onClick={() => startQuickWorkout(workout)}
                >
                  <div className="text-2xl">{workout.icon}</div>
                  <span className="text-sm tracking-[0.03em]">{workout.name}</span>
                  <span className="text-xs text-muted-foreground tracking-[0.01em]">{workout.duration}</span>
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
                <div className="text-xl font-bold tracking-[0.03em] font-['Bebas_Neue'] uppercase">
                  {selectedWorkout?.name}
                </div>
                <div className="text-sm text-muted-foreground tracking-[0.02em] font-['Inter']">
                  {selectedWorkout?.focus}
                </div>
              </div>
            </DialogTitle>
          </DialogHeader>
          
          {selectedWorkout && (
            <div className="space-y-6">
              {/* Workout Info */}
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <Clock className="h-6 w-6 text-primary mx-auto mb-2" />
                  <div className="font-semibold tracking-tight font-mono">{selectedWorkout.duration}</div>
                  <div className="text-sm text-muted-foreground tracking-[0.01em] font-['Inter']">Duration</div>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <Flame className="h-6 w-6 text-destructive mx-auto mb-2" />
                  <div className="font-semibold tracking-tight font-mono">{selectedWorkout.calories} cal</div>
                  <div className="text-sm text-muted-foreground tracking-[0.01em] font-['Inter']">Calories</div>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <Zap className="h-6 w-6 text-secondary mx-auto mb-2" />
                  <div className="font-semibold tracking-[0.03em] font-['Inter'] uppercase">{selectedWorkout.intensity}</div>
                  <div className="text-sm text-muted-foreground tracking-[0.01em] font-['Inter']">Intensity</div>
                </div>
              </div>

              {/* Description */}
              <div>
                <h4 className="font-semibold mb-2 tracking-[0.03em] font-['Inter']">Description</h4>
                <p className="text-muted-foreground tracking-[0.01em] font-['Inter'] leading-relaxed">
                  {selectedWorkout.description}
                </p>
              </div>

              {/* Workout Steps */}
              <div>
                <h4 className="font-semibold mb-3 tracking-[0.03em] font-['Inter']">Workout Steps</h4>
                <div className="space-y-2">
                  {selectedWorkout.steps.map((step: string, index: number) => (
                    <div key={index} className="flex items-start space-x-3 p-3 bg-muted/30 rounded-lg">
                      <div className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-xs font-bold font-mono">
                        {index + 1}
                      </div>
                      <span className="text-sm tracking-[0.01em] font-['Inter'] leading-relaxed">{step}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3">
                <Button 
                  onClick={() => startWorkout(selectedWorkout)}
                  className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:shadow-lg tracking-[0.03em] font-['Inter']"
                >
                  <Play className="h-4 w-4 mr-2" />
                  Start Now
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowWorkoutModal(false)}
                  className="tracking-[0.03em] font-['Inter']"
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