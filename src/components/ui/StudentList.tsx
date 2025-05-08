
import React from "react";
import { User } from "@/types";
import UserProfile from "./UserProfile";
import { Link } from "react-router-dom";
import { Button } from "./button";
import { PlusCircle } from "lucide-react";

interface StudentListProps {
  students: User[];
  onCreateLog?: (studentId: string) => void;
  selectable?: boolean;
  onSelectStudent?: (student: User) => void;
}

const StudentList: React.FC<StudentListProps> = ({ 
  students, 
  onCreateLog,
  selectable = false,
  onSelectStudent
}) => {
  if (!students || students.length === 0) {
    return (
      <div className="text-center p-6 bg-muted rounded-lg">
        <p className="text-muted-foreground">No students found</p>
      </div>
    );
  }

  const handleStudentClick = (student: User) => {
    if (selectable && onSelectStudent) {
      onSelectStudent(student);
    }
  };

  return (
    <div className="space-y-3">
      {students.map((student) => (
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
      ))}
    </div>
  );
};

export default StudentList;
