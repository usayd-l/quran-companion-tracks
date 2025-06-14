
import React from "react";
import { RecitationLog } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  calculateStreak, 
  getGradeDistribution, 
  getMistakeTrends,
  getRecitationTypeStats,
  getWeeklyProgress
} from "@/services/enhancedAnalyticsService";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { Flame, TrendingUp, Target, Calendar, BookOpen, Award } from "lucide-react";

interface EnhancedAnalyticsDashboardProps {
  logs: RecitationLog[];
}

const EnhancedAnalyticsDashboard: React.FC<EnhancedAnalyticsDashboardProps> = ({ logs }) => {
  if (logs.length === 0) {
    return (
      <div className="text-center p-6">
        <h3 className="text-lg font-medium mb-2">No Analytics Data</h3>
        <p className="text-muted-foreground">
          Start creating recitation logs to see your progress analytics.
        </p>
      </div>
    );
  }

  const streakData = calculateStreak(logs);
  const gradeDistribution = getGradeDistribution(logs);
  const mistakeTrends = getMistakeTrends(logs);
  const typeStats = getRecitationTypeStats(logs);
  const weeklyProgress = getWeeklyProgress(logs);

  return (
    <div className="space-y-4">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-3">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Current Streak</p>
                <p className="text-2xl font-bold">{streakData.currentStreak}</p>
                <p className="text-xs text-muted-foreground">days</p>
              </div>
              <Flame className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Sessions</p>
                <p className="text-2xl font-bold">{logs.length}</p>
                <p className="text-xs text-muted-foreground">logged</p>
              </div>
              <BookOpen className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Grade Distribution */}
      {gradeDistribution.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center">
              <Award className="h-4 w-4 mr-2" />
              Grade Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={gradeDistribution}
                    cx="50%"
                    cy="50%"
                    outerRadius={60}
                    dataKey="count"
                    label={({ grade, percentage }) => `${grade}: ${percentage}%`}
                    labelLine={false}
                    fontSize={10}
                  >
                    {gradeDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Mistake Trends */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center">
            <TrendingUp className="h-4 w-4 mr-2" />
            Mistake Trends (Last 7 Days)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mistakeTrends}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" fontSize={10} />
                <YAxis fontSize={10} />
                <Line 
                  type="monotone" 
                  dataKey="totalMistakes" 
                  stroke="#ef4444" 
                  strokeWidth={2}
                  dot={{ fill: '#ef4444', strokeWidth: 2, r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Weekly Progress */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center">
            <Calendar className="h-4 w-4 mr-2" />
            Weekly Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyProgress}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="week" fontSize={10} />
                <YAxis fontSize={10} />
                <Bar dataKey="sessionsCount" fill="#4A6741" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Recitation Type Stats */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center">
            <Target className="h-4 w-4 mr-2" />
            Performance by Type
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {typeStats.map((stat) => (
              <div key={stat.type} className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg">
                <div>
                  <p className="font-medium text-sm">{stat.type}</p>
                  <p className="text-xs text-muted-foreground">
                    {stat.totalSessions} sessions • Avg Grade: {stat.averageGrade}/5
                  </p>
                </div>
                <Badge variant="outline" className="text-xs">
                  {stat.totalMistakes} mistakes
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedAnalyticsDashboard;
