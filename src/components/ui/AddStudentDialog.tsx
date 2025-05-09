
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { mockUsers } from "@/data/mockData";
import { v4 as uuidv4 } from 'uuid';

interface AddStudentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  teacherId: string;
  onSuccess?: () => void;
}

const AddStudentDialog: React.FC<AddStudentDialogProps> = ({
  open,
  onOpenChange,
  teacherId,
  onSuccess
}) => {
  const [studentName, setStudentName] = useState("");
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

    // Create new student and add to mock data
    const newStudent = {
      id: uuidv4(),
      name: studentName,
      role: "student" as const,
      teacherId: teacherId,
      profileImage: `https://ui-avatars.com/api/?name=${encodeURIComponent(studentName)}&background=E9F0E6&color=4A6741`
    };
    
    mockUsers.push(newStudent);
    
    toast({
      title: "Student Added",
      description: `${studentName} has been successfully added to your students.`,
    });
    
    // Reset form and close dialog
    setStudentName("");
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
