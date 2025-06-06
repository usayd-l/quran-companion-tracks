
import React from "react";
import { UserRole } from "@/types";
import { User, Users, ArrowLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface RoleSelectionScreenProps {
  onSelectRole: (role: UserRole) => void;
  onBack?: () => void;
}

const RoleSelectionScreen: React.FC<RoleSelectionScreenProps> = ({
  onSelectRole,
  onBack,
}) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center">
          {onBack && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="mr-2 p-0 h-8 w-8"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          )}
          <CardTitle className="flex-1 text-center pr-8">
            Select your role
          </CardTitle>
        </div>
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
