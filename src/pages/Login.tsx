
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { User, Users } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await login(email, password);
      navigate("/");
    } catch (error) {
      console.error("Login failed", error);
      toast({
        title: "Login Failed",
        description: "Invalid email or password. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async (demoType: 'teacher' | 'student') => {
    setIsLoading(true);
    
    try {
      if (demoType === 'teacher') {
        await login("teacher@demo.com", "password123");
      } else {
        await login("student@demo.com", "password123");
      }
      navigate("/");
    } catch (error) {
      console.error("Demo login failed", error);
      toast({
        title: "Login Failed",
        description: "There was a problem with the demo login. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container max-w-md mx-auto px-4 py-8 min-h-screen flex flex-col justify-center pattern-bg">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold font-arabic">Quran Companion</h1>
        <p className="text-muted-foreground mt-1">Your Quran Memorization Companion</p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-center">Login</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
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
            
            <div className="pt-4">
              <p className="text-sm text-center font-medium mb-3">Quick Demo Accounts</p>
              <div className="flex gap-2">
                <Button 
                  type="button" 
                  className="flex-1 bg-[#D3E4FD] text-primary-foreground hover:bg-[#C0D5F2] text-black"
                  onClick={() => handleDemoLogin('teacher')}
                  disabled={isLoading}
                >
                  <Users className="h-4 w-4 mr-2" />
                  Demo Teacher
                </Button>
                <Button 
                  type="button" 
                  className="flex-1 bg-[#F2FCE2] text-primary-foreground hover:bg-[#E9F0E6] text-black"
                  onClick={() => handleDemoLogin('student')}
                  disabled={isLoading}
                >
                  <User className="h-4 w-4 mr-2" />
                  Demo Student
                </Button>
              </div>
            </div>
          </CardContent>
          
          <CardFooter className="flex flex-col space-y-4">
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Login"}
            </Button>
            
            <p className="text-sm text-center text-muted-foreground">
              Don't have an account?{" "}
              <Link to="/signup" className="text-primary underline hover:text-primary/80">
                Sign up
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default Login;
