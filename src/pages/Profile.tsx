
import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { getUserById, getLogsByUserId } from "@/services/supabaseService";
import LogEntry from "@/components/ui/LogEntry";
import { Button } from "@/components/ui/button";
import { ChevronLeft, User as UserIcon, BarChart } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from "@/components/ui/Header";
import AnalyticsDashboard from "@/components/ui/analytics/AnalyticsDashboard";
import FloatingActionButton from "@/components/ui/FloatingActionButton";
import { useAuth } from "@/context/AuthContext";
import { format } from "date-fns";
import { User, RecitationLog } from "@/types";

const Profile = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { authState } = useAuth();
  const [activeTab, setActiveTab] = useState<"logs" | "analytics">("logs");
  const [user, setUser] = useState<User | null>(null);
  const [logs, setLogs] = useState<RecitationLog[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Get selected date from navigation state if available
  const selectedDate = location.state?.selectedDate ? new Date(location.state.selectedDate) : null;
  
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        
        // Get user data
        const userData = userId ? await getUserById(userId) : authState.user;
        if (!userData) {
          setLoading(false);
          return;
        }
        setUser(userData);
        
        // Get user logs
        const userLogs = await getLogsByUserId(userData.id);
        setLogs(userLogs);
        
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (!authState.loading) {
      fetchUserData();
    }
  }, [userId, authState.user, authState.loading]);
  
  if (authState.loading || loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

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
  
  // Filter logs by selected date if provided
  const filteredLogs = selectedDate 
    ? logs.filter(log => log.date === format(selectedDate, "yyyy-MM-dd"))
    : logs;
  
  const recentLogs = [...filteredLogs].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  
  const isCurrentUser = authState.user && user && user.id === authState.user.id;
  const isTeacher = authState.user && authState.user.role === "teacher";
  
  const handleCreateLog = () => {
    navigate(`/create-log/${user.id}`);
  };

  const handleViewAllLogs = () => {
    navigate("/all-logs", { state: { userId: user.id } });
  };

  const handleStudentProfileClick = () => {
    navigate(`/student-profile/${user.id}`);
  };

  const handleLogClick = (log: RecitationLog) => {
    navigate(`/log/${log.id}`);
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
        <div className="flex-1">
          <button
            onClick={handleStudentProfileClick}
            className="text-left hover:text-primary transition-colors"
          >
            <h1 className="text-xl font-bold">
              {selectedDate ? `${user.name} - ${format(selectedDate, "MMM d, yyyy")}` : user.name}
            </h1>
          </button>
        </div>
      </div>
      
      <Tabs 
        defaultValue="logs" 
        value={activeTab} 
        onValueChange={(value) => setActiveTab(value as "logs" | "analytics")}
      >
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="logs" className="flex items-center justify-center gap-2">
            <ChevronLeft className="h-4 w-4" />
            <span>Logs</span>
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center justify-center gap-2">
            <BarChart className="h-4 w-4" />
            <span>Analytics</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="logs">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">
              {selectedDate ? `Logs for ${format(selectedDate, "MMM d, yyyy")}` : "Recitation Logs"}
            </h2>
          </div>
          
          {recentLogs.length === 0 ? (
            <Card>
              <CardHeader>
                <CardTitle className="text-center text-lg">
                  {selectedDate ? "No logs for this date" : "No logs yet"}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center pb-6">
                <p className="text-muted-foreground mb-4">
                  {selectedDate 
                    ? "No recitation logs were recorded for this date."
                    : "No recitation logs have been recorded yet."}
                </p>
                {!selectedDate && (
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
                <LogEntry 
                  key={log.id} 
                  log={log} 
                  onClick={() => handleLogClick(log)}
                />
              ))}
              
              {selectedDate && (
                <div className="text-center mt-4">
                  <Button 
                    variant="outline" 
                    className="border-primary text-primary hover:bg-primary-light"
                    onClick={handleViewAllLogs}
                  >
                    View All Logs
                  </Button>
                </div>
              )}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="analytics">
          <div className="mb-4">
            <h2 className="text-lg font-semibold">Progress Analytics</h2>
            <p className="text-sm text-muted-foreground">Track progress and identify patterns</p>
          </div>
          
          <AnalyticsDashboard logs={logs} />
        </TabsContent>
      </Tabs>

      {/* Floating Action Button */}
      {(isCurrentUser || isTeacher) && (
        <FloatingActionButton onClick={handleCreateLog} />
      )}
    </div>
  );
};

export default Profile;
