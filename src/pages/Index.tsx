
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getLogsByUserId, getStudentsByTeacherId } from "@/data/mockData";
import { User } from "@/types";
import Dashboard from "@/components/ui/Dashboard";
import UserProfile from "@/components/ui/UserProfile";
import StudentList from "@/components/ui/StudentList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Users } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import Header from "@/components/ui/Header";

const Index = () => {
  const { authState } = useAuth();
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState<"dashboard" | "students">("dashboard");
  const [students, setStudents] = useState<User[]>([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  
  // If not authenticated, redirect to login
  useEffect(() => {
    if (!authState.loading && !authState.isAuthenticated) {
      navigate("/login");
    }
  }, [authState, navigate]);
  
  // If we don't have a user yet, show a loading state
  if (!authState.user) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }
  
  // Get the current user
  const user = authState.user;
  
  // Get students if the user is a teacher
  useEffect(() => {
    if (user.role === "teacher") {
      setStudents(getStudentsByTeacherId(user.id));
    }
  }, [user.id, user.role, refreshTrigger]);

  // Get logs based on the user's role
  const userLogs = user.role === "student" 
    ? getLogsByUserId(user.id)
    : students.flatMap(student => getLogsByUserId(student.id));
    
  // Handle creating a log for a specific student
  const handleCreateLog = (studentId: string) => {
    navigate(`/create-log/${studentId}`);
  };

  // Handle refreshing student list after adding a new student
  const handleStudentAdded = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="container max-w-md mx-auto px-4 py-0 min-h-screen pattern-bg">
      <Header />
      
      <div className="mb-6">
        <UserProfile user={user} />
      </div>
      
      {user.role === "teacher" ? (
        <Tabs defaultValue="dashboard" onValueChange={(value) => setSelectedTab(value as any)}>
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="dashboard" className="flex items-center justify-center gap-2">
              <BookOpen className="h-4 w-4" />
              <span>Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="students" className="flex items-center justify-center gap-2">
              <Users className="h-4 w-4" />
              <span>Students</span>
            </TabsTrigger>
          </TabsList>
          <TabsContent value="dashboard">
            <Dashboard
              user={user}
              logs={userLogs}
              showStudentNames={true}
              refreshTrigger={refreshTrigger}
            />
          </TabsContent>
          <TabsContent value="students">
            {students.length === 0 ? (
              <Card>
                <CardHeader>
                  <CardTitle className="text-center text-lg">No students yet</CardTitle>
                </CardHeader>
                <CardContent className="text-center pb-6">
                  <p className="text-muted-foreground mb-4">You don't have any students yet.</p>
                  <StudentList 
                    students={[]} 
                    teacherId={user.id}
                    onStudentAdded={handleStudentAdded}
                  />
                </CardContent>
              </Card>
            ) : (
              <div>
                <h2 className="text-xl font-semibold mb-4">Your Students</h2>
                <StudentList 
                  students={students} 
                  onCreateLog={handleCreateLog}
                  teacherId={user.id}
                  onStudentAdded={handleStudentAdded}
                />
              </div>
            )}
          </TabsContent>
        </Tabs>
      ) : (
        <Dashboard user={user} logs={userLogs} />
      )}
    </div>
  );
};

export default Index;
