import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User, Classroom, RecitationLog } from "@/types";
import Dashboard from "@/components/ui/Dashboard";
import UserProfile from "@/components/ui/UserProfile";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Users, School } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import Header from "@/components/ui/Header";
import ClassroomList from "@/components/ui/classroom/ClassroomList";
import StudentsPanel from "@/components/ui/classroom/StudentsPanel";
import {
  getUsersByClassroomId,
  getClassroomsByTeacherId,
  getLogsByUserId,
  getLogsByClassroomId
} from "@/services/supabaseService";
import FloatingActionButton from "@/components/ui/FloatingActionButton";

const Index = () => {
  const { authState } = useAuth();
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState<"dashboard" | "students" | "classrooms">("dashboard");
  const [selectedClassroomId, setSelectedClassroomId] = useState<string | undefined>(undefined);
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [students, setStudents] = useState<User[]>([]);
  const [logs, setLogs] = useState<RecitationLog[]>([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  
  // If not authenticated, redirect to login
  useEffect(() => {
    if (!authState.loading && !authState.isAuthenticated) {
      navigate("/login");
    }
  }, [authState, navigate]);
  
  // If we don't have a user yet, show a loading state
  if (!authState.loading && !authState.isAuthenticated) {
    navigate("/login");
  }

  // If we don't have a user yet, show a loading state
  if (!authState.user) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }
  
  // Get the current user
  const user = authState.user;
  
  // Get classrooms if the user is a teacher
  useEffect(() => {
    const fetchClassrooms = async () => {
      if (user.role === "teacher") {
        const teacherClassrooms = await getClassroomsByTeacherId(user.id);
        setClassrooms(teacherClassrooms);
        
        // Select the first classroom by default if none is selected
        if (teacherClassrooms.length > 0 && !selectedClassroomId) {
          setSelectedClassroomId(teacherClassrooms[0].id);
        }
      }
    };

    fetchClassrooms();
  }, [user.id, user.role, refreshTrigger]);
  
  // When a classroom is selected, get its students
  useEffect(() => {
    const fetchStudents = async () => {
      if (selectedClassroomId) {
        const classroomStudents = await getUsersByClassroomId(selectedClassroomId);
        // Add classroom name to each student for display
        const studentsWithClassroom = classroomStudents.map(student => ({
          ...student,
          classroomName: classrooms.find(c => c.id === selectedClassroomId)?.name
        }));
        setStudents(studentsWithClassroom);
      }
    };

    fetchStudents();
  }, [selectedClassroomId, refreshTrigger, classrooms]);

  // Fetch logs based on user role
  useEffect(() => {
    const fetchLogs = async () => {
      try {
        let userLogs: RecitationLog[] = [];
        
        if (user.role === "student") {
          userLogs = await getLogsByUserId(user.id);
        } else if (user.role === "teacher" && selectedClassroomId) {
          userLogs = await getLogsByClassroomId(selectedClassroomId);
        }
        
        setLogs(userLogs);
      } catch (error) {
        console.error("Error fetching logs:", error);
        setLogs([]);
      }
    };

    fetchLogs();
  }, [user.role, user.id, selectedClassroomId, refreshTrigger]);
    
  // Handle creating a log for a specific student
  const handleCreateLog = (studentId: string) => {
    navigate(`/create-log/${studentId}`);
  };

  // Handle refreshing after adding a classroom or student
  const handleRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };
  
  // Handle selection of a classroom
  const handleClassroomSelected = (classroomId: string) => {
    setSelectedClassroomId(classroomId);
    if (selectedTab !== "students") {
      setSelectedTab("students");
    }
  };

  return (
    <div className="container max-w-md mx-auto px-4 py-0 min-h-screen pattern-bg">
      <Header />
      
      <div className="mb-6">
        <UserProfile user={user} />
      </div>
      
      {user.role === "teacher" ? (
        <Tabs defaultValue="dashboard" onValueChange={(value) => setSelectedTab(value as any)} value={selectedTab}>
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="dashboard" className="flex items-center justify-center gap-2">
              <BookOpen className="h-4 w-4" />
              <span>Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="classrooms" className="flex items-center justify-center gap-2">
              <School className="h-4 w-4" />
              <span>Classrooms</span>
            </TabsTrigger>
            <TabsTrigger value="students" className="flex items-center justify-center gap-2">
              <Users className="h-4 w-4" />
              <span>Students</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="dashboard">
            <Dashboard
              user={user}
              logs={logs}
              students={students}
              showStudentNames={true}
              refreshTrigger={refreshTrigger}
            />
          </TabsContent>
          
          <TabsContent value="classrooms">
            <div>
              <h2 className="text-xl font-semibold mb-4">Your Classrooms</h2>
              <ClassroomList 
                classrooms={classrooms}
                teacherId={user.id}
                onClassroomCreated={handleRefresh}
                onClassroomSelected={handleClassroomSelected}
                selectedClassroomId={selectedClassroomId}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="students">
            {selectedClassroomId ? (
              <div>
                <h2 className="text-xl font-semibold mb-4">
                  {classrooms.find(c => c.id === selectedClassroomId)?.name || "Students"}
                </h2>
                <StudentsPanel
                  students={students}
                  classroomId={selectedClassroomId}
                  onCreateLog={handleCreateLog}
                  onStudentAdded={handleRefresh}
                />
              </div>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle className="text-center text-lg">No classroom selected</CardTitle>
                </CardHeader>
                <CardContent className="text-center pb-6">
                  <p className="text-muted-foreground mb-4">Please select or create a classroom first.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      ) : (
        <Dashboard user={user} logs={logs} refreshTrigger={refreshTrigger} />
      )}
      {/* Floating Action Button for all users */}
      {user.role === "teacher" ? (
        selectedClassroomId ? (
          <FloatingActionButton onClick={() => handleCreateLog(students[0]?.id)} />
        ) : null
      ) : (
        <FloatingActionButton onClick={() => handleCreateLog(user.id)} />
      )}
    </div>
  );
};

export default Index;
