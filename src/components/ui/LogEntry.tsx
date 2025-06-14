
import React from "react";
import { RecitationLog, User } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { getUserById } from "@/services/localStorage";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { BookOpen, Star } from "lucide-react";

interface LogEntryProps {
  log: RecitationLog;
  showStudent?: boolean;
}

const LogEntry: React.FC<LogEntryProps> = ({ log, showStudent = false }) => {
  // Format the date in a readable format
  const formattedDate = format(new Date(log.date), "MMMM d, yyyy");
  
  // Get the student if needed
  const student = showStudent ? getUserById(log.userId) : null;
  
  // Determine what was recited (Surah or Juz)
  const recitationContent = log.surahName 
    ? `${log.surahName} (${log.ayahStart}-${log.ayahEnd})`
    : `Juz ${log.juzNumber} (Pages ${log.pageStart}-${log.pageEnd})`;
  
  // Calculate total mistakes
  const totalMistakes = log.mistakeCounts.reduce((sum, item) => sum + item.mistakes, 0);
  const totalStucks = log.mistakeCounts.reduce((sum, item) => sum + item.stucks, 0);
  const totalMarkedMistakes = log.mistakeCounts.reduce((sum, item) => sum + item.markedMistakes, 0);

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
    <Link to={`/log/${log.id}`}>
      <Card className="mb-4 cursor-pointer hover:shadow-md transition-shadow border-l-4 border-l-primary">
        <CardHeader className="pb-2 pt-4">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-base font-medium flex items-center">
                <BookOpen className="h-4 w-4 mr-2 text-primary" />
                {log.recitationType}
              </CardTitle>
              <p className="text-sm text-muted-foreground">{formattedDate}</p>
            </div>
            <Badge variant="outline" className="bg-primary-light text-primary border-primary">
              {totalMistakes + totalStucks + totalMarkedMistakes} issues
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-0 pb-4">
          {showStudent && student && (
            <p className="text-sm mb-2 font-medium">{student.name}</p>
          )}
          <p className="text-sm">{recitationContent}</p>
          <div className="flex gap-2 mt-2 flex-wrap">
            {totalMistakes > 0 && (
              <Badge variant="secondary" className="text-xs">
                {totalMistakes} mistakes
              </Badge>
            )}
            {totalStucks > 0 && (
              <Badge variant="secondary" className="text-xs">
                {totalStucks} stucks
              </Badge>
            )}
            {totalMarkedMistakes > 0 && (
              <Badge variant="secondary" className="text-xs">
                {totalMarkedMistakes} marked
              </Badge>
            )}
            {log.grade && (
              <Badge variant="outline" className={`text-xs ${getGradeColor(log.grade)}`}>
                <Star className="h-3 w-3 mr-1" />
                {log.grade}
              </Badge>
            )}
            {log.needsRepeat && (
              <Badge variant="outline" className="text-xs bg-orange-100 text-orange-800 border-orange-300">
                Needs Repeat
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default LogEntry;
