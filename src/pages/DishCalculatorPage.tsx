import DishCalculator from "@/components/DishCalculator";
import { PageTransition } from "@/components/ui/page-transition";
import { motion } from "framer-motion";
import { Calculator, Target, TrendingUp, Lightbulb } from "lucide-react";

const DishCalculatorPage = () => {
  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-6 py-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="relative">
                <Calculator className="h-12 w-12 text-primary" />
                <div className="absolute inset-0 h-12 w-12 bg-primary rounded-full opacity-20 animate-pulse"></div>
              </div>
            </div>
            <h1 className="text-4xl font-bold text-foreground mb-4 font-['Poppins']">
              Dish Nutrition Calculator
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Calculate nutritional content for any dish by entering the name and weight. 
              Get detailed breakdowns and smart recommendations for better food choices.
            </p>
          </motion.div>

          {/* Features Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
          >
            <div className="text-center p-6 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-xl border">
              <Target className="h-8 w-8 text-blue-500 mx-auto mb-3" />
              <h3 className="text-lg font-semibold mb-2">Accurate Calculations</h3>
              <p className="text-sm text-muted-foreground">
                Get precise nutritional values based on per-100g ratios for any serving size
              </p>
            </div>

            <div className="text-center p-6 bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-xl border">
              <TrendingUp className="h-8 w-8 text-green-500 mx-auto mb-3" />
              <h3 className="text-lg font-semibold mb-2">Smart Recommendations</h3>
              <p className="text-sm text-muted-foreground">
                Receive personalized dietary advice based on calculated nutritional content
              </p>
            </div>

            <div className="text-center p-6 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-xl border">
              <Lightbulb className="h-8 w-8 text-purple-500 mx-auto mb-3" />
              <h3 className="text-lg font-semibold mb-2">Extensive Database</h3>
              <p className="text-sm text-muted-foreground">
                Access 50+ dishes with comprehensive nutritional information
              </p>
            </div>
          </motion.div>

          {/* Calculator Component */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <DishCalculator />
          </motion.div>

          {/* How It Works */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-12 p-8 bg-gradient-to-br from-card to-card/80 rounded-2xl border"
          >
            <h2 className="text-2xl font-bold text-center mb-6">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-bold text-primary">1</span>
                </div>
                <h3 className="font-semibold mb-2">Enter Dish Name</h3>
                <p className="text-sm text-muted-foreground">
                  Search from our database of 50+ dishes or type a custom dish name
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-bold text-primary">2</span>
                </div>
                <h3 className="font-semibold mb-2">Add Weight</h3>
                <p className="text-sm text-muted-foreground">
                  Specify the weight in grams for accurate nutritional calculations
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-bold text-primary">3</span>
                </div>
                <h3 className="font-semibold mb-2">Get Results</h3>
                <p className="text-sm text-muted-foreground">
                  View detailed nutrition breakdown and personalized recommendations
                </p>
              </div>
            </div>
          </motion.div>

          {/* Sample Calculations */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="mt-8 p-8 bg-gradient-to-br from-card to-card/80 rounded-2xl border"
          >
            <h2 className="text-2xl font-bold text-center mb-6">Sample Calculations</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 bg-muted/20 rounded-lg">
                <h4 className="font-semibold mb-2">Paneer Curry (150g)</h4>
                <div className="space-y-1 text-sm">
                  <div>🔥 Calories: 410 kcal</div>
                  <div>🥩 Protein: 16.5g</div>
                  <div>🥑 Fat: 31.5g</div>
                  <div>🍞 Carbs: 10.5g</div>
                </div>
              </div>
              <div className="p-4 bg-muted/20 rounded-lg">
                <h4 className="font-semibold mb-2">Chicken Biryani (200g)</h4>
                <div className="space-y-1 text-sm">
                  <div>🔥 Calories: 580 kcal</div>
                  <div>🥩 Protein: 40g</div>
                  <div>🥑 Fat: 18g</div>
                  <div>🍞 Carbs: 76g</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
};

export default DishCalculatorPage; 