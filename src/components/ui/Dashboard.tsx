
import React from "react";
import { User, RecitationLog } from "@/types";
import { Button } from "@/components/ui/button";
import LogEntry from "./LogEntry";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface DashboardProps {
  user: User;
  logs: RecitationLog[];
  showStudentNames?: boolean;
}

const Dashboard: React.FC<DashboardProps> = ({ 
  user, 
  logs,
  showStudentNames = false
}) => {
  const recentLogs = [...logs].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  ).slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Recent Activity</h2>
        <Link to="/create-log">
          <Button className="bg-primary hover:bg-primary/90">
            <Plus className="h-4 w-4 mr-2" />
            New Log
          </Button>
        </Link>
      </div>
      
      {recentLogs.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-center text-lg">No logs yet</CardTitle>
          </CardHeader>
          <CardContent className="text-center pb-6">
            <p className="text-muted-foreground mb-4">Start tracking your Quran memorization journey by creating your first log.</p>
            <Link to="/create-log">
              <Button className="bg-primary hover:bg-primary/90">
                Create First Log
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div>
          {recentLogs.map((log) => (
            <LogEntry 
              key={log.id} 
              log={log} 
              showStudent={showStudentNames}
            />
          ))}
          
          {logs.length > 5 && (
            <div className="text-center mt-4">
              <Button variant="outline" className="border-primary text-primary hover:bg-primary-light">
                View All Logs
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
