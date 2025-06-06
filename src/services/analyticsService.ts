
import { RecitationLog } from "@/types";
import { format, subDays } from "date-fns";

export interface TypeSpecificAnalytics {
  type: string;
  chartData: {
    date: string;
    count: number;
    mistakes: number;
  }[];
}

export const generateTypeSpecificAnalytics = (logs: RecitationLog[]): TypeSpecificAnalytics[] => {
  // Group logs by recitation type
  const logsByType = logs.reduce((acc, log) => {
    if (!acc[log.recitationType]) {
      acc[log.recitationType] = [];
    }
    acc[log.recitationType].push(log);
    return acc;
  }, {} as Record<string, RecitationLog[]>);

  // Generate analytics for each type that has data
  return Object.entries(logsByType).map(([type, typeLogs]) => {
    // Get last 7 days of data
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = subDays(new Date(), i);
      return format(date, "MM/dd");
    }).reverse();

    const chartData = last7Days.map(dateStr => {
      const logsForDate = typeLogs.filter(log => 
        format(new Date(log.date), "MM/dd") === dateStr
      );

      const count = logsForDate.length;
      const mistakes = logsForDate.reduce((sum, log) => {
        return sum + log.mistakeCounts.reduce((mistakeSum, mc) => 
          mistakeSum + mc.mistakes + mc.stucks + mc.markedMistakes, 0
        );
      }, 0);

      return {
        date: dateStr,
        count,
        mistakes
      };
    });

    return {
      type,
      chartData
    };
  });
};
