
import React, { useState } from "react";
import { Classroom } from "@/types";
import { Button } from "@/components/ui/button";
import { PlusCircle, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { getUsersByClassroomId } from "@/services/localStorage";
import CreateClassroomDialog from "./CreateClassroomDialog";

interface ClassroomListProps {
  classrooms: Classroom[];
  teacherId: string;
  onClassroomCreated?: () => void;
  onClassroomSelected?: (classroomId: string) => void;
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

  const handleClassroomClick = (classroomId: string) => {
    if (onClassroomSelected) {
      onClassroomSelected(classroomId);
    }
  };

  return (
    <div className="space-y-3">
      {classrooms && classrooms.length > 0 ? (
        classrooms.map((classroom) => {
          const students = getUsersByClassroomId(classroom.id);
          return (
            <Card 
              key={classroom.id} 
              className={cn(
                "cursor-pointer hover:shadow-md transform transition duration-200 hover:scale-[1.02]",
                selectedClassroomId === classroom.id ? "border-primary" : "border-border"
              )}
              onClick={() => handleClassroomClick(classroom.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <Users className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">{classroom.name}</h3>
                      <div className="text-sm text-muted-foreground flex items-center gap-2">
                        <span>Code: {classroom.classCode}</span>
                        <Badge variant="outline" className="text-xs">
                          {students.length} students
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })
      ) : (
        <div className="text-center p-6 bg-muted rounded-lg">
          <p className="text-muted-foreground mb-4">No classrooms created yet</p>
        </div>
      )}
      
      <div className="mt-6">
        <Button 
          variant="outline" 
          className="w-full border-dashed border-primary text-primary hover:bg-primary/5"
          onClick={() => setIsCreateDialogOpen(true)}
        >
          <PlusCircle className="h-4 w-4 mr-2" />
          Create New Classroom
        </Button>
        
        <CreateClassroomDialog
          open={isCreateDialogOpen}
          onOpenChange={setIsCreateDialogOpen}
          teacherId={teacherId}
          onSuccess={onClassroomCreated}
        />
      </div>
    </div>
  );
};

export default ClassroomList;
