
import React, { useState } from "react";
import { User } from "@/types";
import UserProfile from "./UserProfile";
import { Link } from "react-router-dom";
import { Button } from "./button";
import { PlusCircle, UserPlus } from "lucide-react";
import AddStudentDialog from "./AddStudentDialog";

interface StudentListProps {
  students: User[];
  onCreateLog?: (studentId: string) => void;
  selectable?: boolean;
  onSelectStudent?: (student: User) => void;
  teacherId?: string;
  onStudentAdded?: () => void;
}

const StudentList: React.FC<StudentListProps> = ({ 
  students, 
  onCreateLog,
  selectable = false,
  onSelectStudent,
  teacherId,
  onStudentAdded
}) => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const handleStudentClick = (student: User) => {
    if (selectable && onSelectStudent) {
      onSelectStudent(student);
    }
  };

  return (
    <div className="space-y-3">
      {students && students.length > 0 ? (
        students.map((student) => (
          <div key={student.id} className="relative">
            <div 
              className={`transform transition duration-200 hover:scale-[1.02] ${selectable ? 'cursor-pointer' : ''}`}
              onClick={() => handleStudentClick(student)}
            >
              {selectable ? (
                <UserProfile user={student} />
              ) : (
                <Link to={`/profile/${student.id}`}>
                  <UserProfile user={student} />
                </Link>
              )}
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
          <p className="text-muted-foreground">No students found</p>
        </div>
      )}
      
      {/* Add Student Button - Only show if teacherId is provided */}
      {teacherId && (
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
            teacherId={teacherId}
            onSuccess={onStudentAdded}
          />
        </div>
      )}
    </div>
  );
};

export default StudentList;
