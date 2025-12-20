// components/WaterTracker/index.tsx
import { useState, useEffect } from "react";
import { Droplet, Plus, Target, TrendingUp, Settings, Moon, Sun } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import SmartGlassSelector from "@/components/SmartGlassSelector";
import { HydrationProgress } from "@/components/WaterTracker/HydrationProgress";
import AddWaterButton from "@/components/WaterTracker/AddWaterButton";
import { WaterEntryForm } from "@/components/TrackingForms";
import { useDailyWater } from "@/hooks/useDailyWater";
import { useWaterGoal } from "@/hooks/useWaterGoal";
import { useWaterReminder } from "@/hooks/useWaterReminder";
import { adjustWaterGoal } from "@/utils/waterGoalAdjustment";
import { useOverGoal } from "@/hooks/useOverGoal";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { QuickAddWater } from "@/components/WaterTracker/QuickAddWater";
import { ManualWaterEntry } from "@/components/WaterTracker/ManualWaterEntry";
import { calculateWeeklyAverage } from "@/utils/waterStats";
import { motion, AnimatePresence } from "framer-motion";

interface WorkoutData {
  date: string;
  completed: boolean;
  intensity: 'low' | 'medium' | 'high';
}

const Water = () => {
  // Core state management
  const { todayEntries, totalMl, setEntries, addEntry, getLastDrinkTime } = useDailyWater();
  const { goalMl, setGoalMl } = useWaterGoal();
  
  // Additional state
  const [weeklyAverage, setWeeklyAverage] = useState<number>(7.2);
  const [streak, setStreak] = useState<number>(5);
  const [workoutCompleted, setWorkoutCompleted] = useState<boolean>(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(false);
  const [reminderInterval, setReminderInterval] = useLocalStorage<number>('reminderInterval', 90); // minutes
  const [workoutHistory, setWorkoutHistory] = useLocalStorage<WorkoutData[]>('workoutHistory', []);
  
  // Calculate adjusted goal based on workout
  const adjustedGoalMl = adjustWaterGoal(goalMl, workoutCompleted);
  const overGoalInfo = useOverGoal(totalMl, adjustedGoalMl);
  
  // Smart reminders
  useWaterReminder(
    todayEntries.length > 0 ? todayEntries[todayEntries.length - 1].time : null,
    notificationsEnabled && totalMl < adjustedGoalMl,
    reminderInterval
  );
  
  // Calculate weekly average from actual data
  useEffect(() => {
    const avg = calculateWeeklyAverage();
    setWeeklyAverage(avg);
  }, [todayEntries]);
  
  // Calculate streak
  useEffect(() => {
    // This would typically come from backend
    // For now, we'll simulate streak calculation
    const calculateStreak = () => {
      // Mock streak logic - in real app, you'd check consecutive days with goal met
      return 5;
    };
    setStreak(calculateStreak());
  }, [totalMl]);
  
  // Handle workout completion
  const handleWorkoutComplete = (intensity: 'low' | 'medium' | 'high') => {
    setWorkoutCompleted(true);
    const today = new Date().toDateString();
    setWorkoutHistory(prev => [
      ...prev.filter(w => new Date(w.date).toDateString() !== today),
      { date: new Date().toISOString(), completed: true, intensity }
    ]);
    
    // Show success message
    showNotification("Workout logged! Your water goal has been adjusted.", "success");
  };
  
  // Add water with auto-goal adjustment check
  const addWater = (amount: number) => {
    const newEntry = {
      time: new Date().toISOString(),
      amount
    };
    
    addEntry(newEntry);
    
    // Show feedback
    if (overGoalInfo && overGoalInfo.extraMl + amount > 0) {
      showNotification(`🎉 Extra hydration logged! Total: ${overGoalInfo.extraMl + amount}ml beyond goal`, "info");
    }
  };
  
  const quickAdd = (amount: number) => {
    addWater(amount);
  };
  
  // Show notification
  const showNotification = (message: string, type: 'success' | 'info' | 'warning' | 'error') => {
    // In a real app, you'd use a toast notification system
    console.log(`${type.toUpperCase()}: ${message}`);
    
    // For demo purposes, alert
    if (typeof window !== 'undefined' && window.Notification && Notification.permission === 'granted') {
      new Notification('💧 Water Tracker', { body: message });
    }
  };
  
  // Calculate statistics
  const percentage = totalMl > 0 ? (totalMl / adjustedGoalMl) * 100 : 0;
  const remainingMl = Math.max(0, adjustedGoalMl - totalMl);
  const totalGlasses = Math.round(totalMl / 250); // Assuming 250ml per glass for display
  
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="text-center">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold text-foreground mb-2">Water Tracker</h1>
          <p className="text-muted-foreground">Stay hydrated throughout the day</p>
        </motion.div>
      </div>

      {/* Workout Adjustment Indicator */}
      {workoutCompleted && (
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="max-w-2xl mx-auto"
        >
          <Card className="bg-gradient-to-r from-secondary/20 to-primary/20 border-secondary/30">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-secondary/20 rounded-full flex items-center justify-center">
                  <Target className="h-5 w-5 text-secondary" />
                </div>
                <div>
                  <p className="font-medium">Goal Adjusted for Workout</p>
                  <p className="text-sm text-muted-foreground">
                    +500ml added to your daily target
                  </p>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setWorkoutCompleted(false)}
              >
                Reset
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Main Progress Card */}
      <Card className="shadow-glow max-w-2xl mx-auto">
        <CardContent className="p-8 text-center space-y-6">
          {/* Enhanced Hydration Progress with over-goal support */}
          <div className="relative">
            <HydrationProgress currentMl={totalMl} goalMl={adjustedGoalMl} />
            
            {/* Over-goal indicator */}
            {overGoalInfo && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full shadow-lg"
              >
                +{overGoalInfo.extraMl}ml
              </motion.div>
            )}
          </div>

          <div>
            <p className="text-muted-foreground">{totalMl}ml today</p>
            <AnimatePresence mode="wait">
              {remainingMl > 0 ? (
                <motion.p
                  key="remaining"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="text-sm text-muted-foreground mt-2"
                >
                  {remainingMl}ml remaining to reach your goal!
                </motion.p>
              ) : (
                <motion.p
                  key="achieved"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="text-sm text-primary font-medium mt-2"
                >
                  🎉 Goal achieved! Keep it up!
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <Dialog>
              <DialogTrigger asChild>
                <Button size="lg" className="bg-gradient-primary hover:shadow-glow transition-all duration-300">
                  <Plus className="h-5 w-5 mr-2" />
                  Add Custom Amount
                </Button>
              </DialogTrigger>
              <DialogContent>
                <ManualWaterEntry onAdd={addWater} />
              </DialogContent>
            </Dialog>

            <AddWaterButton 
              currentGlasses={Math.round(totalMl / 250)} 
              goal={Math.round(adjustedGoalMl / 250)} 
              onClick={() => addWater(250)} 
            />
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="shadow-card hover:shadow-glow transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Progress</CardTitle>
            <Target className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground mb-2">
              {Math.round(percentage)}%
            </div>
            <Progress value={Math.min(percentage, 100)} className="mb-2" />
            <p className="text-xs text-muted-foreground">
              {totalMl}ml of {adjustedGoalMl}ml
            </p>
            {overGoalInfo && (
              <p className="text-xs text-primary mt-1">
                +{overGoalInfo.extraMl}ml beyond goal
              </p>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-card hover:shadow-glow transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Weekly Average</CardTitle>
            <TrendingUp className="h-4 w-4 text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {weeklyAverage.toFixed(1)}
            </div>
            <p className="text-xs text-muted-foreground">glasses per day</p>
            <div className="flex items-center mt-2">
              <TrendingUp className="h-3 w-3 text-secondary mr-1" />
              <span className="text-xs text-secondary">+12% from last week</span>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card hover:shadow-glow transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Streak</CardTitle>
            <div className="text-lg">🔥</div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{streak} days</div>
            <p className="text-xs text-muted-foreground">Keep going!</p>
          </CardContent>
        </Card>
      </div>

      {/* Settings & Workout Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Smart Reminders Settings */}
        <Card className="shadow-card hover:shadow-glow transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Settings className="h-5 w-5" />
              <span>Smart Reminders</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Enable Notifications</p>
                <p className="text-sm text-muted-foreground">
                  Get reminded when you're due for water
                </p>
              </div>
              <Button
                variant={notificationsEnabled ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  if (!notificationsEnabled) {
                    // Request notification permission
                    if (typeof window !== 'undefined' && window.Notification) {
                      Notification.requestPermission().then(permission => {
                        if (permission === 'granted') {
                          setNotificationsEnabled(true);
                          showNotification("Reminders enabled! You'll be notified every 90 minutes of inactivity.", "success");
                        }
                      });
                    }
                  } else {
                    setNotificationsEnabled(false);
                  }
                }}
              >
                {notificationsEnabled ? "Enabled" : "Enable"}
              </Button>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Reminder Interval</label>
              <div className="flex items-center space-x-2">
                <input
                  type="range"
                  min="30"
                  max="180"
                  step="15"
                  value={reminderInterval}
                  onChange={(e) => setReminderInterval(parseInt(e.target.value))}
                  className="flex-1"
                />
                <span className="text-sm font-medium w-16">{reminderInterval} min</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Workout Log */}
        <Card className="shadow-card hover:shadow-glow transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target className="h-5 w-5" />
              <span>Workout Log</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Log workouts to adjust your water goal automatically
            </p>
            
            <div className="grid grid-cols-3 gap-2">
              <Button
                variant="outline"
                className="h-20 flex-col space-y-2"
                onClick={() => handleWorkoutComplete('low')}
              >
                <div className="text-2xl">🚶</div>
                <span className="text-sm">Light</span>
                <span className="text-xs text-muted-foreground">+250ml</span>
              </Button>
              
              <Button
                variant="outline"
                className="h-20 flex-col space-y-2"
                onClick={() => handleWorkoutComplete('medium')}
              >
                <div className="text-2xl">🏃</div>
                <span className="text-sm">Medium</span>
                <span className="text-xs text-muted-foreground">+500ml</span>
              </Button>
              
              <Button
                variant="outline"
                className="h-20 flex-col space-y-2"
                onClick={() => handleWorkoutComplete('high')}
              >
                <div className="text-2xl">💪</div>
                <span className="text-sm">Intense</span>
                <span className="text-xs text-muted-foreground">+750ml</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Add Water */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Quick Add</CardTitle>
        </CardHeader>
        <CardContent>
          <QuickAddWater onAdd={quickAdd} />
        </CardContent>
      </Card>

      {/* Smart Glass Selector */}
      <Card className="shadow-card hover:shadow-glow transition-all duration-300">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Droplet className="h-5 w-5 text-primary" />
            <span>Choose a Glass</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <SmartGlassSelector onSelect={(_, volume) => addWater(volume)} />
        </CardContent>
      </Card>

      {/* Today's Log */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Droplet className="h-5 w-5 text-primary" />
            <span>Today's Water Log</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {todayEntries.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No water logged today. Start hydrating!
              </p>
            ) : (
              <AnimatePresence>
                {todayEntries.map((entry, index) => (
                  <motion.div
                    key={entry.time}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="flex items-center justify-between p-3 bg-gradient-card rounded-lg border"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <Droplet className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{entry.amount}ml</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(entry.time).toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">
                        #{index + 1}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
            
            {totalMl < adjustedGoalMl && (
              <Dialog>
                <DialogTrigger asChild>
                  <div className="flex items-center justify-between p-3 border-2 border-dashed border-muted rounded-lg cursor-pointer hover:bg-accent/50 transition-colors">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                        <Plus className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="font-medium text-muted-foreground">
                          Next drink
                        </p>
                        <p className="text-sm text-muted-foreground">{remainingMl}ml remaining</p>
                      </div>
                    </div>
                    <Button size="sm" variant="outline">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </DialogTrigger>
                <DialogContent>
                  <ManualWaterEntry onAdd={addWater} />
                </DialogContent>
              </Dialog>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Water;