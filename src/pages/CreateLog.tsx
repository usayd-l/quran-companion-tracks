import React, { useEffect, useState } from "react";
import { getUserById } from "@/services/localStorage";
import { useParams, useNavigate } from "react-router-dom";
import RecitationLogForm from "@/components/ui/RecitationLogForm";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import Header from "@/components/ui/Header";
import { useAuth } from "@/context/AuthContext";

const CreateLog = () => {
  const navigate = useNavigate();
  const { authState } = useAuth();
  const { studentId } = useParams<{ studentId?: string }>();
  const [refreshKey, setRefreshKey] = useState(0);
  
  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authState.loading && !authState.isAuthenticated) {
      navigate("/login");
    }
  }, [authState, navigate]);
  
  // If we don't have a user yet, show loading
  if (!authState.user) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }
  
  const user = authState.user;
  const student = studentId ? getUserById(studentId) : undefined;
  
  // Check if user is allowed to create log for this student
  const canCreateLog = !studentId || 
    (user.role === "teacher" && student && student.classroomId === user.classroomId);
  
  if (!canCreateLog) {
    // Redirect if not authorized
    return (
      <div className="container max-w-md mx-auto px-4 py-6">
        <Header />
        <div className="text-center p-6">
          <h1 className="text-xl font-bold mb-4">Unauthorized</h1>
          <p className="mb-4 text-muted-foreground">You are not authorized to create logs for this student.</p>
          <Button onClick={() => navigate(-1)}>Go Back</Button>
        </div>
      </div>
    );
  }
  
  const handleLogSuccess = () => {
    // Increment refresh key to trigger a refresh of the dashboard
    setRefreshKey(prev => prev + 1);
    // Navigate back with a small delay to ensure the refresh happens
    setTimeout(() => navigate(-1), 100);
  };

  return (
    <div className="container max-w-md mx-auto px-4 py-0 pattern-bg">
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
        <div>
          <h1 className="text-xl font-bold">New Recitation Log</h1>
          {student && (
            <p className="text-sm text-muted-foreground">For {student.name}</p>
          )}
        </div>
      </div>
      
      <RecitationLogForm 
        user={user} 
        studentId={studentId}
        onSuccess={handleLogSuccess} 
      />
    </div>
  );
};

export default CreateLog;
