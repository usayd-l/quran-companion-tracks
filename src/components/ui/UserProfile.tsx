
import React, { useState, useEffect } from "react";
import { User } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { getUserById } from "@/services/supabaseService";
import { useNavigate } from "react-router-dom";

interface UserProfileProps {
  user: User;
  showRole?: boolean;
}

const UserProfile: React.FC<UserProfileProps> = ({ user, showRole = true }) => {
  const [profileData, setProfileData] = useState<User>(user);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const userData = await getUserById(user.id);
        if (userData) {
          setProfileData(userData);
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
        // Keep the original user data if fetch fails
        setProfileData(user);
      }
    };

    if (user.id) {
      fetchUserProfile();
    }
  }, [user.id]);

  return (
    <Card className="overflow-hidden border-none shadow-md mb-4">
      <CardContent className="p-4">
        <div className="flex items-center space-x-4">
          <Avatar className="h-12 w-12 border-2 border-primary">
            <AvatarImage src={profileData.profileImage} alt={profileData.name} />
            <AvatarFallback className="bg-primary-light text-primary">
              {profileData.name.split(" ").map(n => n[0]).join("")}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-medium text-lg">{profileData.name}</h3>
            {showRole && (
              <p className="text-sm text-muted-foreground capitalize">{profileData.role}</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserProfile;
