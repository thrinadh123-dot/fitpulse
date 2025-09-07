import { Droplet, Plus, Target, TrendingUp, Settings } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { WaterEntryForm } from "@/components/TrackingForms";
import { useLocalStorage } from "@/hooks/useLocalStorage";

interface WaterEntry {
  time: string;
  amount: number;
}

const Water = () => {
  const [waterEntries, setWaterEntries] = useLocalStorage<WaterEntry[]>('waterEntries', []);
  const [dailyGoal, setDailyGoal] = useLocalStorage<number>('waterGoal', 8);

  const today = new Date().toDateString();
  const todayEntries = waterEntries.filter(entry => 
    new Date(entry.time).toDateString() === today
  );

  const totalGlasses = todayEntries.length;
  const totalMl = todayEntries.reduce((sum, entry) => sum + entry.amount, 0);
  const percentage = (totalGlasses / dailyGoal) * 100;
  const remaining = Math.max(0, dailyGoal - totalGlasses);

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
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-foreground mb-2">Water Tracker</h1>
        <p className="text-muted-foreground">Stay hydrated throughout the day</p>
      </div>

      {/* Main Progress Card */}
      <Card className="shadow-glow max-w-2xl mx-auto">
        <CardContent className="p-8 text-center">
          <div className="relative mb-8">
            <div className="w-32 h-32 mx-auto mb-4 relative">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="hsl(var(--muted))"
                  strokeWidth="8"
                  fill="none"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="hsl(var(--primary))"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={`${percentage * 2.51} 251`}
                  className="transition-all duration-700 ease-out"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <Droplet className="h-8 w-8 text-primary" />
              </div>
            </div>
            
            <div className="text-4xl font-bold text-foreground mb-2">
              {totalGlasses} / {dailyGoal}
            </div>
            <p className="text-muted-foreground mb-4">glasses today ({totalMl}ml)</p>
            
            {remaining > 0 ? (
              <p className="text-sm text-muted-foreground">
                {remaining} more glass{remaining !== 1 ? "es" : ""} to reach your goal!
              </p>
            ) : (
              <p className="text-sm text-primary font-medium">
                🎉 Goal achieved! Keep it up!
              </p>
            )}
          </div>

          <Dialog>
            <DialogTrigger asChild>
              <Button
                size="lg"
                className="bg-gradient-primary hover:shadow-glow transition-all duration-300"
              >
                <Plus className="h-5 w-5 mr-2" />
                Add Water
              </Button>
            </DialogTrigger>
            <DialogContent>
              <WaterEntryForm onAdd={addWater} />
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="shadow-card hover:shadow-glow transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Progress</CardTitle>
            <Target className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground mb-2">
              {Math.round(percentage)}%
            </div>
            <Progress value={percentage} className="mb-2" />
            <p className="text-xs text-muted-foreground">
              {totalMl}ml of {dailyGoal * 250}ml
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-card hover:shadow-glow transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Weekly Average</CardTitle>
            <TrendingUp className="h-4 w-4 text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">7.2</div>
            <p className="text-xs text-muted-foreground">glasses per day</p>
            <div className="flex items-center mt-2">
              <TrendingUp className="h-3 w-3 text-secondary mr-1" />
              <span className="text-xs text-secondary">+12% from last week</span>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card hover:shadow-glow transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Streak</CardTitle>
            <div className="text-lg">🔥</div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">5 days</div>
            <p className="text-xs text-muted-foreground">Keep going!</p>
          </CardContent>
        </Card>
      </div>

      {/* Today's Log */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Droplet className="h-5 w-5 text-primary" />
            <span>Today's Water Log</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {todayEntries.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No water logged today. Start hydrating!
              </p>
            ) : (
              todayEntries.map((entry, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gradient-card rounded-lg border"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <Droplet className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">Glass {index + 1}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(entry.time).toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{entry.amount}ml</p>
                  </div>
                </div>
              ))
            )}
            
            {totalGlasses < dailyGoal && (
              <Dialog>
                <DialogTrigger asChild>
                  <div className="flex items-center justify-between p-3 border-2 border-dashed border-muted rounded-lg cursor-pointer hover:bg-accent/50 transition-colors">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                        <Plus className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="font-medium text-muted-foreground">
                          Next glass
                        </p>
                        <p className="text-sm text-muted-foreground">Add when ready</p>
                      </div>
                    </div>
                    <Button size="sm" variant="outline">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </DialogTrigger>
                <DialogContent>
                  <WaterEntryForm onAdd={addWater} />
                </DialogContent>
              </Dialog>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Button 
          variant="outline" 
          className="h-20 flex-col space-y-2"
          onClick={() => quickAdd(200)}
        >
          <div className="text-2xl">💧</div>
          <span className="text-sm">Small Glass</span>
          <span className="text-xs text-muted-foreground">200ml</span>
        </Button>
        
        <Button 
          variant="outline" 
          className="h-20 flex-col space-y-2"
          onClick={() => quickAdd(250)}
        >
          <div className="text-2xl">🥤</div>
          <span className="text-sm">Regular Glass</span>
          <span className="text-xs text-muted-foreground">250ml</span>
        </Button>
        
        <Button 
          variant="outline" 
          className="h-20 flex-col space-y-2"
          onClick={() => quickAdd(350)}
        >
          <div className="text-2xl">🍶</div>
          <span className="text-sm">Large Glass</span>
          <span className="text-xs text-muted-foreground">350ml</span>
        </Button>
        
        <Button 
          variant="outline" 
          className="h-20 flex-col space-y-2"
          onClick={() => quickAdd(500)}
        >
          <div className="text-2xl">🥛</div>
          <span className="text-sm">Bottle</span>
          <span className="text-xs text-muted-foreground">500ml</span>
        </Button>
      </div>
    </div>
  );
};

export default Water;