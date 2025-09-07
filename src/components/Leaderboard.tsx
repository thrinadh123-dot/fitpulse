import { useState } from "react";
import { Trophy, Medal, Crown, Users, TrendingUp, TrendingDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface LeaderboardEntry {
  id: string;
  rank: number;
  name: string;
  avatar: string;
  score: number;
  metric: string;
  change: number;
  isCurrentUser: boolean;
}

interface LeaderboardProps {
  entries: LeaderboardEntry[];
  metric: 'steps' | 'calories' | 'streak' | 'hydration';
  timeFrame: 'daily' | 'weekly' | 'monthly';
}

const Leaderboard = ({ entries, metric, timeFrame }: LeaderboardProps) => {
  const [selectedMetric, setSelectedMetric] = useState(metric);

  const getMetricIcon = (metric: string) => {
    switch (metric) {
      case 'steps':
        return <TrendingUp className="h-4 w-4" />;
      case 'calories':
        return <TrendingUp className="h-4 w-4" />;
      case 'streak':
        return <TrendingUp className="h-4 w-4" />;
      case 'hydration':
        return <TrendingUp className="h-4 w-4" />;
      default:
        return <TrendingUp className="h-4 w-4" />;
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="h-5 w-5 text-yellow-500" />;
      case 2:
        return <Medal className="h-5 w-5 text-gray-400" />;
      case 3:
        return <Medal className="h-5 w-5 text-amber-600" />;
      default:
        return <Trophy className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const formatScore = (score: number, metric: string) => {
    switch (metric) {
      case 'steps':
        return `${score.toLocaleString()} steps`;
      case 'calories':
        return `${score.toLocaleString()} kcal`;
      case 'streak':
        return `${score} days`;
      case 'hydration':
        return `${score} glasses`;
      default:
        return score.toString();
    }
  };

  return (
    <Card className="shadow-lg border-primary/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Trophy className="h-5 w-5 text-primary" />
            <span>Leaderboard</span>
          </CardTitle>
          <Badge variant="outline" className="text-xs">
            {timeFrame.charAt(0).toUpperCase() + timeFrame.slice(1)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Metric Selector */}
        <div className="flex space-x-2">
          {['steps', 'calories', 'streak', 'hydration'].map((m) => (
            <Button
              key={m}
              variant={selectedMetric === m ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedMetric(m as 'steps' | 'calories' | 'streak' | 'hydration')}
              className="text-xs"
            >
              {getMetricIcon(m)}
              <span className="ml-1 capitalize">{m}</span>
            </Button>
          ))}
        </div>

        {/* Leaderboard Entries */}
        <div className="space-y-2">
          {entries.map((entry, index) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className={`flex items-center space-x-3 p-3 rounded-lg transition-all ${
                entry.isCurrentUser
                  ? 'bg-primary/10 border border-primary/30'
                  : 'bg-muted/20 hover:bg-muted/30'
              }`}
            >
              {/* Rank */}
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted">
                {entry.rank <= 3 ? (
                  getRankIcon(entry.rank)
                ) : (
                  <span className="text-sm font-medium">{entry.rank}</span>
                )}
              </div>

              {/* Avatar */}
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <span className="text-xs font-bold text-primary-foreground">
                  {entry.name.charAt(0).toUpperCase()}
                </span>
              </div>

              {/* Name and Score */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <span className={`text-sm font-medium truncate ${
                    entry.isCurrentUser ? 'text-primary' : ''
                  }`}>
                    {entry.isCurrentUser ? 'You' : entry.name}
                  </span>
                  {entry.isCurrentUser && (
                    <Badge variant="secondary" className="text-xs">
                      You
                    </Badge>
                  )}
                </div>
                <div className="text-xs text-muted-foreground">
                  {formatScore(entry.score, selectedMetric)}
                </div>
              </div>

              {/* Change Indicator */}
              <div className="flex items-center space-x-1">
                {entry.change > 0 ? (
                  <TrendingUp className="h-3 w-3 text-green-500" />
                ) : entry.change < 0 ? (
                  <TrendingDown className="h-3 w-3 text-red-500" />
                ) : null}
                {entry.change !== 0 && (
                  <span className={`text-xs ${
                    entry.change > 0 ? 'text-green-500' : 'text-red-500'
                  }`}>
                    {Math.abs(entry.change)}
                  </span>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* View All Button */}
        <Button variant="outline" className="w-full" size="sm">
          <Users className="h-4 w-4 mr-2" />
          View Full Leaderboard
        </Button>
      </CardContent>
    </Card>
  );
};

export default Leaderboard; 