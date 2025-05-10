
import React, { useState } from "react";
import { User } from "@/types";
import UserProfile from "@/components/ui/UserProfile";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PlusCircle, UserPlus } from "lucide-react";
import AddStudentDialog from "@/components/ui/AddStudentDialog";

interface StudentsPanelProps {
  students: User[];
  classroomId: string;
  onCreateLog?: (studentId: string) => void;
  onStudentAdded?: () => void;
}

const StudentsPanel: React.FC<StudentsPanelProps> = ({ 
  students, 
  classroomId,
  onCreateLog,
  onStudentAdded
}) => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  return (
    <div className="space-y-3">
      {students && students.length > 0 ? (
        students.map((student) => (
          <div key={student.id} className="relative">
            <div className="transform transition duration-200 hover:scale-[1.02]">
              <Link to={`/profile/${student.id}`}>
                <UserProfile user={student} />
              </Link>
            </div>
            
            {onCreateLog && (
              <div className="absolute top-1/2 right-2 -translate-y-1/2">
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8 border-primary text-primary hover:bg-primary/10"
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    onCreateLog(student.id);
                  }}
                >
                  <PlusCircle className="h-4 w-4 mr-1" />
                  <span>Log</span>
                </Button>
              </div>
            )}
          </div>
        ))
      ) : (
        <div className="text-center p-6 bg-muted rounded-lg">
          <p className="text-muted-foreground">No students found in this classroom</p>
        </div>
      )}
      
      <div className="mt-6">
        <Button 
          variant="outline" 
          className="w-full border-dashed border-primary text-primary hover:bg-primary/5"
          onClick={() => setIsAddDialogOpen(true)}
        >
          <UserPlus className="h-4 w-4 mr-2" />
          Add New Student
        </Button>
        
        <AddStudentDialog
          open={isAddDialogOpen}
          onOpenChange={setIsAddDialogOpen}
          classroomId={classroomId}
          onSuccess={onStudentAdded}
        />
      </div>
    </div>
  );
};

export default StudentsPanel;
