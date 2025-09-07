import { useState } from "react";
import { Smile, Frown, Meh, Heart, Zap, Coffee } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface MoodOption {
  id: string;
  emoji: string;
  label: string;
  color: string;
  icon: React.ReactNode;
}

interface MoodTrackerProps {
  currentMood: string;
  onMoodChange: (mood: string) => void;
}

const MoodTracker = ({ currentMood, onMoodChange }: MoodTrackerProps) => {
  const [selectedMood, setSelectedMood] = useState(currentMood);

  const moodOptions: MoodOption[] = [
    {
      id: 'excellent',
      emoji: '😄',
      label: 'Excellent',
      color: 'text-green-500',
      icon: <Smile className="h-5 w-5" />
    },
    {
      id: 'good',
      emoji: '🙂',
      label: 'Good',
      color: 'text-blue-500',
      icon: <Heart className="h-5 w-5" />
    },
    {
      id: 'okay',
      emoji: '😐',
      label: 'Okay',
      color: 'text-yellow-500',
      icon: <Meh className="h-5 w-5" />
    },
    {
      id: 'tired',
      emoji: '😴',
      label: 'Tired',
      color: 'text-orange-500',
      icon: <Coffee className="h-5 w-5" />
    },
    {
      id: 'stressed',
      emoji: '😰',
      label: 'Stressed',
      color: 'text-red-500',
      icon: <Zap className="h-5 w-5" />
    },
    {
      id: 'sad',
      emoji: '😢',
      label: 'Sad',
      color: 'text-purple-500',
      icon: <Frown className="h-5 w-5" />
    }
  ];

  const handleMoodSelect = (moodId: string) => {
    setSelectedMood(moodId);
    onMoodChange(moodId);
  };

  const getCurrentMood = () => {
    return moodOptions.find(mood => mood.id === selectedMood) || moodOptions[0];
  };

  return (
    <Card className="shadow-lg border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <span className="text-2xl">{getCurrentMood().emoji}</span>
          <span>How are you feeling?</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-2">
          {moodOptions.map((mood) => (
            <motion.div
              key={mood.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant={selectedMood === mood.id ? "default" : "outline"}
                className={`w-full h-16 flex flex-col items-center justify-center space-y-1 ${
                  selectedMood === mood.id ? mood.color : ''
                }`}
                onClick={() => handleMoodSelect(mood.id)}
              >
                <span className="text-xl">{mood.emoji}</span>
                <span className="text-xs font-medium">{mood.label}</span>
              </Button>
            </motion.div>
          ))}
        </div>

        {/* Mood Insights */}
        <div className="mt-4 p-3 bg-muted/20 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            {getCurrentMood().icon}
            <span className="text-sm font-medium">Today's Mood: {getCurrentMood().label}</span>
          </div>
          <p className="text-xs text-muted-foreground">
            {selectedMood === 'excellent' && "You're feeling great! Perfect time for a challenging workout."}
            {selectedMood === 'good' && "You're in a good mood. Consider trying a new exercise routine."}
            {selectedMood === 'okay' && "You're doing okay. A light workout might help boost your energy."}
            {selectedMood === 'tired' && "You seem tired. Consider gentle stretching or a short walk."}
            {selectedMood === 'stressed' && "You're feeling stressed. Try meditation or a calming yoga session."}
            {selectedMood === 'sad' && "You're feeling down. Remember, it's okay to take it easy today."}
          </p>
        </div>

        {/* Weekly Mood Trend */}
        <div className="mt-4">
          <h4 className="text-sm font-medium mb-2">This Week's Mood</h4>
          <div className="flex space-x-1">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => {
              const randomMood = moodOptions[Math.floor(Math.random() * moodOptions.length)];
              return (
                <motion.div
                  key={day}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex flex-col items-center space-y-1"
                >
                  <span className="text-xs text-muted-foreground">{day}</span>
                  <div className="w-6 h-6 rounded-full bg-muted/30 flex items-center justify-center">
                    <span className="text-xs">{randomMood.emoji}</span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MoodTracker; 