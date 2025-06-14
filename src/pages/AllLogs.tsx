
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { RecitationLog, RecitationType } from "@/types";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import LogEntry from "@/components/ui/LogEntry";
import LogsFilter from "@/components/ui/LogsFilter";
import { useAuth } from "@/context/AuthContext";
import { getLogsByUserId, getLogsByClassroomId } from "@/services/supabaseService";

const AllLogs = () => {
  const navigate = useNavigate();
  const { authState } = useAuth();
  const [logs, setLogs] = useState<RecitationLog[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<RecitationLog[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<RecitationType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      if (!authState.user) return;
      
      try {
        setLoading(true);
        let allLogs: RecitationLog[] = [];
        
        if (authState.user.role === "student") {
          allLogs = await getLogsByUserId(authState.user.id);
        } else if (authState.user.role === "teacher" && authState.user.classroomId) {
          allLogs = await getLogsByClassroomId(authState.user.classroomId);
        }
        
        // Sort by date (newest first) and created date
        allLogs.sort((a, b) => {
          const dateComparison = new Date(b.date).getTime() - new Date(a.date).getTime();
          if (dateComparison === 0) {
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          }
          return dateComparison;
        });
        
        setLogs(allLogs);
        setFilteredLogs(allLogs);
      } catch (error) {
        console.error("Error fetching logs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, [authState.user]);

  useEffect(() => {
    if (selectedTypes.length === 0) {
      setFilteredLogs(logs);
    } else {
      setFilteredLogs(logs.filter(log => selectedTypes.includes(log.recitationType)));
    }
  }, [logs, selectedTypes]);

  const handleFilterChange = (types: RecitationType[]) => {
    setSelectedTypes(types);
  };

  if (loading) {
    return (
      <div className="container max-w-md mx-auto px-4 py-6">
        <div className="text-center p-6">
          <p className="text-muted-foreground">Loading logs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-md mx-auto px-4 py-6 pattern-bg">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate(-1)}
            className="mr-4"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-xl font-bold">All Logs</h1>
        </div>
      </div>

      <div className="mb-4">
        <LogsFilter 
          selectedTypes={selectedTypes}
          onFilterChange={handleFilterChange}
        />
      </div>

      <div className="mb-4">
        <p className="text-sm text-muted-foreground">
          Showing {filteredLogs.length} of {logs.length} logs
          {selectedTypes.length > 0 && ` (filtered by: ${selectedTypes.join(', ')})`}
        </p>
      </div>

      {filteredLogs.length === 0 ? (
        <div className="text-center p-6">
          <h3 className="text-lg font-medium mb-2">
            {selectedTypes.length > 0 ? "No logs match your filter" : "No logs yet"}
          </h3>
          <p className="text-muted-foreground mb-4">
            {selectedTypes.length > 0 
              ? "Try adjusting your filter criteria or clear the filters to see all logs."
              : "Start tracking your Quran memorization journey by creating your first log."}
          </p>
          {selectedTypes.length > 0 && (
            <Button variant="outline" onClick={() => setSelectedTypes([])}>
              Clear Filters
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredLogs.map((log) => (
            <LogEntry 
              key={log.id} 
              log={log} 
              showStudent={authState.user?.role === "teacher"}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default AllLogs;
