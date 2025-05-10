
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { saveUser } from "@/services/localStorage";
import { v4 as uuidv4 } from 'uuid';

interface AddStudentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  classroomId: string;
  onSuccess?: () => void;
}

const AddStudentDialog: React.FC<AddStudentDialogProps> = ({
  open,
  onOpenChange,
  classroomId,
  onSuccess
}) => {
  const [studentName, setStudentName] = useState("");
  const [studentEmail, setStudentEmail] = useState("");
  const { toast } = useToast();

  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!studentName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a student name",
        variant: "destructive",
      });
      return;
    }

    // Create new student and add to localStorage
    const newStudent = {
      id: uuidv4(),
      name: studentName,
      role: "student" as const,
      classroomId: classroomId,
      email: studentEmail || `${studentName.toLowerCase().replace(/\s+/g, '.')}@student.example.com`,
      password: "password123", // Default password
      profileImage: `https://ui-avatars.com/api/?name=${encodeURIComponent(studentName)}&background=E9F0E6&color=4A6741`
    };
    
    saveUser(newStudent);
    
    toast({
      title: "Student Added",
      description: `${studentName} has been successfully added to your classroom.`,
    });
    
    // Reset form and close dialog
    setStudentName("");
    setStudentEmail("");
    onOpenChange(false);
    
    if (onSuccess) {
      onSuccess();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Student</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleAddStudent} className="space-y-4 mt-2">
          <div>
            <Label htmlFor="studentName">Student Name</Label>
            <Input
              id="studentName"
              placeholder="Enter student's name"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="studentEmail">Student Email (optional)</Label>
            <Input
              id="studentEmail"
              type="email"
              placeholder="student@example.com"
              value={studentEmail}
              onChange={(e) => setStudentEmail(e.target.value)}
            />
            <p className="text-xs text-muted-foreground mt-1">
              If left blank, a dummy email will be generated.
            </p>
          </div>
          
          <div className="flex justify-end space-x-2 pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-primary">
              Add Student
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddStudentDialog;
