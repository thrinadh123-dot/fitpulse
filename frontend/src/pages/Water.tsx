import { useState } from "react";
import { Droplet, ChevronDown, ChevronUp, Bell, TrendingUp, Flame, Clock, Edit2, Dumbbell, Zap, Heart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useLocalStorage } from "@/hooks/useLocalStorage";

interface WaterEntry {
  time: string;
  amount: number;
}

const Water = () => {
  const [waterEntries, setWaterEntries] = useLocalStorage<WaterEntry[]>('waterEntries', []);
  const [dailyGoal, setDailyGoal] = useLocalStorage<number>('waterGoal', 12);
  const [remindersEnabled, setRemindersEnabled] = useLocalStorage<boolean>('waterReminders', true);
  const [autoAdjustEnabled, setAutoAdjustEnabled] = useLocalStorage<boolean>('autoAdjustGoal', false);
  const [isHistoryCollapsed, setIsHistoryCollapsed] = useState(true);

  const today = new Date().toDateString();
  const todayEntries = waterEntries.filter(entry => 
    new Date(entry.time).toDateString() === today
  );

  const totalMl = todayEntries.reduce((sum, entry) => sum + entry.amount, 0);
  const totalLiters = (totalMl / 1000).toFixed(1);
  const goalMl = 3000;
  const goalLiters = (goalMl / 1000).toFixed(1);
  const percentage = Math.min((totalMl / goalMl) * 100, 100);
  
  const weeklyAverage = 0.0;
  const streak = 1;
  const lastDrink = "2h ago";
  
  const addWater = (amount: number) => {
    const newEntry: WaterEntry = {
      time: new Date().toISOString(),
      amount
    };
    setWaterEntries(prev => [...prev, newEntry]);
  };

  const quickAdd = (amount: number) => {
    addWater(amount);
  };

  return (
    <div className="space-y-4 p-4">
      {/* Page Title - Already Correct */}
      <div className="mb-4">
        <h1 className="text-3xl font-bold text-foreground">Water Tracker</h1>
        <p className="text-sm text-muted-foreground mt-1">Stay hydrated throughout the day</p>
      </div>

      {/* Top Section - 3-Column Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr_280px] gap-8 items-start">

  {/* LEFT — Progress Circle */}
  <div className="flex justify-center">
    <div className="relative w-56 h-56">
      
      {/* Background ring */}
      <div className="absolute inset-0 rounded-full bg-muted/40" />

      {/* Progress fill */}
      <div
        className="absolute inset-0 rounded-full bg-gradient-to-t from-blue-600 via-blue-500 to-cyan-400 transition-all duration-700 ease-out"
        style={{
          clipPath: `inset(${100 - Math.min(percentage, 100)}% 0 0 0)`,
          transform: 'rotate(180deg)'
        }}
      />

      {/* Glow */}
      <div className="absolute inset-0 rounded-full blur-xl bg-blue-500/20" />

      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <div className="text-4xl font-bold text-foreground tracking-tight">
          {totalLiters}L
        </div>
        <div className="text-xs uppercase tracking-wide text-muted-foreground mt-2">
          Today’s Intake
        </div>
        <div className="text-2xl font-semibold text-primary mt-1">
          {Math.round(percentage)}%
        </div>
      </div>
    </div>
  </div>

  {/* RIGHT — Info + Actions */}
  <div className="flex flex-col space-y-6">

    {/* Stats */}
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-foreground">
        Water Intake
      </h3>

      <div className="grid grid-cols-2 gap-4 text-sm">
        <div className="p-3 rounded-lg bg-muted/40">
          <div className="text-muted-foreground">Daily Goal</div>
          <div className="font-medium text-foreground">{goalLiters}L</div>
        </div>

        <div className="p-3 rounded-lg bg-muted/40">
          <div className="text-muted-foreground">Current</div>
          <div className="font-medium text-foreground">{totalLiters}L</div>
        </div>
      </div>

      {/* Remaining / Success */}
      {percentage >= 100 ? (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-primary/10 text-primary text-sm">
          🎉 Goal achieved! Excellent hydration today.
        </div>
      ) : (
        <div className="text-sm text-muted-foreground">
          {Math.round((goalMl - totalMl) / 100) / 10}L remaining
        </div>
      )}

      {/* Linear progress (secondary feedback) */}
      <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-700"
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
    </div>

    {/* Quick Add */}
    <div className="space-y-3">
      <div className="text-sm font-medium text-foreground">Quick Add</div>

      <div className="grid grid-cols-2 gap-4">
        <Button
          className="bg-gradient-primary hover:scale-[1.02] active:scale-95 transition-all"
          onClick={() => quickAdd(250)}
        >
          +250 ml
        </Button>

        <Button
          className="bg-gradient-primary hover:scale-[1.02] active:scale-95 transition-all"
          onClick={() => quickAdd(500)}
        >
          +500 ml
        </Button>
      </div>
    </div>
  </div>


        {/* RIGHT STACK - Two Small Cards */}
        <div className="flex flex-col gap-4">
          {/* TOP RIGHT CARD - Quick Add */}
          <Card className="bg-gradient-card">
            <CardContent className="p-4">
              <h3 className="text-lg font-semibold text-foreground mb-4">Custom Amount</h3>
              <div className="grid grid-cols-4 gap-3">
                {[
                  { label: "Small Glass", amount: 300, emoji: "🥤" },
                  { label: "Large Glass", amount: 350, emoji: "🍶" },
                  { label: "Bottle", amount: 500, emoji: "💧" },
                  { label: "Big Bottle", amount: 750, emoji: "🚰" },
                ].map((item) => (
                  <button
                    key={item.label}
                    className="flex flex-col items-center p-3 rounded-lg border border-muted hover:bg-accent/50 transition-all"
                    onClick={() => quickAdd(item.amount)}
                  >
                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center mb-2 text-lg">
                      {item.emoji}
                    </div>
                    <p className="text-xs text-foreground">{item.label}</p>
                    <p className="text-xs text-muted-foreground mt-1">{item.amount}ml</p>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* BOTTOM RIGHT CARD - Secondary Feature */}
          <Card className="bg-gradient-card">
            <CardContent className="p-4">
              <h3 className="text-lg font-semibold text-foreground mb-4">Workout Intensity</h3>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: "Light", emoji: "🚶", desc: "Low sweat" },
                  { label: "Medium", emoji: "🏃", desc: "Moderate" },
                  { label: "Interval", emoji: "⚡", desc: "High intensity" },
                ].map((item) => (
                  <button
                    key={item.label}
                    className="flex flex-col items-center p-3 rounded-lg border border-muted hover:bg-accent/50 transition-all"
                    onClick={() => {}}
                  >
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center mb-2 text-lg">
                      {item.emoji}
                    </div>
                    <p className="text-xs text-foreground">{item.label}</p>
                    <p className="text-xs text-muted-foreground mt-1">{item.desc}</p>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Weekly Average */}
        <Card className="bg-gradient-card">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2 mb-3">
              <TrendingUp className="w-4 h-4 text-muted-foreground" />
              <p className="text-sm font-medium text-foreground">Weekly Average</p>
            </div>
            <p className="text-2xl font-semibold text-foreground mb-1">{weeklyAverage.toFixed(1)}L</p>
            <p className="text-xs text-muted-foreground">Last 7 days</p>
          </CardContent>
        </Card>

        {/* Current Streak */}
        <Card className="bg-gradient-card">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2 mb-3">
              <Flame className="w-4 h-4 text-muted-foreground" />
              <p className="text-sm font-medium text-foreground">Current Streak</p>
            </div>
            <p className="text-2xl font-semibold text-foreground mb-1">{streak} day</p>
            <p className="text-xs text-muted-foreground">Keep it up</p>
          </CardContent>
        </Card>

        {/* Last Drink */}
        <Card className="bg-gradient-card">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2 mb-3">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <p className="text-sm font-medium text-foreground">Last Drink</p>
            </div>
            <p className="text-2xl font-semibold text-foreground mb-1">{lastDrink}</p>
            <p className="text-xs text-muted-foreground">Time since last</p>
          </CardContent>
        </Card>
      </div>

      {/* Hydration Settings Card */}
      <Card className="bg-gradient-card">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-foreground">Hydration Settings</h3>
          </div>
          
          <div className="space-y-6">
            {/* Enable Notifications */}
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-foreground">Enable Notifications</p>
                <p className="text-xs text-muted-foreground">Get hydration reminders</p>
              </div>
              <Switch 
                checked={remindersEnabled}
                onCheckedChange={setRemindersEnabled}
              />
            </div>

            {/* Auto Goal Adjustment */}
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-foreground">Auto Goal Adjustment</p>
                <p className="text-xs text-muted-foreground">Adjust goal based on activity</p>
              </div>
              <Switch 
                checked={autoAdjustEnabled}
                onCheckedChange={setAutoAdjustEnabled}
              />
            </div>

            {/* Daily Water Goal */}
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-foreground">Daily Water Goal</p>
                <p className="text-xs text-muted-foreground">Set your daily hydration target</p>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-foreground">{goalLiters}L</span>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Edit2 className="w-3 h-3" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Today's History Card */}
      <Card className="bg-gradient-card">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">Today's History</h3>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 w-8 p-0"
              onClick={() => setIsHistoryCollapsed(!isHistoryCollapsed)}
            >
              {isHistoryCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
            </Button>
          </div>

          {!isHistoryCollapsed && (
            <div className="space-y-3">
              {todayEntries.length === 0 ? (
                <div className="text-center py-6">
                  <p className="text-sm text-muted-foreground">No water logged today</p>
                </div>
              ) : (
                todayEntries.map((entry, index) => (
                  <div 
                    key={index}
                    className="flex items-center justify-between py-3 border-b border-muted last:border-0"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                        <Droplet className="w-3 h-3 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{entry.amount}ml</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <p className="text-xs text-muted-foreground">
                        {new Date(entry.time).toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </p>
                      <p className="text-xs text-muted-foreground">Glass {index + 1}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Water;