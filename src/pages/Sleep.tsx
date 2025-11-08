// SleepVisualizer.tsx
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SleepLogForm } from "@/components/SleepLogForm";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Moon,
  BarChart3,
  LayoutGrid,
  Clock,
  Sunrise,
  Sunset,
  Brain,
  TrendingUp,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Plus,
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

// Storage key for sleep logs
const SLEEP_LOGS_STORAGE_KEY = "fitpulse_sleep_logs";
const MONTHLY_SLEEP_STORAGE_KEY = "fitpulse_monthly_sleep";

// Days of week in order
const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

// Helper to get today's weekday
const getTodayWeekday = (): string => {
  return new Date().toLocaleDateString("en-US", { weekday: "long" });
};

// Helper to get days up to today (optional - for filtering future days)
const getDaysUpToToday = (): string[] => {
  const today = new Date();
  const todayIndex = today.getDay(); // 0=Sunday, 1=Monday, etc.
  // Convert to Monday=0 format
  const mondayIndex = todayIndex === 0 ? 6 : todayIndex - 1;
  return daysOfWeek.slice(0, mondayIndex + 1);
};

// Load monthly sleep data from localStorage
function loadMonthlySleepData(): Record<string, { duration: number; quality: string }> {
  try {
    const stored = localStorage.getItem(MONTHLY_SLEEP_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error("Error loading monthly sleep data:", error);
  }
  return {};
}

// Save monthly sleep data to localStorage
function saveMonthlySleepData(data: Record<string, { duration: number; quality: string }>) {
  try {
    localStorage.setItem(MONTHLY_SLEEP_STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error("Error saving monthly sleep data:", error);
  }
}

const qualityColors = {
  Excellent: { bg: "bg-green-500/20", text: "text-green-500", border: "border-green-500/30", fill: "bg-green-500", emoji: "😴" },
  Good: { bg: "bg-blue-500/20", text: "text-blue-500", border: "border-blue-500/30", fill: "bg-blue-500", emoji: "😊" },
  Average: { bg: "bg-yellow-500/20", text: "text-yellow-500", border: "border-yellow-500/30", fill: "bg-yellow-500", emoji: "😐" },
  Poor: { bg: "bg-red-500/20", text: "text-red-500", border: "border-red-500/30", fill: "bg-red-500", emoji: "😴" },
};

// Helper to calculate analytics 🧠
function calculateAnalytics(data: any[], monthlyData?: Record<string, { duration: number; quality: string }>) {
  if (!data.length) return null;

  const durations = data.map(d => d.duration);
  const avgNum = durations.reduce((a, b) => a + b, 0) / durations.length;
  const avg = avgNum.toFixed(1);
  const best = data.reduce((a, b) => (a.duration > b.duration ? a : b));
  const worst = data.reduce((a, b) => (a.duration < b.duration ? a : b));

  // Calculate previous week average from monthly data
  let lastWeekAvg = 7.0; // default fallback
  if (monthlyData) {
    const today = new Date();
    const lastWeekStart = new Date(today);
    lastWeekStart.setDate(today.getDate() - 14); // 2 weeks ago (start of previous week)
    const lastWeekEnd = new Date(today);
    lastWeekEnd.setDate(today.getDate() - 8); // 1 week ago (end of previous week)

    const previousWeekDurations: number[] = [];
    for (let d = new Date(lastWeekStart); d <= lastWeekEnd; d.setDate(d.getDate() + 1)) {
      const dateKey = d.toISOString().split('T')[0];
      if (monthlyData[dateKey]) {
        previousWeekDurations.push(monthlyData[dateKey].duration);
      }
    }

    if (previousWeekDurations.length > 0) {
      lastWeekAvg = previousWeekDurations.reduce((a, b) => a + b, 0) / previousWeekDurations.length;
    }
  }

  const trendNum = avgNum - lastWeekAvg;
  const trend = Math.abs(trendNum).toFixed(1);
  const isImproving = trendNum > 0;
  const consistency = Math.max(0, 100 - (Math.sqrt(
    durations.map(d => (d - avgNum) ** 2).reduce((a, b) => a + b, 0) / durations.length
  ) * 10)).toFixed(0);

  // Generate AI Tip
  const generateAITip = (): string => {
    if (trendNum > 1.0) {
      return `Your average sleep improved by ${trend} hours this week — great consistency! 🌟`;
    } else if (trendNum > 0.3) {
      return `Your sleep improved by ${trend} hours this week. Keep up the good routine! 💪`;
    } else if (trendNum < -1.0) {
      return `Your sleep decreased by ${trend} hours this week. Try to maintain a consistent bedtime. 😴`;
    } else if (trendNum < -0.3) {
      return `Your sleep decreased by ${trend} hours this week. Consider going to bed earlier. 🌙`;
    } else if (avgNum >= 8) {
      return `Excellent! You're averaging ${avg} hours of sleep. Maintain this healthy routine! ⭐`;
    } else if (avgNum >= 7) {
      return `Good sleep average of ${avg} hours. Aim for 8+ hours for optimal rest. 💤`;
    } else if (avgNum >= 6) {
      return `Your average is ${avg} hours. Try to get 7-8 hours for better recovery. 🎯`;
    } else {
      return `Your average is ${avg} hours. Prioritize getting at least 7 hours of sleep. ⚠️`;
    }
  };

  return { 
    avg, 
    avgNum,
    best, 
    worst, 
    trend, 
    trendNum, 
    isImproving,
    consistency,
    lastWeekAvg,
    aiTip: generateAITip()
  };
}

// 🧠 Smart Analytics Summary Component
const SmartAnalyticsSummary = ({ 
  data, 
  monthlyData 
}: { 
  data: any[];
  monthlyData?: Record<string, { duration: number; quality: string }>;
}) => {
  const analytics = calculateAnalytics(data, monthlyData);
  if (!analytics) return null;

  const statItems = [
    {
      icon: "💤",
      label: "Average Duration",
      value: `${analytics.avg} hrs`,
      delay: 0.1,
    },
    {
      icon: "⭐",
      label: "Best Day",
      value: `${analytics.best.day}`,
      subValue: `${analytics.best.duration}h`,
      delay: 0.2,
    },
    {
      icon: "⚡",
      label: "Worst Day",
      value: `${analytics.worst.day}`,
      subValue: `${analytics.worst.duration}h`,
      delay: 0.3,
    },
    {
      icon: "📈",
      label: "Weekly Trend",
      value: analytics.isImproving ? "Improving" : "Dropping",
      subValue: `${analytics.isImproving ? "+" : "-"}${analytics.trend}h`,
      isPositive: analytics.isImproving,
      delay: 0.4,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mt-6 border border-border rounded-xl p-6 bg-card/50 backdrop-blur-sm shadow-lg"
    >
      <motion.div 
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
        className="flex items-center gap-2 mb-6"
      >
        <Brain className="w-6 h-6 text-primary" />
        <h2 className="text-xl font-semibold">Smart Analytics Summary</h2>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {statItems.map((item, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: item.delay, duration: 0.3 }}
            className="flex flex-col p-3 rounded-lg bg-background/50 border border-border/50"
          >
            <span className="text-sm text-muted-foreground mb-1">{item.icon} {item.label}</span>
            <span className={`text-lg font-bold ${item.isPositive !== undefined ? (item.isPositive ? "text-green-500" : "text-red-500") : "text-foreground"}`}>
              {item.value}
            </span>
            {item.subValue && (
              <span className="text-xs text-muted-foreground mt-0.5">{item.subValue}</span>
            )}
          </motion.div>
        ))}
      </div>

      {/* AI Tip Section */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.4 }}
        className="p-4 rounded-lg bg-primary/10 border border-primary/20"
      >
        <div className="flex items-start gap-3">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.6, type: "spring", stiffness: 200 }}
            className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center"
          >
            <span className="text-lg">💡</span>
          </motion.div>
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-foreground mb-1">AI Tip</h3>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="text-sm text-muted-foreground leading-relaxed"
            >
              {analytics.aiTip}
            </motion.p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// 📊 Bar Chart View Component - Horizontal Bars with Quality Indicators
