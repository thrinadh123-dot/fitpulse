import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Check, ChevronLeft, ChevronRight } from "lucide-react";
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isAfter, isBefore } from "date-fns";
import { cn } from "@/lib/utils";
import { useUser } from "@/hooks/useUser";
import { useToast } from "@/hooks/use-toast";

interface OnboardingData {
  goal: string;
  age: number;
  height: number;
  weight: number;
  unitSystem: 'metric' | 'imperial';
}

const goals = [
  { id: 'muscle-gain', title: 'Muscle Gain', icon: '💪', description: 'Build strength and muscle mass' },
  { id: 'weight-loss', title: 'Weight Loss', icon: '🔥', description: 'Lose weight and burn fat' },
  { id: 'maintain-fitness', title: 'Maintain Fitness', icon: '🧘', description: 'Stay healthy and active' },
  { id: 'rehabilitation', title: 'Rehabilitation', icon: '🛡️', description: 'Recover from injury or surgery' },
  { id: 'custom', title: 'Custom Plan', icon: '⚙️', description: 'Create a personalized fitness plan' },
];

const datePickerMonths = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const MIN_AGE = 13;
const MAX_AGE = 100;

// Utility functions
const calculateAge = (birthDate: Date) => {
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
};

const convertHeight = (value: number, from: 'metric' | 'imperial', to: 'metric' | 'imperial') => {
  if (from === to) return value;
  if (from === 'metric' && to === 'imperial') {
    return Math.round(value * 0.393701); // cm to inches
  } else {
    return Math.round(value * 2.54); // inches to cm
  }
};

const convertWeight = (value: number, from: 'metric' | 'imperial', to: 'metric' | 'imperial') => {
  if (from === to) return value;
  if (from === 'metric' && to === 'imperial') {
    return Math.round(value * 2.20462); // kg to lbs
  } else {
    return Math.round(value * 0.453592); // lbs to kg
  }
};

