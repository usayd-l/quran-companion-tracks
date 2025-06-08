
import React from "react";
import { useAuth } from "@/context/AuthContext";
import UserProfile from "./UserProfile";
import { Badge } from "@/components/ui/badge";

const Header = () => {
  const { authState, isDemoMode } = useAuth();

  return (
    <header className="bg-white border-b border-gray-200 px-4 py-3 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold font-arabic text-[#4A6741]">
            Quran Companion
          </h1>
          {isDemoMode && (
            <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
              Demo Mode
            </Badge>
          )}
        </div>
        
        {authState.user && <UserProfile user={authState.user} />}
      </div>
    </header>
  );
};

export default Header;
