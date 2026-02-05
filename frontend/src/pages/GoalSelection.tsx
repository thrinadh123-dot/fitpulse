import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Activity, Target, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const goals = [
  {
    id: "muscle-gain",
    title: "Muscle Gain",
    description: "Build strength and increase muscle mass",
    icon: Target,
    color: "from-blue-500 to-purple-600",
  },
  {
    id: "weight-loss",
    title: "Weight Loss",
    description: "Lose weight and improve body composition",
    icon: Activity,
    color: "from-green-500 to-teal-600",
  },
  {
    id: "maintain-fitness",
    title: "Maintain Fitness",
    description: "Stay healthy and maintain current fitness level",
    icon: Heart,
    color: "from-pink-500 to-rose-600",
  },
];

const GoalSelection = () => {
  const navigate = useNavigate();
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null);

  const handleGoalSelect = (goalId: string) => {
    setSelectedGoal(goalId);
    // Save goal to localStorage or context
    localStorage.setItem("fitnessGoal", goalId);
  };

  const handleContinue = () => {
    if (selectedGoal) {
      navigate("/dashboard");
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const cardVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
    hover: {
      scale: 1.05,
    },
    tap: { scale: 0.95 },
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-hero px-4">
      <motion.div
        className="w-full max-w-4xl"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div
          className="text-center mb-12"
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-center space-x-2 mb-6">
            <Activity className="h-12 w-12 text-primary" />
            <span className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              FitPulse
            </span>
          </div>
          <motion.h1 
            className="text-3xl font-bold mb-4"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Hi there! Let's set your goals
          </motion.h1>
          <p className="text-muted-foreground text-lg">
            Select the goal that best matches your fitness journey
          </p>
        </motion.div>

        <motion.div
          className="grid md:grid-cols-3 gap-6 mb-8"
          variants={containerVariants}
        >
          {goals.map((goal) => {
            const Icon = goal.icon;
            const isSelected = selectedGoal === goal.id;

            return (
              <motion.div key={goal.id} variants={cardVariants} whileHover="hover" whileTap="tap">
                <Card
                  className={`cursor-pointer transition-all duration-300 ${
                    isSelected
                      ? "ring-2 ring-primary shadow-glow border-primary"
                      : "hover:shadow-lg"
                  }`}
                  onClick={() => handleGoalSelect(goal.id)}
                >
                  <CardContent className="p-6">
                    <div
                      className={`w-16 h-16 rounded-full bg-gradient-to-r ${goal.color} flex items-center justify-center mb-4 mx-auto`}
                    >
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-center mb-2">
                      {goal.title}
                    </h3>
                    <p className="text-muted-foreground text-center">
                      {goal.description}
                    </p>
                    {isSelected && (
                      <motion.div
                        className="mt-4 text-center"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      >
                        <div className="w-6 h-6 bg-primary rounded-full mx-auto flex items-center justify-center">
                          <svg
                            className="w-4 h-4 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </div>
                      </motion.div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        <motion.div
          className="text-center"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          <Button
            onClick={handleContinue}
            disabled={!selectedGoal}
            className="bg-gradient-primary hover:shadow-glow transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed px-8 py-3 text-lg"
          >
            Continue to Dashboard
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default GoalSelection;