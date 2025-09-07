import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarIcon, Check, AlertCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameYear } from "date-fns";
import { cn } from "@/lib/utils";
import { useUser } from "@/hooks/useUser";
import { useToast } from "@/hooks/use-toast";

// Remove this duplicate default export and the unused OnboardingStep component
// If you need OnboardingStep, export it as a named export or refactor its usage.

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

const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

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

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

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
      // Save onboarding data and wait for it to complete
      await Promise.resolve(saveOnboardingData(data as unknown as Record<string, unknown>));
      
      // Show success toast
      toast({
        title: "Profile setup complete!",
        description: "Your fitness journey begins now.",
      });

      // Navigate to dashboard and replace the history entry
      // Using replace: true prevents going back to onboarding
      navigate('/dashboard', { replace: true });
    } catch (error) {
      console.error('Error in onboarding completion:', error);
      toast({
        title: "Error saving data",
        description: "Please try again.",
        variant: "destructive",
      });
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
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-muted-foreground">Step {currentStep} of 4</span>
            <span className="text-sm text-muted-foreground">{Math.round((currentStep / 4) * 100)}%</span>
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

        {/* Step Content */}
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

// Step 1: Goal Selection
const GoalSelectionStep = ({ 
  data, 
  updateData, 
  nextStep 
}: { 
  data: OnboardingData; 
  updateData: (field: keyof OnboardingData, value: string | number) => void; 
  nextStep: () => void; 
}) => {
  return (
    <Card className="shadow-glow h-full flex flex-col justify-between">
      <CardHeader className="text-center pb-2">
        <CardTitle className="text-2xl font-bold mb-1">What's your fitness goal?</CardTitle>
        <p className="text-muted-foreground text-sm">
          Choose the goal that best describes your fitness journey
        </p>
      </CardHeader>

      <CardContent className="space-y-4 flex-grow">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {goals.map((goal) => (
            <motion.div
              key={goal.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card
                className={`cursor-pointer transition-all duration-300 ${
                  data.goal === goal.id
                    ? "ring-2 ring-primary shadow-glow bg-gradient-card"
                    : "hover:shadow-card"
                }`}
                onClick={() => updateData("goal", goal.id)}
              >
                <CardContent className="p-4 text-center relative">
                  <div className="text-3xl mb-2">{goal.icon}</div>
                  <h3 className="font-semibold text-base mb-1">{goal.title}</h3>
                  <p className="text-xs text-muted-foreground">{goal.description}</p>
                  {data.goal === goal.id && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute top-3 right-3"
                    >
                      <Check className="h-5 w-5 text-primary" />
                    </motion.div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </CardContent>

      <div className="px-6 pb-4">
        <Button
          onClick={nextStep}
          disabled={!data.goal}
          className="w-full bg-gradient-primary hover:shadow-glow transition-all duration-300"
        >
          Continue
        </Button>
      </div>
    </Card>
  );
};


// Enhanced Date Picker Component
const EnhancedDatePicker = ({ 
  selectedDate, 
  onDateSelect 
}: { 
  selectedDate: Date | undefined; 
  onDateSelect: (date: Date | undefined) => void; 
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [showMonthPicker, setShowMonthPicker] = useState(false);
  const [showYearPicker, setShowYearPicker] = useState(false);

  const today = new Date();
  const currentYear = today.getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => currentYear - i);

  const handleMonthChange = (monthIndex: number) => {
    const newDate = new Date(currentMonth.getFullYear(), monthIndex, 1);
    setCurrentMonth(newDate);
    setShowMonthPicker(false);
  };

  const handleYearChange = (year: number) => {
    const newDate = new Date(year, currentMonth.getMonth(), 1);
    setCurrentMonth(newDate);
    setShowYearPicker(false);
  };

  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const prevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const getDaysInMonth = () => {
    const start = startOfMonth(currentMonth);
    const end = endOfMonth(currentMonth);
    return eachDayOfInterval({ start, end });
  };

  const isDateDisabled = (date: Date) => {
    return date > today || date < new Date("1900-01-01");
  };

  return (
    <div className="w-auto p-0 bg-card border border-primary/20 rounded-lg">
      {/* Header with Month/Year Navigation */}
      <div className="flex items-center justify-between p-3 border-b border-primary/20">
        <Button
          variant="ghost"
          size="sm"
          onClick={prevMonth}
          disabled={isSameMonth(currentMonth, new Date("1900-01-01"))}
          className="h-8 w-8 p-0 hover:bg-primary/10"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowMonthPicker(!showMonthPicker)}
            className="hover:bg-primary/10 font-medium"
          >
            {months[currentMonth.getMonth()]}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowYearPicker(!showYearPicker)}
            className="hover:bg-primary/10 font-medium"
          >
            {currentMonth.getFullYear()}
          </Button>
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={nextMonth}
          disabled={isSameMonth(currentMonth, today)}
          className="h-8 w-8 p-0 hover:bg-primary/10"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Month Picker */}
      {showMonthPicker && (
        <div className="p-3 border-b border-primary/20">
          <div className="grid grid-cols-3 gap-2">
            {months.map((month, index) => (
              <Button
                key={month}
                variant="ghost"
                size="sm"
                onClick={() => handleMonthChange(index)}
                className={cn(
                  "text-sm",
                  currentMonth.getMonth() === index && "bg-primary text-primary-foreground"
                )}
              >
                {month.slice(0, 3)}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Year Picker */}
      {showYearPicker && (
        <div className="p-3 border-b border-primary/20 max-h-48 overflow-y-auto">
          <div className="grid grid-cols-3 gap-2">
            {years.map((year) => (
              <Button
                key={year}
                variant="ghost"
                size="sm"
                onClick={() => handleYearChange(year)}
                className={cn(
                  "text-sm",
                  currentMonth.getFullYear() === year && "bg-primary text-primary-foreground"
                )}
              >
                {year}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Calendar Grid */}
      {!showMonthPicker && !showYearPicker && (
        <div className="p-3">
          {/* Day Headers */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day} className="text-center text-xs font-medium text-muted-foreground p-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7 gap-1">
            {getDaysInMonth().map((date) => {
              const isSelected = selectedDate && 
                date.getDate() === selectedDate.getDate() &&
                date.getMonth() === selectedDate.getMonth() &&
                date.getFullYear() === selectedDate.getFullYear();
              
              const isDisabled = isDateDisabled(date);
              
              return (
                <Button
                  key={date.toISOString()}
                  variant="ghost"
                  size="sm"
                  onClick={() => !isDisabled && onDateSelect(date)}
                  disabled={isDisabled}
                  className={cn(
                    "h-8 w-8 p-0 text-sm",
                    isSelected && "bg-primary text-primary-foreground",
                    isDisabled && "text-muted-foreground opacity-50",
                    !isDisabled && "hover:bg-primary/10"
                  )}
                >
                  {date.getDate()}
                </Button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

// Step 2: Age Detection with Enhanced Date of Birth
const AgeDetectionStep = ({ 
  data, 
  updateData, 
  nextStep, 
  prevStep 
}: { 
  data: OnboardingData; 
  updateData: (field: keyof OnboardingData, value: string | number) => void; 
  nextStep: () => void; 
  prevStep: () => void; 
}) => {
  const [birthDate, setBirthDate] = useState<Date | undefined>(undefined);
  const [calculatedAge, setCalculatedAge] = useState<number | null>(null);

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setBirthDate(date);
      const age = calculateAge(date);
      setCalculatedAge(age);
      updateData('age', age);
    }
  };

  const isValidAge = () => {
    return calculatedAge !== null && calculatedAge >= 9 && calculatedAge <= 100;
  };

  const calculateAge = (birthDate: Date) => {
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  return (
    <Card className="shadow-glow bg-card/80 backdrop-blur-sm border border-primary/20">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-bold mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Tell us your age
        </CardTitle>
        <p className="text-muted-foreground">This helps us personalize your fitness plan</p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col items-center space-y-6">
          {/* Enhanced Date of Birth Picker */}
          <div className="w-full max-w-sm">
            <Label htmlFor="dob" className="text-lg font-semibold mb-4 block text-center">
              When were you born?
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal border-primary/30 hover:border-primary/60 transition-all duration-300",
                    !birthDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {birthDate ? format(birthDate, "PPP") : <span>Select your date of birth</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="center">
                <EnhancedDatePicker
                  selectedDate={birthDate}
                  onDateSelect={handleDateSelect}
                />
              </PopoverContent>
            </Popover>
          </div>
          
          {/* Age Display */}
          <AnimatePresence>
            {calculatedAge !== null && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.9 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="text-center"
              >
                {/* <div className="bg-gradient-to-r from-primary/20 to-secondary/20 rounded-lg p-4 border border-primary/30">
                  <p className="text-2xl font-bold text-primary">
                    You are {calculatedAge} years old
                  </p>
                </div> */}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Error Message */}
          <AnimatePresence>
            {calculatedAge !== null && !isValidAge() && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="flex items-center space-x-2 text-red-400 bg-red-400/10 border border-red-400/30 rounded-lg px-4 py-3"
              >
                <AlertCircle className="h-4 w-4" />
                <p className="text-sm font-medium">
                  Your age must be greater than 9 years to continue.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        <div className="flex gap-4">
          <Button
            onClick={prevStep}
            variant="outline"
            className="flex-1 border-primary/30 hover:border-primary/60 transition-all duration-300"
          >
            Back
          </Button>
          <Button
            onClick={nextStep}
            disabled={!isValidAge()}
            className="flex-1 bg-gradient-primary hover:shadow-glow transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
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
  handleUnitToggle 
}: { 
  data: OnboardingData; 
  updateData: (field: keyof OnboardingData, value: string | number) => void; 
  nextStep: () => void; 
  prevStep: () => void; 
  handleUnitToggle: () => void; 
}) => {
  return (
    <Card className="shadow-glow">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-bold mb-2">Height & Weight</CardTitle>
        <p className="text-muted-foreground">Help us calculate your BMI and fitness metrics</p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex justify-center">
          <Button
            onClick={handleUnitToggle}
            variant="outline"
            className="mb-4"
          >
            Switch to {data.unitSystem === 'metric' ? 'Imperial' : 'Metric'}
          </Button>
        </div>
        
        <div className="space-y-6">
          <div className="space-y-4">
            <Label className="text-lg font-semibold">
              Height: {data.height} {data.unitSystem === 'metric' ? 'cm' : 'in'}
            </Label>
            <Slider
              value={[data.height]}
              onValueChange={(value) => updateData('height', value[0])}
              max={data.unitSystem === 'metric' ? 220 : 87}
              min={data.unitSystem === 'metric' ? 120 : 47}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>{data.unitSystem === 'metric' ? '120 cm' : '47 in'}</span>
              <span>{data.unitSystem === 'metric' ? '220 cm' : '87 in'}</span>
            </div>
          </div>
          
          <div className="space-y-4">
            <Label className="text-lg font-semibold">
              Weight: {data.weight} {data.unitSystem === 'metric' ? 'kg' : 'lbs'}
            </Label>
            <Slider
              value={[data.weight]}
              onValueChange={(value) => updateData('weight', value[0])}
              max={data.unitSystem === 'metric' ? 150 : 330}
              min={data.unitSystem === 'metric' ? 40 : 88}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>{data.unitSystem === 'metric' ? '40 kg' : '88 lbs'}</span>
              <span>{data.unitSystem === 'metric' ? '150 kg' : '330 lbs'}</span>
            </div>
          </div>
        </div>
        
        <div className="flex gap-4">
          <Button
            onClick={prevStep}
            variant="outline"
            className="flex-1"
          >
            Back
          </Button>
          <Button
            onClick={nextStep}
            className="flex-1 bg-gradient-primary hover:shadow-glow transition-all duration-300"
          >
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
  onComplete 
}: { 
  data: OnboardingData; 
  onComplete: () => void; 
}) => {
  const selectedGoal = goals.find(goal => goal.id === data.goal);
  
  return (
    <Card className="shadow-glow">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-bold mb-2">You're all set! 🎉</CardTitle>
        <p className="text-muted-foreground">Let's review your profile and start your fitness journey</p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="bg-muted/50 rounded-lg p-6 space-y-4">
          <h3 className="font-semibold text-lg">Your Profile Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Goal:</span>
              <p className="font-medium">{selectedGoal?.icon} {selectedGoal?.title}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Age:</span>
              <p className="font-medium">{data.age} years old</p>
            </div>
            <div>
              <span className="text-muted-foreground">Height:</span>
              <p className="font-medium">{data.height} {data.unitSystem === 'metric' ? 'cm' : 'in'}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Weight:</span>
              <p className="font-medium">{data.weight} {data.unitSystem === 'metric' ? 'kg' : 'lbs'}</p>
            </div>
          </div>
        </div>
        
        <Button
          onClick={onComplete}
          className="w-full bg-gradient-primary hover:shadow-glow transition-all duration-300 text-lg py-6"
        >
          Start Your Journey
        </Button>
      </CardContent>
    </Card>
  );
};

export default EnhancedOnboarding;