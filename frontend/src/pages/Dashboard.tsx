import { useState, useEffect, useMemo } from "react";
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
import { QuickActions } from "@/components/features/QuickActions";
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
const DEFAULT_CHART_DATA = {
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
            weight: 400,
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
          family: "'Inter', sans-serif",
          size: 12,
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: 'hsl(var(--muted-foreground))',
          font: {
            family: "'Inter', sans-serif",
            size: 12,
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
            size: 12,
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
          <h3 className="text-card-title uppercase">
            {title}
          </h3>
          <div className="p-2 rounded-full" style={{ backgroundColor: `${color}20` }}>
            <Icon className="h-4 w-4" style={{ color }} />
          </div>
        </div>
        <div className="mb-3">
          <div className="text-primary-number text-foreground leading-none">
            {current.toLocaleString()}
          </div>
          <div className="text-number-label text-muted-foreground mt-1">
            Goal: {target.toLocaleString()} {unit}
          </div>
        </div>
        <div className="space-y-2">
          <Progress value={progress} className="h-2 progress-bar" style={{ '--progress-color': color } as React.CSSProperties} />
          <div className="text-number-label text-muted-foreground">
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
        <CardTitle className="text-card-title uppercase flex items-center space-x-2">
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
              <div className="text-page-heading leading-none">{mood.emoji}</div>
              <div className="text-number-label mt-1">{mood.label}</div>
            </button>
          ))}
        </div>
        
        <div className="mt-4">
          <h4 className="text-card-title uppercase mb-2">Weekly Mood</h4>
          <div className="flex justify-between">
            {weeklyMood.map((mood, index) => (
              <div key={index} className="text-center">
                <div className="text-card-title uppercase">{getMoodEmoji(mood)}</div>
                <div className="text-number-label text-muted-foreground mt-1">
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
  const { data: fitnessData, goals, getProgress, getLastResetTime } = useFitnessStore();
  const { toast } = useToast();

  const chartData = useMemo(() => {
    // Helper to get last 7 days
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const today = new Date();
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(today);
      d.setDate(d.getDate() - (6 - i));
      return {
        dateStr: d.toISOString().split('T')[0],
        label: days[d.getDay()]
      };
    });

    // Helper to get history for a specific date
    const getHistoryForDate = (dateStr: string) => {
      // Check current day first
      if (dateStr === fitnessData.lastUpdated) {
        return fitnessData;
      }
      // Then check history
      return fitnessData.history?.find(h => h.date === dateStr) || null;
    };

    // Sleep Data
    const sleepData = last7Days.map(day => {
      const entry = fitnessData.sleepHistory?.find(e => e.date === day.dateStr);
      return entry ? entry.duration : 0;
    });

    // Workouts Data (Monthly/Weekly) - Simplified to Weekly count for now
    const getWeekNumber = (d: Date) => {
      d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
      d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
      const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
      return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
    };

    const currentWeek = getWeekNumber(new Date());
    const last4Weeks = [currentWeek - 3, currentWeek - 2, currentWeek - 1, currentWeek];
    
    const workoutsByWeek = last4Weeks.map(week => {
       return fitnessData.workouts.filter(w => {
         const wDate = new Date(w.date);
         return getWeekNumber(wDate) === week;
       }).length;
    });

    // Weekly Steps (Activity)
    const weeklySteps = last7Days.map(day => {
      const history = getHistoryForDate(day.dateStr);
      return history ? history.steps : 0;
    });

    // Trends (Calories vs Burned - simulated 'burned' as calories for now or random var)
    // Let's show Calories Consumed vs Goal for last 7 days
    const caloriesTrend = last7Days.map(day => {
      const history = getHistoryForDate(day.dateStr);
      return history ? history.calories : 0;
    });

    return {
      daily: {
        // Hourly breakdown is not tracked, so we'll show a simple "Today vs Goal" progress as a bar
        // Or we can just mock the hourly distribution based on current total?
        // Let's stick to a simple distribution for visual appeal, scaled to current total.
        labels: ['6AM', '9AM', '12PM', '3PM', '6PM', '9PM'],
        datasets: [
          {
            label: 'Calories Burned (Est)',
            // Distribute current calories roughly across the day
            data: [
              fitnessData.calories * 0.1, 
              fitnessData.calories * 0.2, 
              fitnessData.calories * 0.3, 
              fitnessData.calories * 0.2, 
              fitnessData.calories * 0.15, 
              fitnessData.calories * 0.05
            ],
            borderColor: 'hsl(var(--sunset-orange))',
            backgroundColor: 'hsl(var(--sunset-orange))',
            borderWidth: 1,
          }
        ]
      },
      weekly: {
        labels: last7Days.map(d => d.label),
        datasets: [
          {
            label: 'Steps',
            data: weeklySteps,
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
            data: workoutsByWeek,
            borderColor: 'hsl(var(--highlight-blue))',
            backgroundColor: 'hsl(var(--highlight-blue))',
            borderWidth: 1,
          }
        ]
      },
      sleepQuality: {
        labels: last7Days.map(d => d.label),
        datasets: [
          {
            label: 'Sleep Hours',
            data: sleepData,
            borderColor: 'hsl(var(--red-violet))',
            backgroundColor: 'hsl(var(--red-violet))',
            borderWidth: 1,
          }
        ]
      },
      trends: {
        labels: last7Days.map(d => d.label),
        datasets: [
          {
            label: 'Daily Calories',
            data: caloriesTrend,
            backgroundColor: 'hsl(var(--sunset-orange))',
            borderColor: 'hsl(var(--sunset-orange))',
            borderWidth: 1,
          }
        ]
      }
    };
  }, [fitnessData]);
  
  // State for chart time period
  const [selectedTimeframe, setSelectedTimeframe] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [selectedChart, setSelectedChart] = useState<'overview' | 'sleep' | 'trends'>('overview');
  const [currentMood, setCurrentMood] = useState('good');
  const [weeklyMood, setWeeklyMood] = useState(['good', 'excellent', 'neutral', 'good', 'excellent', 'stressed', 'good']);
  const [showFullLeaderboard, setShowFullLeaderboard] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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



  const handleAddSteps = async () => {
    console.log('🔍 DEBUG: Dashboard - Add steps feedback');
  };

  const handleAddWater = async () => {
    console.log('🔍 DEBUG: Dashboard - Add water feedback');
  };

  const handleLogMeal = () => {
    console.log('🔍 DEBUG: Dashboard - Log meal feedback');
  };

  const handleLogSleep = () => {
    console.log('🔍 DEBUG: Dashboard - Log sleep feedback');
  };

  const getCurrentChartData = () => {
    switch (selectedTimeframe) {
      case 'daily':
        return chartData.daily;
      case 'weekly':
        return chartData.weekly;
      case 'monthly':
        return chartData.monthly;
      default:
        return chartData.daily;
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
            <p className="text-body-text text-muted-foreground">Loading your fitness data...</p>
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
                    <h1 className="text-page-heading text-foreground mb-2">
                      {getGreeting()}, {user?.firstName || 'Fitness Warrior'}! 💪
                    </h1>
                    <p className="text-body-text text-muted-foreground">
                      Ready to crush your fitness goals today?
                    </p>
                    <p className="text-number-label text-muted-foreground/80 mt-3">
                      Last Reset: {getLastResetTime()}
                    </p>
                  </div>
                  <div className="text-primary-number">🏆</div>
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
                  current={Math.round(fitnessData.water / 250)}
                  target={Math.round(goals.water / 250)}
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
                      <CardTitle className="text-card-title uppercase flex items-center space-x-3">
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
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="sleep">Sleep</TabsTrigger>
                        <TabsTrigger value="trends">Trends</TabsTrigger>
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
                        <h3 className="text-card-title uppercase text-success mb-3">
                          Tomorrow's Goal
                        </h3>
                        <p className="text-success/90 text-body-text">
                          Aim for 2.5 L water and 2100 calories burned
                        </p>
                      </div>
                      <TargetIcon className="h-10 w-10 text-success" />
                    </div>
                    <div className="mt-6">
                      <Progress value={65} className="h-3 progress-bar" />
                      <div className="flex justify-between mt-2">
                        <span className="text-number-label text-success/80">65% progress</span>
                        <span className="text-number-label text-success/80">+15% from yesterday</span>
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
                        <CardTitle className="text-card-title uppercase flex items-center space-x-3">
                          <Zap className="h-6 w-6 text-primary" />
                          <span>XP Progress & Rewards</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-5">
                        <div className="text-center">
                          <div className="text-primary-number text-primary mb-2 leading-none">
                            +120 XP
                          </div>
                          <div className="text-number-label text-muted-foreground">
                            earned today
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-body-text mb-1">Day 4 of 7</div>
                          <div className="text-number-label text-muted-foreground">
                            streak • keep going!
                          </div>
                        </div>
                        <div className="flex justify-center">
                          <div className="relative">
                            <div className="w-20 h-20 rounded-full border-4 border-primary/20 flex items-center justify-center">
                              <Crown className="h-8 w-8 text-primary" />
                            </div>
                            <div className="absolute -top-2 -right-2">
                              <Badge className="bg-primary text-primary-foreground text-number-label">
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
                        <CardTitle className="text-card-title uppercase flex items-center space-x-3">
                          <Users className="h-6 w-6 text-primary" />
                          <span>Community Stats</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-5">
                        <div className="text-center">
                          <div className="text-primary-number text-primary mb-2 leading-none">
                            #{communityStats.rank}
                          </div>
                          <div className="text-number-label text-muted-foreground">
                            Top 8% globally
                          </div>
                        </div>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-body-text">Total Users</span>
                            <span className="text-body-text">
                              {communityStats.totalUsers.toLocaleString()}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-body-text">Your Age Group</span>
                            <span className="text-body-text">
                              {communityStats.ageGroup}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-body-text">Active Today</span>
                            <span className="text-body-text">
                              3,842
                            </span>
                          </div>
                        </div>
                        <div className="text-center pt-3">
                          <Badge variant="secondary" className="text-number-label px-4 py-1.5">
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
                      <CardTitle className="text-card-title uppercase flex items-center space-x-3">
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
                                    <AvatarFallback className="text-card-title">
                                      {entry.avatar}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                                    <span className="text-number-label font-bold text-primary-foreground">
                                      {index + 1}
                                    </span>
                                  </div>
                                </div>
                                <div>
                                  <div className="text-body-text">
                          {entry.name}
                        </div>
                                  <div className="text-number-label text-muted-foreground">
                                    {entry.xp.toLocaleString()} XP
                                  </div>
                                </div>
                              </div>
                              <div className="flex space-x-1">
                                {entry.status.map((status, idx) => (
                                  <span key={idx} className="text-body-text">{status}</span>
                                ))}
                              </div>
                            </div>
                          ))}
                          <Button 
                            variant="outline" 
                            className="w-full mt-4 btn-secondary text-card-title"
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
                                  <div className="text-page-heading">{entry.badge}</div>
                                  <Avatar className="h-8 w-8">
                                    <AvatarFallback className="text-card-title">
                                      {entry.avatar}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <div className="font-medium text-body-text">
                                      {entry.name}
                                    </div>
                                    <div className="text-number-label text-muted-foreground">
                                      {entry.xp.toLocaleString()} XP
                                    </div>
                                  </div>
                                </div>
                                <div className="text-body-text font-medium">
                                  #{index + 1}
                                </div>
                              </div>
                            ))}
                          </div>
                          <Button 
                            variant="outline" 
                            className="w-full mt-4 btn-secondary text-card-title"
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


