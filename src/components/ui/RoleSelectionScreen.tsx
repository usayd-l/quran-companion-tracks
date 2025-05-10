
import React from "react";
import { UserRole } from "@/types";
import { User, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface RoleSelectionScreenProps {
  onSelectRole: (role: UserRole) => void;
}

const RoleSelectionScreen: React.FC<RoleSelectionScreenProps> = ({
  onSelectRole,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-center">Select your role</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
          <div
            className={cn(
              "rounded-lg p-6 cursor-pointer transition-all border-2 bg-[#F2FCE2] border-transparent hover:shadow-md",
              "hover:border-[#4A6741]"
            )}
            onClick={() => onSelectRole("student")}
          >
            <div className="flex flex-col items-center justify-center space-y-3">
              <User
                size={48}
                className="text-gray-600"
              />
              <p className="font-medium text-center">Individual Learner</p>
            </div>
          </div>
          
          <div
            className={cn(
              "rounded-lg p-6 cursor-pointer transition-all border-2 bg-[#D3E4FD] border-transparent hover:shadow-md",
              "hover:border-[#2D2A26]"
            )}
            onClick={() => onSelectRole("teacher")}
          >
            <div className="flex flex-col items-center justify-center space-y-3">
              <Users
                size={48}
                className="text-gray-600"
              />
              <p className="font-medium text-center">Teacher</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RoleSelectionScreen;
