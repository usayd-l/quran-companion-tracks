
import React, { useState, useEffect } from "react";
import { User, RecitationLog, RecitationType } from "@/types";
import { Button } from "@/components/ui/button";
import LogEntry from "./LogEntry";
import { Link, useNavigate } from "react-router-dom";
import { BarChart, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FloatingActionButton from "./FloatingActionButton";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import LogsFilter from "./LogsFilter";
import EnhancedAnalyticsDashboard from "./analytics/EnhancedAnalyticsDashboard";

interface DashboardProps {
  user: User;
  logs: RecitationLog[];
  students?: User[];
  showStudentNames?: boolean;
  refreshTrigger?: number;
}

const Dashboard: React.FC<DashboardProps> = ({ 
  user, 
  logs: initialLogs,
  students = [],
  showStudentNames = false,
  refreshTrigger = 0
}) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"logs" | "analytics">("logs");
  const [logs, setLogs] = useState<RecitationLog[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTypes, setSelectedTypes] = useState<RecitationType[]>([]);
  const [selectedStudentId, setSelectedStudentId] = useState<string>("all-students");
  
  // Sort logs by date and creation time (newest first)
  useEffect(() => {
    const sortedLogs = [...initialLogs].sort((a, b) => {
      const dateComparison = new Date(b.date).getTime() - new Date(a.date).getTime();
      if (dateComparison === 0) {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      return dateComparison;
    });
    setLogs(sortedLogs);
  }, [initialLogs, refreshTrigger]);
  
  // Filter logs by selected student, date and type
  const filteredLogs = logs.filter(log => {
    const studentMatch = selectedStudentId === "all-students" ? true : log.userId === selectedStudentId;
    const dateMatch = selectedDate 
      ? new Date(log.date).toDateString() === selectedDate.toDateString()
      : true;
    const typeMatch = selectedTypes.length === 0 || selectedTypes.includes(log.recitationType);
    
    return studentMatch && dateMatch && typeMatch;
  });

  // Get recent logs (top 5 if no filters applied)
  const displayLogs = selectedDate || selectedTypes.length > 0 || selectedStudentId !== "all-students"
    ? filteredLogs 
    : filteredLogs.slice(0, 5);

  const handleCreateLog = () => {
    navigate("/create-log");
  };

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
  };

  const clearDateFilter = () => {
    setSelectedDate(undefined);
  };

  const handleFilterChange = (types: RecitationType[]) => {
    setSelectedTypes(types);
  };

  const handleDateChange = (date?: Date) => {
    setSelectedDate(date);
  };

  const handleViewAllLogs = () => {
    navigate("/all-logs");
  };

  const hasFilters = selectedDate || selectedTypes.length > 0 || selectedStudentId !== "all-students";
  const selectedStudent = students.find(s => s.id === selectedStudentId);

  return (
    <div className="space-y-6 relative pb-20">
      {/* Student Selection Dropdown for Teachers */}
      {user.role === "teacher" && students.length > 0 && (
        <div className="mb-4">
          <Select value={selectedStudentId} onValueChange={setSelectedStudentId}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a student to view their data" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-students">All Students</SelectItem>
              {students.map((student) => (
                <SelectItem key={student.id} value={student.id}>
                  {student.name} ({student.classroomName || "No Classroom"})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <Tabs 
        defaultValue="logs" 
        value={activeTab} 
        onValueChange={(value) => setActiveTab(value as "logs" | "analytics")}
      >
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="logs" className="flex items-center justify-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>Logs</span>
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center justify-center gap-2">
            <BarChart className="h-4 w-4" />
            <span>Analytics</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="logs">
          <div className="space-y-4">
            <div className="flex justify-between items-start">
              <h2 className="text-xl font-semibold">
                {selectedStudent 
                  ? `${selectedStudent.name}'s Logs`
                  : hasFilters 
                    ? "Filtered Logs" 
                    : "Recent Activity"}
              </h2>
              
              <LogsFilter 
                selectedTypes={selectedTypes}
                selectedDate={selectedDate}
                onFilterChange={handleFilterChange}
                onDateChange={handleDateChange}
                showDatePicker={user.role === "student"}
              />
            </div>
            
            {/* Show empty state if teacher hasn't selected a student */}
            {user.role === "teacher" && selectedStudentId === "all-students" ? (
              <Card>
                <CardHeader>
                  <CardTitle className="text-center text-lg">Select a Student</CardTitle>
                </CardHeader>
                <CardContent className="text-center pb-6">
                  <p className="text-muted-foreground">
                    Please select a student from the dropdown above to view their logs and analytics.
                  </p>
                </CardContent>
              </Card>
            ) : displayLogs.length === 0 ? (
              <Card>
                <CardHeader>
                  <CardTitle className="text-center text-lg">
                    {hasFilters ? "No logs match your filters" : "No logs yet"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center pb-6">
                  <p className="text-muted-foreground mb-4">
                    {hasFilters 
                      ? "Try adjusting your filter criteria to see more logs."
                      : user.role === "student" 
                        ? "Start tracking your Quran memorization journey by creating your first log." 
                        : "This student hasn't recorded any logs yet."}
                  </p>
                  {hasFilters && (
                    <div className="flex gap-2 justify-center">
                      {selectedDate && (
                        <Button variant="outline" size="sm" onClick={clearDateFilter}>
                          Clear Date
                        </Button>
                      )}
                      {selectedTypes.length > 0 && (
                        <Button variant="outline" size="sm" onClick={() => setSelectedTypes([])}>
                          Clear Filters
                        </Button>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            ) : (
              <div>
                {displayLogs.map((log) => (
                  <LogEntry 
                    key={log.id} 
                    log={log} 
                    showStudent={showStudentNames && selectedStudentId === "all-students"}
                  />
                ))}
                
                {!hasFilters && logs.length > 5 && (
                  <div className="text-center mt-4">
                    <Button 
                      variant="outline" 
                      className="border-primary text-primary hover:bg-primary-light"
                      onClick={handleViewAllLogs}
                    >
                      View All Logs ({filteredLogs.length})
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="analytics">
          <div className="mb-4">
            <h2 className="text-xl font-semibold">
              {selectedStudent ? `${selectedStudent.name}'s Analytics` : "Analytics"}
            </h2>
            <p className="text-sm text-muted-foreground">Track progress and identify patterns</p>
          </div>
          
          {user.role === "teacher" && selectedStudentId === "all-students" ? (
            <Card>
              <CardHeader>
                <CardTitle className="text-center text-lg">Select a Student</CardTitle>
              </CardHeader>
              <CardContent className="text-center pb-6">
                <p className="text-muted-foreground">
                  Please select a student from the dropdown above to view their analytics.
                </p>
              </CardContent>
            </Card>
          ) : (
            <EnhancedAnalyticsDashboard logs={filteredLogs} />
          )}
        </TabsContent>
      </Tabs>

      {/* Floating Action Button for students */}
      {user.role === "student" && (
        <FloatingActionButton onClick={handleCreateLog} />
      )}
    </div>
  );
};

export default Dashboard;
