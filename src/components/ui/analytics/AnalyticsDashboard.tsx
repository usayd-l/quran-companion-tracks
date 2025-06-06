
import React from "react";
import { RecitationLog } from "@/types";
import { generateTypeSpecificAnalytics } from "@/services/analyticsService";
import TypeSpecificChart from "./TypeSpecificChart";

interface AnalyticsDashboardProps {
  logs: RecitationLog[];
}

const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ logs }) => {
  const typeAnalytics = generateTypeSpecificAnalytics(logs);

  if (typeAnalytics.length === 0) {
    return (
      <div className="text-center p-6">
        <h3 className="text-lg font-medium mb-2">No Analytics Data</h3>
        <p className="text-muted-foreground">
          Start creating recitation logs to see your progress analytics.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {typeAnalytics.map((typeData) => (
        <TypeSpecificChart key={typeData.type} data={typeData} />
      ))}
    </div>
  );
};

export default AnalyticsDashboard;
