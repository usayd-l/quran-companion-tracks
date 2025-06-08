import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { UserRole } from "@/types";
import RoleSelectionScreen from "@/components/ui/RoleSelectionScreen";
import ClassroomJoinForm from "@/components/ui/ClassroomJoinForm";
import { getClassroomByCode, joinClassroom } from "@/services/supabaseService";
import { ArrowLeft } from "lucide-react";

// Screen types for our multi-step signup
type SignupScreen = 'role-selection' | 'classroom-join' | 'registration';

const Signup = () => {
  const navigate = useNavigate();
  const [currentScreen, setCurrentScreen] = useState<SignupScreen>('role-selection');
  const [role, setRole] = useState<UserRole>("student");
  const [classroomId, setClassroomId] = useState<string | undefined>(undefined);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { signup } = useAuth();
  const { toast } = useToast();

  const handleRoleSelect = (selectedRole: UserRole) => {
    setRole(selectedRole);
    
    if (selectedRole === "student") {
      setCurrentScreen('classroom-join');
    } else {
      setCurrentScreen('registration');
    }
  };

  const handleJoinClassroom = async (classCode: string) => {
    const classroom = await getClassroomByCode(classCode);
    if (classroom) {
      setClassroomId(classroom.id);
      setCurrentScreen('registration');
    } else {
      toast({
        title: "Classroom not found",
        description: "Please check the class code and try again.",
        variant: "destructive",
      });
    }
  };

  const handleSkipClassroom = () => {
    setClassroomId(undefined);
    setCurrentScreen('registration');
  };

  const handleBack = () => {
    if (currentScreen === 'classroom-join') {
      setCurrentScreen('role-selection');
    } else if (currentScreen === 'registration') {
      if (role === "student") {
        setCurrentScreen('classroom-join');
      } else {
        setCurrentScreen('role-selection');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await signup(name, email, password, role);

      // If a classroom was selected for a student, join it after signup
      if (role === "student" && classroomId) {
        // Note: We'll need to handle this after the user confirms their email
        // For now, we'll store the classroom ID in localStorage temporarily
        localStorage.setItem('pendingClassroomId', classroomId);
      }
      
      toast({
        title: "Account created!",
        description: "Please check your email to verify your account.",
      });
      
      navigate("/login");
    } catch (error: any) {
      console.error("Signup failed", error);
      toast({
        title: "Signup Failed",
        description: error.message || "There was a problem creating your account.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToLogin = () => {
    navigate("/login");
  };

  const renderContent = () => {
    switch (currentScreen) {
      case 'role-selection':
        return (
          <RoleSelectionScreen 
            onSelectRole={handleRoleSelect} 
            onBack={handleBackToLogin}
          />
        );
        
      case 'classroom-join':
        return (
          <ClassroomJoinForm 
            onJoinClassroom={handleJoinClassroom}
            onBack={handleBack}
            onSkip={handleSkipClassroom}
          />
        );
        
      case 'registration':
        return (
          <Card>
            <CardHeader>
              <div className="flex items-center">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleBack}
                  className="mr-2 p-0 h-8 w-8"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <CardTitle className="flex-1 text-center pr-8">
                  Create an Account
                </CardTitle>
              </div>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input 
                    id="name" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="email@example.com"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input 
                    id="password" 
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </CardContent>
              
              <CardFooter className="flex flex-col space-y-4">
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isLoading}
                >
                  {isLoading ? "Creating Account..." : "Sign Up"}
                </Button>
                
                <p className="text-sm text-center text-muted-foreground">
                  Already have an account?{" "}
                  <Link to="/login" className="text-primary underline hover:text-primary/80">
                    Login
                  </Link>
                </p>
              </CardFooter>
            </form>
          </Card>
        );
    }
  };

  return (
    <div className="container max-w-md mx-auto px-4 py-8 min-h-screen flex flex-col justify-center pattern-bg">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold font-arabic">Quran Companion</h1>
        <p className="text-muted-foreground mt-1">Your Quran Memorization Companion</p>
      </div>
      
      {renderContent()}
    </div>
  );
};

export default Signup;
