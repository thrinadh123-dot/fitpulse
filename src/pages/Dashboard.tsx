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
        },
      },
      tooltip: {
        backgroundColor: 'hsl(var(--card))',
        titleColor: 'hsl(var(--foreground))',
        bodyColor: 'hsl(var(--foreground))',
        borderColor: 'hsl(var(--border))',
        borderWidth: 1,
      },
    },
    scales: {
      x: {
        ticks: {
          color: 'hsl(var(--muted-foreground))',
        },
        grid: {
          color: 'hsl(var(--border))',
        },
      },
      y: {
        ticks: {
          color: 'hsl(var(--muted-foreground))',
        },
        grid: {
          color: 'hsl(var(--border))',
        },
      },
    },
  };

// Daily Summary Tile Component with Dark Mode Support
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
          <h3 className="text-sm font-medium text-muted-foreground font-['Inter']">{title}</h3>
          <div className="p-2 rounded-full glow-pulse" style={{ backgroundColor: `${color}20` }}>
            <Icon className="h-4 w-4" style={{ color }} />
          </div>
        </div>
        <div className="mb-3">
          <div className="text-2xl font-bold text-foreground font-['Roboto Mono']">
            {current.toLocaleString()} / {target.toLocaleString()}
          </div>
          <div className="text-sm text-muted-foreground font-['Inter']">{unit}</div>
        </div>
        <div className="space-y-2">
          <Progress value={progress} className="h-2 progress-bar" style={{ '--progress-color': color } as React.CSSProperties} />
          <div className="text-xs text-muted-foreground font-['Inter']">
            {progress.toFixed(0)}% complete
          </div>
        </div>
      </CardContent>
    </Card>
  </motion.div>
);

