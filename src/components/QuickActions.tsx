import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { motion, AnimatePresence } from 'framer-motion';
import { useFitnessStore } from '@/hooks/useFitnessStore';
import { useToast } from '@/hooks/use-toast';

interface QuickActionButtonProps {
  icon: string;
  label: string;
  onClick: () => void;
  variant?: 'default' | 'outline';
  className?: string;
}

const QuickActionButton = ({ icon, label, onClick, variant = 'outline', className = '' }: QuickActionButtonProps) => {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleClick = () => {
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
      >
        <span className="mr-2">{icon}</span>
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
          <DialogTitle>Log Your Meal</DialogTitle>
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
                <span className="font-medium">{meal.name}</span>
                <span className="text-sm text-muted-foreground">{meal.calories} cal</span>
              </Button>
            ))}
          </div>
          <div className="border-t pt-4">
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <Label htmlFor="calories">Custom Calories</Label>
                <Input
                  id="calories"
                  type="number"
                  placeholder="Enter calories"
                  value={calories}
                  onChange={(e) => setCalories(e.target.value)}
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
          <DialogTitle>Log Your Sleep</DialogTitle>
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
                {sleep.label}
              </Button>
            ))}
          </div>
          <div className="border-t pt-4">
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <Label htmlFor="hours">Custom Hours</Label>
                <Input
                  id="hours"
                  type="number"
                  step="0.5"
                  min="0"
                  max="24"
                  placeholder="Enter hours"
                  value={hours}
                  onChange={(e) => setHours(e.target.value)}
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
          <DialogTitle>Add Steps</DialogTitle>
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
                {step.label}
              </Button>
            ))}
          </div>
          <div className="border-t pt-4">
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <Label htmlFor="steps">Custom Steps</Label>
                <Input
                  id="steps"
                  type="number"
                  placeholder="Enter steps"
                  value={steps}
                  onChange={(e) => setSteps(e.target.value)}
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
  mealLogged?: boolean;
  sleepLogged?: boolean;
}

export const QuickActions = ({ 
  onAddSteps, 
  onAddWater, 
  onLogMeal, 
  onLogSleep,
  mealLogged = false,
  sleepLogged = false
}: QuickActionsProps) => {
  const { logMeal, addWater, logSleep, addSteps, getLastResetTime } = useFitnessStore();
  const { toast } = useToast();

  const handleAddWater = () => {
    addWater(1);
    onAddWater?.();
    toast({
      title: "Water Added",
      description: "1 cup of water added to your daily intake.",
    });
  };

  const handleAddSteps = (steps: number) => {
    addSteps(steps);
    onAddSteps?.();
    toast({
      title: "Steps Added",
      description: `${steps} steps added to your daily count.`,
    });
  };

  const handleLogMeal = (calories: number) => {
    logMeal(calories);
    onLogMeal?.();
    toast({
      title: "Meal Logged",
      description: `${calories} calories added to your nutrition log.`,
    });
  };

  const handleLogSleep = (hours: number) => {
    logSleep(hours);
    onLogSleep?.();
    toast({
      title: "Sleep Logged",
      description: `${hours} hours of sleep recorded.`,
    });
  };

  return (
    <Card className="shadow-lg border-0 bg-gradient-to-br from-card to-card/80">
      <CardHeader>
        <CardTitle className="text-lg">Quick Actions</CardTitle>
        <p className="text-sm text-muted-foreground">
          Last Reset: {getLastResetTime()}
        </p>
      </CardHeader>
      <CardContent className="space-y-3">
        <MealLogDialog onLog={handleLogMeal} />
        
        <div className="grid grid-cols-2 gap-2">
          <QuickActionButton
            icon="💧"
            label={mealLogged ? "Added! ✅" : "Add Water"}
            onClick={handleAddWater}
            variant={mealLogged ? "default" : "outline"}
            className={mealLogged ? "bg-green-500 text-white" : ""}
          />
          <QuickActionButton
            icon="💧💧"
            label="Add 2 Cups"
            onClick={() => {
              addWater(2);
              onAddWater?.();
            }}
          />
        </div>
        
        <StepsLogDialog onLog={handleAddSteps} />
        <SleepLogDialog onLog={handleLogSleep} />
      </CardContent>
    </Card>
  );
}; 