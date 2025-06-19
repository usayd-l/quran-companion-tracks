
import React from "react";
import { useAuth } from "@/context/AuthContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LogOut, Loader2 } from "lucide-react";

const Header = () => {
  const { authState, isDemoMode, logout, isLoggingOut } = useAuth();

  const handleLogout = async () => {
    if (isDemoMode) {
      const confirmLogout = window.confirm(
        "Are you sure you want to exit demo mode? All demo records will be deleted."
      );
      if (confirmLogout) {
        await logout();
      }
    } else {
      await logout();
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 px-4 py-3 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold font-arabic text-[#4A6741]">
            Quran Companion
          </h1>
          {isDemoMode && (
            <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 border border-yellow-300">
              Demo Mode
            </Badge>
          )}
        </div>
        
        <div className="flex items-center gap-3">
          {authState.user && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="text-muted-foreground hover:text-destructive"
            >
              {isLoggingOut ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <LogOut className="h-4 w-4" />
              )}
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
