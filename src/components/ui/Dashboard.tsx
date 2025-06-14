
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
import { format } from "date-fns";
import LogsFilter from "./LogsFilter";
import EnhancedAnalyticsDashboard from "./analytics/EnhancedAnalyticsDashboard";

interface DashboardProps {
  user: User;
  logs: RecitationLog[];
  showStudentNames?: boolean;
  refreshTrigger?: number;
}

const Dashboard: React.FC<DashboardProps> = ({ 
  user, 
  logs: initialLogs,
  showStudentNames = false,
  refreshTrigger = 0
}) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"logs" | "analytics">("logs");
  const [logs, setLogs] = useState<RecitationLog[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [selectedTypes, setSelectedTypes] = useState<RecitationType[]>([]);
  
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
  
  // Filter logs by selected date and type
  const filteredLogs = logs.filter(log => {
    const dateMatch = selectedDate 
      ? new Date(log.date).toDateString() === selectedDate.toDateString()
      : true;
    
    const typeMatch = selectedTypes.length === 0 || selectedTypes.includes(log.recitationType);
    
    return dateMatch && typeMatch;
  });

  // Get recent logs (top 5 if no filters applied)
  const displayLogs = selectedDate || selectedTypes.length > 0 
    ? filteredLogs 
    : filteredLogs.slice(0, 5);

  const handleCreateLog = () => {
    navigate("/create-log");
  };

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    setIsDatePickerOpen(false);
  };

  const clearDateFilter = () => {
    setSelectedDate(undefined);
  };

  const handleFilterChange = (types: RecitationType[]) => {
    setSelectedTypes(types);
  };

  const handleViewAllLogs = () => {
    navigate("/all-logs");
  };

  const hasFilters = selectedDate || selectedTypes.length > 0;

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
          <div className="space-y-4">
            <div className="flex justify-between items-start">
              <h2 className="text-xl font-semibold">
                {hasFilters ? "Filtered Logs" : "Recent Activity"}
              </h2>
              <div className="flex flex-col gap-2">
                <div className="flex gap-2">
                  <Popover open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
                    <PopoverTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Calendar className="h-4 w-4 mr-2" />
                        {selectedDate ? format(selectedDate, "MMM dd") : "Pick Date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="end">
                      <CalendarComponent
                        mode="single"
                        selected={selectedDate}
                        onSelect={handleDateSelect}
                        initialFocus
                        className="p-3 pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                  {selectedDate && (
                    <Button variant="ghost" size="sm" onClick={clearDateFilter}>
                      Clear Date
                    </Button>
                  )}
                </div>
                
                <LogsFilter 
                  selectedTypes={selectedTypes}
                  onFilterChange={handleFilterChange}
                />
              </div>
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
                      : user.role === "student" 
                        ? "Start tracking your Quran memorization journey by creating your first log." 
                        : "Your students haven't recorded any logs yet."}
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
                    showStudent={showStudentNames}
                  />
                ))}
                
                {!hasFilters && logs.length > 5 && (
                  <div className="text-center mt-4">
                    <Button 
                      variant="outline" 
                      className="border-primary text-primary hover:bg-primary-light"
                      onClick={handleViewAllLogs}
                    >
                      View All Logs ({logs.length})
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="analytics">
          <div className="mb-4">
            <h2 className="text-xl font-semibold">Analytics</h2>
            <p className="text-sm text-muted-foreground">Track your progress and identify patterns</p>
          </div>
          
          <EnhancedAnalyticsDashboard logs={logs} />
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
