
import React from "react";
import { User } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface UserProfileProps {
  user: User;
  showRole?: boolean;
}

const UserProfile: React.FC<UserProfileProps> = ({ user, showRole = true }) => {
  return (
    <Card className="overflow-hidden border-none shadow-md mb-4">
      <CardContent className="p-4">
        <div className="flex items-center space-x-4">
          <Avatar className="h-12 w-12 border-2 border-primary">
            <AvatarImage src={user.profileImage} alt={user.name} />
            <AvatarFallback className="bg-primary-light text-primary">
              {user.name.split(" ").map(n => n[0]).join("")}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-medium text-lg">{user.name}</h3>
            {showRole && (
              <p className="text-sm text-muted-foreground capitalize">{user.role}</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserProfile;
