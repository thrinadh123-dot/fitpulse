import { Moon, Plus, Clock, TrendingUp, Bed } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { SleepEntryForm, ManualSleepEntryForm } from "@/components/TrackingForms";
import { useLocalStorage } from "@/hooks/useLocalStorage";

interface SleepEntry {
  date: string;
  bedtime: string;
  wakeTime: string;
  quality: string;
  duration: number;
}

const Sleep = () => {
  const [sleepEntries, setSleepEntries] = useLocalStorage<SleepEntry[]>('sleepEntries', []);
  const [sleepGoal] = useLocalStorage<number>('sleepGoal', 8);

  const addSleepEntry = (entry: { bedtime: string; wakeTime: string; quality: string }) => {
    const bedDateTime = new Date();
    const [bedHour, bedMin] = entry.bedtime.split(':').map(Number);
    bedDateTime.setHours(bedHour, bedMin, 0, 0);
    
    const wakeDateTime = new Date();
    const [wakeHour, wakeMin] = entry.wakeTime.split(':').map(Number);
    wakeDateTime.setHours(wakeHour, wakeMin, 0, 0);
    
    // If wake time is earlier than bed time, assume next day
    if (wakeDateTime < bedDateTime) {
      wakeDateTime.setDate(wakeDateTime.getDate() + 1);
    }
    
    const duration = (wakeDateTime.getTime() - bedDateTime.getTime()) / (1000 * 60 * 60);
    
    const newEntry: SleepEntry = {
      date: new Date().toISOString().split('T')[0],
      bedtime: entry.bedtime,
      wakeTime: entry.wakeTime,
      quality: entry.quality,
      duration: Math.round(duration * 10) / 10
    };
    
    setSleepEntries(prev => [newEntry, ...prev.slice(0, 6)]);
  };

  const recentEntries = sleepEntries.slice(0, 7);
  const lastNight = recentEntries[0] || {
    bedtime: "10:30",
    wakeTime: "7:00",
    duration: 8.5,
    quality: "Good"
  };

  const weeklyAverage = recentEntries.length > 0 
    ? recentEntries.reduce((sum, entry) => sum + entry.duration, 0) / recentEntries.length
    : 7.8;

  const getQualityColor = (quality: string) => {
    switch (quality.toLowerCase()) {
      case "great": return "text-secondary";
      case "good": return "text-primary";
      case "fair": return "text-yellow-500";
      case "poor": return "text-destructive";
      default: return "text-muted-foreground";
    }
  };

  const getQualityBadge = (quality: string) => {
    switch (quality.toLowerCase()) {
      case "great": return "secondary";
      case "good": return "default";
      case "fair": return "outline";
      case "poor": return "destructive";
      default: return "outline";
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Sleep Tracker</h1>
          <p className="text-muted-foreground">Monitor your rest and recovery</p>
        </div>
        <div className="flex space-x-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-gradient-primary hover:shadow-glow transition-all duration-300">
                <Plus className="h-4 w-4 mr-2" />
                Log Sleep
              </Button>
            </DialogTrigger>
            <DialogContent>
              <SleepEntryForm onAdd={addSleepEntry} />
            </DialogContent>
          </Dialog>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="hover:shadow-glow transition-all duration-300">
                <Moon className="h-4 w-4 mr-2" />
                Manual Entry
              </Button>
            </DialogTrigger>
            <DialogContent>
              <ManualSleepEntryForm onAdd={addSleepEntry} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Last Night's Sleep */}
      <Card className="shadow-glow">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Moon className="h-5 w-5 text-primary" />
            <span>Last Night's Sleep</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-3 bg-primary/10 rounded-full flex items-center justify-center">
                <Bed className="h-8 w-8 text-primary" />
              </div>
              <div className="text-2xl font-bold text-foreground">
                {lastNight.bedtime}
              </div>
              <p className="text-sm text-muted-foreground">Bedtime</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-3 bg-secondary/10 rounded-full flex items-center justify-center">
                <Clock className="h-8 w-8 text-secondary" />
              </div>
              <div className="text-2xl font-bold text-foreground">
                {lastNight.wakeTime}
              </div>
              <p className="text-sm text-muted-foreground">Wake Time</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-3 bg-primary/10 rounded-full flex items-center justify-center">
                <Moon className="h-8 w-8 text-primary" />
              </div>
              <div className="text-2xl font-bold text-foreground">
                {lastNight.duration}h
              </div>
              <p className="text-sm text-muted-foreground">Duration</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-3 bg-secondary/10 rounded-full flex items-center justify-center">
                <TrendingUp className="h-8 w-8 text-secondary" />
              </div>
              <Badge variant={getQualityBadge(lastNight.quality)} className="text-lg px-3 py-1">
                {lastNight.quality}
              </Badge>
              <p className="text-sm text-muted-foreground mt-2">Quality</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="shadow-card hover:shadow-glow transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Weekly Average</CardTitle>
            <Moon className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {weeklyAverage.toFixed(1)}h
            </div>
            <p className="text-xs text-muted-foreground mb-2">
              Goal: {sleepGoal}h per night
            </p>
            <Progress value={(weeklyAverage / sleepGoal) * 100} />
          </CardContent>
        </Card>

        <Card className="shadow-card hover:shadow-glow transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sleep Debt</CardTitle>
            <Clock className="h-4 w-4 text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {sleepGoal - weeklyAverage > 0 
                ? `${(sleepGoal - weeklyAverage).toFixed(1)}h`
                : "0h"
              }
            </div>
            <p className="text-xs text-muted-foreground">
              {sleepGoal - weeklyAverage > 0 
                ? "Below weekly goal"
                : "Meeting your goal!"
              }
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-card hover:shadow-glow transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sleep Score</CardTitle>
            <div className="text-lg">⭐</div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">82/100</div>
            <p className="text-xs text-muted-foreground">Based on quality & duration</p>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Overview */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>This Week's Sleep Pattern</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentEntries.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No sleep data logged yet. Start tracking your sleep!
              </p>
            ) : (
              recentEntries.map((entry, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gradient-card rounded-lg border"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 text-center">
                      <div className="font-medium text-xs">
                        {new Date(entry.date).toLocaleDateString([], { 
                          weekday: 'short' 
                        })}
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <div className="font-medium">{entry.duration}h</div>
                        <Progress 
                          value={(entry.duration / 10) * 100} 
                          className="flex-1 max-w-32"
                        />
                      </div>
                    </div>
                  </div>
                  <Badge variant={getQualityBadge(entry.quality)}>
                    {entry.quality}
                  </Badge>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Sleep Tips */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <div className="text-lg">💡</div>
            <span>Sleep Tips</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Moon className="h-3 w-3 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium text-sm">Consistent Schedule</h4>
                  <p className="text-xs text-muted-foreground">
                    Go to bed and wake up at the same time every day
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-secondary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Clock className="h-3 w-3 text-secondary" />
                </div>
                <div>
                  <h4 className="font-medium text-sm">Wind Down Routine</h4>
                  <p className="text-xs text-muted-foreground">
                    Create a relaxing pre-sleep routine 30-60 minutes before bed
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <div className="text-xs">📱</div>
                </div>
                <div>
                  <h4 className="font-medium text-sm">Limit Screen Time</h4>
                  <p className="text-xs text-muted-foreground">
                    Avoid screens 1 hour before bedtime
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-secondary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <div className="text-xs">🌡️</div>
                </div>
                <div>
                  <h4 className="font-medium text-sm">Cool Environment</h4>
                  <p className="text-xs text-muted-foreground">
                    Keep your bedroom between 60-67°F (15-19°C)
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Sleep;