
import React from "react";
import { User, RecitationLog } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface StudentDayCardProps {
  student: User;
  logs: RecitationLog[];
  selectedDate: Date;
}

const StudentDayCard: React.FC<StudentDayCardProps> = ({
  student,
  logs,
  selectedDate,
}) => {
  const navigate = useNavigate();

  const getAttendanceStatus = () => {
    if (logs.length === 0) return "absent";
    const attendanceLog = logs.find(log => log.attendanceStatus);
    return attendanceLog?.attendanceStatus || "present";
  };

  const getAttendanceColor = (status: string) => {
    switch (status) {
      case 'present': return 'bg-green-100 text-green-800 border-green-300';
      case 'late': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'absent': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getRecitationSummary = () => {
    const types = [...new Set(logs.map(log => log.recitationType))];
    return types.join(", ") || "No recitation recorded";
  };

  const handleViewDetails = () => {
    navigate(`/profile/${student.id}`, { 
      state: { selectedDate: selectedDate.toISOString() } 
    });
  };

  const attendanceStatus = getAttendanceStatus();

  return (
    <Card className="mb-4 hover:shadow-md transition-shadow cursor-pointer" onClick={handleViewDetails}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">{student.name}</CardTitle>
          <Badge
            variant="outline"
            className={getAttendanceColor(attendanceStatus)}
          >
            {attendanceStatus.charAt(0).toUpperCase() + attendanceStatus.slice(1)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Recitation Types:</p>
            <p className="text-sm font-medium">{getRecitationSummary()}</p>
          </div>
          
          {logs.length > 0 && (
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <p className="text-muted-foreground">Total Logs:</p>
                <p className="font-medium">{logs.length}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Pages Read:</p>
                <p className="font-medium">
                  {logs.reduce((total, log) => total + (log.pagesCount || 0), 0)}
                </p>
              </div>
            </div>
          )}
          
          <div className="flex justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                handleViewDetails();
              }}
              className="flex items-center gap-2"
            >
              <Eye className="h-4 w-4" />
              View Details
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StudentDayCard;
