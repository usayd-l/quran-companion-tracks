
import React from "react";
import { Card, CardContent } from "./card";
import { Badge } from "./badge";
import { Calendar, BookOpen, User, AlertTriangle } from "lucide-react";
import { format } from "date-fns";
import { RecitationLog } from "@/types";

interface LogEntryProps {
  log: RecitationLog;
  onClick?: () => void;
  showStudentName?: boolean;
}

const LogEntry: React.FC<LogEntryProps> = ({ log, onClick, showStudentName = false }) => {
  const formattedDate = format(new Date(log.date), "MMM d, yyyy");
  
  // Calculate total issues
  const totalIssues = log.mistakeCounts.reduce(
    (total, count) => total + count.mistakes + count.stucks + count.markedMistakes,
    0
  );
  
  // Determine what was recited
  const recitationContent = log.surahName 
    ? `${log.surahName} (${log.ayahStart}-${log.ayahEnd})`
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

  // Get attendance status color
  const getAttendanceColor = (status?: string) => {
    switch (status) {
      case 'present': return 'bg-green-100 text-green-800 border-green-300';
      case 'late': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'absent': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };
  
  return (
    <Card 
      className={`mb-3 transition-all duration-200 ${
        onClick ? 'cursor-pointer hover:shadow-md hover:scale-[1.01]' : ''
      }`}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="w-4 h-4 mr-1" />
            {formattedDate}
          </div>
          <div className="flex items-center gap-2">
            {log.attendanceStatus && (
              <Badge variant="outline" className={getAttendanceColor(log.attendanceStatus)}>
                {log.attendanceStatus.charAt(0).toUpperCase() + log.attendanceStatus.slice(1)}
              </Badge>
            )}
            {log.grade && (
              <Badge variant="outline" className={getGradeColor(log.grade)}>
                {log.grade}
              </Badge>
            )}
          </div>
        </div>
        
        {showStudentName && log.userName && (
          <div className="flex items-center mb-2 text-sm">
            <User className="w-4 h-4 mr-1 text-muted-foreground" />
            <span className="font-medium">{log.userName}</span>
          </div>
        )}
        
        <div className="flex items-center mb-2">
          <BookOpen className="w-4 h-4 mr-2 text-muted-foreground" />
          <div>
            <span className="font-medium text-sm">{log.recitationType}</span>
            <p className="text-sm text-muted-foreground">{recitationContent}</p>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <span className="text-xs text-muted-foreground mr-2">Issues:</span>
            <Badge 
              variant="outline" 
              className={totalIssues > 5 ? "border-red-300 text-red-800" : "border-green-300 text-green-800"}
            >
              {totalIssues}
            </Badge>
          </div>
          
          {log.needsRepeat && (
            <div className="flex items-center">
              <AlertTriangle className="w-4 h-4 mr-1 text-orange-500" />
              <span className="text-xs text-orange-600">Needs Repeat</span>
            </div>
          )}
        </div>

        {log.absenceReason && (
          <div className="mt-2 pt-2 border-t">
            <span className="text-xs text-muted-foreground">Reason: {log.absenceReason}</span>
          </div>
        )}
        
        {log.notes && (
          <div className="mt-2 pt-2 border-t">
            <p className="text-sm text-muted-foreground italic">"{log.notes}"</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LogEntry;
