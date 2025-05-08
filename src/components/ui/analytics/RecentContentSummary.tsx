
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface RecentContentSummaryProps {
  data: {
    type: 'surah' | 'juz';
    name: string;
    count: number;
  }[];
}

const RecentContentSummary: React.FC<RecentContentSummaryProps> = ({ data }) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-md">Recent Content</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        {data.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            No recitation data available
          </p>
        ) : (
          <ul className="space-y-2">
            {data.map((item, index) => (
              <li key={index} className="flex justify-between items-center py-1 border-b last:border-0 border-border/30">
                <span className="text-sm">
                  {item.type === 'surah' ? 'Surah' : 'Juz'} {item.name}
                </span>
                <span className="text-xs px-2 py-1 bg-primary/10 rounded-full">
                  {item.count} {item.count === 1 ? 'time' : 'times'}
                </span>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentContentSummary;
