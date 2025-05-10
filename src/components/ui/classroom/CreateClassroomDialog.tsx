
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { saveClassroom } from "@/services/localStorage";
import { v4 as uuidv4 } from 'uuid';

interface CreateClassroomDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  teacherId: string;
  onSuccess?: () => void;
}

// Generate a random 6-character classroom code
const generateClassroomCode = () => {
  const characters = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Removed similar looking characters
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

const CreateClassroomDialog: React.FC<CreateClassroomDialogProps> = ({
  open,
  onOpenChange,
  teacherId,
  onSuccess
}) => {
  const [classroomName, setClassroomName] = useState("");
  const [classroomCode, setClassroomCode] = useState(generateClassroomCode());
  const { toast } = useToast();

  const handleAddClassroom = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!classroomName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a classroom name",
        variant: "destructive",
      });
      return;
    }

    // Create new classroom and add to localStorage
    const newClassroom = {
      id: uuidv4(),
      name: classroomName,
      teacherId,
      classCode: classroomCode
    };
    
    saveClassroom(newClassroom);
    
    toast({
      title: "Classroom Created",
      description: `${classroomName} has been created successfully.`,
    });
    
    // Reset form and close dialog
    setClassroomName("");
    setClassroomCode(generateClassroomCode());
    onOpenChange(false);
    
    if (onSuccess) {
      onSuccess();
    }
  };

  const regenerateCode = () => {
    setClassroomCode(generateClassroomCode());
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Classroom</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleAddClassroom} className="space-y-4 mt-2">
          <div>
            <Label htmlFor="classroomName">Classroom Name</Label>
            <Input
              id="classroomName"
              placeholder="Enter classroom name"
              value={classroomName}
              onChange={(e) => setClassroomName(e.target.value)}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="classroomCode">Classroom Code</Label>
            <div className="flex gap-2">
              <Input
                id="classroomCode"
                placeholder="Classroom code"
                value={classroomCode}
                onChange={(e) => setClassroomCode(e.target.value.toUpperCase())}
                className="font-mono"
                required
              />
              <Button type="button" variant="outline" onClick={regenerateCode}>
                Regenerate
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Share this code with your students so they can join your classroom.
            </p>
          </div>
          
          <div className="flex justify-end space-x-2 pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-primary">
              Create Classroom
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateClassroomDialog;
