import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Activity, 
  Target, 
  Droplet, 
  Moon, 
  Zap, 
  Heart, 
  Trophy, 
  Users, 
  Crown,
  BarChart3,
  TrendingUp,
  Flame,
  Star,
  Award,
  Lightbulb,
  Settings,
  ArrowUp,
  ArrowDown,
  Palette,
  Type,
  Accessibility
} from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useTheme } from "@/hooks/useTheme";

const DarkModeDemo = () => {
  const { isDark } = useTheme();
  const [progress, setProgress] = useState(75);

  // Chart data for demo
  const chartData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Calories',
        data: [1800, 2100, 1950, 2200, 1900, 2400, 2000],
        borderColor: 'hsl(var(--sunset-orange))',
        backgroundColor: 'hsl(var(--sunset-orange) / 0.1)',
        tension: 0.4,
        fill: true,
      },
      {
        label: 'Steps',
        data: [8500, 9200, 7800, 10500, 8800, 12000, 9500],
        borderColor: 'hsl(var(--neon-green))',
        backgroundColor: 'hsl(var(--neon-green) / 0.1)',
        tension: 0.4,
        fill: true,
      }
    ]
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <div className="flex items-center justify-center space-x-4 mb-6">
            <h1 className="text-4xl font-bold text-foreground font-['Bebas Neue']">
              Dark Mode UI Showcase
            </h1>
            <ThemeToggle />
          </div>
          <p className="text-lg text-muted-foreground font-['Inter'] max-w-2xl mx-auto">
            Experience the sleek, modern Dark Mode interface optimized for readability, 
            energy efficiency, and user comfort during low-light conditions.
          </p>
          <Badge variant="outline" className="text-sm font-['Inter']">
            {isDark ? '🌙 Dark Mode Active' : '☀️ Light Mode Active'}
          </Badge>
        </motion.div>

        {/* Color Palette Showcase */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="card-enhanced">
            <CardHeader>
              <CardTitle className="text-2xl font-['Bebas Neue'] flex items-center space-x-2">
                <Palette className="h-6 w-6 text-primary" />
                <span>Dark Mode Color Palette</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { name: 'Neon Green', color: 'hsl(var(--neon-green))', desc: 'Energy bars, streaks, XP' },
                  { name: 'Sunset Orange', color: 'hsl(var(--sunset-orange))', desc: 'CTA buttons, actions' },
                  { name: 'Red-Violet', color: 'hsl(var(--red-violet))', desc: 'Alerts, warnings' },
                  { name: 'Highlight Blue', color: 'hsl(var(--highlight-blue))', desc: 'Charts, links' },
                  { name: 'Success Green', color: 'hsl(var(--success-green))', desc: 'Completed goals' },
                  { name: 'Error Red', color: 'hsl(var(--error-red))', desc: 'Errors, failures' },
                  { name: 'Main Background', color: 'hsl(var(--background))', desc: 'Deep charcoal black' },
                  { name: 'Card Background', color: 'hsl(var(--card))', desc: 'Slightly lighter' }
                ].map((item, index) => (
                  <div key={index} className="text-center space-y-2">
                    <div 
                      className="w-full h-16 rounded-lg border-2 border-border"
                      style={{ backgroundColor: item.color }}
                    />
                    <div>
                      <div className="font-semibold text-sm font-['Inter']">{item.name}</div>
                      <div className="text-xs text-muted-foreground font-['Inter']">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Typography Showcase */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="card-enhanced">
            <CardHeader>
              <CardTitle className="text-2xl font-['Bebas Neue'] flex items-center space-x-2">
                <Type className="h-6 w-6 text-primary" />
                <span>Typography System</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <h1 className="text-4xl font-bold text-foreground font-['Bebas Neue'] mb-2">
                    Bebas Neue - Headings
                  </h1>
                  <p className="text-muted-foreground font-['Inter']">
                    Tall, bold, visually dominant – perfect for stats & section headers
                  </p>
                </div>
                <div>
                  <h2 className="text-2xl font-semibold text-foreground font-['Inter'] mb-2">
                    Inter - Body Text
                  </h2>
                  <p className="text-muted-foreground font-['Inter']">
                    Highly legible sans-serif font – perfect for dark backgrounds and body content
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-mono text-foreground font-['Roboto Mono'] mb-2">
                    Roboto Mono - Numbers
                  </h3>
                  <p className="text-muted-foreground font-['Inter']">
                    Monospaced for alignment – improves clarity in numerical data
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Interactive Components */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="card-enhanced">
            <CardHeader>
              <CardTitle className="text-2xl font-['Bebas Neue'] flex items-center space-x-2">
                <Settings className="h-6 w-6 text-primary" />
                <span>Interactive Components</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Buttons */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold font-['Inter']">Buttons</h3>
                <div className="flex flex-wrap gap-4">
                  <Button className="btn-primary">Primary Action</Button>
                  <Button variant="outline" className="btn-secondary">Secondary Action</Button>
                  <Button variant="ghost">Ghost Button</Button>
                  <Button variant="destructive">Destructive Action</Button>
                </div>
              </div>

              {/* Form Elements */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold font-['Inter']">Form Elements</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium font-['Inter']">Input Field</label>
                    <Input placeholder="Enter your data..." />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium font-['Inter']">Select Dropdown</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose option" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="option1">Option 1</SelectItem>
                        <SelectItem value="option2">Option 2</SelectItem>
                        <SelectItem value="option3">Option 3</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium font-['Inter']">Textarea</label>
                  <Textarea placeholder="Enter your message..." />
                </div>
              </div>

              {/* Progress Indicators */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold font-['Inter']">Progress Indicators</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm font-['Inter'] mb-2">
                      <span>Daily Progress</span>
                      <span>{progress}%</span>
                    </div>
                    <Progress value={progress} className="progress-bar" />
                  </div>
                  <div className="flex gap-4">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setProgress(Math.max(0, progress - 10))}
                    >
                      <ArrowDown className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setProgress(Math.min(100, progress + 10))}
                    >
                      <ArrowUp className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Data Visualization */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="card-enhanced">
            <CardHeader>
              <CardTitle className="text-2xl font-['Bebas Neue'] flex items-center space-x-2">
                <BarChart3 className="h-6 w-6 text-primary" />
                <span>Data Visualization</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="charts" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="charts">Charts</TabsTrigger>
                  <TabsTrigger value="metrics">Metrics</TabsTrigger>
                  <TabsTrigger value="stats">Stats</TabsTrigger>
                </TabsList>
                <TabsContent value="charts" className="mt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="font-semibold font-['Inter']">Chart Colors</h4>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 rounded bg-[hsl(var(--neon-green))]" />
                          <span className="text-sm font-['Inter']">Neon Green - Positive trends</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 rounded bg-[hsl(var(--sunset-orange))]" />
                          <span className="text-sm font-['Inter']">Sunset Orange - Key metrics</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 rounded bg-[hsl(var(--highlight-blue))]" />
                          <span className="text-sm font-['Inter']">Highlight Blue - Chart lines</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 rounded bg-[hsl(var(--red-violet))]" />
                          <span className="text-sm font-['Inter']">Red-Violet - Negative patterns</span>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h4 className="font-semibold font-['Inter']">Chart Optimization</h4>
                      <ul className="text-sm text-muted-foreground font-['Inter'] space-y-2">
                        <li>• High contrast for better readability</li>
                        <li>• Consistent color scheme</li>
                        <li>• Smooth animations</li>
                        <li>• Accessible color combinations</li>
                      </ul>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="metrics" className="mt-6">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      { icon: Activity, value: '8,547', label: 'Steps', color: 'text-[hsl(var(--neon-green))]' },
                      { icon: Target, value: '1,850', label: 'Calories', color: 'text-[hsl(var(--sunset-orange))]' },
                      { icon: Droplet, value: '6', label: 'Water Cups', color: 'text-[hsl(var(--highlight-blue))]' },
                      { icon: Moon, value: '7.5', label: 'Sleep Hours', color: 'text-[hsl(var(--red-violet))]' }
                    ].map((metric, index) => (
                      <div key={index} className="text-center p-4 rounded-lg bg-card border border-border">
                        <metric.icon className={`h-8 w-8 mx-auto mb-2 ${metric.color}`} />
                        <div className="text-2xl font-bold font-['Roboto Mono']">{metric.value}</div>
                        <div className="text-sm text-muted-foreground font-['Inter']">{metric.label}</div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
                <TabsContent value="stats" className="mt-6">
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="p-4 rounded-lg bg-card border border-border">
                        <div className="flex items-center space-x-2 mb-2">
                          <TrendingUp className="h-5 w-5 text-success" />
                          <span className="font-semibold font-['Inter']">Weekly Progress</span>
                        </div>
                        <div className="text-2xl font-bold text-success font-['Roboto Mono']">+15%</div>
                        <div className="text-sm text-muted-foreground font-['Inter']">vs last week</div>
                      </div>
                      <div className="p-4 rounded-lg bg-card border border-border">
                        <div className="flex items-center space-x-2 mb-2">
                          <Flame className="h-5 w-5 text-[hsl(var(--sunset-orange))]" />
                          <span className="font-semibold font-['Inter']">Streak</span>
                        </div>
                        <div className="text-2xl font-bold text-[hsl(var(--sunset-orange))] font-['Roboto Mono']">7 days</div>
                        <div className="text-sm text-muted-foreground font-['Inter']">Personal best!</div>
                      </div>
                      <div className="p-4 rounded-lg bg-card border border-border">
                        <div className="flex items-center space-x-2 mb-2">
                          <Award className="h-5 w-5 text-[hsl(var(--highlight-blue))]" />
                          <span className="font-semibold font-['Inter']">Achievements</span>
                        </div>
                        <div className="text-2xl font-bold text-[hsl(var(--highlight-blue))] font-['Roboto Mono']">12</div>
                        <div className="text-sm text-muted-foreground font-['Inter']">unlocked</div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </motion.div>

        {/* Accessibility Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="card-enhanced">
            <CardHeader>
              <CardTitle className="text-2xl font-['Bebas Neue'] flex items-center space-x-2">
                <Accessibility className="h-6 w-6 text-primary" />
                <span>Accessibility & UX</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold font-['Inter']">Contrast Ratios</h4>
                  <div className="space-y-2 text-sm font-['Inter']">
                    <div className="flex justify-between">
                      <span>Primary text on background:</span>
                      <span className="font-mono">4.5:1 ✓</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Secondary text on background:</span>
                      <span className="font-mono">3:1 ✓</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Interactive elements:</span>
                      <span className="font-mono">4.5:1 ✓</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="font-semibold font-['Inter']">Focus Indicators</h4>
                  <div className="space-y-2">
                    <Button variant="outline" className="focus:ring-2 focus:ring-primary focus:ring-offset-2">
                      Focus me (Tab to see)
                    </Button>
                    <p className="text-sm text-muted-foreground font-['Inter']">
                      All interactive elements have visible focus indicators
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-center space-y-4 pt-8 border-t border-border"
        >
          <h3 className="text-xl font-semibold font-['Bebas Neue']">Dark Mode Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm font-['Inter']">
            <div className="space-y-2">
              <h4 className="font-semibold">Visual Comfort</h4>
              <p className="text-muted-foreground">Optimized for low-light environments</p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold">Energy Efficiency</h4>
              <p className="text-muted-foreground">Reduces eye strain and battery usage</p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold">Modern Design</h4>
              <p className="text-muted-foreground">Sleek, professional appearance</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DarkModeDemo; 