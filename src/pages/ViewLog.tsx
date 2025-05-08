
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getLogById, getUserById } from "@/data/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { format } from "date-fns";
import UserProfile from "@/components/ui/UserProfile";
import { Badge } from "@/components/ui/badge";

const ViewLog = () => {
  const { logId } = useParams<{ logId: string }>();
  const navigate = useNavigate();
  
  const log = logId ? getLogById(logId) : undefined;
  const student = log ? getUserById(log.userId) : undefined;
  
  if (!log || !student) {
    return (
      <div className="container max-w-md mx-auto px-4 py-6">
        <div className="text-center p-6">
          <h1 className="text-xl font-bold mb-4">Log Not Found</h1>
          <p className="mb-4 text-muted-foreground">The requested log entry could not be found.</p>
          <Button onClick={() => navigate("/")}>Go Home</Button>
        </div>
      </div>
    );
  }
  
  // Format the date
  const formattedDate = format(new Date(log.date), "MMMM d, yyyy");
  
  // Determine what was recited (Surah or Juz)
  const recitationContent = log.surahName 
    ? `${log.surahName} (Ayah ${log.ayahStart} to ${log.ayahEnd})`
    : `Juz ${log.juzNumber} (Pages ${log.pageStart} to ${log.pageEnd})`;
    
  return (
    <div className="container max-w-md mx-auto px-4 py-6 pattern-bg">
      <div className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => navigate(-1)}
          className="mr-4"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-xl font-bold">View Log</h1>
      </div>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <UserProfile user={student} showRole={false} />
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Date</p>
              <p className="font-medium">{formattedDate}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Type</p>
              <p className="font-medium">{log.recitationType}</p>
            </div>
          </div>
          
          <div>
            <p className="text-sm text-muted-foreground">Recited</p>
            <p className="font-medium">{recitationContent}</p>
          </div>
          
          <div>
            <p className="text-sm text-muted-foreground">Tester</p>
            <p className="font-medium">{log.testerName}</p>
          </div>
        </CardContent>
      </Card>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Mistake Tracking</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {log.mistakeCounts.map((count, index) => (
              <div key={index} className="p-3 bg-secondary-light rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <p className="font-medium text-sm">
                    {count.portion === "Full" ? "Full" : 
                     count.portion === "Half" ? `Half ${index + 1}` : 
                     `Quarter ${index + 1}`}
                  </p>
                  <Badge variant="outline" className="bg-primary-light text-primary border-primary">
                    {count.mistakes + count.stucks + count.markedMistakes} issues
                  </Badge>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div>
                    <p className="text-xs text-muted-foreground">Mistakes</p>
                    <p className="font-medium">{count.mistakes}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Stucks</p>
                    <p className="font-medium">{count.stucks}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Marked</p>
                    <p className="font-medium">{count.markedMistakes}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      {log.notes && (
        <Card>
          <CardHeader>
            <CardTitle>Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{log.notes}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ViewLog;