// Enhanced Date Picker Component
const EnhancedDatePicker = ({
  selectedDate,
  onDateSelect,
}: {
  selectedDate: Date | undefined;
  onDateSelect: (date: Date | undefined) => void;
}) => {
  const today = new Date();
  const minDate = new Date(today.getFullYear() - MAX_AGE, today.getMonth(), today.getDate());
  const maxDate = new Date(today.getFullYear() - MIN_AGE, today.getMonth(), today.getDate());
  const [currentMonth, setCurrentMonth] = useState(selectedDate ?? maxDate);
  const [mode, setMode] = useState<"calendar" | "month" | "year">("calendar");
  const years = Array.from({ length: MAX_AGE - MIN_AGE + 1 }, (_, i) => maxDate.getFullYear() - i);
  const isDateDisabled = (date: Date) => isAfter(date, maxDate) || isBefore(date, minDate);
  const days = eachDayOfInterval({ start: startOfMonth(currentMonth), end: endOfMonth(currentMonth) });

  return (
    <div className="w-[320px] bg-card border border-primary/20 rounded-lg shadow-lg">
      <div className="flex items-center justify-between px-3 py-2 border-b border-primary/20 h-12">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
          disabled={isSameMonth(currentMonth, minDate)}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" onClick={() => setMode(mode === "month" ? "calendar" : "month")}>
            {datePickerMonths[currentMonth.getMonth()]}
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setMode(mode === "year" ? "calendar" : "year")}>
            {currentMonth.getFullYear()}
          </Button>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
          disabled={isSameMonth(currentMonth, maxDate)}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      <div className="p-3 min-h-[260px]">
        {mode === "month" && (
          <div className="grid grid-cols-3 gap-2">
            {datePickerMonths.map((m, i) => (
              <Button
                key={m}
                variant="ghost"
                size="sm"
                onClick={() => {
                  setCurrentMonth(new Date(currentMonth.getFullYear(), i, 1));
                  setMode("calendar");
                }}
                className={cn(currentMonth.getMonth() === i && "bg-primary text-primary-foreground")}
              >
                {m.slice(0, 3)}
              </Button>
            ))}
          </div>
        )}
        {mode === "year" && (
          <div className="grid grid-cols-3 gap-2 max-h-52 overflow-y-auto">
            {years.map((year) => (
              <Button
                key={year}
                variant="ghost"
                size="sm"
                onClick={() => {
                  setCurrentMonth(new Date(year, currentMonth.getMonth(), 1));
                  setMode("calendar");
                }}
                className={cn(currentMonth.getFullYear() === year && "bg-primary text-primary-foreground")}
              >
                {year}
              </Button>
            ))}
          </div>
        )}
        {mode === "calendar" && (
          <>
            <div className="grid grid-cols-7 mb-2">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
                <div key={d} className="text-center text-number-label text-muted-foreground">
                  {d}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {days.map((date) => {
                const selected = selectedDate && date.toDateString() === selectedDate.toDateString();
                const disabled = isDateDisabled(date);
                return (
                  <Button
                    key={date.toISOString()}
                    variant="ghost"
                    size="sm"
                    disabled={disabled}
                    onClick={() => !disabled && onDateSelect(date)}
                    className={cn("h-8 w-8 p-0", selected && "bg-primary text-primary-foreground", disabled && "opacity-40")}
                  >
                    {date.getDate()}
                  </Button>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// Step 1: Goal Selection
const GoalSelectionStep = ({
  data,
  updateData,
  nextStep,
}: {
  data: OnboardingData;
  updateData: (field: keyof OnboardingData, value: string | number) => void;
  nextStep: () => void;
}) => {
  return (
    <Card className="shadow-glow h-full flex flex-col justify-between">
      <CardHeader className="text-center pb-3">
        <CardTitle className="text-page-heading mb-1  uppercase">WHAT'S YOUR FITNESS GOAL?</CardTitle>
        <p className="text-body-text text-muted-foreground">Select the goal that best describes your fitness journey</p>
      </CardHeader>
      <CardContent className="space-y-4 flex-grow">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {goals.map((goal) => {
            const selected = data.goal === goal.id;
            return (
              <motion.div key={goal.id} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Card
                  onClick={() => updateData("goal", goal.id)}
                  className={`relative cursor-pointer transition-all duration-300 ${selected ? "ring-2 ring-primary shadow-glow bg-gradient-card" : "hover:shadow-card"}`}
                >
                  <CardContent className="p-5 text-center">
                    <div className="text-primary-number mb-3">{goal.icon}</div>
                    <h3 className="text-card-title mb-1  uppercase">{goal.title}</h3>
                    <p className="text-number-label text-muted-foreground leading-relaxed">{goal.description}</p>
                    {selected && (
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute top-3 right-3">
                        <Check className="h-5 w-5 text-primary" />
                      </motion.div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </CardContent>
      <div className="px-6 pb-5">
        <Button
          onClick={nextStep}
          disabled={!data.goal}
          className="w-full bg-gradient-primary  uppercase hover:shadow-glow transition-all duration-300 text-card-title"
        >
          Continue
        </Button>
      </div>
    </Card>
  );
};

// Step 2: Age Detection
const AgeDetectionStep = ({
  data,
  updateData,
  nextStep,
  prevStep,
}: {
  data: OnboardingData;
  updateData: (field: keyof OnboardingData, value: string | number) => void;
  nextStep: () => void;
  prevStep: () => void;
}) => {
  const [birthDate, setBirthDate] = useState<Date>();

  const handleDateSelect = (date: Date | undefined) => {
    setBirthDate(date);
    if (date) {
      const age = calculateAge(date);
      updateData("age", age);
    }
  };

  return (
    <Card className="shadow-glow">
      <CardHeader className="text-center">
        <CardTitle className="text-page-heading mb-2">Your Age</CardTitle>
        <p className="text-body-text text-muted-foreground">Used to personalize your fitness plan</p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex justify-center">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant={"outline"} className={cn("w-[280px] justify-start text-left font-normal text-body-text", !birthDate && "text-muted-foreground")}>
                <CalendarIcon className="mr-2 h-4 w-4" />
                {birthDate ? format(birthDate, "PPP") : <span>Pick your birth date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <EnhancedDatePicker selectedDate={birthDate} onDateSelect={handleDateSelect} />
            </PopoverContent>
          </Popover>
        </div>
        {birthDate && (
          <div className="text-center">
            <p className="text-card-title uppercase">Age: {data.age} years old</p>
          </div>
        )}
        <div className="flex gap-4 pt-4">
          <Button variant="outline" className="flex-1 text-body-text" onClick={prevStep}>
            Back
          </Button>
          <Button
            className="flex-1 bg-gradient-primary hover:shadow-glow transition-all text-body-text"
            onClick={nextStep}
            disabled={!birthDate}
          >
            Continue
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

// Step 3: Height & Weight
const HeightWeightStep = ({
  data,
  updateData,
  nextStep,
  prevStep,
  handleUnitToggle,
}: {
  data: OnboardingData;
  updateData: (field: keyof OnboardingData, value: string | number) => void;
  nextStep: () => void;
  prevStep: () => void;
  handleUnitToggle: () => void;
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const heightCm = data.unitSystem === "metric" ? data.height : data.height * 2.54;
  const weightKg = data.unitSystem === "metric" ? data.weight : data.weight * 0.453592;
  const heightMin = data.unitSystem === "metric" ? 120 : 47;
  const heightMax = data.unitSystem === "metric" ? 220 : 87;
  const weightMin = data.unitSystem === "metric" ? 40 : 88;
  const weightMax = data.unitSystem === "metric" ? 150 : 330;

  const bmi = useMemo(() => {
    if (!heightCm || !weightKg) return null;
    return (weightKg / Math.pow(heightCm / 100, 2)).toFixed(1);
  }, [heightCm, weightKg]);

  const handleNumberChange = (field: "height" | "weight", value: string, min: number, max: number) => {
    const v = Number(value);
    if (Number.isNaN(v) || v < min || v > max) return;
    updateData(field, v);
  };

  const pct = (value: number, min: number, max: number) => {
    if (!value) return 0;
    return Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));
  };

  const heightPct = pct(data.height as number, heightMin, heightMax);
  const weightPct = pct(data.weight as number, weightMin, weightMax);

  return (
    <Card className="shadow-glow max-w-3xl mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-page-heading mb-2">Height & Weight</CardTitle>
        <p className="text-body-text text-muted-foreground">Used internally to personalize your fitness plan</p>
      </CardHeader>
      <CardContent className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-3">
            <Label className="text-card-title uppercase">Height</Label>
            <div className="flex items-center gap-3">
              <Input
                type="number"
                inputMode="decimal"
                value={data.height}
                onChange={(e) => handleNumberChange("height", e.target.value, heightMin, heightMax)}
                className="text-body-text"
              />
              <Button onClick={handleUnitToggle} className="w-24 text-body-text">
                {data.unitSystem === 'metric' ? 'cm' : 'in'}
              </Button>
            </div>
            <div className="space-y-1">
              <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-emerald-400 to-amber-400 transition-all" style={{ width: `${heightPct}%` }} />
              </div>
              <p className="text-number-label text-muted-foreground">
                Range {heightMin}–{heightMax} {data.unitSystem === 'metric' ? 'cm' : 'in'}
              </p>
            </div>
          </div>
          <div className="space-y-3">
            <Label className="text-card-title uppercase">Weight</Label>
            <div className="flex items-center gap-3">
              <Input
                type="number"
                inputMode="decimal"
                value={data.weight}
                onChange={(e) => handleNumberChange("weight", e.target.value, weightMin, weightMax)}
                className="text-body-text"
              />
              <Button onClick={handleUnitToggle} className="w-24 text-body-text">
                {data.unitSystem === 'metric' ? 'kg' : 'lb'}
              </Button>
            </div>
            <div className="space-y-1">
              <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-emerald-400 to-amber-400 transition-all" style={{ width: `${weightPct}%` }} />
              </div>
              <p className="text-number-label text-muted-foreground">
                Range {weightMin}–{weightMax} {data.unitSystem === 'metric' ? 'kg' : 'lb'}
              </p>
            </div>
          </div>
        </div>
        {bmi && (
          <div className="text-center border rounded-lg p-4 bg-muted/30">
            <p className="text-card-title uppercase">BMI: {bmi}</p>
            <p className="text-body-text text-muted-foreground">Used internally for recommendations</p>
          </div>
        )}
        <div className="flex items-center justify-between border rounded-lg px-4 py-3 bg-muted/20">
          <div>
            <p className="text-card-title">Advanced controls</p>
            <p className="text-number-label text-muted-foreground">Optional sliders for quick adjustments</p>
          </div>
          <Button variant={showAdvanced ? "default" : "outline"} size="sm" onClick={() => setShowAdvanced((v) => !v)} className="text-body-text">
            {showAdvanced ? "Hide" : "Show"}
          </Button>
        </div>
        {showAdvanced && (
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-number-label text-muted-foreground">
                <span>Height slider</span>
                <span>{data.height} {data.unitSystem === 'metric' ? 'cm' : 'in'}</span>
              </div>
              <input
                type="range"
                min={heightMin}
                max={heightMax}
                value={data.height}
                onChange={(e) => updateData("height", Number(e.target.value))}
                className="w-full accent-emerald-400"
              />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-number-label text-muted-foreground">
                <span>Weight slider</span>
                <span>{data.weight} {data.unitSystem === 'metric' ? 'kg' : 'lb'}</span>
              </div>
              <input
                type="range"
                min={weightMin}
                max={weightMax}
                value={data.weight}
                onChange={(e) => updateData("weight", Number(e.target.value))}
                className="w-full accent-emerald-400"
              />
            </div>
          </div>
        )}
        <div className="flex gap-4 pt-4">
          <Button variant="outline" className="flex-1 text-body-text" onClick={prevStep}>
            Back
          </Button>
          <Button className="flex-1 bg-gradient-primary hover:shadow-glow transition-all text-body-text" onClick={nextStep}>
            Continue
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

// Step 4: Completion
const CompletionStep = ({
  data,
  onComplete,
}: {
  data: OnboardingData;
  onComplete: () => void;
}) => {
  const selectedGoal = goals.find((goal) => goal.id === data.goal);

  return (
    <Card className="shadow-glow max-w-3xl mx-auto">
      <CardHeader className="text-center space-y-3 pb-6">
        <div className="flex justify-center">
          <div className="h-14 w-14 rounded-full bg-primary/15 flex items-center justify-center">
            <Check className="h-8 w-8 text-primary" />
          </div>
        </div>
        <CardTitle className="text-page-heading  uppercase">YOU'RE ALL SET!</CardTitle>
        <p className="text-body-text text-muted-foreground">Review your profile and start your fitness journey</p>
      </CardHeader>
      <CardContent className="space-y-8">
        <div className="rounded-xl border bg-gradient-card p-6 space-y-6">
          <h3 className="text-card-title  uppercase text-muted-foreground">Your Profile Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <p className="text-number-label text-muted-foreground  uppercase">Goal</p>
              <p className="text-body-text flex items-center gap-2">
                    <span className="text-card-title uppercase">{selectedGoal?.icon}</span>
                    {selectedGoal?.title}
                  </p>
            </div>
            <div className="space-y-1">
              <p className="text-number-label text-muted-foreground  uppercase">Age</p>
              <p className="text-body-text">{data.age} years</p>
            </div>
            <div className="space-y-1">
              <p className="text-number-label text-muted-foreground  uppercase">Height</p>
              <p className="text-body-text">
                {data.height} {data.unitSystem === "metric" ? "cm" : "in"}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-number-label text-muted-foreground  uppercase">Weight</p>
              <p className="text-body-text">
                {data.weight} {data.unitSystem === "metric" ? "kg" : "lb"}
              </p>
            </div>
          </div>
        </div>
        <Button onClick={onComplete} className="w-full bg-gradient-primary  uppercase text-card-title py-6 hover:shadow-glow transition-all">
          Start Your Journey
        </Button>
        <p className="text-center text-number-label text-muted-foreground">You can update these details anytime in your profile settings</p>
      </CardContent>
    </Card>
  );
};

// Main Component
const EnhancedOnboarding = () => {
  const navigate = useNavigate();
  const { saveOnboardingData } = useUser();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [data, setData] = useState<OnboardingData>({
    goal: '',
    age: 25,
    height: 170,
    weight: 70,
    unitSystem: 'metric'
  });

  const updateData = (field: keyof OnboardingData, value: string | number) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  const nextStep = () => currentStep < 4 && setCurrentStep(currentStep + 1);
  const prevStep = () => currentStep > 1 && setCurrentStep(currentStep - 1);

  const handleUnitToggle = () => {
    const newUnitSystem = data.unitSystem === 'metric' ? 'imperial' : 'metric';
    const newHeight = convertHeight(data.height, data.unitSystem, newUnitSystem);
    const newWeight = convertWeight(data.weight, data.unitSystem, newUnitSystem);
    
    setData(prev => ({
      ...prev,
      unitSystem: newUnitSystem,
      height: newHeight,
      weight: newWeight
    }));
  };

  const handleCompleteOnboarding = async () => {
    try {
      await Promise.resolve(saveOnboardingData(data as unknown as Record<string, unknown>));
      toast({ title: "Profile setup complete!", description: "Your fitness journey begins now." });
      navigate('/dashboard', { replace: true });
    } catch (error) {
      console.error('Error in onboarding completion:', error);
      toast({ title: "Error saving data", description: "Please try again.", variant: "destructive" });
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <GoalSelectionStep data={data} updateData={updateData} nextStep={nextStep} />;
      case 2:
        return <AgeDetectionStep data={data} updateData={updateData} nextStep={nextStep} prevStep={prevStep} />;
      case 3:
        return <HeightWeightStep data={data} updateData={updateData} nextStep={nextStep} prevStep={prevStep} handleUnitToggle={handleUnitToggle} />;
      case 4:
        return <CompletionStep data={data} onComplete={handleCompleteOnboarding} />;
      default:
        return null;
    }
  };

  return (
    <div className="dark min-h-screen bg-gradient-to-b from-[#0A0C0B] via-[#0E1110] to-[#0A0C0B] flex items-center justify-center px-6 py-10">
      <div className="w-full max-w-2xl">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-body-text text-muted-foreground">Step {currentStep} of 4</span>
            <span className="text-body-text text-muted-foreground">{Math.round((currentStep / 4) * 100)}%</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <motion.div
              className="bg-gradient-primary h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${(currentStep / 4) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default EnhancedOnboarding;



