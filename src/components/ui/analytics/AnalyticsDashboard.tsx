
import React from "react";
import ConsistencyChart from "./ConsistencyChart";
import MistakesTrendChart from "./MistakesTrendChart";
import RecentContentSummary from "./RecentContentSummary";
import { AnalyticsData } from "@/types";

interface AnalyticsDashboardProps {
  data: AnalyticsData;
}

const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ data }) => {
  return (
    <div className="space-y-4">
      <ConsistencyChart data={data.consistency} />
      <MistakesTrendChart data={data.mistakes} />
      <RecentContentSummary data={data.recentContent} />
    </div>
  );
};

export default AnalyticsDashboard;
