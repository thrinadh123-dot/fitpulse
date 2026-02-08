import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useFitnessStore } from "@/stores/fitnessStore";
import { useToast } from "@/hooks/use-toast";
import { QuickActions } from "@/components/features/QuickActions";
import DishCalculator from "@/components/features/DishCalculator";
import { PageTransition } from "@/components/ui/page-transition";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Target, Activity, Droplet, Moon, Flame, Beef, Wheat, Apple,
  Plus, Search, Edit, Trash2, Clock, TrendingUp,
  Save, Calendar
} from "lucide-react";
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
  ArcElement,
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

interface Meal {
  id: string;
  name: string;
  time: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
}

interface MacroGoals {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

const Nutrition = () => {
  const { data: fitnessData, goals, getProgress, getLastResetTime, addMeal: addMealToStore, deleteMeal: deleteMealFromStore } = useFitnessStore();
  const { toast } = useToast();
  
  // State management
  const [chartType, setChartType] = useState<'line' | 'area'>('line');
  const [activeFilter, setActiveFilter] = useState<'calories' | 'protein' | 'carbs' | 'fat'>('calories');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddMealOpen, setIsAddMealOpen] = useState(false);
  const [editingMeal, setEditingMeal] = useState<Meal | null>(null);
  
  // Quick Actions state (keep UI flags only; actual counters come from store)
  
  // Dish comparison state
  const [showCompareModal, setShowCompareModal] = useState(false);
  const [selectedDishes, setSelectedDishes] = useState<Array<{name: string, nutrition: {calories: number, protein: number, carbs: number, fat: number}}>>([]);
  