// Mood Tracker Component with Dark Mode Support
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
        <CardTitle className="text-lg flex items-center space-x-2 font-['Bebas Neue']">
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
                  ? 'bg-secondary/20 border-2 border-secondary glow-pulse' 
                  : 'hover:bg-muted/50'
              }`}
            >
              <div className="text-2xl">{mood.emoji}</div>
              <div className="text-xs font-['Inter']">{mood.label}</div>
            </button>
          ))}
        </div>
        
        <div className="mt-4">
          <h4 className="text-sm font-medium font-['Inter'] mb-2">Weekly Mood</h4>
          <div className="flex justify-between">
            {weeklyMood.map((mood, index) => (
              <div key={index} className="text-center">
                <div className="text-lg">{getMoodEmoji(mood)}</div>
                <div className="text-xs text-muted-foreground font-['Inter']">{days[index]}</div>
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

  const handleAddSteps = () => {
    // QuickActions will call addSteps on the store directly. Keep toast feedback only.
    console.log('🔍 DEBUG: Dashboard - requested steps add');
    toast({
      title: "Steps Added!",
      description: "1000 steps requested. UI will update when synced.",
    });
  };

  const handleAddWater = () => {
    // QuickActions handles calling addWater on the store. Keep toast feedback only.
    console.log('🔍 DEBUG: Dashboard - requested water add');
    toast({
      title: "Water Added!",
      description: "1 cup requested. UI will update when synced.",
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
            <p className="text-muted-foreground">Loading your fitness data...</p>
          </div>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-10 gap-8">
            {/* Left Column: Main Content (70%) */}
            <div className="lg:col-span-7 space-y-8">
              {/* Greeting Banner */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
                className="bg-gradient-to-r from-primary/20 via-secondary/20 to-primary/20 rounded-2xl p-8 border border-primary/30 shadow-lg card-enhanced"
          >
            <div className="flex items-center justify-between">
              <div>
                    <h1 className="text-3xl font-bold text-foreground mb-2 font-['Bebas Neue']">
                      {getGreeting()}, {user?.firstName || 'Fitness Warrior'}! 💪
                </h1>
                    <p className="text-lg text-muted-foreground font-['Inter']">
                  Ready to crush your fitness goals today?
                </p>
                    <p className="text-sm text-muted-foreground mt-2 font-['Inter']">
                      Last Reset: {getLastResetTime()}
                </p>
              </div>
                  <div className="text-4xl glow-pulse">🏆</div>
            </div>
          </motion.div>

              {/* Daily Summary Tiles */}
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

              {/* Charts Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <Card className="shadow-lg border-0 bg-gradient-to-br from-card to-card/80 card-enhanced">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg flex items-center space-x-2 font-['Bebas Neue']">
                        <BarChart3 className="h-6 w-6 text-primary" />
                        <span>Progress Analytics</span>
                      </CardTitle>
                      <div className="flex items-center space-x-2">
                        <Select value={selectedTimeframe} onValueChange={(value: 'daily' | 'weekly' | 'monthly') => setSelectedTimeframe(value)}>
                          <SelectTrigger className="w-32">
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
                        <Line data={getCurrentChartData()} options={chartOptions} />
                      </TabsContent>
                      <TabsContent value="sleep" className="mt-6">
                        <Line data={chartData.sleepQuality} options={chartOptions} />
                      </TabsContent>
                      <TabsContent value="trends" className="mt-6">
                        <Bar data={chartData.trends} options={chartOptions} />
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
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-xl font-semibold text-success mb-2 font-['Bebas Neue']">Tomorrow's Goal</h3>
                        <p className="text-success/80 font-['Inter']">Aim for 2.5L water and 2100 calories</p>
                      </div>
                      <TargetIcon className="h-8 w-8 text-success glow-pulse" />
                    </div>
                    <div className="mt-4">
                      <Progress value={65} className="h-2 progress-bar" />
                    </div>
                  </CardContent>
                </Card>
                      </motion.div>
            </div>

            {/* Right Sidebar (30%) */}
            <div className="lg:col-span-3 space-y-6">
              {/* XP Progress & Rewards */}
                      <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                <Card className="shadow-lg border-0 bg-gradient-to-br from-card to-card/80 card-enhanced">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center space-x-2 font-['Bebas Neue']">
                      <Zap className="h-5 w-5 text-primary" />
                      <span>XP Progress & Rewards</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                                         <div className="text-center">
                       <div className="text-2xl font-bold text-primary mb-1 font-['Roboto Mono']">+120 XP</div>
                       <div className="text-sm text-muted-foreground font-['Inter']">earned today</div>
                     </div>
                     <div className="text-center">
                       <div className="text-lg font-semibold mb-1 font-['Inter']">Day 4 of 7</div>
                       <div className="text-sm text-muted-foreground font-['Inter']">streak</div>
                     </div>
                     <div className="text-center">
                       <div className="text-lg font-semibold mb-1 font-['Inter']">Intermediate</div>
                       <div className="text-sm text-muted-foreground font-['Inter']">badge level</div>
                     </div>
                    <div className="flex justify-center">
                      <div className="relative">
                        <div className="w-16 h-16 rounded-full border-4 border-primary/20 flex items-center justify-center glow-pulse">
                          <Crown className="h-6 w-6 text-primary" />
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

              {/* Quick Actions */}
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
                    <CardTitle className="text-lg flex items-center space-x-2 font-['Bebas Neue']">
                      <Users className="h-5 w-5 text-primary" />
                      <span>Community Stats</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary font-['Roboto Mono']">#{communityStats.rank}</div>
                      <div className="text-sm text-muted-foreground font-['Inter']">Top 8%</div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm font-['Inter']">Total Users</span>
                        <span className="text-sm font-medium font-['Roboto Mono']">{communityStats.totalUsers.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm font-['Inter']">Age Group</span>
                        <span className="text-sm font-medium font-['Inter']">{communityStats.ageGroup}</span>
                      </div>
                    </div>
                    <div className="text-center">
                      <Badge variant="secondary" className="text-sm font-['Inter']">
                        {communityStats.badge}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Leaderboard Preview */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.9 }}
              >
                <Card className="shadow-lg border-0 bg-gradient-to-br from-card to-card/80 card-enhanced">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center space-x-2 font-['Bebas Neue']">
                      <Trophy className="h-5 w-5 text-primary" />
                      <span>Leaderboard</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {!showFullLeaderboard ? (
                      <>
                        {leaderboardEntries.map((entry, index) => (
                          <div key={entry.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-all">
                            <div className="flex items-center space-x-3">
                              <Avatar className="h-8 w-8">
                                <AvatarFallback className="font-['Inter']">{entry.avatar}</AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium text-sm font-['Inter']">{entry.name}</div>
                                <div className="text-xs text-muted-foreground font-['Roboto Mono']">+{entry.xp} XP</div>
                              </div>
                            </div>
                            <div className="flex space-x-1">
                              {entry.status.map((status, idx) => (
                                <span key={idx} className="text-xs text-success font-['Inter']">{status}</span>
                              ))}
                            </div>
                          </div>
                        ))}
                        <Button 
                          variant="outline" 
                          className="w-full mt-4 btn-secondary"
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
                                  <AvatarFallback className="font-['Inter']">{entry.avatar}</AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="font-medium text-sm font-['Inter']">{entry.name}</div>
                                  <div className="text-xs text-muted-foreground font-['Roboto Mono']">{entry.xp} XP</div>
                                </div>
                              </div>
                              <div className="text-sm font-medium font-['Inter']">
                                #{index + 1}
                              </div>
                            </div>
                          ))}
                        </div>
                        <Button 
                          variant="outline" 
                          className="w-full mt-4 btn-secondary"
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
    </PageTransition>
  );
};

export default Dashboard; 