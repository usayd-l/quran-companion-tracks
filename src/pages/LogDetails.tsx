import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, Clock, User, BookOpen } from "lucide-react";
import { RecitationLog, MistakeCount } from "@/types";
import { getLogById } from "@/services/supabaseService";
import { format } from "date-fns";

const LogDetails: React.FC = () => {
  const { logId } = useParams<{ logId: string }>();
  const navigate = useNavigate();
  const [log, setLog] = useState<RecitationLog | null>(null);
  const [mistakeCounts, setMistakeCounts] = useState<MistakeCount[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogDetails = async () => {
      if (!logId) return;
      
      try {
        const logData = await getLogById(logId);
        setLog(logData);
        // For now, use the mistake counts from the log data
        setMistakeCounts(logData?.mistakeCounts || []);
      } catch (error) {
        console.error("Error fetching log details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLogDetails();
  }, [logId]);

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  if (!log) {
    return <div className="p-6">Log not found</div>;
  }

  const totalMistakes = mistakeCounts.reduce((sum, mc) => sum + mc.mistakes, 0);
  const totalStucks = mistakeCounts.reduce((sum, mc) => sum + mc.stucks, 0);
  const totalMarkedMistakes = mistakeCounts.reduce((sum, mc) => sum + mc.markedMistakes, 0);

  const getGradeColor = (grade?: string) => {
    switch (grade) {
      case "A": return "bg-green-100 text-green-800";
      case "B": return "bg-blue-100 text-blue-800";
      case "C": return "bg-yellow-100 text-yellow-800";
      case "D": return "bg-orange-100 text-orange-800";
      case "F": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getAttendanceColor = (status?: string) => {
    switch (status) {
      case "present": return "bg-green-100 text-green-800";
      case "late": return "bg-yellow-100 text-yellow-800";
      case "absent": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <h1 className="text-2xl font-bold">Recitation Log Details</h1>
      </div>

      <div className="grid gap-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Basic Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Date:</span>
                <span>{format(new Date(log.date), "PPP")}</span>
              </div>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Tester:</span>
                <span>{log.testerName}</span>
              </div>
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Type:</span>
                <Badge variant="outline">{log.recitationType}</Badge>
              </div>
              {log.attendanceStatus && (
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Attendance:</span>
                  <Badge className={getAttendanceColor(log.attendanceStatus)}>
                    {log.attendanceStatus}
                  </Badge>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recitation Content */}
        <Card>
          <CardHeader>
            <CardTitle>Recitation Content</CardTitle>
          </CardHeader>
          <CardContent>
            {log.surahName && (
              <div className="mb-4">
                <span className="font-medium">Surah:</span> {log.surahName}
                {log.ayahStart && log.ayahEnd && (
                  <span className="ml-2 text-muted-foreground">
                    (Ayah {log.ayahStart} - {log.ayahEnd})
                  </span>
                )}
              </div>
            )}
            {log.juzNumber && (
              <div className="mb-4">
                <span className="font-medium">Juz:</span> {log.juzNumber}
                {log.pagesCount && (
                  <span className="ml-2 text-muted-foreground">
                    ({log.pagesCount} pages)
                  </span>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Mistake Analysis */}
        <Card>
          <CardHeader>
            <CardTitle>Mistake Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <div className="text-2xl font-bold text-red-600">{totalMistakes}</div>
                <div className="text-sm text-red-800">Total Mistakes</div>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600">{totalStucks}</div>
                <div className="text-sm text-yellow-800">Total Stucks</div>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{totalMarkedMistakes}</div>
                <div className="text-sm text-blue-800">Marked Mistakes</div>
              </div>
            </div>

            {mistakeCounts.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-medium">Breakdown by Portion:</h4>
                {mistakeCounts.map((mistake, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium">{mistake.portion}</span>
                    <div className="flex gap-4 text-sm">
                      <span className="text-red-600">Mistakes: {mistake.mistakes}</span>
                      <span className="text-yellow-600">Stucks: {mistake.stucks}</span>
                      <span className="text-blue-600">Marked: {mistake.markedMistakes}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Additional Information */}
        {(log.notes || log.absenceReason) && (
          <Card>
            <CardHeader>
              <CardTitle>Additional Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {log.absenceReason && (
                <div>
                  <span className="font-medium">Absence Reason:</span>
                  <p className="mt-1 text-muted-foreground">{log.absenceReason}</p>
                </div>
              )}
              {log.notes && (
                <div>
                  <span className="font-medium">Notes:</span>
                  <p className="mt-1 text-muted-foreground">{log.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default LogDetails;