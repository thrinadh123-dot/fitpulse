import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Heart, 
  Activity, 
  Droplet, 
  Moon, 
  AlertTriangle, 
  CheckCircle, 
  ArrowRight, 
  ArrowLeft,
  Stethoscope,
  Shield,
  Clock,
  Target,
  TrendingUp,
  Calendar,
  Zap
} from "lucide-react";
import { useTheme } from "@/hooks/useTheme";

// Types
interface MedicalCondition {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  severity: 'mild' | 'moderate' | 'severe' | null;
  currentValue: string;
  unit: string;
  normalRange: string;
  criticalThreshold: string;
  criticalMessage: string;
}

interface WellnessPlan {
  duration: number;
  conditions: MedicalCondition[];
  dailyGoals: {
    exercise: string;
    nutrition: string;
    sleep: string;
    stress: string;
    lifestyle: string;
  };
  estimatedProgress: string;
  educationTips: string[];
}

const MedicalCheckup = () => {
  const { isDark } = useTheme();
  const [currentStep, setCurrentStep] = useState(0);
  const [showDisclaimer, setShowDisclaimer] = useState(true);
  const [selectedConditions, setSelectedConditions] = useState<MedicalCondition[]>([]);
  const [planDuration, setPlanDuration] = useState(30);
  const [generatedPlan, setGeneratedPlan] = useState<WellnessPlan | null>(null);

  // Available conditions
  const availableConditions: MedicalCondition[] = [
    {
      id: 'hypertension',
      name: 'Hypertension',
      icon: <Heart className="h-5 w-5" />,
      description: 'High blood pressure management',
      severity: null,
      currentValue: '',
      unit: 'mmHg',
      normalRange: '< 120/80',
      criticalThreshold: '180/120',
      criticalMessage: 'Blood pressure is critically high. Please consult a medical professional immediately.'
    },
    {
      id: 'diabetes',
      name: 'Diabetes',
      icon: <Activity className="h-5 w-5" />,
      description: 'Blood sugar management',
      severity: null,
      currentValue: '',
      unit: 'mg/dL (Fasting)',
      normalRange: '< 100',
      criticalThreshold: '300',
      criticalMessage: 'Blood sugar is critically high. Please consult a medical professional immediately.'
    },
    {
      id: 'asthma',
      name: 'Asthma',
      icon: <Droplet className="h-5 w-5" />,
      description: 'Respiratory health management',
      severity: null,
      currentValue: '',
      unit: 'Peak Flow (L/min)',
      normalRange: '400-600',
      criticalThreshold: '200',
      criticalMessage: 'Peak flow is critically low. Please consult a medical professional immediately.'
    },
    {
      id: 'depression',
      name: 'Depression',
      icon: <Moon className="h-5 w-5" />,
      description: 'Mental health support',
      severity: null,
      currentValue: '',
      unit: 'PHQ-2 Score',
      normalRange: '0-2',
      criticalThreshold: '6',
      criticalMessage: 'Depression symptoms are severe. Please consult a mental health professional immediately.'
    },
    {
      id: 'anxiety',
      name: 'Anxiety',
      icon: <AlertTriangle className="h-5 w-5" />,
      description: 'Anxiety management',
      severity: null,
      currentValue: '',
      unit: 'GAD-2 Score',
      normalRange: '0-2',
      criticalThreshold: '6',
      criticalMessage: 'Anxiety symptoms are severe. Please consult a mental health professional immediately.'
    }
  ];

  const steps = [
    { title: "Disclaimer", icon: <Shield className="h-4 w-4" /> },
    { title: "Select Conditions", icon: <Stethoscope className="h-4 w-4" /> },
    { title: "Input Values", icon: <Target className="h-4 w-4" /> },
    { title: "Choose Duration", icon: <Clock className="h-4 w-4" /> },
    { title: "Review Plan", icon: <CheckCircle className="h-4 w-4" /> },
    { title: "Track Progress", icon: <TrendingUp className="h-4 w-4" /> }
  ];

  const handleConditionToggle = (condition: MedicalCondition) => {
    if (selectedConditions.find(c => c.id === condition.id)) {
      setSelectedConditions(selectedConditions.filter(c => c.id !== condition.id));
    } else {
      setSelectedConditions([...selectedConditions, { ...condition }]);
    }
  };

  const handleNext = () => {
    if (currentStep === 3) {
      // Generate a simple plan for demo
      const plan: WellnessPlan = {
        duration: planDuration,
        conditions: selectedConditions,
        dailyGoals: {
          exercise: "30 minutes of moderate exercise (walking, cycling, or swimming)",
          nutrition: "Balanced diet with plenty of fruits, vegetables, and whole grains",
          sleep: "7-8 hours of quality sleep with regular sleep schedule",
          stress: "10 minutes daily relaxation or mindfulness practice",
          lifestyle: "Maintain healthy habits, avoid smoking, limit alcohol consumption"
        },
        estimatedProgress: `With consistent adherence, you may see improvements in ${selectedConditions.map(c => c.name).join(', ')} within ${planDuration} days.`,
        educationTips: ["Regular exercise and healthy eating benefit all aspects of health"]
      };
      setGeneratedPlan(plan);
    }
    setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    setCurrentStep(currentStep - 1);
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Stethoscope className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold text-foreground font-['Bebas Neue']">
              Medical Checkup Planner
            </h1>
          </div>
          <p className="text-lg text-muted-foreground font-['Inter'] max-w-2xl mx-auto">
            Create personalized wellness plans tailored to your health conditions and goals.
          </p>
        </motion.div>

        {/* Progress Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="card-enhanced">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex justify-between text-sm font-['Inter']">
                  <span>Step {currentStep + 1} of {steps.length}</span>
                  <span>{Math.round(((currentStep + 1) / steps.length) * 100)}% Complete</span>
                </div>
                <Progress value={((currentStep + 1) / steps.length) * 100} className="progress-bar" />
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium font-['Inter']">
                    {steps[currentStep]?.title}
                  </span>
                  <div className="flex items-center space-x-2">
                    {steps[currentStep]?.icon}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Disclaimer Modal */}
        <AnimatePresence>
          {showDisclaimer && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-card border border-border rounded-lg p-6 max-w-md w-full"
              >
                <div className="text-center space-y-4">
                  <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto" />
                  <h3 className="text-xl font-bold font-['Bebas Neue']">Important Disclaimer</h3>
                  <p className="text-sm text-muted-foreground font-['Inter']">
                    This feature is an educational tool and does not replace professional medical advice. 
                    Always consult with healthcare professionals for medical decisions.
                  </p>
                  <Button 
                    onClick={() => setShowDisclaimer(false)}
                    className="w-full btn-primary"
                  >
                    I Understand and Agree
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Step Content */}
        <AnimatePresence mode="wait">
          {currentStep === 0 && (
            <motion.div
              key="step-0"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <Card className="card-enhanced">
                <CardHeader>
                  <CardTitle className="text-2xl font-['Bebas Neue'] flex items-center space-x-2">
                    <Shield className="h-6 w-6 text-primary" />
                    <span>Welcome to Medical Checkup Planner</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold font-['Inter']">What this tool provides:</h3>
                    <ul className="space-y-2 text-sm font-['Inter']">
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-success" />
                        <span>Personalized wellness plans based on your conditions</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-success" />
                        <span>Educational guidance for lifestyle modifications</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-success" />
                        <span>Progress tracking and habit building</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-success" />
                        <span>Estimated improvements with consistent adherence</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
                    <div className="flex items-start space-x-2">
                      <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5" />
                      <div className="text-sm font-['Inter']">
                        <p className="font-semibold text-yellow-600">Medical Disclaimer</p>
                        <p className="text-muted-foreground mt-1">
                          This tool is for educational purposes only. It does not provide medical advice, 
                          diagnosis, or treatment. Always consult healthcare professionals for medical decisions.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {currentStep === 1 && (
            <motion.div
              key="step-1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <Card className="card-enhanced">
                <CardHeader>
                  <CardTitle className="text-2xl font-['Bebas Neue'] flex items-center space-x-2">
                    <Stethoscope className="h-6 w-6 text-primary" />
                    <span>Select Your Medical Conditions</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {availableConditions.map((condition) => (
                      <div
                        key={condition.id}
                        onClick={() => handleConditionToggle(condition)}
                        className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                          selectedConditions.find(c => c.id === condition.id)
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:border-primary/50'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 rounded-full ${
                            selectedConditions.find(c => c.id === condition.id)
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted'
                          }`}>
                            {condition.icon}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold font-['Inter']">{condition.name}</h3>
                            <p className="text-sm text-muted-foreground font-['Inter']">
                              {condition.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {selectedConditions.length === 0 && (
                    <div className="mt-4 text-center text-sm text-muted-foreground font-['Inter']">
                      Please select at least one condition to continue
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}

          {currentStep === 2 && (
            <motion.div
              key="step-2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <Card className="card-enhanced">
                <CardHeader>
                  <CardTitle className="text-2xl font-['Bebas Neue'] flex items-center space-x-2">
                    <Target className="h-6 w-6 text-primary" />
                    <span>Input Current Values & Severity</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {selectedConditions.map((condition, index) => (
                    <div key={condition.id} className="space-y-4 p-4 border border-border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 rounded-full bg-primary/10">
                          {condition.icon}
                        </div>
                        <div>
                          <h3 className="font-semibold font-['Inter']">{condition.name}</h3>
                          <p className="text-sm text-muted-foreground font-['Inter']">
                            Normal range: {condition.normalRange}
                          </p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium font-['Inter']">Severity Level</label>
                          <div className="flex space-x-2">
                            {['mild', 'moderate', 'severe'].map((severity) => (
                              <Button
                                key={severity}
                                variant={condition.severity === severity ? "default" : "outline"}
                                size="sm"
                                onClick={() => {
                                  const updatedConditions = [...selectedConditions];
                                  updatedConditions[index].severity = severity as any;
                                  setSelectedConditions(updatedConditions);
                                }}
                                className="capitalize"
                              >
                                {severity}
                              </Button>
                            ))}
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <label className="text-sm font-medium font-['Inter']">
                            Current Value ({condition.unit})
                          </label>
                          <input
                            type="text"
                            value={condition.currentValue}
                            onChange={(e) => {
                              const updatedConditions = [...selectedConditions];
                              updatedConditions[index].currentValue = e.target.value;
                              setSelectedConditions(updatedConditions);
                            }}
                            className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
                            placeholder={`Enter ${condition.unit}`}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          )}

          {currentStep === 3 && (
            <motion.div
              key="step-3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <Card className="card-enhanced">
                <CardHeader>
                  <CardTitle className="text-2xl font-['Bebas Neue'] flex items-center space-x-2">
                    <Clock className="h-6 w-6 text-primary" />
                    <span>Choose Plan Duration</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[15, 30, 60].map((duration) => (
                      <div
                        key={duration}
                        onClick={() => setPlanDuration(duration)}
                        className={`p-6 rounded-lg border-2 cursor-pointer transition-all duration-200 text-center ${
                          planDuration === duration
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:border-primary/50'
                        }`}
                      >
                        <div className="text-3xl font-bold font-['Roboto Mono'] text-primary">
                          {duration}
                        </div>
                        <div className="text-sm font-['Inter'] text-muted-foreground">
                          Days
                        </div>
                        <div className="mt-2 text-xs font-['Inter'] text-muted-foreground">
                          {duration === 15 && "Quick start"}
                          {duration === 30 && "Recommended"}
                          {duration === 60 && "Comprehensive"}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-6 p-4 bg-primary/5 border border-primary/20 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-5 w-5 text-primary" />
                      <span className="font-semibold font-['Inter']">Plan Summary</span>
                    </div>
                    <p className="text-sm text-muted-foreground font-['Inter'] mt-2">
                      You'll receive a {planDuration}-day personalized plan for: {selectedConditions.map(c => c.name).join(', ')}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {currentStep === 4 && generatedPlan && (
            <motion.div
              key="step-4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <Card className="card-enhanced">
                <CardHeader>
                  <CardTitle className="text-2xl font-['Bebas Neue'] flex items-center space-x-2">
                    <CheckCircle className="h-6 w-6 text-primary" />
                    <span>Your Personalized Wellness Plan</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Plan Overview */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <Clock className="h-5 w-5 text-primary" />
                        <span className="font-semibold font-['Inter']">Duration</span>
                      </div>
                      <div className="text-2xl font-bold font-['Roboto Mono'] text-primary">
                        {generatedPlan.duration} Days
                      </div>
                    </div>
                    
                    <div className="p-4 bg-success/5 border border-success/20 rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <TrendingUp className="h-5 w-5 text-success" />
                        <span className="font-semibold font-['Inter']">Estimated Progress</span>
                      </div>
                      <div className="text-sm font-['Inter'] text-muted-foreground">
                        {generatedPlan.estimatedProgress}
                      </div>
                    </div>
                  </div>

                  {/* Daily Goals */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold font-['Inter']">Daily Goals</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Object.entries(generatedPlan.dailyGoals).map(([key, goal]) => (
                        <div key={key} className="p-4 border border-border rounded-lg">
                          <div className="flex items-center space-x-2 mb-2">
                            {key === 'exercise' && <Activity className="h-5 w-5 text-primary" />}
                            {key === 'nutrition' && <Droplet className="h-5 w-5 text-primary" />}
                            {key === 'sleep' && <Moon className="h-5 w-5 text-primary" />}
                            {key === 'stress' && <Heart className="h-5 w-5 text-primary" />}
                            {key === 'lifestyle' && <Target className="h-5 w-5 text-primary" />}
                            <span className="font-semibold font-['Inter'] capitalize">
                              {key}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground font-['Inter']">
                            {goal}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Education Tips */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold font-['Inter']">Educational Tips</h3>
                    <div className="space-y-2">
                      {generatedPlan.educationTips.map((tip, index) => (
                        <div key={index} className="flex items-start space-x-2 p-3 bg-muted/50 rounded-lg">
                          <Zap className="h-4 w-4 text-primary mt-0.5" />
                          <p className="text-sm font-['Inter']">{tip}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Disclaimer */}
                  <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
                    <div className="flex items-start space-x-2">
                      <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5" />
                      <div className="text-sm font-['Inter']">
                        <p className="font-semibold text-yellow-600">Important Reminder</p>
                        <p className="text-muted-foreground mt-1">
                          Consult a medical expert before making major lifestyle changes. 
                          This plan is for educational purposes only.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {currentStep === 5 && (
            <motion.div
              key="step-5"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <Card className="card-enhanced">
                <CardHeader>
                  <CardTitle className="text-2xl font-['Bebas Neue'] flex items-center space-x-2">
                    <TrendingUp className="h-6 w-6 text-primary" />
                    <span>Track Your Progress</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="text-center space-y-4">
                    <div className="text-6xl">🎉</div>
                    <h3 className="text-xl font-semibold font-['Inter']">
                      Your plan is ready!
                    </h3>
                    <p className="text-muted-foreground font-['Inter']">
                      Start tracking your daily progress and build healthy habits.
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 border border-border rounded-lg">
                      <Calendar className="h-8 w-8 text-primary mx-auto mb-2" />
                      <h4 className="font-semibold font-['Inter']">Daily Check-ins</h4>
                      <p className="text-sm text-muted-foreground font-['Inter']">
                        Mark your goals as completed each day
                      </p>
                    </div>
                    
                    <div className="text-center p-4 border border-border rounded-lg">
                      <Zap className="h-8 w-8 text-primary mx-auto mb-2" />
                      <h4 className="font-semibold font-['Inter']">XP & Streaks</h4>
                      <p className="text-sm text-muted-foreground font-['Inter']">
                        Earn points and maintain consistency
                      </p>
                    </div>
                    
                    <div className="text-center p-4 border border-border rounded-lg">
                      <Target className="h-8 w-8 text-primary mx-auto mb-2" />
                      <h4 className="font-semibold font-['Inter']">Progress Review</h4>
                      <p className="text-sm text-muted-foreground font-['Inter']">
                        Reassess your values after plan completion
                      </p>
                    </div>
                  </div>
                  
                  <Button 
                    onClick={() => window.location.href = '/dashboard'}
                    className="w-full btn-primary"
                  >
                    Start Tracking My Progress
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation Buttons */}
        {!showDisclaimer && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex justify-between"
          >
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 0}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back</span>
            </Button>
            
            <Button
              onClick={handleNext}
              disabled={
                (currentStep === 1 && selectedConditions.length === 0) ||
                (currentStep === 2 && selectedConditions.some(c => !c.severity || !c.currentValue)) ||
                currentStep === 5
              }
              className="flex items-center space-x-2 btn-primary"
            >
              <span>
                {currentStep === 4 ? 'Start Tracking' : 'Next'}
              </span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default MedicalCheckup; 