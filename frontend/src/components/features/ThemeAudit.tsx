import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, AlertCircle, Eye, EyeOff } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import { motion } from "framer-motion";

interface AuditItem {
  id: string;
  component: string;
  screen: string;
  status: 'completed' | 'pending' | 'issues';
  notes: string;
  priority: 'high' | 'medium' | 'low';
}

const auditItems: AuditItem[] = [
  {
    id: '1',
    component: 'Login/Register',
    screen: 'Authentication',
    status: 'completed',
    notes: 'Input fields and social buttons have sufficient contrast',
    priority: 'high'
  },
  {
    id: '2',
    component: 'Dashboard',
    screen: 'Main Dashboard',
    status: 'completed',
    notes: 'Background, cards, and icons updated for both themes',
    priority: 'high'
  },
  {
    id: '3',
    component: 'Workout Planner',
    screen: 'Fitness',
    status: 'completed',
    notes: 'Calendar view and cards support light backgrounds',
    priority: 'high'
  },
  {
    id: '4',
    component: 'Sleep Tracker',
    screen: 'Sleep',
    status: 'completed',
    notes: 'Soft backgrounds and visible graph lines implemented',
    priority: 'medium'
  },
  {
    id: '5',
    component: 'Hydration & Nutrition',
    screen: 'Nutrition',
    status: 'completed',
    notes: 'Charts and stats optimized for visibility',
    priority: 'high'
  },
  {
    id: '6',
    component: 'Settings Page',
    screen: 'Settings',
    status: 'completed',
    notes: 'Theme selector with 3-option implementation',
    priority: 'high'
  },
  {
    id: '7',
    component: 'Theme Toggle',
    screen: 'Global',
    status: 'completed',
    notes: 'Quick access theme switcher in header',
    priority: 'high'
  },
  {
    id: '8',
    component: 'Charts & Graphs',
    screen: 'Multiple',
    status: 'completed',
    notes: 'Visibility of lines, tooltips, and text optimized',
    priority: 'medium'
  },
  {
    id: '9',
    component: 'Form Elements',
    screen: 'Multiple',
    status: 'completed',
    notes: 'Input fields, buttons, and controls themed',
    priority: 'high'
  },
  {
    id: '10',
    component: 'Navigation',
    screen: 'Global',
    status: 'completed',
    notes: 'Header, sidebar, and navigation elements themed',
    priority: 'high'
  },
  {
    id: '11',
    component: 'Cards & Containers',
    screen: 'Multiple',
    status: 'completed',
    notes: 'All card components support both themes',
    priority: 'medium'
  },
  {
    id: '12',
    component: 'Buttons & CTAs',
    screen: 'Multiple',
    status: 'completed',
    notes: 'All button variants work in both themes',
    priority: 'high'
  },
  {
    id: '13',
    component: 'Icons & SVGs',
    screen: 'Multiple',
    status: 'completed',
    notes: 'Icons reviewed for visibility on light backgrounds',
    priority: 'medium'
  },
  {
    id: '14',
    component: 'Animations & Transitions',
    screen: 'Global',
    status: 'completed',
    notes: 'Smooth transitions between themes implemented',
    priority: 'low'
  },
  {
    id: '15',
    component: 'Accessibility',
    screen: 'Global',
    status: 'completed',
    notes: 'WCAG 2.1 AA contrast ratios maintained',
    priority: 'high'
  }
];

export function ThemeAudit() {
  const { theme, isDark } = useTheme();
  const [showDetails, setShowDetails] = useState(false);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'pending':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case 'issues':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const completedItems = auditItems.filter(item => item.status === 'completed').length;
  const totalItems = auditItems.length;
  const completionPercentage = Math.round((completedItems / totalItems) * 100);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Theme Implementation Audit</span>
            <div className="flex items-center space-x-2">
              <Badge variant="outline">
                {theme} mode
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowDetails(!showDetails)}
              >
                {showDetails ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                {showDetails ? 'Hide Details' : 'Show Details'}
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Progress Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-lg border">
                <div className="text-2xl font-bold text-green-600">{completionPercentage}%</div>
                <div className="text-sm text-muted-foreground">Completion</div>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-lg border">
                <div className="text-2xl font-bold text-blue-600">{completedItems}</div>
                <div className="text-sm text-muted-foreground">Completed</div>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-orange-500/10 to-red-500/10 rounded-lg border">
                <div className="text-2xl font-bold text-orange-600">{totalItems - completedItems}</div>
                <div className="text-sm text-muted-foreground">Remaining</div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Theme Implementation Progress</span>
                <span>{completedItems}/{totalItems}</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <motion.div
                  className="bg-primary h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${completionPercentage}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
              </div>
            </div>

            {/* Detailed Audit List */}
            {showDetails && (
              <div className="space-y-3">
                <h3 className="font-semibold text-lg">Detailed Audit</h3>
                <div className="grid gap-3">
                  {auditItems.map((item) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`p-4 rounded-lg border ${
                        item.status === 'completed' 
                          ? 'bg-green-50 border-green-200' 
                          : item.status === 'issues'
                          ? 'bg-red-50 border-red-200'
                          : 'bg-yellow-50 border-yellow-200'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            {getStatusIcon(item.status)}
                            <h4 className="font-medium">{item.component}</h4>
                            <Badge 
                              variant="outline" 
                              className={`text-xs ${getPriorityColor(item.priority)}`}
                            >
                              {item.priority}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-1">
                            Screen: {item.screen}
                          </p>
                          <p className="text-sm">{item.notes}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 