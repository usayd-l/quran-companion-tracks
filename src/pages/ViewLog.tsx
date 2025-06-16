
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getLogById, getUserById } from "@/services/supabaseService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Loader2 } from "lucide-react";
import { format } from "date-fns";
import UserProfile from "@/components/ui/UserProfile";
import { Badge } from "@/components/ui/badge";
import { RecitationLog, User } from "@/types";

const ViewLog = () => {
  const { logId } = useParams<{ logId: string }>();
  const navigate = useNavigate();
  
  const [log, setLog] = useState<RecitationLog | null>(null);
  const [student, setStudent] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchLogData = async () => {
      if (!logId) {
        setError("No log ID provided");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const logData = await getLogById(logId);
        
        if (!logData) {
          setError("Log not found");
          setLoading(false);
          return;
        }

        setLog(logData);
        
        const userData = await getUserById(logData.userId);
        if (!userData) {
          setError("Student not found");
          setLoading(false);
          return;
        }
        
        setStudent(userData);
      } catch (err) {
        console.error("Error fetching log data:", err);
        setError("Failed to load log data");
      } finally {
        setLoading(false);
      }
    };

    fetchLogData();
  }, [logId]);
  
  if (loading) {
    return (
      <div className="container max-w-md mx-auto px-4 py-6">
        <div className="text-center p-6">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading log...</p>
        </div>
      </div>
    );
  }
  
  if (error || !log || !student) {
    return (
      <div className="container max-w-md mx-auto px-4 py-6">
        <div className="text-center p-6">
          <h1 className="text-xl font-bold mb-4">Log Not Found</h1>
          <p className="mb-4 text-muted-foreground">
            {error || "The requested log entry could not be found."}
          </p>
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
    : `Juz ${log.juzNumber}${log.pagesCount ? ` (${log.pagesCount} pages)` : ''}`;

  // Get grade color
  const getGradeColor = (grade?: string) => {
    switch (grade) {
      case 'Excellent': return 'bg-green-100 text-green-800 border-green-300';
      case 'Very Good': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'Good': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'Average': return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'Failed': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };
    
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

          {log.attendanceStatus && (
            <div>
              <p className="text-sm text-muted-foreground">Attendance</p>
              <Badge variant="outline" className={
                log.attendanceStatus === 'present' ? 'bg-green-100 text-green-800 border-green-300' :
                log.attendanceStatus === 'late' ? 'bg-yellow-100 text-yellow-800 border-yellow-300' :
                'bg-red-100 text-red-800 border-red-300'
              }>
                {log.attendanceStatus.charAt(0).toUpperCase() + log.attendanceStatus.slice(1)}
              </Badge>
              {log.absenceReason && (
                <p className="text-sm text-muted-foreground mt-1">Reason: {log.absenceReason}</p>
              )}
            </div>
          )}

          {log.grade && (
            <div>
              <p className="text-sm text-muted-foreground mb-2">Grade</p>
              <Badge variant="outline" className={getGradeColor(log.grade)}>
                {log.grade}
              </Badge>
            </div>
          )}

          {log.needsRepeat && (
            <div>
              <Badge variant="outline" className="bg-orange-100 text-orange-800 border-orange-300">
                Needs Repeat
              </Badge>
            </div>
          )}
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
