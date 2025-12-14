import { useState, useEffect } from "react";
import { 
  Bell, Settings, User, Activity, Droplet, Moon, Target, TrendingUp, 
  Plus, Calendar, BarChart3, Zap, Flame, Sparkles, Crown, Users, 
  Award, Lightbulb, Target as TargetIcon, Coffee, Mic, MicOff,
  ArrowUp, ArrowDown, Heart, Trophy, Star
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUser } from "@/hooks/useUser";
import { useFitnessStore } from "@/stores/fitnessStore";
import { useToast } from "@/hooks/use-toast";
import { QuickActions } from "@/components/QuickActions";
import { PageTransition } from "@/components/ui/page-transition";
import { motion } from "framer-motion";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ArcElement
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ArcElement
);

// Chart data with dark mode support and time period tabs
const chartData = {
  daily: {
    labels: ['6AM', '9AM', '12PM', '3PM', '6PM', '9PM'],
    datasets: [
      {
        label: 'Calories Burned',
        data: [120, 180, 220, 160, 200, 140],
        borderColor: 'hsl(var(--sunset-orange))',
        backgroundColor: 'hsl(var(--sunset-orange))',
        borderWidth: 1,
      }
    ]
  },
  weekly: {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Steps',
        data: [8500, 9200, 7800, 10500, 8900, 12000, 9500],
        borderColor: 'hsl(var(--neon-green))',
        backgroundColor: 'hsl(var(--neon-green))',
        borderWidth: 1,
      }
    ]
  },
  monthly: {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [
      {
        label: 'Workouts',
        data: [4, 5, 3, 6],
        borderColor: 'hsl(var(--highlight-blue))',
        backgroundColor: 'hsl(var(--highlight-blue))',
        borderWidth: 1,
      }
    ]
  },
  sleepQuality: {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Sleep Hours',
        data: [7.5, 8.2, 6.8, 7.9, 8.5, 9.1, 8.0],
        borderColor: 'hsl(var(--red-violet))',
        backgroundColor: 'hsl(var(--red-violet))',
        borderWidth: 1,
      }
    ]
  },
  trends: {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Weight (kg)',
        data: [75, 74.2, 73.8, 73.1, 72.5, 71.9],
        backgroundColor: 'hsl(var(--neon-green))',
        borderColor: 'hsl(var(--neon-green))',
        borderWidth: 1,
      }
    ]
  }
};

const chartOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top' as const,
      labels: {
        color: 'hsl(var(--foreground))',
        font: {
          family: "'Inter', sans-serif",
          size: 12,
          weight: '500',
        },
      },
    },
    tooltip: {
      backgroundColor: 'hsl(var(--card))',
      titleColor: 'hsl(var(--foreground))',
      bodyColor: 'hsl(var(--foreground))',
      borderColor: 'hsl(var(--border))',
      borderWidth: 1,
      titleFont: {
        family: "'Inter', sans-serif",
        size: 12,
      },
      bodyFont: {
        family: "'Roboto Mono', monospace",
        size: 11,
      },
    },
  },
  scales: {
    x: {
      ticks: {
        color: 'hsl(var(--muted-foreground))',
        font: {
          family: "'Inter', sans-serif",
          size: 11,
        },
      },
      grid: {
        color: 'hsl(var(--border))',
      },
    },
    y: {
      ticks: {
        color: 'hsl(var(--muted-foreground))',
        font: {
          family: "'Inter', sans-serif",
          size: 11,
        },
      },
      grid: {
        color: 'hsl(var(--border))',
      },
    },
  },
};

