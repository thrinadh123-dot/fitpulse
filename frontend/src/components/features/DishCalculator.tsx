import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Calculator, Search, Flame, Beef, Wheat, Apple, 
  AlertTriangle, CheckCircle, Info, Plus, Target,
  TrendingUp, TrendingDown, Lightbulb, Save, BarChart3
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import dishesData from "@/data/dishes.json";

interface DishNutrition {
  cal: number;
  protein: number;
  fat: number;
  carbs: number;
}

interface CalculatedNutrition {
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
  factor: number;
}

interface Recommendation {
  type: 'warning' | 'success' | 'info';
  message: string;
  icon: React.ReactNode;
}

interface DishCalculatorProps {
  onAddToDailyLog?: (dishName: string, nutrition: {calories: number, protein: number, carbs: number, fat: number}) => void;
  onCompareDishes?: (dish1: {name: string, nutrition: {calories: number, protein: number, carbs: number, fat: number}}, 
                    dish2: {name: string, nutrition: {calories: number, protein: number, carbs: number, fat: number}}) => void;
}

const DishCalculator = ({ onAddToDailyLog, onCompareDishes }: DishCalculatorProps) => {
  const [dishName, setDishName] = useState("");
  const [weight, setWeight] = useState("");
  const [calculatedNutrition, setCalculatedNutrition] = useState<CalculatedNutrition | null>(null);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [searchResults, setSearchResults] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState("");
  const [isLogging, setIsLogging] = useState(false);
  const [isComparing, setIsComparing] = useState(false);
  
  const { toast } = useToast();

  // Get all dish names for search
  const dishNames = Object.keys(dishesData);

  // Search functionality
  useEffect(() => {
    if (dishName.length > 0) {
      setIsSearching(true);
      const filtered = dishNames.filter(name =>
        name.toLowerCase().includes(dishName.toLowerCase())
      ).slice(0, 5); // Limit to 5 results
      setSearchResults(filtered);
    } else {
      setSearchResults([]);
    }
    setIsSearching(false);
  }, [dishName]);

  // Calculate nutrition based on dish and weight
  const calculateNutrition = () => {
    setError("");
    setCalculatedNutrition(null);
    setRecommendations([]);

    // Validation
    if (!dishName.trim()) {
      setError("Please enter a dish name");
      return;
    }

    const weightNum = parseFloat(weight);
    if (!weightNum || weightNum <= 0) {
      setError("Please enter a valid weight greater than 0");
      return;
    }

    // Find dish in database
    const dish = dishesData[dishName as keyof typeof dishesData] as DishNutrition;
    if (!dish) {
      setError(`Dish "${dishName}" not found in our database. Try searching for a similar dish.`);
      return;
    }

    // Calculate nutrition based on weight
    const factor = weightNum / 100;
    const calculated: CalculatedNutrition = {
      calories: Math.round(dish.cal * factor),
      protein: Math.round((dish.protein * factor) * 10) / 10,
      fat: Math.round((dish.fat * factor) * 10) / 10,
      carbs: Math.round((dish.carbs * factor) * 10) / 10,
      factor
    };

    setCalculatedNutrition(calculated);
    generateRecommendations(calculated);
    
    toast({
      title: "Nutrition Calculated",
      description: `Calculated nutrition for ${weight}g of ${dishName}`,
    });
  };

  // Generate smart recommendations based on calculated nutrition
  const generateRecommendations = (nutrition: CalculatedNutrition) => {
    const recs: Recommendation[] = [];

    // Protein recommendations
    if (nutrition.protein < 10) {
      recs.push({
        type: 'warning',
        message: 'Low protein content. Consider adding legumes, eggs, or lean meat.',
        icon: <Beef className="h-4 w-4" />
      });
    } else if (nutrition.protein > 30) {
      recs.push({
        type: 'success',
        message: 'Great protein content! This will help with muscle building and satiety.',
        icon: <CheckCircle className="h-4 w-4" />
      });
    }

    // Fat recommendations
    if (nutrition.fat > 25) {
      recs.push({
        type: 'warning',
        message: 'High fat content. Consider reducing portion size or choosing a lighter option.',
        icon: <Apple className="h-4 w-4" />
      });
    } else if (nutrition.fat < 5) {
      recs.push({
        type: 'info',
        message: 'Low fat content. Consider adding healthy fats like avocado or nuts.',
        icon: <Info className="h-4 w-4" />
      });
    }

    // Carb recommendations
    if (nutrition.carbs > 40) {
      recs.push({
        type: 'warning',
        message: 'High carb content. Consider reducing rice, bread, or pasta portions.',
        icon: <Wheat className="h-4 w-4" />
      });
    }

    // Calorie recommendations
    if (nutrition.calories > 500) {
      recs.push({
        type: 'warning',
        message: 'High calorie content. Consider a smaller portion or lighter alternative.',
        icon: <Flame className="h-4 w-4" />
      });
    } else if (nutrition.calories < 100) {
      recs.push({
        type: 'info',
        message: 'Low calorie content. This could be a good snack or side dish.',
        icon: <Info className="h-4 w-4" />
      });
    }

    // Balanced meal recommendation
    if (nutrition.protein >= 15 && nutrition.fat >= 8 && nutrition.carbs >= 15) {
      recs.push({
        type: 'success',
        message: 'Well-balanced meal! Good mix of protein, carbs, and healthy fats.',
        icon: <CheckCircle className="h-4 w-4" />
      });
    }

    // Fiber recommendation
    if (nutrition.carbs > 20 && nutrition.fat < 10) {
      recs.push({
        type: 'info',
        message: 'Good fiber content. This will help with digestion and satiety.',
        icon: <Info className="h-4 w-4" />
      });
    }

    // Meal timing recommendation
    if (nutrition.calories > 400) {
      recs.push({
        type: 'info',
        message: 'This is a substantial meal. Consider having it as lunch or dinner.',
        icon: <Info className="h-4 w-4" />
      });
    } else if (nutrition.calories < 200) {
      recs.push({
        type: 'info',
        message: 'Light meal option. Perfect for breakfast or a snack.',
        icon: <Info className="h-4 w-4" />
      });
    }

    // Healthier alternatives recommendation
    if (nutrition.fat > 20) {
      recs.push({
        type: 'warning',
        message: 'Consider grilled or steamed alternatives to reduce fat content.',
        icon: <Info className="h-4 w-4" />
      });
    }

    // Portion control recommendation
    if (nutrition.calories > 600) {
      recs.push({
        type: 'warning',
        message: 'Large portion size. Consider splitting into two meals.',
        icon: <Info className="h-4 w-4" />
      });
    }

    setRecommendations(recs);
  };

  // Handle dish selection from search results
  const selectDish = (selectedDish: string) => {
    setDishName(selectedDish);
    setSearchResults([]);
  };

  // Handle logging meal to daily log
  const handleLogMeal = async () => {
    if (!calculatedNutrition) return;
    
    setIsLogging(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (onAddToDailyLog) {
      onAddToDailyLog(dishName, calculatedNutrition);
    }
    
    setIsLogging(false);
    
    toast({
      title: "Meal Logged Successfully",
      description: `${dishName} has been added to your daily nutrition log.`,
    });
  };

  // Handle comparing dishes
  const handleCompareDishes = async () => {
    if (!calculatedNutrition) return;
    
    setIsComparing(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    
    if (onCompareDishes) {
      // For demo, compare with a sample dish
      const sampleDish = {
        name: "Sample Dish",
        nutrition: {
          calories: 400,
          protein: 20,
          carbs: 45,
          fat: 15
        }
      };
      const currentDish = {
        name: dishName,
        nutrition: calculatedNutrition
      };
      onCompareDishes(currentDish, sampleDish);
    }
    
    setIsComparing(false);
    
    toast({
      title: "Dish Comparison Ready",
      description: `Comparing ${dishName} with sample dish.`,
    });
  };

  // Get recommendation color
  const getRecommendationColor = (type: string) => {
    switch (type) {
      case 'warning': return 'text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/20 border-orange-200 dark:border-orange-800/30';
      case 'success': return 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800/30';
      case 'info': return 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800/30';
      default: return 'text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-800/20 border-gray-200 dark:border-gray-700/30';
    }
  };

  return (
    <Card className="shadow-lg border-0 bg-gradient-to-br from-card to-card/80">
      <CardHeader>
        <CardTitle className="text-xl flex items-center space-x-2">
          <Calculator className="h-6 w-6 text-primary" />
          <span>Dish Nutrition Calculator</span>
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Enter a dish name and weight to calculate nutritional content
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
      {/* Input Section */}
        <div className="space-y-4">
            {/* Dish Name Input with Search */}
            <div className="space-y-2">
            <Label htmlFor="dish-name">🍽️ Dish Name</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                id="dish-name"
                placeholder="Enter dish name (e.g., Paneer Curry)"
                value={dishName}
                onChange={(e) => setDishName(e.target.value)}
                className="pl-10"
                />
              </div>
              
            {/* Search Results Dropdown */}
              <AnimatePresence>
              {searchResults.length > 0 && (
                  <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute z-10 w-full bg-background border rounded-lg shadow-lg mt-1"
                >
                  {searchResults.map((dish) => (
                    <button
                          key={dish}
                      onClick={() => selectDish(dish)}
                      className="w-full text-left px-4 py-2 hover:bg-muted/50 transition-colors"
                    >
                      {dish}
                    </button>
                  ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Weight Input */}
            <div className="space-y-2">
            <Label htmlFor="weight">⚖️ Weight (grams)</Label>
                <Input
              id="weight"
                  type="number"
                  placeholder="Enter weight in grams (e.g., 150)"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                />
            </div>

            {/* Calculate Button */}
            <Button
            onClick={calculateNutrition}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:shadow-lg"
            disabled={!dishName.trim() || !weight.trim()}
          >
            <Calculator className="h-4 w-4 mr-2" />
            Calculate Nutrition
          </Button>
        </div>

        {/* Error Display */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
                </motion.div>
          )}
        </AnimatePresence>

      {/* Results Section */}
      <AnimatePresence>
        {calculatedNutrition && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
            className="space-y-4"
          >
            {/* Nutrition Results */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-gradient-to-br from-orange-500/10 to-red-500/10 rounded-lg border">
                  <Flame className="h-6 w-6 text-orange-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-foreground">
                    {calculatedNutrition.calories}
                  </div>
                  <div className="text-sm text-muted-foreground">kcal</div>
                </div>

                <div className="text-center p-4 bg-gradient-to-br from-red-500/10 to-pink-500/10 rounded-lg border">
                  <Beef className="h-6 w-6 text-red-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-foreground">
                    {calculatedNutrition.protein}
                  </div>
                  <div className="text-sm text-muted-foreground">g protein</div>
                </div>

                <div className="text-center p-4 bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-lg border">
                  <Wheat className="h-6 w-6 text-green-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-foreground">
                    {calculatedNutrition.carbs}
                  </div>
                  <div className="text-sm text-muted-foreground">g carbs</div>
                </div>

                <div className="text-center p-4 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 rounded-lg border">
                  <Apple className="h-6 w-6 text-yellow-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-foreground">
                    {calculatedNutrition.fat}
                  </div>
                  <div className="text-sm text-muted-foreground">g fat</div>
                </div>
              </div>

              {/* Calculation Info */}
              <div className="text-center text-sm text-muted-foreground">
                Based on {weight}g serving (×{calculatedNutrition.factor.toFixed(2)} factor)
              </div>

            {/* Smart Recommendations */}
              {recommendations.length > 0 && (
                  <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Lightbulb className="h-5 w-5 text-primary" />
                    <h4 className="font-medium">Smart Recommendations</h4>
                  </div>
                  <div className="space-y-2">
                    {recommendations.map((rec, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`smart-recommendation-item flex items-start space-x-3 p-3 rounded-lg border ${getRecommendationColor(rec.type)}`}
                      >
                        {rec.icon}
                        <span className="text-sm">{rec.message}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* Quick Actions */}
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={handleLogMeal}
                  disabled={!calculatedNutrition || isLogging}
                >
                  {isLogging ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mr-2"></div>
                      Logging...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Log Meal
                    </>
                  )}
                </Button>
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={handleCompareDishes}
                  disabled={!calculatedNutrition || isComparing}
                >
                  {isComparing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mr-2"></div>
                      Comparing...
                    </>
                  ) : (
                    <>
                      <BarChart3 className="h-4 w-4 mr-2" />
                      Compare Dishes
                    </>
                  )}
                </Button>
              </div>
              
              {/* Additional Action */}
              <Button 
                variant="outline" 
                className="w-full"
                onClick={handleLogMeal}
                disabled={!calculatedNutrition}
              >
                <Target className="h-4 w-4 mr-2" />
                Add to Daily Log
              </Button>
          </motion.div>
        )}
      </AnimatePresence>

        {/* Available Dishes Info */}
        <div className="text-center text-sm text-muted-foreground">
          <Info className="h-4 w-4 inline mr-1" />
          Our database contains {dishNames.length} dishes. Start typing to search!
            </div>
          </CardContent>
        </Card>
  );
};

export default DishCalculator; 