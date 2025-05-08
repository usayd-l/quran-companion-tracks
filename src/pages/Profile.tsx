
import React from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getUserById, getLogsByUserId, currentUser } from "@/data/mockData";
import UserProfile from "@/components/ui/UserProfile";
import LogEntry from "@/components/ui/LogEntry";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Profile = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  
  const user = userId ? getUserById(userId) : undefined;
  const logs = user ? getLogsByUserId(user.id) : [];
  
  const isCurrentUser = user && user.id === currentUser.id;
  const isTeacher = currentUser.role === "teacher";
  const isTeacherOfUser = user && user.teacherId === currentUser.id;
  
  if (!user) {
    return (
      <div className="container max-w-md mx-auto px-4 py-6">
        <div className="text-center p-6">
          <h1 className="text-xl font-bold mb-4">User Not Found</h1>
          <p className="mb-4 text-muted-foreground">The requested user profile could not be found.</p>
          <Button onClick={() => navigate("/")}>Go Home</Button>
        </div>
      </div>
    );
  }
  
  const recentLogs = [...logs].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  
  return (
    <div className="container max-w-md mx-auto px-4 py-6 pattern-bg">
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
      
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Recitation Logs</h2>
        {(isCurrentUser || isTeacherOfUser) && (
          <Link to={isTeacherOfUser ? `/create-log/${user.id}` : "/create-log"}>
            <Button className="bg-primary hover:bg-primary/90">
              <Plus className="h-4 w-4 mr-2" />
              New Log
            </Button>
          </Link>
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
              <Link to={isTeacherOfUser ? `/create-log/${user.id}` : "/create-log"} className="block mt-4">
                <Button className="bg-primary hover:bg-primary/90">
                  Create First Log
                </Button>
              </Link>
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
    </div>
  );
};

export default Profile;
