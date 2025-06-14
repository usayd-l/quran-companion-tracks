
import React, { useState, useEffect } from "react";
import { Classroom } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { School, Users, Plus } from "lucide-react";
import CreateClassroomDialog from "./CreateClassroomDialog";
import { getUsersByClassroomId } from "@/services/supabaseService";

interface ClassroomListProps {
  classrooms: Classroom[];
  teacherId: string;
  onClassroomCreated: () => void;
  onClassroomSelected: (classroomId: string) => void;
  selectedClassroomId?: string;
}

const ClassroomList: React.FC<ClassroomListProps> = ({
  classrooms,
  teacherId,
  onClassroomCreated,
  onClassroomSelected,
  selectedClassroomId
}) => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [studentCounts, setStudentCounts] = useState<{ [key: string]: number }>({});

  // Fetch student counts for each classroom
  useEffect(() => {
    const fetchStudentCounts = async () => {
      const counts: { [key: string]: number } = {};
      
      for (const classroom of classrooms) {
        try {
          const students = await getUsersByClassroomId(classroom.id);
          counts[classroom.id] = students.length;
        } catch (error) {
          console.error(`Error fetching students for classroom ${classroom.id}:`, error);
          counts[classroom.id] = 0;
        }
      }
      
      setStudentCounts(counts);
    };

    if (classrooms.length > 0) {
      fetchStudentCounts();
    }
  }, [classrooms]);

  const handleClassroomCreated = () => {
    setIsCreateDialogOpen(false);
    onClassroomCreated();
  };

  return (
    <div className="space-y-4">
      {classrooms.map((classroom) => (
        <Card 
          key={classroom.id}
          className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
            selectedClassroomId === classroom.id 
              ? 'ring-2 ring-primary bg-primary/5' 
              : 'hover:bg-gray-50'
          }`}
          onClick={() => onClassroomSelected(classroom.id)}
        >
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between text-lg">
              <div className="flex items-center gap-2">
                <School className="h-5 w-5 text-primary" />
                <span>{classroom.name}</span>
              </div>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Users className="h-4 w-4" />
                <span>{studentCounts[classroom.id] || 0}</span>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Class Code: <span className="font-mono font-medium">{classroom.classCode}</span>
              </p>
              <p className="text-xs text-muted-foreground">
                {studentCounts[classroom.id] || 0} {studentCounts[classroom.id] === 1 ? 'student' : 'students'}
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
      
      <Card className="border-dashed border-primary/50 bg-primary/5">
        <CardContent className="p-6 text-center">
          <Button
            variant="ghost"
            className="w-full border-dashed border-primary text-primary hover:bg-primary/10"
            onClick={() => setIsCreateDialogOpen(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Create New Classroom
          </Button>
        </CardContent>
      </Card>
      
      <CreateClassroomDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        teacherId={teacherId}
        onSuccess={handleClassroomCreated}
      />
    </div>
  );
};

export default ClassroomList;
