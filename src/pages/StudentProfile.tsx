
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getUserById } from "@/services/supabaseService";
import UserProfile from "@/components/ui/UserProfile";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Camera } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Header from "@/components/ui/Header";
import { User } from "@/types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const StudentProfile = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [profileImage, setProfileImage] = useState<string>("");
  
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        if (!userId) return;
        
        const userData = await getUserById(userId);
        if (userData) {
          setUser(userData);
          setProfileImage(userData.profileImage || "");
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId]);
  
  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (!user) {
    return (
      <div className="container max-w-md mx-auto px-4 py-6">
        <Header />
        <div className="text-center p-6">
          <h1 className="text-xl font-bold mb-4">Student Not Found</h1>
          <p className="mb-4 text-muted-foreground">The requested student profile could not be found.</p>
          <Button onClick={() => navigate("/")}>Go Home</Button>
        </div>
      </div>
    );
  }

  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = () => {
    // TODO: Implement profile saving logic
    setIsEditing(false);
  };
  
  return (
    <div className="container max-w-md mx-auto px-4 py-0 min-h-screen pattern-bg">
      <Header />
      
      <div className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => navigate(-1)}
          className="mr-4"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-xl font-bold">Student Profile</h1>
      </div>
      
      <Card className="mb-6">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Personal Information</CardTitle>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? "Cancel" : "Edit"}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              <UserProfile user={user} showRole={false} />
              {isEditing && (
                <div className="absolute bottom-0 right-0">
                  <Label htmlFor="profile-image" className="cursor-pointer">
                    <div className="bg-primary text-white p-2 rounded-full">
                      <Camera className="h-4 w-4" />
                    </div>
                    <Input
                      id="profile-image"
                      type="file"
                      accept="image/*"
                      onChange={handleProfileImageChange}
                      className="hidden"
                    />
                  </Label>
                </div>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-1 gap-4">
            <div>
              <Label className="text-sm text-muted-foreground">Full Name</Label>
              {isEditing ? (
                <Input value={user.name} readOnly className="mt-1" />
              ) : (
                <p className="font-medium mt-1">{user.name}</p>
              )}
            </div>
            
            <div>
              <Label className="text-sm text-muted-foreground">Email</Label>
              {isEditing ? (
                <Input value={user.email} readOnly className="mt-1" />
              ) : (
                <p className="font-medium mt-1">{user.email}</p>
              )}
            </div>
            
            <div>
              <Label className="text-sm text-muted-foreground">Student ID</Label>
              <p className="font-medium mt-1">{user.id}</p>
            </div>
            
            <div>
              <Label className="text-sm text-muted-foreground">Classroom</Label>
              <p className="font-medium mt-1">{user.classroomName || "Not assigned"}</p>
            </div>
            
            <div>
              <Label className="text-sm text-muted-foreground">Role</Label>
              <p className="font-medium mt-1 capitalize">{user.role}</p>
            </div>
          </div>
          
          {isEditing && (
            <div className="pt-4">
              <Button onClick={handleSaveProfile} className="w-full">
                Save Changes
              </Button>
            </div>
          )}
          
          {/* Space for future fields */}
          <div className="pt-4 border-t">
            <p className="text-sm text-muted-foreground italic">
              Additional profile information will be added here in future updates.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentProfile;
