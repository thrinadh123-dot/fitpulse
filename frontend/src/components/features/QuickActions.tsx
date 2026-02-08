import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { motion } from 'framer-motion';
import { useFitnessStore, selectIsSyncing } from '@/stores/fitnessStore';
import { Loader2 } from 'lucide-react';

interface QuickActionButtonProps {
  icon: string;
  label: string;
  onClick: () => void;
  variant?: 'default' | 'outline';
  className?: string;
  isLoading?: boolean;
}

const QuickActionButton = ({ 
  icon, 
  label, 
  onClick, 
  variant = 'outline', 
  className = '',
  isLoading = false 
}: QuickActionButtonProps) => {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleClick = () => {
    if (isLoading) return;
    setIsAnimating(true);
    onClick();
    setTimeout(() => setIsAnimating(false), 300);
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      animate={isAnimating ? { scale: [1, 1.1, 1] } : {}}
      transition={{ duration: 0.2 }}
    >
      <Button 
        className={`w-full ${className}`} 
        variant={variant}
        onClick={handleClick}
        disabled={isLoading}
      >
        {isLoading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <span className="mr-2">{icon}</span>
        )}
        {label}
      </Button>
    </motion.div>
  );
};

// Meal Logging Dialog
const MealLogDialog = ({ onLog }: { onLog: (calories: number) => void }) => {
  const [calories, setCalories] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const calorieValue = parseInt(calories);
    if (calorieValue > 0) {
      onLog(calorieValue);
      setCalories('');
      setIsOpen(false);
    }
  };

  const quickMeals = [
    { name: 'Breakfast', calories: 400 },
    { name: 'Lunch', calories: 600 },
    { name: 'Dinner', calories: 700 },
    { name: 'Snack', calories: 200 }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          🍽️ Log Meal
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-card-title uppercase uppercase">Log Your Meal</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-2">
            {quickMeals.map((meal) => (
              <Button
                key={meal.name}
                variant="outline"
                onClick={() => {
                  onLog(meal.calories);
                  setIsOpen(false);
                }}
                className="h-auto p-3 flex flex-col"
              >
                <span className="text-card-title">{meal.name}</span>
                <span className="text-number-label text-muted-foreground">{meal.calories} cal</span>
              </Button>
            ))}
          </div>
          <div className="border-t pt-4">
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <Label htmlFor="calories" className="text-form-label">Custom Calories</Label>
                <Input
                  id="calories"
                  type="number"
                  placeholder="Enter calories"
                  value={calories}
                  onChange={(e) => setCalories(e.target.value)}
                  className="text-input-text"
                />
              </div>
              <Button type="submit" className="w-full">
                Log Custom Meal
              </Button>
            </form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Sleep Logging Dialog
const SleepLogDialog = ({ onLog }: { onLog: (hours: number) => void }) => {
  const [hours, setHours] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const hourValue = parseFloat(hours);
    if (hourValue > 0 && hourValue <= 24) {
      onLog(hourValue);
      setHours('');
      setIsOpen(false);
    }
  };

  const quickSleep = [
    { hours: 6, label: '6 hours' },
    { hours: 7, label: '7 hours' },
    { hours: 8, label: '8 hours' },
    { hours: 9, label: '9 hours' }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          😴 Log Sleep
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-card-title uppercase uppercase">Log Your Sleep</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-2">
            {quickSleep.map((sleep) => (
              <Button
                key={sleep.hours}
                variant="outline"
                onClick={() => {
                  onLog(sleep.hours);
                  setIsOpen(false);
                }}
                className="h-auto p-3"
              >
                <span className="text-body-text">{sleep.label}</span>
              </Button>
            ))}
          </div>
          <div className="border-t pt-4">
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <Label htmlFor="hours" className="text-form-label">Custom Hours</Label>
                <Input
                  id="hours"
                  type="number"
                  step="0.5"
                  min="0"
                  max="24"
                  placeholder="Enter hours"
                  value={hours}
                  onChange={(e) => setHours(e.target.value)}
                  className="text-input-text"
                />
              </div>
              <Button type="submit" className="w-full">
                Log Custom Sleep
              </Button>
            </form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Steps Logging Dialog
const StepsLogDialog = ({ onLog }: { onLog: (steps: number) => void }) => {
  const [steps, setSteps] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const stepValue = parseInt(steps);
    if (stepValue > 0) {
      onLog(stepValue);
      setSteps('');
      setIsOpen(false);
    }
  };

  const quickSteps = [
    { steps: 1000, label: '1K steps' },
    { steps: 2000, label: '2K steps' },
    { steps: 5000, label: '5K steps' },
    { steps: 10000, label: '10K steps' }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          👟 Add Steps
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-card-title uppercase uppercase">Add Steps</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-2">
            {quickSteps.map((step) => (
              <Button
                key={step.steps}
                variant="outline"
                onClick={() => {
                  onLog(step.steps);
                  setIsOpen(false);
                }}
                className="h-auto p-3"
              >
                <span className="text-body-text">{step.label}</span>
              </Button>
            ))}
          </div>
          <div className="border-t pt-4">
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <Label htmlFor="steps" className="text-form-label">Custom Steps</Label>
                <Input
                  id="steps"
                  type="number"
                  placeholder="Enter steps"
                  value={steps}
                  onChange={(e) => setSteps(e.target.value)}
                  className="text-input-text"
                />
              </div>
              <Button type="submit" className="w-full">
                Add Custom Steps
              </Button>
            </form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

interface QuickActionsProps {
  onAddSteps?: () => void;
  onAddWater?: () => void;
  onLogMeal?: () => void;
  onLogSleep?: () => void;
}

export const QuickActions = ({ 
  onAddSteps, 
  onAddWater, 
  onLogMeal, 
  onLogSleep
}: QuickActionsProps) => {
  // Use the new global store
  const {
    addWater,
    addCalories,
    addSteps,
    setSleep,
    getLastResetTime
  } = useFitnessStore();
  
  const isSyncing = useFitnessStore(selectIsSyncing);
  const [waterAdded, setWaterAdded] = useState(false);
  const [stepsAdded, setStepsAdded] = useState(false);

  const handleAddWater = async () => {
    console.log('🔍 DEBUG: Water button clicked');
    await addWater(250);
    onAddWater?.();
    setWaterAdded(true);
    setTimeout(() => setWaterAdded(false), 2000);
  };

  const handleAddSteps = async (steps: number) => {
    console.log('🔍 DEBUG: Steps button clicked with:', steps);
    await addSteps(steps);
    onAddSteps?.();
    setStepsAdded(true);
    setTimeout(() => setStepsAdded(false), 2000);
  };

  const handleLogMeal = async (calories: number) => {
    console.log('🔍 DEBUG: Meal logged with:', calories);
    await addCalories(calories);
    onLogMeal?.();
  };

  const handleLogSleep = async (hours: number) => {
    console.log('🔍 DEBUG: Sleep logged with:', hours);
    await setSleep(hours);
    onLogSleep?.();
  };

  return (
    <Card className="shadow-lg border-0 bg-gradient-to-br from-card to-card/80">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-card-title uppercase">Quick Actions</CardTitle>
          {isSyncing && (
            <div className="flex items-center text-number-label text-muted-foreground">
              <Loader2 className="h-3 w-3 animate-spin mr-1" />
              Syncing...
            </div>
          )}
        </div>
        <p className="text-number-label text-muted-foreground">
          Last Reset: {getLastResetTime()}
        </p>
      </CardHeader>
      <CardContent className="space-y-3">
        <MealLogDialog onLog={handleLogMeal} />
        
        <div className="grid grid-cols-2 gap-2">
          <QuickActionButton
            icon="💧"
            label={waterAdded ? "Added! ✅" : "Add Water"}
            onClick={handleAddWater}
            variant={waterAdded ? "default" : "outline"}
            className={waterAdded ? "bg-green-500 text-white" : ""}
            isLoading={isSyncing}
          />
          <QuickActionButton
            icon="💧💧"
            label="Add 2 Cups"
            onClick={async () => {
              console.log('🔍 DEBUG: Add 2 cups clicked');
              await addWater(500);
              onAddWater?.();
              setWaterAdded(true);
              setTimeout(() => setWaterAdded(false), 2000);
            }}
            isLoading={isSyncing}
          />
        </div>
        
        <StepsLogDialog onLog={handleAddSteps} />
        <SleepLogDialog onLog={handleLogSleep} />
      </CardContent>
    </Card>
  );
};
