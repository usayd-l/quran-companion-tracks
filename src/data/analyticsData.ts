
import { AnalyticsData } from "@/types";
import { RecitationLog } from "@/types";

// Helper function to format date for display
const formatDate = (date: Date): string => {
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

// Helper to generate dates for last 7 days
const getLast7Days = (): string[] => {
  const dates: string[] = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    dates.push(formatDate(date));
  }
  return dates;
};

// Generate consistency data (daily log counts for the last week)
export const generateConsistencyData = (logs: RecitationLog[]): AnalyticsData['consistency'] => {
  const days = getLast7Days();
  const countByDay = new Map<string, number>();
  
  // Initialize all days with 0
  days.forEach(day => countByDay.set(day, 0));
  
  // Count logs per day
  logs.forEach(log => {
    const logDate = new Date(log.date);
    const formattedDate = formatDate(logDate);
    
    if (countByDay.has(formattedDate)) {
      countByDay.set(formattedDate, (countByDay.get(formattedDate) || 0) + 1);
    }
  });
  
  // Convert to the required format
  return days.map(date => ({
    date,
    count: countByDay.get(date) || 0
  }));
};

// Generate mistake trend data
export const generateMistakesData = (logs: RecitationLog[]): AnalyticsData['mistakes'] => {
  const days = getLast7Days();
  const mistakesByDay: {[key: string]: {mistakes: number, stucks: number, marked: number}} = {};
  
  // Initialize all days with zeros
  days.forEach(day => {
    mistakesByDay[day] = {mistakes: 0, stucks: 0, marked: 0};
  });
  
  // Sum mistakes by day
  logs.forEach(log => {
    const logDate = new Date(log.date);
    const formattedDate = formatDate(logDate);
    
    if (mistakesByDay[formattedDate]) {
      log.mistakeCounts.forEach(count => {
        mistakesByDay[formattedDate].mistakes += count.mistakes;
        mistakesByDay[formattedDate].stucks += count.stucks;
        mistakesByDay[formattedDate].marked += count.markedMistakes;
      });
    }
  });
  
  // Convert to the required format
  return days.map(date => ({
    date,
    mistakes: mistakesByDay[date].mistakes,
    stucks: mistakesByDay[date].stucks,
    marked: mistakesByDay[date].marked
  }));
};

// Generate recent content summary
export const generateRecentContentData = (logs: RecitationLog[]): AnalyticsData['recentContent'] => {
  const contentMap = new Map<string, {type: 'surah' | 'juz', count: number}>();
  
  logs.forEach(log => {
    // Track Surahs
    if (log.surahName) {
      const key = `surah-${log.surahName}`;
      if (contentMap.has(key)) {
        const existing = contentMap.get(key)!;
        contentMap.set(key, {...existing, count: existing.count + 1});
      } else {
        contentMap.set(key, {type: 'surah', count: 1});
      }
    }
    
    // Track Juz
    if (log.juzNumber) {
      const key = `juz-${log.juzNumber}`;
      if (contentMap.has(key)) {
        const existing = contentMap.get(key)!;
        contentMap.set(key, {...existing, count: existing.count + 1});
      } else {
        contentMap.set(key, {type: 'juz', count: 1});
      }
    }
  });
  
  // Convert to the required format and sort by count (descending)
  return Array.from(contentMap.entries())
    .map(([key, data]) => ({
      type: data.type,
      name: key.split('-')[1],
      count: data.count
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5); // Top 5 only
};

// Generate all analytics data
export const generateAnalyticsData = (logs: RecitationLog[]): AnalyticsData => {
  return {
    consistency: generateConsistencyData(logs),
    mistakes: generateMistakesData(logs),
    recentContent: generateRecentContentData(logs)
  };
};
