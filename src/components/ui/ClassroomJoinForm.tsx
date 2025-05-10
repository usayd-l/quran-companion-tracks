
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { getClassroomByCode } from "@/services/localStorage";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft } from "lucide-react";

interface ClassroomJoinFormProps {
  onJoinClassroom: (classroomId: string) => void;
  onBack: () => void;
  onSkip: () => void;
}

const ClassroomJoinForm: React.FC<ClassroomJoinFormProps> = ({
  onJoinClassroom,
  onBack,
  onSkip
}) => {
  const [classCode, setClassCode] = useState("");
  const [isJoining, setIsJoining] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsJoining(true);
    
    try {
      if (!classCode.trim()) {
        toast({
          title: "Error",
          description: "Please enter a classroom code",
          variant: "destructive",
        });
        setIsJoining(false);
        return;
      }

      const classroom = getClassroomByCode(classCode.trim());
      
      if (!classroom) {
        toast({
          title: "Invalid Code",
          description: "No classroom found with this code. Please check and try again.",
          variant: "destructive",
        });
        setIsJoining(false);
        return;
      }
      
      // Pass the classroom ID to the parent component
      onJoinClassroom(classroom.id);
      
    } catch (error) {
      console.error("Error joining classroom:", error);
      toast({
        title: "Error",
        description: "There was a problem joining the classroom.",
        variant: "destructive",
      });
      setIsJoining(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="mr-2 p-0 h-8 w-8"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <CardTitle className="flex-1 text-center pr-8">Join a Classroom</CardTitle>
        </div>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="classCode">Classroom Code</Label>
            <Input
              id="classCode"
              value={classCode}
              onChange={(e) => setClassCode(e.target.value)}
              placeholder="Enter the code provided by your teacher"
            />
          </div>
          <p className="text-sm text-center text-muted-foreground">
            Ask your teacher for the classroom code to join their class. You can also continue as an individual learner.
          </p>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="w-full flex flex-col gap-2">
            <Button
              type="submit"
              className="w-full"
              disabled={isJoining}
            >
              {isJoining ? "Joining..." : "Join Classroom"}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={onSkip}
            >
              Continue as Individual Learner
            </Button>
          </div>
        </CardFooter>
      </form>
    </Card>
  );
};

export default ClassroomJoinForm;