const BarChartView = ({ data }: { data: any[] }) => {
  const loggedData = data.filter(d => d.duration !== undefined);
  const maxDuration = loggedData.length > 0 
    ? Math.max(...loggedData.map(d => d.duration), 10) 
    : 10;

  // Quality Legend
  const qualityLegend = [
    { label: "Excellent", color: qualityColors.Excellent },
    { label: "Good", color: qualityColors.Good },
    { label: "Average", color: qualityColors.Average },
    { label: "Poor", color: qualityColors.Poor },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <BarChart3 className="w-5 h-5" />
          Sleep Duration Chart
        </h3>
        {/* Quality Legend */}
        <div className="flex items-center gap-4 flex-wrap">
          <span className="text-xs text-muted-foreground font-medium">Quality:</span>
          {qualityLegend.map((item) => (
            <div key={item.label} className="flex items-center gap-1.5">
              <div className={`w-3 h-3 rounded-full ${item.color.fill}`} />
              <span className="text-xs text-muted-foreground">{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {daysOfWeek.map((day, idx) => {
          const entry = data.find((d) => d.day === day);
          
          // If no data exists, render a blank "No Entry Yet" card
          if (!entry || entry.duration === undefined) {
            return (
              <motion.div
                key={day}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.1 }}
                className="flex items-center justify-between py-3 border-b border-border/20 text-muted-foreground"
              >
                <span className="font-semibold w-32">{day}</span>
                <span className="italic text-sm">No entry yet</span>
              </motion.div>
            );
          }

          // Otherwise, render normal chart bar
          const colors = qualityColors[entry.quality as keyof typeof qualityColors] || qualityColors.Average;
          const barWidth = (entry.duration / maxDuration) * 100;
          
          return (
            <motion.div
              key={day}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.1 }}
              className="space-y-2"
            >
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-3 min-w-[120px]">
                  <span className="font-semibold text-foreground">{entry.day}</span>
                  <Badge className={`${colors.bg} ${colors.text} ${colors.border} text-xs px-2 py-0.5`}>
                    {entry.quality}
                  </Badge>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-muted-foreground">{entry.bedtime}</span>
                  <span className="text-muted-foreground">→</span>
                  <span className="text-muted-foreground">{entry.wakeup}</span>
                  <span className="font-bold text-foreground min-w-[50px] text-right">
                    {entry.duration}h
                  </span>
                </div>
              </div>
              
              {/* Horizontal Bar */}
              <div className="relative h-8 bg-muted rounded-lg overflow-hidden border border-border/50">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${barWidth}%` }}
                  transition={{ 
                    duration: 0.6, 
                    delay: idx * 0.1,
                    ease: "easeOut"
                  }}
                  className={`h-full ${colors.fill} rounded-lg relative flex items-center justify-end pr-3`}
                >
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: idx * 0.1 + 0.4 }}
                    className="text-xs font-semibold text-white drop-shadow-sm"
                  >
                    {entry.duration}h
                  </motion.span>
                </motion.div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

// ⏰ Timeline View Component
const TimelineView = ({ data }: { data: any[] }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold flex items-center gap-2">
        <Clock className="w-5 h-5" />
        Sleep Timeline
      </h3>
      <div className="space-y-4">
        {daysOfWeek.map((day, idx) => {
          const entry = data.find((d) => d.day === day);
          
          // If no data exists, render a blank "No Entry Yet" card
          if (!entry || entry.duration === undefined) {
            return (
              <motion.div
                key={day}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="flex items-center gap-4 p-3 rounded-lg border border-border/30 bg-muted/20"
              >
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-muted-foreground">{day}</span>
                    <span className="text-xs italic text-muted-foreground">No entry yet</span>
                  </div>
                </div>
              </motion.div>
            );
          }

          const colors = qualityColors[entry.quality as keyof typeof qualityColors] || qualityColors.Average;
          return (
            <motion.div
              key={day}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="flex items-center gap-4 p-3 rounded-lg border border-border bg-card/50"
            >
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold">{entry.day}</span>
                  <Badge className={colors.bg + " " + colors.text + " " + colors.border}>
                    {entry.quality}
                  </Badge>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Sunset className="w-4 h-4" />
                    <span>{entry.bedtime}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Sunrise className="w-4 h-4" />
                    <span>{entry.wakeup}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{entry.duration}h</span>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

// 📅 Monthly Calendar View Component
const MonthlyCalendarView = ({ monthlyData }: { monthlyData: Record<string, { duration: number; quality: string }> }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const month = currentDate.getMonth();
  const year = currentDate.getFullYear();

  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const daysInMonth = lastDayOfMonth.getDate();
  const startingDayOfWeek = firstDayOfMonth.getDay();

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === "prev") {
        newDate.setMonth(month - 1);
      } else {
        newDate.setMonth(month + 1);
      }
      return newDate;
    });
  };

  const getDateKey = (day: number) => {
    const date = new Date(year, month, day);
    return date.toISOString().split('T')[0];
  };

  const getDayData = (day: number) => {
    const dateKey = getDateKey(day);
    return monthlyData[dateKey] || null;
  };

  // Generate calendar grid
  const calendarDays: (number | null)[] = [];
  // Add empty cells for days before the first day of the month
  for (let i = 0; i < startingDayOfWeek; i++) {
    calendarDays.push(null);
  }
  // Add all days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          Monthly Sleep Calendar
        </h3>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigateMonth("prev")}
            className="h-8 w-8 p-0"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <span className="text-sm font-medium min-w-[140px] text-center">
            {monthNames[month]} {year}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigateMonth("next")}
            className="h-8 w-8 p-0"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="border border-border rounded-lg p-4 bg-card/50">
        {/* Week day headers */}
        <div className="grid grid-cols-7 gap-2 mb-2">
          {weekDays.map((day) => (
            <div key={day} className="text-center text-xs font-semibold text-muted-foreground py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-2">
          {calendarDays.map((day, idx) => {
            if (day === null) {
              return <div key={idx} className="aspect-square" />;
            }

            const dayData = getDayData(day);
            const colors = dayData
              ? qualityColors[dayData.quality as keyof typeof qualityColors] || qualityColors.Average
              : null;
            const isToday = 
              day === new Date().getDate() &&
              month === new Date().getMonth() &&
              year === new Date().getFullYear();

            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.01 }}
                className={`
                  aspect-square p-2 rounded-lg border transition-all
                  ${dayData 
                    ? `${colors?.border} ${colors?.bg} cursor-pointer hover:shadow-md` 
                    : 'border-border/50 bg-muted/30'
                  }
                  ${isToday ? 'ring-2 ring-primary ring-offset-2' : ''}
                `}
              >
                <div className="flex flex-col h-full">
                  <div className="flex items-center justify-between mb-1">
                    <div className={`text-xs font-semibold ${isToday ? 'text-primary' : 'text-foreground'}`}>
                      {day}
                    </div>
                    {dayData && (
                      <span className="text-xs" title={dayData.quality}>
                        {colors?.emoji}
                      </span>
                    )}
                  </div>
                  {dayData && (
                    <div className="flex-1 flex flex-col justify-center items-center gap-0.5">
                      <div className={`text-base font-bold ${colors?.text}`}>
                        {dayData.duration}h
                      </div>
                      <div className={`text-[9px] ${colors?.text} opacity-70 font-medium`}>
                        {dayData.quality}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// 🎴 Card Grid View Component with Weekly/Monthly Tabs
const CardGridView = ({ 
  data, 
  monthlyData 
}: { 
  data: any[];
  monthlyData: Record<string, { duration: number; quality: string }>;
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold flex items-center gap-2">
        <LayoutGrid className="w-5 h-5" />
        Sleep Overview
      </h3>
      
      <Tabs defaultValue="weekly" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="weekly" className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Weekly View
          </TabsTrigger>
          <TabsTrigger value="monthly" className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Monthly View
          </TabsTrigger>
        </TabsList>

        <TabsContent value="weekly" className="mt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-7 gap-4">
            {daysOfWeek.map((day, idx) => {
              const entry = data.find((d) => d.day === day);
              
              // If no data exists, render a blank "No Entry Yet" card
              if (!entry || entry.duration === undefined) {
                return (
                  <motion.div
                    key={day}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.1 }}
                    className="p-4 rounded-lg border border-border/30 bg-muted/20 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-muted-foreground">{day}</span>
                    </div>
                    <div className="text-center py-4">
                      <span className="text-sm italic text-muted-foreground">No entry yet</span>
                    </div>
                  </motion.div>
                );
              }

              const colors = qualityColors[entry.quality as keyof typeof qualityColors] || qualityColors.Average;
              return (
                <motion.div
                  key={day}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.1 }}
                  className={`p-4 rounded-lg border ${colors.border} ${colors.bg} space-y-3 hover:shadow-md transition-shadow`}
                >
                  {/* Day and Quality Badge */}
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-foreground">{entry.day}</span>
                    <Badge className={`${colors.text} ${colors.bg} ${colors.border} text-xs px-2 py-0.5`}>
                      {entry.quality}
                    </Badge>
                  </div>
                  
                  {/* Total Duration */}
                  <div className={`text-3xl font-bold ${colors.text}`}>
                    {entry.duration}h
                  </div>
                  
                  {/* Bedtime and Wake Time */}
                  <div className="space-y-2 pt-2 border-t border-border/50">
                    <div className="flex items-center gap-2 text-xs">
                      <Sunset className="w-3.5 h-3.5 text-muted-foreground" />
                      <span className="text-muted-foreground">Bedtime:</span>
                      <span className="font-semibold text-foreground">{entry.bedtime}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <Sunrise className="w-3.5 h-3.5 text-muted-foreground" />
                      <span className="text-muted-foreground">Wake:</span>
                      <span className="font-semibold text-foreground">{entry.wakeup}</span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="monthly" className="mt-4">
          <MonthlyCalendarView monthlyData={monthlyData} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

// 🎯 Main Component
export default function SleepVisualizer() {
  const [view, setView] = useState<"bar" | "timeline" | "grid">("bar");
  const [sleepData, setSleepData] = useState<any[]>([]);
  const [monthlySleepData, setMonthlySleepData] = useState<Record<string, { duration: number; quality: string }>>({});
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentDay, setCurrentDay] = useState<string>("");

  // Load data from localStorage on mount
  useEffect(() => {
    const today = getTodayWeekday();
    setCurrentDay(today);

    // Retrieve saved logs from localStorage
    try {
      const storedData = localStorage.getItem(SLEEP_LOGS_STORAGE_KEY);
      if (storedData) {
        const parsed = JSON.parse(storedData);
        setSleepData(parsed);
      } else {
        // Initialize with empty entries for all days
        const emptyData = daysOfWeek.map(day => ({ day }));
        setSleepData(emptyData);
      }
    } catch (error) {
      console.error("Error loading sleep logs:", error);
      const emptyData = daysOfWeek.map(day => ({ day }));
      setSleepData(emptyData);
    }

    // Load monthly data
    const monthlyData = loadMonthlySleepData();
    setMonthlySleepData(monthlyData);
  }, []);

  const handleSleepLogSubmit = (entry: { date: string; bedtime: string; wakeTime: string; duration: number; quality: string }) => {
    const entryDate = new Date(entry.date);
    const newEntry = {
      day: entryDate.toLocaleDateString("en-US", { weekday: "long" }),
      duration: entry.duration,
      bedtime: entry.bedtime,
      wakeup: entry.wakeTime,
      quality: entry.quality,
    };

    // Update weekly data
    setSleepData(prev => {
      const newData = [...prev];
      const existingIndex = newData.findIndex(item => item.day === newEntry.day);
      if (existingIndex !== -1) {
        newData[existingIndex] = newEntry;
      } else {
        newData.push(newEntry);
      }
      
      // Save to localStorage
      try {
        localStorage.setItem(SLEEP_LOGS_STORAGE_KEY, JSON.stringify(newData));
      } catch (error) {
        console.error("Error saving sleep logs:", error);
      }
      
      return newData;
    });

    // Update monthly data
    const dateKey = entryDate.toISOString().split('T')[0];
    setMonthlySleepData(prev => {
      const updated = {
        ...prev,
        [dateKey]: {
          duration: entry.duration,
          quality: entry.quality,
        },
      };
      saveMonthlySleepData(updated);
      return updated;
    });
  };

  return (
    <Card className="bg-card text-card-foreground border-border shadow-lg">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4">
        <div className="space-y-1">
          <CardTitle className="text-xl flex items-center gap-2">
            <Moon className="w-5 h-5 text-primary" />
            This Week's Sleep Pattern
          </CardTitle>
          <CardDescription className="text-sm">
            Track your sleep duration and quality across the week
          </CardDescription>
        </div>

        <div className="flex gap-2">
          <Button
            variant={view === "bar" ? "default" : "outline"}
            size="sm"
            onClick={() => setView("bar")}
            className="gap-2"
          >
            <BarChart3 className="w-4 h-4" />
            <span className="hidden sm:inline">Chart</span>
          </Button>
          <Button
            variant={view === "timeline" ? "default" : "outline"}
            size="sm"
            onClick={() => setView("timeline")}
            className="gap-2"
          >
            <Clock className="w-4 h-4" />
            <span className="hidden sm:inline">Timeline</span>
          </Button>
          <Button
            variant={view === "grid" ? "default" : "outline"}
            size="sm"
            onClick={() => setView("grid")}
            className="gap-2"
          >
            <LayoutGrid className="w-4 h-4" />
            <span className="hidden sm:inline">Cards</span>
          </Button>
        </div>
      </CardHeader>

      <CardContent className="pt-2">
        <AnimatePresence mode="wait">
          <motion.div
            key={view}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {view === "bar" && <BarChartView data={sleepData} />}
            {view === "timeline" && <TimelineView data={sleepData} />}
            {view === "grid" && <CardGridView data={sleepData} monthlyData={monthlySleepData} />}
          </motion.div>
        </AnimatePresence>

        {/* 🧠 Added Smart Analytics Summary */}
        <SmartAnalyticsSummary data={sleepData} monthlyData={monthlySleepData} />
      </CardContent>

      {/* 💤 Floating Log Sleep Button */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        className="fixed bottom-6 right-6 z-40"
      >
        <Button
          onClick={() => setIsFormOpen(true)}
          size="lg"
          className="h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-shadow"
        >
          <Plus className="h-6 w-6" />
          <span className="sr-only">Log Sleep</span>
        </Button>
      </motion.div>

      {/* 💤 Floating Side Modal Form */}
      <SleepLogForm 
        onSubmit={handleSleepLogSubmit} 
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
      />
    </Card>
  );
}
