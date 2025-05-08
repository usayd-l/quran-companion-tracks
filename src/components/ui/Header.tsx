
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { LogOut, User, Home, PlusCircle } from "lucide-react";

const Header: React.FC = () => {
  const { authState, logout } = useAuth();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    logout();
    navigate("/login");
  };
  
  if (!authState.isAuthenticated) return null;
  
  return (
    <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border/40 p-3 mb-4">
      <div className="flex justify-between items-center max-w-md mx-auto">
        <Link to="/" className="text-xl font-arabic font-semibold">
          Quran Companion
        </Link>
        
        <div className="flex items-center space-x-2">
          <Link to="/">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Home className="h-4 w-4" />
            </Button>
          </Link>
          
          <Link to="/create-log">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <PlusCircle className="h-4 w-4" />
            </Button>
          </Link>
          
          <Link to="/profile">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <User className="h-4 w-4" />
            </Button>
          </Link>
          
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-destructive"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
