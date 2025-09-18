import React from 'react';
import { useFitnessStore, selectWaterAmount, selectCaloriesAmount, selectStepsAmount, selectSleepAmount, selectIsSyncing } from '@/stores/fitnessStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Loader2, Droplet, Flame, Activity, Moon } from 'lucide-react';
import { motion } from 'framer-motion';

/**
 * Example of a properly connected display component that automatically
 * updates when QuickActions modify the global state
 */
export const FitnessProgressWidget = () => {
  // Subscribe to specific pieces of state using selectors
  const water = useFitnessStore(selectWaterAmount);
  const calories = useFitnessStore(selectCaloriesAmount);
  const steps = useFitnessStore(selectStepsAmount);
  const sleep = useFitnessStore(selectSleepAmount);
  const isSyncing = useFitnessStore(selectIsSyncing);
  
  // Get goals and progress calculator
  const { goals, getProgress } = useFitnessStore();

  const metrics = [
    {
      id: 'water',
      label: 'Water',
      value: water,
      target: goals.water,
      unit: 'cups',
      icon: Droplet,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10'
    },
    {
      id: 'calories',
      label: 'Calories',
      value: calories,
      target: goals.calories,
      unit: 'kcal',
      icon: Flame,
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10'
    },
    {
      id: 'steps',
      label: 'Steps',
      value: steps,
      target: goals.steps,
      unit: 'steps',
      icon: Activity,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10'
    },
    {
      id: 'sleep',
      label: 'Sleep',
      value: sleep,
      target: goals.sleep,
      unit: 'hours',
      icon: Moon,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10'
    }
  ];

  return (
    <Card className=\"shadow-lg\">
      <CardHeader>
        <div className=\"flex items-center justify-between\">
          <CardTitle className=\"text-lg\">Today's Progress</CardTitle>
          {isSyncing && (
            <div className=\"flex items-center text-xs text-muted-foreground\">
              <Loader2 className=\"h-3 w-3 animate-spin mr-1\" />
              Syncing...
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className=\"grid grid-cols-1 md:grid-cols-2 gap-4\">
          {metrics.map((metric, index) => {
            const progress = getProgress(metric.id as any);
            const Icon = metric.icon;
            
            return (
              <motion.div
                key={metric.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className=\"p-4 rounded-lg border bg-card\"
              >
                <div className=\"flex items-center justify-between mb-3\">
                  <div className=\"flex items-center space-x-2\">
                    <div className={`p-2 rounded-full ${metric.bgColor}`}>
                      <Icon className={`h-4 w-4 ${metric.color}`} />
                    </div>
                    <div>
                      <p className=\"text-sm font-medium\">{metric.label}</p>
                      <p className=\"text-xs text-muted-foreground\">
                        {metric.value} / {metric.target} {metric.unit}
                      </p>
                    </div>
                  </div>
                  <div className=\"text-right\">
                    <p className=\"text-lg font-bold\">{progress.toFixed(0)}%</p>
                  </div>
                </div>
                <Progress value={progress} className=\"h-2\" />
              </motion.div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

/**
 * Example of subscribing to state changes with custom logic
 */
export const useWaterNotifications = () => {
  const water = useFitnessStore(selectWaterAmount);
  const { goals } = useFitnessStore();
  
  React.useEffect(() => {
    // Example: Show notification when user reaches water goal
    if (water >= goals.water) {
      console.log('🎉 Water goal achieved!');
      // Could trigger a celebration animation or notification
    }
  }, [water, goals.water]);
};