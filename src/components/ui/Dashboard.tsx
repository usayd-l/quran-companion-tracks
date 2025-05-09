
import React, { useState, useEffect } from "react";
import { User, RecitationLog } from "@/types";
import { Button } from "@/components/ui/button";
import LogEntry from "./LogEntry";
import { Link, useNavigate } from "react-router-dom";
import { Plus, BarChart } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { generateAnalyticsData } from "@/data/analyticsData";
import AnalyticsDashboard from "./analytics/AnalyticsDashboard";
import { getLogsByUserId } from "@/data/mockData";

interface DashboardProps {
  user: User;
  logs: RecitationLog[];
  showStudentNames?: boolean;
  refreshTrigger?: number;
}

const Dashboard: React.FC<DashboardProps> = ({ 
  user, 
  logs: initialLogs,
  showStudentNames = false,
  refreshTrigger = 0
}) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"logs" | "analytics">("logs");
  const [logs, setLogs] = useState<RecitationLog[]>(initialLogs);
  
  // Re-fetch logs when refreshTrigger changes or when initialLogs change
  useEffect(() => {
    if (user.role === "student") {
      setLogs(getLogsByUserId(user.id));
    } else {
      // For teachers, we'll use the logs passed from the parent which are already updated
      setLogs(initialLogs);
    }
  }, [initialLogs, user.id, user.role, refreshTrigger]);
  
  const recentLogs = [...logs].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  ).slice(0, 5);
  
  const analyticsData = generateAnalyticsData(logs);

  const handleCreateLog = (studentId?: string) => {
    if (studentId) {
      navigate(`/create-log/${studentId}`);
    } else {
      navigate("/create-log");
    }
  };

  return (
    <div className="space-y-6">
      <Tabs 
        defaultValue="logs" 
        value={activeTab} 
        onValueChange={(value) => setActiveTab(value as "logs" | "analytics")}
      >
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="logs" className="flex items-center justify-center gap-2">
            <Plus className="h-4 w-4" />
            <span>Logs</span>
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center justify-center gap-2">
            <BarChart className="h-4 w-4" />
            <span>Analytics</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="logs">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Recent Activity</h2>
            <Button 
              className="bg-primary hover:bg-primary/90"
              onClick={() => handleCreateLog()}
            >
              <Plus className="h-4 w-4 mr-2" />
              New Log
            </Button>
          </div>
          
          {recentLogs.length === 0 ? (
            <Card>
              <CardHeader>
                <CardTitle className="text-center text-lg">No logs yet</CardTitle>
              </CardHeader>
              <CardContent className="text-center pb-6">
                <p className="text-muted-foreground mb-4">Start tracking your Quran memorization journey by creating your first log.</p>
                <Button 
                  className="bg-primary hover:bg-primary/90"
                  onClick={() => handleCreateLog()}
                >
                  Create First Log
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div>
              {recentLogs.map((log) => (
                <LogEntry 
                  key={log.id} 
                  log={log} 
                  showStudent={showStudentNames}
                />
              ))}
              
              {logs.length > 5 && (
                <div className="text-center mt-4">
                  <Button variant="outline" className="border-primary text-primary hover:bg-primary-light">
                    View All Logs
                  </Button>
                </div>
              )}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="analytics">
          <div className="mb-4">
            <h2 className="text-xl font-semibold">Analytics</h2>
            <p className="text-sm text-muted-foreground">Track your progress and identify patterns</p>
          </div>
          
          <AnalyticsDashboard data={analyticsData} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
