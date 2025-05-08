
import React from "react";
import { currentUser, getUserById } from "@/data/mockData";
import { useParams, useNavigate } from "react-router-dom";
import RecitationLogForm from "@/components/ui/RecitationLogForm";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

const CreateLog = () => {
  const navigate = useNavigate();
  const { studentId } = useParams<{ studentId?: string }>();
  const user = currentUser; // This would come from authentication
  
  const student = studentId ? getUserById(studentId) : undefined;
  
  // Check if user is allowed to create log for this student
  const canCreateLog = !studentId || 
    (user.role === "teacher" && student && student.teacherId === user.id);
  
  if (!canCreateLog) {
    // Redirect if not authorized
    return (
      <div className="container max-w-md mx-auto px-4 py-6">
        <div className="text-center p-6">
          <h1 className="text-xl font-bold mb-4">Unauthorized</h1>
          <p className="mb-4 text-muted-foreground">You are not authorized to create logs for this student.</p>
          <Button onClick={() => navigate(-1)}>Go Back</Button>
        </div>
      </div>
    );
  }
  
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
        onSuccess={() => {
          // In a real app, we would update the dashboard data
        }} 
      />
    </div>
  );
};

export default CreateLog;