  // Weekly nutrition data - dynamic from store
  const weeklyChartData = useMemo(() => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      return {
        dateStr: d.toISOString().split('T')[0],
        label: d.toLocaleDateString('en-US', { weekday: 'short' })
      };
    });

    const data = last7Days.map(day => {
      const dayMeals = fitnessData.meals.filter(m => m.date === day.dateStr);
      return {
        calories: dayMeals.reduce((sum, m) => sum + m.calories, 0),
        protein: dayMeals.reduce((sum, m) => sum + m.protein, 0),
        carbs: dayMeals.reduce((sum, m) => sum + m.carbs, 0),
        fat: dayMeals.reduce((sum, m) => sum + m.fat, 0),
      };
    });

    return {
      labels: last7Days.map(d => d.label),
      data
    };
  }, [fitnessData.meals]);

  // Macro goals (calculated from fitness goals)
  const macroGoals: MacroGoals = {
    calories: goals.calories,
    protein: Math.round(goals.calories * 0.3 / 4), // 30% of calories from protein
    carbs: Math.round(goals.calories * 0.45 / 4),  // 45% of calories from carbs
    fat: Math.round(goals.calories * 0.25 / 9)     // 25% of calories from fat
  };

  // Get today's meals from store
  const today = new Date().toISOString().split('T')[0];
  const meals = fitnessData.meals.filter(m => m.date === today).map(m => ({
    ...m,
    // Ensure compatibility with local Meal interface if needed, or just use what's there
  }));

  // Calculate today's totals from store data
  const todayTotals = {
    calories: fitnessData.calories,
    protein: fitnessData.protein,
    carbs: fitnessData.carbs,
    fat: fitnessData.fat
  };



  // Quick start meal options
  const quickMeals = [
    { name: '🍳 Breakfast', type: 'breakfast' as const, calories: 400, protein: 25, carbs: 45, fat: 15 },
    { name: '🥪 Lunch', type: 'lunch' as const, calories: 600, protein: 35, carbs: 60, fat: 20 },
    { name: '🍽 Dinner', type: 'dinner' as const, calories: 700, protein: 40, carbs: 70, fat: 25 },
    { name: '🥤 Snack', type: 'snack' as const, calories: 200, protein: 10, carbs: 25, fat: 8 }
  ];

  // Quick Actions handlers
  const handleAddSteps = () => {
    console.log('🔍 DEBUG: Nutrition - Add steps feedback');
  };

  const handleAddWater = () => {
    console.log('🔍 DEBUG: Nutrition - Add water feedback');
  };

  const handleLogMeal = () => {
    console.log('🔍 DEBUG: Nutrition - Log meal feedback');
  };

  const handleLogSleep = () => {
    console.log('🔍 DEBUG: Nutrition - Log sleep feedback');
  };

  // Add meal function
  const addMeal = async (mealData: Omit<Meal, 'id' | 'time'>) => {
    await addMealToStore({
      ...mealData,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });
    handleLogMeal();
  };

  // Add calculated dish to daily log
  const addCalculatedDishToLog = (dishName: string, nutrition: {calories: number, protein: number, carbs: number, fat: number}) => {
    addMeal({
      name: dishName,
      calories: nutrition.calories,
      protein: nutrition.protein,
      carbs: nutrition.carbs,
      fat: nutrition.fat,
      type: 'dinner' // Default type
    });
  };

  // Compare dishes function
  const compareDishes = (dish1: {name: string, nutrition: {calories: number, protein: number, carbs: number, fat: number}}, 
                        dish2: {name: string, nutrition: {calories: number, protein: number, carbs: number, fat: number}}) => {
    setSelectedDishes([dish1, dish2]);
    setShowCompareModal(true);
  };

  // Delete meal function
  const deleteMeal = async (mealId: string) => {
    await deleteMealFromStore(mealId);
    toast({
      title: "Meal Deleted",
      description: "Meal has been removed from your log.",
    });
  };

  // Edit meal function
  const editMeal = (meal: Meal) => {
    setEditingMeal(meal);
    setIsAddMealOpen(true);
  };

  // Weekly chart data - now uses state and updates with today's totals
  const weeklyData = {
    labels: weeklyChartData.labels,
    datasets: [
      {
        label: 'Calories',
        data: weeklyChartData.data.map(d => d.calories),
        borderColor: 'hsl(25 95% 53%)',
        backgroundColor: 'hsl(25 95% 53% / 0.1)',
        tension: 0.4,
        fill: chartType === 'area',
      },
      {
        label: 'Protein',
        data: weeklyChartData.data.map(d => d.protein),
        borderColor: 'hsl(0 100% 50%)',
        backgroundColor: 'hsl(0 100% 50% / 0.1)',
        tension: 0.4,
        fill: chartType === 'area',
      },
      {
        label: 'Carbs',
        data: weeklyChartData.data.map(d => d.carbs),
        borderColor: 'hsl(142 76% 36%)',
        backgroundColor: 'hsl(142 76% 36% / 0.1)',
        tension: 0.4,
        fill: chartType === 'area',
      },
      {
        label: 'Fat',
        data: weeklyChartData.data.map(d => d.fat),
        borderColor: 'hsl(60 100% 50%)',
        backgroundColor: 'hsl(60 100% 50% / 0.1)',
        tension: 0.4,
        fill: chartType === 'area',
      }
    ]
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

  // Macro breakdown chart data
  const macroBreakdownData = {
    labels: ['Protein', 'Carbs', 'Fat'],
    datasets: [
      {
        data: [todayTotals.protein * 4, todayTotals.carbs * 4, todayTotals.fat * 9],
        backgroundColor: [
          'hsl(0 100% 50%)',
          'hsl(142 76% 36%)',
          'hsl(60 100% 50%)',
        ],
        borderWidth: 0,
      },
    ],
  };

  // Filtered meals based on search
  const filteredMeals = meals.filter(meal =>
    meal.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Header Section */}
        <motion.div 
            initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
            className="mb-8"
        >
            <div className="flex items-center justify-between">
        <div>
  <h1 className="text-page-heading text-foreground mb-2">
    Hey {getGreeting()}, ready to track your nutrition?
  </h1>

  <p className="text-body-text text-muted-foreground">
    Monitor your daily nutrition and calorie intake
  </p>

  <p className="text-number-label text-muted-foreground mt-2">
    Last Reset: {getLastResetTime()}
  </p>
</div>

              <Button
                onClick={() => setIsAddMealOpen(true)}
                className="bg-gradient-to-r from-green-500 to-emerald-500 hover:shadow-lg"
              >
                <Plus className="h-4 w-4 mr-2" />
                 Log Meal
              </Button>
        </div>
        </motion.div>

          {/* Daily Summary Panel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8"
          >
            <Card className="shadow-lg border-0 bg-gradient-to-br from-card to-card/80 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-card-title uppercase text-muted-foreground">Calories</h3>
                  <Flame className="h-4 w-4 text-orange-500" />
                </div>
                <div className="text-primary-number text-foreground mb-2">
                  {todayTotals.calories.toLocaleString()}
                </div>
                <p className="text-number-label text-muted-foreground mb-3">
                  Goal: {macroGoals.calories.toLocaleString()} kcal
                </p>
                <Progress value={(todayTotals.calories / macroGoals.calories) * 100} className="h-2" />
              </CardContent>
            </Card>

            <Card className="shadow-lg border-0 bg-gradient-to-br from-card to-card/80 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-card-title uppercase text-muted-foreground">Protein</h3>
                  <Beef className="h-4 w-4 text-red-500" />
                </div>
                <div className="text-primary-number text-foreground mb-2">
                  {todayTotals.protein}
                </div>
                <p className="text-number-label text-muted-foreground mb-3">
                  g / {macroGoals.protein}g
                </p>
                <Progress value={(todayTotals.protein / macroGoals.protein) * 100} className="h-2" />
              </CardContent>
            </Card>

            <Card className="shadow-lg border-0 bg-gradient-to-br from-card to-card/80 backdrop-blur-sm">
              <CardContent className="p-6">
                                 <div className="flex items-center justify-between mb-4">
                   <h3 className="text-card-title uppercase text-muted-foreground">Carbs</h3>
                   <Wheat className="h-4 w-4 text-green-500" />
                 </div>
                <div className="text-primary-number text-foreground mb-2">
                  {todayTotals.carbs}
              </div>
                <p className="text-number-label text-muted-foreground mb-3">
                  g / {macroGoals.carbs}g
                </p>
                <Progress value={(todayTotals.carbs / macroGoals.carbs) * 100} className="h-2" />
              </CardContent>
            </Card>

            <Card className="shadow-lg border-0 bg-gradient-to-br from-card to-card/80 backdrop-blur-sm">
              <CardContent className="p-6">
                                 <div className="flex items-center justify-between mb-4">
                   <h3 className="text-card-title uppercase text-muted-foreground">Fat</h3>
                   <Apple className="h-4 w-4 text-yellow-500" />
                 </div>
                <div className="text-primary-number text-foreground mb-2">
                  {todayTotals.fat}
                </div>
                <p className="text-number-label text-muted-foreground mb-3">
                  g / {macroGoals.fat}g
                </p>
                <Progress value={(todayTotals.fat / macroGoals.fat) * 100} className="h-2" />
            </CardContent>
          </Card>
        </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Weekly Overview Graph */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Card className="shadow-lg border-0 bg-gradient-to-br from-card to-card/80">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-card-title uppercase flex items-center space-x-2">
                        <TrendingUp className="h-6 w-6 text-primary" />
                        <span>Weekly Overview</span>
                      </CardTitle>
                      <div className="flex items-center space-x-2">
                        <Select value={chartType} onValueChange={(value: 'line' | 'area') => setChartType(value)}>
                          <SelectTrigger className="w-24">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="line">Line</SelectItem>
                            <SelectItem value="area">Area</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
            </CardHeader>
            <CardContent>
                    <div className="h-64">
                      <Line data={weeklyData} options={chartOptions} />
              </div>
            </CardContent>
          </Card>
        </motion.div>

                            {/* Dish Calculator */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
              >
                <DishCalculator 
                  onAddToDailyLog={addCalculatedDishToLog}
                  onCompareDishes={compareDishes}
                />
        </motion.div>

              {/* Quick Start Meal Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
              >
                <Card className="shadow-lg border-0 bg-gradient-to-br from-card to-card/80">
                  <CardHeader>
                    <CardTitle className="text-card-title uppercase">Quick Start Meals</CardTitle>
            </CardHeader>
            <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {quickMeals.map((meal, index) => (
        <motion.div
                          key={meal.name}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                          <Button
                      variant="outline"
                            className="w-full h-auto p-4 flex flex-col"
                            onClick={() => {
                              addMeal({
                                name: meal.name,
                                calories: meal.calories,
                                protein: meal.protein,
                                carbs: meal.carbs,
                                fat: meal.fat,
                                type: meal.type
                              });
                            }}
                          >
                            <span className="text-card-title uppercase mb-2">{meal.name.split(' ')[0]}</span>
                            <span className="text-body-text">{meal.name.split(' ').slice(1).join(' ')}</span>
                            <span className="text-number-label text-muted-foreground mt-1">{meal.calories} cal</span>
                          </Button>
                      </motion.div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

              {/* Recent Meals Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
      >
                <Card className="shadow-lg border-0 bg-gradient-to-br from-card to-card/80">
          <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-card-title uppercase flex items-center space-x-2">
                        <Clock className="h-6 w-6 text-primary" />
                        <span>Recent Meals</span>
                      </CardTitle>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Search meals..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-10 w-64"
                        />
                      </div>
                    </div>
          </CardHeader>
          <CardContent>
                    {filteredMeals.length === 0 ? (
                      <div className="text-center py-8">
                        <p className="text-body-text text-muted-foreground mb-4">
                          {searchQuery ? 'No meals found matching your search.' : 'No meals logged yet. Start your nutrition journey!'}
                        </p>
                        <Button onClick={() => setIsAddMealOpen(true)}>
                          <Plus className="h-4 w-4 mr-2" />
                          Add New Meal
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {filteredMeals.map((meal) => (
                  <motion.div
                    key={meal.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                            className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                                <span className="text-card-title uppercase">
                                  {meal.type === 'breakfast' ? '🍳' : 
                                   meal.type === 'lunch' ? '🥪' : 
                                   meal.type === 'dinner' ? '🍽' : '🥤'}
                                </span>
                              </div>
                      <div>
                        <h4 className="text-card-title uppercase">{meal.name}</h4>
                        <p className="text-body-text text-muted-foreground">{meal.time}</p>
                                <div className="flex space-x-2 mt-1">
                                  <Badge variant="secondary" className="text-number-label">
                            P: {meal.protein}g
                                  </Badge>
                                  <Badge variant="secondary" className="text-number-label">
                            C: {meal.carbs}g
                                  </Badge>
                                  <Badge variant="secondary" className="text-number-label">
                            F: {meal.fat}g
                                  </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="text-right">
                        <div className="text-card-title uppercase">{meal.calories} kcal</div>
                                <Badge variant="outline" className="text-number-label capitalize">
                          {meal.type}
                        </Badge>
                      </div>
                              <div className="flex space-x-1">
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => editMeal(meal)}
                                  className="hover:bg-muted/80 transition-colors"
                                >
                          <Edit className="h-4 w-4" />
                        </Button>
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => deleteMeal(meal.id)}
                                  className="hover:bg-destructive/10 hover:text-destructive transition-colors"
                                >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                              </div>
                    </div>
                  </motion.div>
                ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
                <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                <QuickActions 
                  onAddSteps={handleAddSteps}
                  onAddWater={handleAddWater}
                  onLogMeal={handleLogMeal}
                  onLogSleep={handleLogSleep}
                />
              </motion.div>

              {/* Macro Breakdown Chart */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.7 }}
              >
                <Card className="shadow-lg border-0 bg-gradient-to-br from-card to-card/80">
                  <CardHeader>
                    <CardTitle className="text-card-title uppercase">Macro Breakdown</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-48">
                      <Doughnut data={macroBreakdownData} options={chartOptions} />
                    </div>
                    <div className="grid grid-cols-3 gap-2 mt-4 text-center">
                      <div>
                        <div className="text-card-title text-red-500">Protein</div>
                        <div className="text-number-label text-muted-foreground">{todayTotals.protein}g</div>
                      </div>
                      <div>
                        <div className="text-card-title text-green-500">Carbs</div>
                        <div className="text-number-label text-muted-foreground">{todayTotals.carbs}g</div>
                      </div>
                      <div>
                        <div className="text-card-title text-yellow-500">Fat</div>
                        <div className="text-number-label text-muted-foreground">{todayTotals.fat}g</div>
                      </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

              {/* Nutrition Tips */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
              >
                <Card className="shadow-lg border-0 bg-gradient-to-br from-card to-card/80">
                  <CardHeader>
                    <CardTitle className="text-card-title uppercase">Nutrition Tips</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="text-body-text text-muted-foreground">
                      💡 Drink water before meals to improve digestion
              </div>
                    <div className="text-body-text text-muted-foreground">
                      🥗 Include protein in every meal for better satiety
            </div>
                    <div className="text-body-text text-muted-foreground">
                      🍎 Eat colorful fruits and vegetables daily
              </div>
                    <div className="text-body-text text-muted-foreground">
                      ⏰ Don't skip breakfast - it kickstarts your metabolism
              </div>
                  </CardContent>
                </Card>
              </motion.div>
              </div>
            </div>
            
          {/* Log Meal Modal */}
          <Dialog open={isAddMealOpen} onOpenChange={setIsAddMealOpen}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Log New Meal</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="meal-name">Meal Name</Label>
                  <Input
                    id="meal-name"
                    placeholder="e.g., Grilled Chicken Salad"
                    defaultValue=""
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="meal-calories">Calories</Label>
                    <Input
                      id="meal-calories"
                      type="number"
                      placeholder="550"
                      defaultValue=""
                    />
                  </div>
                  <div>
                    <Label htmlFor="meal-type">Type</Label>
                    <Select defaultValue="dinner">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="breakfast">Breakfast</SelectItem>
                        <SelectItem value="lunch">Lunch</SelectItem>
                        <SelectItem value="dinner">Dinner</SelectItem>
                        <SelectItem value="snack">Snack</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="meal-protein">Protein (g)</Label>
                    <Input
                      id="meal-protein"
                      type="number"
                      placeholder="25"
                      defaultValue=""
                    />
                  </div>
                  <div>
                    <Label htmlFor="meal-carbs">Carbs (g)</Label>
                    <Input
                      id="meal-carbs"
                      type="number"
                      placeholder="30"
                      defaultValue=""
                    />
                  </div>
                  <div>
                    <Label htmlFor="meal-fat">Fat (g)</Label>
                    <Input
                      id="meal-fat"
                      type="number"
                      placeholder="15"
                      defaultValue=""
                    />
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button 
                    onClick={() => {
                      // Get values from inputs and add meal
                      const nameInput = document.getElementById('meal-name') as HTMLInputElement;
                      const caloriesInput = document.getElementById('meal-calories') as HTMLInputElement;
                      const proteinInput = document.getElementById('meal-protein') as HTMLInputElement;
                      const carbsInput = document.getElementById('meal-carbs') as HTMLInputElement;
                      const fatInput = document.getElementById('meal-fat') as HTMLInputElement;
                      
                      if (nameInput && caloriesInput) {
                        addMeal({
                          name: nameInput.value || "Custom Meal",
                          calories: parseInt(caloriesInput.value) || 0,
                          protein: parseInt(proteinInput.value) || 0,
                          carbs: parseInt(carbsInput.value) || 0,
                          fat: parseInt(fatInput.value) || 0,
                          type: 'dinner'
                        });
                        setIsAddMealOpen(false);
                      }
                    }}
                    className="flex-1"
                  >
                    Log Meal
                  </Button>
                  <Button variant="outline" onClick={() => setIsAddMealOpen(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {/* Dish Comparison Modal */}
          <Dialog open={showCompareModal} onOpenChange={setShowCompareModal}>
            <DialogContent className="sm:max-w-4xl">
              <DialogHeader>
                <DialogTitle>Dish Comparison</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                {selectedDishes.length === 2 && (
                  <div className="grid grid-cols-2 gap-6">
                    {selectedDishes.map((dish, index) => (
                      <div key={index} className="space-y-4">
                        <h3 className="text-card-title uppercase">{dish.name}</h3>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-body-text">Calories:</span>
                            <span className="text-card-title uppercase">{dish.nutrition.calories} kcal</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-body-text">Protein:</span>
                            <span className="text-card-title uppercase">{dish.nutrition.protein}g</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-body-text">Carbs:</span>
                            <span className="text-card-title uppercase">{dish.nutrition.carbs}g</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-body-text">Fat:</span>
                            <span className="text-card-title uppercase">{dish.nutrition.fat}g</span>
                          </div>
                        </div>
                        <Button 
                          onClick={() => addCalculatedDishToLog(dish.name, dish.nutrition)}
                          className="w-full"
                        >
                          Add to Daily Log
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>

          {/* Sticky CTA Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.9 }}
            className="fixed bottom-6 right-6 z-50"
          >
            <div className="flex space-x-3">
              <Button
                onClick={() => setIsAddMealOpen(true)}
                className="bg-gradient-to-r from-green-500 to-emerald-500 hover:shadow-lg shadow-lg"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Meal
              </Button>
              {/* <Button
                variant="outline"
                className="shadow-lg"
              >
                {/* <Save className="h-4 w-4 mr-2" />
                Save Log
              </Button> */}
            </div>
          </motion.div>
        </div>
    </div>
    </PageTransition>
  );
};

export default Nutrition;
