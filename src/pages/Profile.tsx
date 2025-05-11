import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getUserById, getLogsByUserId, getCurrentUser } from "@/services/localStorage";
import UserProfile from "@/components/ui/UserProfile";
import LogEntry from "@/components/ui/LogEntry";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Plus, BarChart } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from "@/components/ui/Header";
import { generateAnalyticsData } from "@/data/analyticsData";
import AnalyticsDashboard from "@/components/ui/analytics/AnalyticsDashboard";
import { useAuth } from "@/context/AuthContext";

const Profile = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const { authState } = useAuth();
  const [activeTab, setActiveTab] = useState<"logs" | "analytics">("logs");
  
  // If we don't have a user yet, use the URL parameter
  const currentAuthUser = authState.user;
  const user = userId ? getUserById(userId) : currentAuthUser;
  
  if (!user) {
    return (
      <div className="container max-w-md mx-auto px-4 py-6">
        <Header />
        <div className="text-center p-6">
          <h1 className="text-xl font-bold mb-4">User Not Found</h1>
          <p className="mb-4 text-muted-foreground">The requested user profile could not be found.</p>
          <Button onClick={() => navigate("/")}>Go Home</Button>
        </div>
      </div>
    );
  }
  
  const logs = getLogsByUserId(user?.id || '');
  const analyticsData = generateAnalyticsData(logs);
  
  const recentLogs = [...logs].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  
  const isCurrentUser = currentAuthUser && user && user.id === currentAuthUser.id;
  const isTeacher = currentAuthUser && currentAuthUser.role === "teacher";
  const isTeacherOfUser = user && currentAuthUser && user.classroomId === currentAuthUser.classroomId;
  
  const handleCreateLog = () => {
    if (isTeacherOfUser) {
      navigate(`/create-log/${user.id}`);
    } else {
      navigate("/create-log");
    }
  };
  
  return (
    <div className="container max-w-md mx-auto px-4 py-0 min-h-screen pattern-bg">
      <Header />
      
      <div className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => navigate(-1)}
          className="mr-4"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-xl font-bold">Profile</h1>
      </div>
      
      <div className="mb-6">
        <UserProfile user={user} />
      </div>
      
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
            <h2 className="text-lg font-semibold">Recitation Logs</h2>
            {(isCurrentUser || isTeacherOfUser) && (
              <Button 
                className="bg-primary hover:bg-primary/90"
                onClick={handleCreateLog}
              >
                <Plus className="h-4 w-4 mr-2" />
                New Log
              </Button>
            )}
          </div>
          
          {recentLogs.length === 0 ? (
            <Card>
              <CardHeader>
                <CardTitle className="text-center text-lg">No logs yet</CardTitle>
              </CardHeader>
              <CardContent className="text-center pb-6">
                <p className="text-muted-foreground">No recitation logs have been recorded yet.</p>
                {(isCurrentUser || isTeacherOfUser) && (
                  <Button 
                    className="mt-4 bg-primary hover:bg-primary/90"
                    onClick={handleCreateLog}
                  >
                    Create First Log
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {recentLogs.map(log => (
                <LogEntry key={log.id} log={log} />
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="analytics">
          <div className="mb-4">
            <h2 className="text-lg font-semibold">Progress Analytics</h2>
            <p className="text-sm text-muted-foreground">Track progress and identify patterns</p>
          </div>
          
          <AnalyticsDashboard data={analyticsData} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Profile;
