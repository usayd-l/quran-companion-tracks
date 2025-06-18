
import React, { useState, useEffect } from "react";
import { User, RecitationLog, RecitationType } from "@/types";
import { Button } from "@/components/ui/button";
import LogEntry from "./LogEntry";
import { Link, useNavigate } from "react-router-dom";
import { BarChart, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FloatingActionButton from "./FloatingActionButton";
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
import DateNavigation from "./DateNavigation";
import StudentDayCard from "./StudentDayCard";

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
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTypes, setSelectedTypes] = useState<RecitationType[]>([]);
  const [selectedStudentId, setSelectedStudentId] = useState<string>("select-students");
  
  // Sort logs by date and creation time (newest first)
  useEffect(() => {
    console.log('Dashboard: Initial logs received:', initialLogs.length);
    const sortedLogs = [...initialLogs].sort((a, b) => {
      const dateComparison = new Date(b.date).getTime() - new Date(a.date).getTime();
      if (dateComparison === 0) {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      return dateComparison;
    });
    setLogs(sortedLogs);
    console.log('Dashboard: Sorted logs set:', sortedLogs.length);
  }, [initialLogs, refreshTrigger]);
  
  // Filter logs for teacher view
  const getFilteredLogsForDate = () => {
    const selectedDateString = format(selectedDate, "yyyy-MM-dd");
    console.log('Filtering logs for date:', selectedDateString);
    const filtered = logs.filter(log => log.date === selectedDateString);
    console.log('Filtered logs for date:', filtered.length);
    return filtered;
  };

  // Filter logs for student view (existing logic)
  const getFilteredLogsForStudent = () => {
    const dateMatch = selectedDate 
      ? logs.filter(log => new Date(log.date).toDateString() === selectedDate.toDateString())
      : logs;
    const typeMatch = selectedTypes.length === 0 
      ? dateMatch 
      : dateMatch.filter(log => selectedTypes.includes(log.recitationType));
    
    return typeMatch;
  };

  // Group logs by student for teacher view
  const getStudentLogsForDate = () => {
    const dateFilteredLogs = getFilteredLogsForDate();
    console.log('Date filtered logs:', dateFilteredLogs.length);
    const studentLogsMap = new Map<string, RecitationLog[]>();
    
    dateFilteredLogs.forEach(log => {
      if (!studentLogsMap.has(log.userId)) {
        studentLogsMap.set(log.userId, []);
      }
      studentLogsMap.get(log.userId)!.push(log);
    });
    
    // Include all students, even those without logs for the date
    const result = students.map(student => {
      const studentLogs = studentLogsMap.get(student.id) || [];
      return { student, logs: studentLogs };
    });
    
    console.log('Student logs for date:', result.length, 'students');
    return result;
  };

  const handleCreateLog = () => {
    navigate("/create-log");
  };

  const handleFilterChange = (types: RecitationType[]) => {
    setSelectedTypes(types);
  };

  const handleDateChange = (date: Date) => {
    console.log('Date changed to:', date);
    setSelectedDate(date);
  };

  const handleViewAllLogs = () => {
    navigate("/all-logs");
  };

  // Render content based on user role and active tab
  const renderLogsContent = () => {
    if (user.role === "teacher") {
      const studentLogsForDate = getStudentLogsForDate();
      console.log('Rendering teacher view with students:', studentLogsForDate.length);
      
      return (
        <div className="space-y-4">
          <DateNavigation 
            selectedDate={selectedDate}
            onDateChange={handleDateChange}
          />
          
          {studentLogsForDate.length === 0 ? (
            <Card>
              <CardHeader>
                <CardTitle className="text-center text-lg">No Students Found</CardTitle>
              </CardHeader>
              <CardContent className="text-center pb-6">
                <p className="text-muted-foreground">
                  No students are enrolled in your classrooms.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div>
              <h3 className="text-lg font-semibold mb-4">
                Student Activity - {format(selectedDate, "MMMM d, yyyy")}
              </h3>
              {studentLogsForDate.map(({ student, logs }) => (
                <StudentDayCard 
                  key={student.id}
                  student={student}
                  logs={logs}
                  selectedDate={selectedDate}
                />
              ))}
            </div>
          )}
        </div>
      );
    } else {
      // Student view (existing logic)
      const filteredLogs = getFilteredLogsForStudent();
      const displayLogs = selectedTypes.length > 0 ? filteredLogs : filteredLogs.slice(0, 5);
      const hasFilters = selectedTypes.length > 0;

      return (
        <div className="space-y-4">
          <div className="flex justify-between items-start">
            <h2 className="text-xl font-semibold">
              {hasFilters ? "Filtered Logs" : "Recent Activity"}
            </h2>
            
            <LogsFilter 
              selectedTypes={selectedTypes}
              selectedDate={undefined}
              onFilterChange={handleFilterChange}
              onDateChange={() => {}}
              showDatePicker={false}
            />
          </div>
          
          {displayLogs.length === 0 ? (
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
                    : "Start tracking your Quran memorization journey by creating your first log."}
                </p>
                {hasFilters && (
                  <Button variant="outline" size="sm" onClick={() => setSelectedTypes([])}>
                    Clear Filters
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <div>
              {displayLogs.map((log) => (
                <LogEntry 
                  key={log.id} 
                  log={log} 
                  showStudentName={false}
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
      );
    }
  };

  const renderAnalyticsContent = () => {
    if (user.role === "teacher") {
      return (
        <div className="space-y-4">
          <div className="mb-4">
            <Select value={selectedStudentId} onValueChange={setSelectedStudentId}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a student to view their analytics" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="select-students">Select Students</SelectItem>
                {students.map((student) => (
                  <SelectItem key={student.id} value={student.id}>
                    {student.name} ({student.classroomName || "No Classroom"})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedStudentId === "select-students" ? (
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
            <div>
              <div className="mb-4">
                <h2 className="text-xl font-semibold">
                  {students.find(s => s.id === selectedStudentId)?.name}'s Analytics
                </h2>
                <p className="text-sm text-muted-foreground">Track progress and identify patterns</p>
              </div>
              <EnhancedAnalyticsDashboard 
                logs={logs.filter(log => log.userId === selectedStudentId)} 
              />
            </div>
          )}
        </div>
      );
    } else {
      return (
        <div>
          <div className="mb-4">
            <h2 className="text-xl font-semibold">Analytics</h2>
            <p className="text-sm text-muted-foreground">Track progress and identify patterns</p>
          </div>
          <EnhancedAnalyticsDashboard logs={logs} />
        </div>
      );
    }
  };

  return (
    <div className="space-y-6 relative pb-20">
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
          {renderLogsContent()}
        </TabsContent>
        
        <TabsContent value="analytics">
          {renderAnalyticsContent()}
        </TabsContent>
      </Tabs>

      {/* Floating Action Button for all users */}
      <FloatingActionButton onClick={handleCreateLog} />
    </div>
  );
};

export default Dashboard;
