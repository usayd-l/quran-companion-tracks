
import React, { useState, useEffect } from "react";
import { currentUser, getLogsByUserId, getStudentsByTeacherId } from "@/data/mockData";
import { User } from "@/types";
import Dashboard from "@/components/ui/Dashboard";
import UserProfile from "@/components/ui/UserProfile";
import StudentList from "@/components/ui/StudentList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Users } from "lucide-react";

const Index = () => {
  const user = currentUser; // This would come from authentication
  const [selectedTab, setSelectedTab] = useState<"dashboard" | "students">("dashboard");
  const [students, setStudents] = useState<User[]>([]);
  
  useEffect(() => {
    if (user.role === "teacher") {
      setStudents(getStudentsByTeacherId(user.id));
    }
  }, [user.id, user.role]);

  // Get logs based on the user's role
  const userLogs = user.role === "student" 
    ? getLogsByUserId(user.id)
    : students.flatMap(student => getLogsByUserId(student.id));

  return (
    <div className="container max-w-md mx-auto px-4 py-6 min-h-screen pattern-bg">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-center mb-2">Quran Companion</h1>
        <div className="mb-4">
          <UserProfile user={user} />
        </div>
      </div>
      
      {user.role === "teacher" ? (
        <Tabs defaultValue="dashboard" onValueChange={(value) => setSelectedTab(value as any)}>
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="dashboard" className="flex items-center justify-center gap-2">
              <BookOpen className="h-4 w-4" />
              <span>Logs</span>
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
                </CardContent>
              </Card>
            ) : (
              <div>
                <h2 className="text-xl font-semibold mb-4">Your Students</h2>
                <StudentList students={students} />
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
