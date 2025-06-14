
import React from "react";
import { Loader2 } from "lucide-react";

const AuthLoadingScreen = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-muted-foreground">Please wait...</p>
      </div>
    </div>
  );
};

export default AuthLoadingScreen;
