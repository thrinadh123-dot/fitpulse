import { Activity, Plus, Timer, Flame, Target, TrendingUp, Zap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { WorkoutEntryForm } from "@/components/features/TrackingForms";
import WorkoutPlanner from "@/components/features/WorkoutPlanner";
import { useFitnessStore } from "@/stores/fitnessStore";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

const Fitness = () => {
  const workouts = useFitnessStore(state => state.data.workouts);
  const goals = useFitnessStore(state => state.goals);
  const addWorkoutToStore = useFitnessStore(state => state.addWorkout);
  
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
    workouts: { current: weekWorkouts.length, target: goals.workouts },
    minutes: { 
      current: weekWorkouts.reduce((sum, w) => sum + w.duration, 0), 
      target: goals.activeMinutes 
    },
  };

  const addWorkout = (workout: { name: string; type: string; duration: number; calories: number; notes: string }) => {
    addWorkoutToStore(workout);
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
    const workoutData = {
      name: workout.name,
      type: workout.focus.split(' ')[0].toLowerCase(),
      duration: parseInt(workout.duration.split('-')[0]),
      calories: workout.calories,
      notes: `Quick start: ${workout.description}`,
    };
    
    addWorkoutToStore(workoutData);
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
    const workoutData = {
      name: workout.name,
      type: workout.focus.split(' ')[0].toLowerCase(),
      duration: parseInt(workout.duration.split('-')[0]),
      calories: workout.calories,
      notes: `Quick start: ${workout.description}`,
    };
    
    addWorkoutToStore(workoutData);
    
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
          <h1 className="text-page-heading text-foreground mb-2">
            Fitness Tracker
          </h1>
          <p className="text-body-text text-muted-foreground">
            Track your workouts and stay active
          </p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-gradient-primary hover:shadow-glow transition-all duration-300 text-card-title">
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
            <CardTitle className="text-card-title uppercase flex items-center space-x-2">
              <Activity className="h-5 w-5 text-primary" />
              <span>Workouts</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-primary-number text-foreground mt-2">
              {todayStats.workouts}
            </div>
            <p className="text-number-label text-muted-foreground mt-2">
              completed today
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-card hover:shadow-glow transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-card-title uppercase flex items-center space-x-2">
              <Timer className="h-5 w-5 text-secondary" />
              <span>Duration</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline space-x-2 mt-2">
              <div className="text-primary-number text-foreground">
                {todayStats.duration}
              </div>
              <span className="text-body-text text-muted-foreground">min</span>
            </div>
            <p className="text-number-label text-muted-foreground mt-2">
              total active time
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-card hover:shadow-glow transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-card-title uppercase flex items-center space-x-2">
              <Flame className="h-5 w-5 text-destructive" />
              <span>Calories</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-primary-number text-foreground mt-2">
              {todayStats.calories}
            </div>
            <p className="text-number-label text-muted-foreground mt-2">
              burned today
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-card hover:shadow-glow transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-card-title uppercase flex items-center space-x-2">
              <Activity className="h-5 w-5 text-primary" />
              <span>Steps</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-primary-number text-foreground mt-2">
              {todayStats.steps.toLocaleString()}
            </div>
            <p className="text-number-label text-muted-foreground mt-2">
              steps taken
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Goals & Streak */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Workout Goal */}
        <Card className="shadow-card lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-card-title uppercase flex items-center space-x-2">
              <Target className="h-5 w-5 text-primary" />
              <span>Weekly Workout Goal</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="flex justify-between mb-3 items-center">
                <span className="text-card-title uppercase text-muted-foreground">Workouts completed</span>
                <span className="text-card-title text-foreground">
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
              <div className="flex justify-between mb-3 items-center">
                <span className="text-card-title uppercase text-muted-foreground">Active minutes</span>
                <span className="text-card-title text-foreground">
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
            <CardTitle className="text-card-title uppercase flex items-center space-x-2">
              <Zap className="h-5 w-5 text-secondary" />
              <span>Workout Streak</span>
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
                className="text-primary-number leading-none"
              >
                🔥
              </motion.div>
              <div>
                <div className="text-primary-number text-foreground mt-2">
                  {currentStreak}
                </div>
                <div className="text-number-label text-muted-foreground mt-2 uppercase">
                  Day Streak
                </div>
              </div>
              <div className="text-number-label text-muted-foreground leading-relaxed">
                Keep it up! Consistency is key to fitness success.
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Workout Types */}
        <Card className="shadow-card lg:col-span-3">
          <CardHeader>
            <CardTitle className="text-card-title uppercase flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-secondary" />
              <span>Workout Types</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
              {workoutTypes.map((type, index) => (
                <div key={index} className="text-center p-5 bg-gradient-card rounded-xl">
                  <div className="text-primary-number mb-3 leading-none">{type.icon}</div>
                  <div className="text-card-title uppercase text-foreground mb-1">
                    {type.name}
                  </div>
                  <div className="text-number-label text-muted-foreground">
                    {type.count} logged
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Workouts */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="text-card-title uppercase flex items-center space-x-2">
            <Activity className="h-5 w-5 text-primary" />
            <span>Recent Workouts</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentWorkouts.length === 0 ? (
              <p className="text-center text-muted-foreground py-10">
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
                      <h4 className="text-card-title uppercase text-foreground">{workout.name}</h4>
                      <p className="text-number-label text-muted-foreground">
                        {new Date(workout.date).toLocaleDateString()}
                      </p>
                      <div className="flex items-center space-x-2 mt-2">
                        <Badge variant="outline" className="text-number-label">
                          {workout.type}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-card-title text-foreground">{workout.duration} min</div>
                    <div className="text-number-label text-muted-foreground">
                      {workout.calories} cal
                    </div>
                  </div>
                </div>
              ))
            )}
            
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full text-card-title">
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
          <CardTitle className="text-card-title uppercase">
            Quick Start Workouts
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
                  className="h-20 w-full flex-col space-y-2 hover:bg-accent transition-colors hover:shadow-lg"
                  onClick={() => startQuickWorkout(workout)}
                >
                  <div className="text-primary-number leading-none">{workout.icon}</div>
                  <span className="text-card-title uppercase text-foreground">{workout.name}</span>
                  <span className="text-number-label text-muted-foreground">{workout.duration}</span>
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
            <DialogTitle className="text-card-title uppercase">
              {selectedWorkout?.name}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {selectedWorkout && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-card-title uppercase text-muted-foreground">Duration</span>
                  <span className="text-card-title text-foreground">{selectedWorkout.duration}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-card-title uppercase text-muted-foreground">Intensity</span>
                  <span className="text-card-title text-foreground">{selectedWorkout.intensity}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-card-title uppercase text-muted-foreground">Calories</span>
                  <span className="text-card-title text-foreground">{selectedWorkout.calories}</span>
                </div>
                <div className="space-y-2">
                  <span className="text-card-title uppercase text-muted-foreground">Steps</span>
                  <ul className="list-disc pl-5 space-y-1">
                    {selectedWorkout.steps?.map((step: string, index: number) => (
                      <li key={index} className="text-body-text text-foreground">{step}</li>
                    ))}
                  </ul>
                </div>
                <Button onClick={() => startWorkout(selectedWorkout)} className="w-full mt-4 text-card-title">
                  Start Workout
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Fitness;
