import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Droplet, Moon, Activity, Plus, Clock } from "lucide-react";

interface WaterEntryFormProps {
  onAdd: (amount: number) => void;
}

export const WaterEntryForm = ({ onAdd }: WaterEntryFormProps) => {
  const [amount, setAmount] = useState(1);
  const { toast } = useToast();

  const handleAdd = () => {
    onAdd(amount);
    toast({
      title: "Water Added",
      description: `Added ${amount} cup${amount > 1 ? 's' : ''} to your daily intake.`,
    });
  };

  const quickAmounts = [0.5, 1, 1.5, 2];

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Droplet className="h-5 w-5 text-primary" />
          <span>Add Water</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="amount">Amount (ml)</Label>
          <Input
            id="amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(parseInt(e.target.value))}
            placeholder="Enter amount in ml"
          />
        </div>
        
        <div className="grid grid-cols-4 gap-2">
          {quickAmounts.map((qty) => (
            <Button
              key={qty}
              variant="outline"
              size="sm"
              onClick={() => setAmount(qty)}
              className="text-xs"
            >
              {qty} cup{qty !== 1 ? 's' : ''}
            </Button>
          ))}
        </div>
        
        <Button onClick={handleAdd} className="w-full">
          <Plus className="h-4 w-4 mr-2" />
          Add Water
        </Button>
      </CardContent>
    </Card>
  );
};

interface SleepEntryFormProps {
  onAdd: (entry: { bedtime: string; wakeTime: string; quality: string }) => void;
}

export const SleepEntryForm = ({ onAdd }: SleepEntryFormProps) => {
  const [bedtime, setBedtime] = useState('22:30');
  const [wakeTime, setWakeTime] = useState('07:00');
  const [quality, setQuality] = useState('good');
  const { toast } = useToast();

  const handleAdd = () => {
    onAdd({ bedtime, wakeTime, quality });
    toast({
      title: "Sleep Logged",
      description: `Sleep session from ${bedtime} to ${wakeTime} recorded.`,
    });
  };

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Moon className="h-5 w-5 text-primary" />
          <span>Log Sleep</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="bedtime">Bedtime</Label>
            <Input
              id="bedtime"
              type="time"
              value={bedtime}
              onChange={(e) => setBedtime(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="waketime">Wake Time</Label>
            <Input
              id="waketime"
              type="time"
              value={wakeTime}
              onChange={(e) => setWakeTime(e.target.value)}
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="quality">Sleep Quality</Label>
          <Select value={quality} onValueChange={setQuality}>
            <SelectTrigger>
              <SelectValue placeholder="Select quality" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="poor">Poor</SelectItem>
              <SelectItem value="fair">Fair</SelectItem>
              <SelectItem value="good">Good</SelectItem>
              <SelectItem value="great">Great</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <Button onClick={handleAdd} className="w-full">
          <Clock className="h-4 w-4 mr-2" />
          Log Sleep
        </Button>
      </CardContent>
    </Card>
  );
};

interface ManualSleepEntryFormProps {
  onAdd: (entry: { bedtime: string; wakeTime: string; quality: string }) => void;
}

export const ManualSleepEntryForm = ({ onAdd }: ManualSleepEntryFormProps) => {
  const [sleepStart, setSleepStart] = useState('');
  const [wakeTime, setWakeTime] = useState('');
  const [quality, setQuality] = useState('good');
  const [notes, setNotes] = useState('');
  const { toast } = useToast();

  const handleAdd = () => {
    if (!sleepStart || !wakeTime) {
      toast({
        title: "Error",
        description: "Please enter both sleep start and wake times.",
        variant: "destructive"
      });
      return;
    }

    onAdd({ bedtime: sleepStart, wakeTime, quality });
    setSleepStart('');
    setWakeTime('');
    setNotes('');
    toast({
      title: "Manual Sleep Entry Logged",
      description: `Sleep session from ${sleepStart} to ${wakeTime} recorded with ${quality} quality.`,
    });
  };

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Moon className="h-5 w-5 text-primary" />
          <span>Manually Enter Sleep</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="sleep-start">Sleep Start Time</Label>
            <Input
              id="sleep-start"
              type="time"
              value={sleepStart}
              onChange={(e) => setSleepStart(e.target.value)}
              placeholder="e.g., 22:30"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="wake-time">Wake Time</Label>
            <Input
              id="wake-time"
              type="time"
              value={wakeTime}
              onChange={(e) => setWakeTime(e.target.value)}
              placeholder="e.g., 07:00"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="sleep-quality">Quality</Label>
          <Select value={quality} onValueChange={setQuality}>
            <SelectTrigger>
              <SelectValue placeholder="Select quality" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="excellent">Excellent</SelectItem>
              <SelectItem value="good">Good</SelectItem>
              <SelectItem value="poor">Poor</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="sleep-notes">Notes (optional)</Label>
          <Textarea
            id="sleep-notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="How did you sleep? Any observations..."
            rows={3}
          />
        </div>
        
        <Button onClick={handleAdd} className="w-full">
          <Clock className="h-4 w-4 mr-2" />
          Log Manual Entry
        </Button>
      </CardContent>
    </Card>
  );
};

interface WorkoutEntryFormProps {
  onAdd: (workout: { name: string; type: string; duration: number; calories: number; notes: string }) => void;
}

export const WorkoutEntryForm = ({ onAdd }: WorkoutEntryFormProps) => {
  const [name, setName] = useState('');
  const [type, setType] = useState('cardio');
  const [duration, setDuration] = useState(30);
  const [calories, setCalories] = useState(200);
  const [notes, setNotes] = useState('');
  const { toast } = useToast();

  const handleAdd = () => {
    if (!name.trim()) {
      toast({
        title: "Error",
        description: "Please enter a workout name.",
        variant: "destructive"
      });
      return;
    }

    onAdd({ name: name.trim(), type, duration, calories, notes: notes.trim() });
    setName('');
    setNotes('');
    toast({
      title: "Workout Logged",
      description: `${name} (${duration} min) has been added to your fitness log.`,
    });
  };

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Activity className="h-5 w-5 text-primary" />
          <span>Log Workout</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="workout-name">Workout Name</Label>
          <Input
            id="workout-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Morning Run, Chest Day"
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="workout-type">Type</Label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cardio">Cardio</SelectItem>
                <SelectItem value="strength">Strength</SelectItem>
                <SelectItem value="flexibility">Flexibility</SelectItem>
                <SelectItem value="hiit">HIIT</SelectItem>
                <SelectItem value="sports">Sports</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="duration">Duration (min)</Label>
            <Input
              id="duration"
              type="number"
              value={duration}
              onChange={(e) => setDuration(parseInt(e.target.value))}
              placeholder="Minutes"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="calories">Calories Burned</Label>
          <Input
            id="calories"
            type="number"
            value={calories}
            onChange={(e) => setCalories(parseInt(e.target.value))}
            placeholder="Estimated calories"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="notes">Notes (optional)</Label>
          <Textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="How did it feel? Any observations..."
            rows={3}
          />
        </div>
        
        <Button onClick={handleAdd} className="w-full">
          <Plus className="h-4 w-4 mr-2" />
          Log Workout
        </Button>
      </CardContent>
    </Card>
  );
};