// Daily Summary Tile Component with Improved Typography
const DailySummaryTile = ({ 
  title, 
  current, 
  target, 
  unit, 
  icon: Icon, 
  color, 
  progress 
}: {
  title: string;
  current: number;
  target: number;
  unit: string;
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  color: string;
  progress: number;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={{ scale: 1.02, y: -2 }}
    transition={{ duration: 0.3 }}
  >
    <Card className="h-full card-enhanced shadow-lg hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-card to-card/80">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-muted-foreground font-['Inter'] tracking-[0.02em]">
            {title}
          </h3>
          <div className="p-2 rounded-full" style={{ backgroundColor: `${color}20` }}>
            <Icon className="h-4 w-4" style={{ color }} />
          </div>
        </div>
        <div className="mb-3">
          <div className="text-2xl font-bold text-foreground font-['Roboto Mono'] leading-tight tracking-tight">
            {current.toLocaleString()} / {target.toLocaleString()}
          </div>
          <div className="text-sm text-muted-foreground font-['Inter'] tracking-[0.01em] mt-1">
            {unit}
          </div>
        </div>
        <div className="space-y-2">
          <Progress value={progress} className="h-2 progress-bar" style={{ '--progress-color': color } as React.CSSProperties} />
          <div className="text-xs text-muted-foreground font-['Inter'] tracking-[0.01em]">
            {progress.toFixed(0)}% complete
          </div>
        </div>
      </CardContent>
    </Card>
  </motion.div>
);

// Mood Tracker Component with Improved Typography
const MoodTracker = ({ currentMood, onMoodChange, weeklyMood }: { 
  currentMood: string; 
  onMoodChange: (mood: string) => void;
  weeklyMood: string[];
}) => {
  const moods = [
    { emoji: '😄', label: 'Excellent', value: 'excellent', color: 'text-green-500' },
    { emoji: '🙂', label: 'Good', value: 'good', color: 'text-blue-500' },
    { emoji: '😐', label: 'Neutral', value: 'neutral', color: 'text-yellow-500' },
    { emoji: '😟', label: 'Stressed', value: 'stressed', color: 'text-orange-500' },
    { emoji: '😴', label: 'Tired', value: 'tired', color: 'text-purple-500' }
  ];

  const getMoodEmoji = (mood: string) => {
    const moodObj = moods.find(m => m.value === mood);
    return moodObj ? moodObj.emoji : '😐';
  };

  const getMoodColor = (mood: string) => {
    const moodObj = moods.find(m => m.value === mood);
    return moodObj ? moodObj.color : 'text-yellow-500';
  };

  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <Card className="shadow-lg border-0 bg-gradient-to-br from-card to-card/80 card-enhanced">
      <CardHeader>
        <CardTitle className="text-lg flex items-center space-x-2 font-['Bebas Neue'] tracking-[0.03em]">
          <Heart className="h-5 w-5 text-secondary" />
          <span>Mood Tracker</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between">
          {moods.map((mood) => (
            <button
              key={mood.value}
              onClick={() => onMoodChange(mood.value)}
              className={`p-2 rounded-lg transition-all hover:scale-105 ${
                currentMood === mood.value 
                  ? 'bg-secondary/20 border-2 border-secondary' 
                  : 'hover:bg-muted/50'
              }`}
            >
              <div className="text-2xl">{mood.emoji}</div>
              <div className="text-xs font-['Inter'] tracking-[0.01em] mt-1">{mood.label}</div>
            </button>
          ))}
        </div>
        
        <div className="mt-4">
          <h4 className="text-sm font-medium font-['Inter'] mb-2 tracking-[0.02em]">Weekly Mood</h4>
          <div className="flex justify-between">
            {weeklyMood.map((mood, index) => (
              <div key={index} className="text-center">
                <div className="text-lg">{getMoodEmoji(mood)}</div>
                <div className="text-xs text-muted-foreground font-['Inter'] tracking-[0.01em] mt-1">
                  {days[index]}
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const Dashboard = () => {
  const { user } = useUser();
  const { data: fitnessData, goals, addSteps, addWater } = useFitnessStore();
  const { toast } = useToast();
  
  // State for chart time period
  const [selectedTimeframe, setSelectedTimeframe] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [selectedChart, setSelectedChart] = useState<'overview' | 'sleep' | 'trends'>('overview');
  const [currentMood, setCurrentMood] = useState('good');
  const [weeklyMood, setWeeklyMood] = useState(['good', 'excellent', 'neutral', 'good', 'excellent', 'stressed', 'good']);
  const [showFullLeaderboard, setShowFullLeaderboard] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [mealLogged, setMealLogged] = useState(false);
  const [sleepLogged, setSleepLogged] = useState(false);

  // Sample data for demonstration
  const communityStats = {
    rank: 8,
    totalUsers: 15420,
    ageGroup: '25-34',
    badge: 'Fitness Enthusiast'
  };

  const leaderboardEntries = [
    { id: '1', name: 'Sarah Johnson', avatar: 'SJ', xp: 2840, status: ['🏆', '🔥'] },
    { id: '2', name: 'Mike Chen', avatar: 'MC', xp: 2720, status: ['🔥'] },
    { id: '3', name: 'Emma Davis', avatar: 'ED', xp: 2650, status: ['⚡'] }
  ];

  const fullLeaderboardData = [
    { name: 'Sarah Johnson', avatar: 'SJ', xp: 2840, badge: '🏆' },
    { name: 'Mike Chen', avatar: 'MC', xp: 2720, badge: '🥈' },
    { name: 'Emma Davis', avatar: 'ED', xp: 2650, badge: '🥉' },
    { name: 'Alex Rodriguez', avatar: 'AR', xp: 2580, badge: '💪' },
    { name: 'Lisa Wang', avatar: 'LW', xp: 2450, badge: '🔥' }
  ];

  // Calculate progress percentages
  const getProgress = (metric: string) => {
    const current = Number(fitnessData[metric as keyof typeof fitnessData]) || 0;
    const target = Number(goals[metric as keyof typeof goals]) || 1;
    return Math.min((current / target) * 100, 100);
  };

  const getLastResetTime = () => {
    return new Date().toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const handleAddSteps = async () => {
    console.log('🔍 DEBUG: Dashboard - Add steps button clicked');
    await addSteps(1000);
    // Force a re-render by updating state
    setIsLoading(prev => {
      setTimeout(() => setIsLoading(false), 0);
      return true;
    });
    toast({
      title: "Steps Added!",
      description: "1000 steps added to your daily count.",
    });
  };

  const handleAddWater = async () => {
    console.log('🔍 DEBUG: Dashboard - Add water button clicked');
    await addWater(1);
    // Force a re-render by updating state
    setIsLoading(prev => {
      setTimeout(() => setIsLoading(false), 0);
      return true;
    });
    toast({
      title: "Water Added!",
      description: "1 cup of water added to your daily intake.",
    });
  };

  const handleLogMeal = () => {
    setMealLogged(true);
    setTimeout(() => setMealLogged(false), 3000);
  };

  const handleLogSleep = () => {
    setSleepLogged(true);
    setTimeout(() => setSleepLogged(false), 3000);
  };

  // Get current chart data based on selected timeframe
  const getCurrentChartData = () => {
    if (selectedChart === 'overview') {
      return chartData[selectedTimeframe];
    } else if (selectedChart === 'sleep') {
      return chartData.sleepQuality;
    } else {
      return chartData.trends;
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  // Show loading state
  if (isLoading) {
    return (
      <PageTransition>
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground font-['Inter']">Loading your fitness data...</p>
          </div>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        {/* Main Content */}
        <div className="max-w-[1920px] mx-auto px-6 py-8">
          {/* IMPROVED: 70/30 Grid Layout */}
          <div className="grid grid-cols-1 xl:grid-cols-[2.2fr_1fr] gap-6">
            
            {/* Left Column: Main Content (70%) */}
            <div className="space-y-6">
              
              {/* Greeting Banner - Improved Typography */}
              <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="bg-gradient-to-r from-primary/20 via-secondary/20 to-primary/20 rounded-2xl p-8 border border-primary/30 shadow-lg card-enhanced"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-4xl font-bold text-foreground mb-3 font-['Bebas Neue'] tracking-[0.03em] leading-tight">
                      {getGreeting()}, {user?.firstName || 'Fitness Warrior'}! 💪
                    </h1>
                    <p className="text-xl text-muted-foreground font-['Inter'] tracking-[0.01em] leading-relaxed">
                      Ready to crush your fitness goals today?
                    </p>
                    <p className="text-sm text-muted-foreground/80 mt-3 font-['Roboto Mono'] tracking-[0.02em]">
                      Last Reset: {getLastResetTime()}
                    </p>
                  </div>
                  <div className="text-5xl">🏆</div>
                </div>
              </motion.div>

              {/* IMPROVED: Daily Summary Tiles - Clean 2x2 Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <DailySummaryTile
                  title="Calories"
                  current={fitnessData.calories}
                  target={goals.calories}
                  unit="kcal"
                  icon={Target}
                  color="hsl(var(--sunset-orange))"
                  progress={getProgress('calories')}
                />
                <DailySummaryTile
                  title="Steps"
                  current={fitnessData.steps}
                  target={goals.steps}
                  unit="steps"
                  icon={Activity}
                  color="hsl(var(--neon-green))"
                  progress={getProgress('steps')}
                />
                <DailySummaryTile
                  title="Water"
                  current={fitnessData.water}
                  target={goals.water}
                  unit="cups"
                  icon={Droplet}
                  color="hsl(var(--highlight-blue))"
                  progress={getProgress('water')}
                />
                <DailySummaryTile
                  title="Sleep"
                  current={fitnessData.sleep}
                  target={goals.sleep}
                  unit="hours"
                  icon={Moon}
                  color="hsl(var(--red-violet))"
                  progress={getProgress('sleep')}
                />
              </div>

              {/* Charts Section - Dominant Position */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <Card className="shadow-lg border-0 bg-gradient-to-br from-card to-card/80 card-enhanced">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-xl flex items-center space-x-3 font-['Bebas Neue'] tracking-[0.04em]">
                        <BarChart3 className="h-7 w-7 text-primary" />
                        <span>Progress Analytics</span>
                      </CardTitle>
                      <div className="flex items-center space-x-3">
                        <Select value={selectedTimeframe} onValueChange={(value: 'daily' | 'weekly' | 'monthly') => setSelectedTimeframe(value)}>
                          <SelectTrigger className="w-36">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="daily">Daily</SelectItem>
                            <SelectItem value="weekly">Weekly</SelectItem>
                            <SelectItem value="monthly">Monthly</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Tabs value={selectedChart} onValueChange={(value: 'overview' | 'sleep' | 'trends') => setSelectedChart(value)} className="w-full">
                      <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="overview" className="font-['Inter'] tracking-[0.02em]">Overview</TabsTrigger>
                        <TabsTrigger value="sleep" className="font-['Inter'] tracking-[0.02em]">Sleep</TabsTrigger>
                        <TabsTrigger value="trends" className="font-['Inter'] tracking-[0.02em]">Trends</TabsTrigger>
                      </TabsList>
                      <TabsContent value="overview" className="mt-6">
                        <div className="h-[300px]">
                          <Line data={getCurrentChartData()} options={chartOptions} />
                        </div>
                      </TabsContent>
                      <TabsContent value="sleep" className="mt-6">
                        <div className="h-[300px]">
                          <Line data={chartData.sleepQuality} options={chartOptions} />
                        </div>
                      </TabsContent>
                      <TabsContent value="trends" className="mt-6">
                        <div className="h-[300px]">
                          <Bar data={chartData.trends} options={chartOptions} />
                        </div>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Tomorrow's Goal Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <Card className="shadow-lg border-0 bg-gradient-to-br from-success/20 to-success/10 card-enhanced border-success/30">
                  <CardContent className="p-8">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-2xl font-semibold text-success mb-3 font-['Bebas Neue'] tracking-[0.03em] leading-tight">
                          Tomorrow's Goal
                        </h3>
                        <p className="text-success/90 font-['Inter'] tracking-[0.01em] leading-relaxed">
                          Aim for 2.5L water and 2100 calories burned
                        </p>
                      </div>
                      <TargetIcon className="h-10 w-10 text-success" />
                    </div>
                    <div className="mt-6">
                      <Progress value={65} className="h-3 progress-bar" />
                      <div className="flex justify-between mt-2">
                        <span className="text-sm text-success/80 font-['Inter'] tracking-[0.01em]">65% progress</span>
                        <span className="text-sm text-success/80 font-['Roboto Mono'] tracking-[0.02em]">+15% from yesterday</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Right Column: Sidebar (30%) - Sticky & Organized */}
            <div className="space-y-6">
              {/* Sticky Container for better UX */}
              <div className="sticky top-24 flex flex-col gap-6">
                
                {/* Progress / XP Group */}
                <div className="space-y-6">
                  <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                  >
                    <Card className="shadow-lg border-0 bg-gradient-to-br from-card to-card/80 card-enhanced">
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center space-x-3 font-['Bebas Neue'] tracking-[0.04em]">
                          <Zap className="h-6 w-6 text-primary" />
                          <span>XP Progress & Rewards</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-5">
                        <div className="text-center">
                          <div className="text-3xl font-bold text-primary mb-2 font-['Roboto Mono'] tracking-tight">
                            +120 XP
                          </div>
                          <div className="text-sm text-muted-foreground font-['Inter'] tracking-[0.02em]">
                            earned today
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-semibold mb-1 font-['Inter'] tracking-[0.02em]">Day 4 of 7</div>
                          <div className="text-sm text-muted-foreground font-['Inter'] tracking-[0.01em]">
                            streak • keep going!
                          </div>
                        </div>
                        <div className="flex justify-center">
                          <div className="relative">
                            <div className="w-20 h-20 rounded-full border-4 border-primary/20 flex items-center justify-center">
                              <Crown className="h-8 w-8 text-primary" />
                            </div>
                            <div className="absolute -top-2 -right-2">
                              <Badge className="bg-primary text-primary-foreground font-['Inter'] tracking-[0.02em]">
                                Intermediate
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>

                  {/* Mood Tracker */}
                  <MoodTracker 
                    currentMood={currentMood}
                    onMoodChange={setCurrentMood}
                    weeklyMood={weeklyMood}
                  />
                </div>

                {/* Actions Group */}
                <div className="space-y-6">
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.7 }}
                  >
                    <QuickActions 
                      onAddSteps={handleAddSteps}
                      onAddWater={handleAddWater}
                      onLogMeal={handleLogMeal}
                      onLogSleep={handleLogSleep}
                      mealLogged={mealLogged}
                      sleepLogged={sleepLogged}
                    />
                  </motion.div>

                  {/* Community Stats */}
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.8 }}
                  >
                    <Card className="shadow-lg border-0 bg-gradient-to-br from-card to-card/80 card-enhanced">
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center space-x-3 font-['Bebas Neue'] tracking-[0.04em]">
                          <Users className="h-6 w-6 text-primary" />
                          <span>Community Stats</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-5">
                        <div className="text-center">
                          <div className="text-3xl font-bold text-primary mb-2 font-['Roboto Mono'] tracking-tight">
                            #{communityStats.rank}
                          </div>
                          <div className="text-sm text-muted-foreground font-['Inter'] tracking-[0.02em]">
                            Top 8% globally
                          </div>
                        </div>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-['Inter'] tracking-[0.02em]">Total Users</span>
                            <span className="text-sm font-medium font-['Roboto Mono'] tracking-tight">
                              {communityStats.totalUsers.toLocaleString()}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-['Inter'] tracking-[0.02em]">Your Age Group</span>
                            <span className="text-sm font-medium font-['Inter'] tracking-[0.02em]">
                              {communityStats.ageGroup}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-['Inter'] tracking-[0.02em]">Active Today</span>
                            <span className="text-sm font-medium font-['Roboto Mono'] tracking-tight">
                              3,842
                            </span>
                          </div>
                        </div>
                        <div className="text-center pt-3">
                          <Badge variant="secondary" className="text-sm font-['Inter'] tracking-[0.03em] px-4 py-1.5">
                            {communityStats.badge}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </div>

                {/* Competitive Section */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.9 }}
                >
                  <Card className="shadow-lg border-0 bg-gradient-to-br from-card to-card/80 card-enhanced">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center space-x-3 font-['Bebas Neue'] tracking-[0.04em]">
                        <Trophy className="h-6 w-6 text-primary" />
                        <span>Leaderboard</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {!showFullLeaderboard ? (
                        <>
                          {leaderboardEntries.map((entry, index) => (
                            <div key={entry.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-all duration-200">
                              <div className="flex items-center space-x-4">
                                <div className="relative">
                                  <Avatar className="h-10 w-10">
                                    <AvatarFallback className="font-['Inter'] font-semibold text-sm">
                                      {entry.avatar}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                                    <span className="text-xs font-bold text-primary-foreground">
                                      {index + 1}
                                    </span>
                                  </div>
                                </div>
                                <div>
                                  <div className="font-medium text-sm font-['Inter'] tracking-[0.02em]">
                                    {entry.name}
                                  </div>
                                  <div className="text-xs text-muted-foreground font-['Roboto Mono'] tracking-tight">
                                    {entry.xp.toLocaleString()} XP
                                  </div>
                                </div>
                              </div>
                              <div className="flex space-x-1">
                                {entry.status.map((status, idx) => (
                                  <span key={idx} className="text-sm font-['Inter']">{status}</span>
                                ))}
                              </div>
                            </div>
                          ))}
                          <Button 
                            variant="outline" 
                            className="w-full mt-4 btn-secondary font-['Inter'] tracking-[0.02em]"
                            onClick={() => setShowFullLeaderboard(true)}
                          >
                            🔎 View Full Leaderboard
                          </Button>
                        </>
                      ) : (
                        <>
                          <div className="space-y-3">
                            {fullLeaderboardData.map((entry, index) => (
                              <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                                <div className="flex items-center space-x-3">
                                  <div className="text-2xl">{entry.badge}</div>
                                  <Avatar className="h-8 w-8">
                                    <AvatarFallback className="font-['Inter'] font-semibold">
                                      {entry.avatar}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <div className="font-medium text-sm font-['Inter'] tracking-[0.02em]">
                                      {entry.name}
                                    </div>
                                    <div className="text-xs text-muted-foreground font-['Roboto Mono'] tracking-tight">
                                      {entry.xp.toLocaleString()} XP
                                    </div>
                                  </div>
                                </div>
                                <div className="text-sm font-medium font-['Inter'] tracking-[0.03em]">
                                  #{index + 1}
                                </div>
                              </div>
                            ))}
                          </div>
                          <Button 
                            variant="outline" 
                            className="w-full mt-4 btn-secondary font-['Inter'] tracking-[0.02em]"
                            onClick={() => setShowFullLeaderboard(false)}
                          >
                            ← Back to Preview
                          </Button>
                        </>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default Dashboard;