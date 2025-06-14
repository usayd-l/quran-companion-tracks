
import { RecitationLog, RecitationType } from "@/types";
import { format, subDays, startOfWeek, endOfWeek, differenceInDays } from "date-fns";

export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastLogDate: string | null;
}

export interface GradeDistribution {
  grade: string;
  count: number;
  percentage: number;
  color: string;
}

export interface MistakeTrend {
  date: string;
  totalMistakes: number;
  averageMistakes: number;
  mistakeTypes: {
    mistakes: number;
    stucks: number;
    marked: number;
  };
}

export interface ContentPerformance {
  content: string;
  type: 'surah' | 'juz';
  totalSessions: number;
  averageGrade: number;
  averageMistakes: number;
  needsImprovement: boolean;
}

export interface RecitationTypeStats {
  type: RecitationType;
  totalSessions: number;
  averageGrade: number;
  totalMistakes: number;
  lastSession: string | null;
}

export interface WeeklyProgress {
  week: string;
  sessionsCount: number;
  averageGrade: number;
  totalMistakes: number;
}

export const calculateStreak = (logs: RecitationLog[]): StreakData => {
  if (logs.length === 0) {
    return { currentStreak: 0, longestStreak: 0, lastLogDate: null };
  }

  // Sort logs by date (newest first)
  const sortedLogs = [...logs].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  // Get unique dates
  const uniqueDates = [...new Set(sortedLogs.map(log => log.date))].sort().reverse();
  
  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 0;
  
  const today = new Date();
  const yesterday = format(subDays(today, 1), "yyyy-MM-dd");
  const todayStr = format(today, "yyyy-MM-dd");
  
  // Calculate current streak
  for (let i = 0; i < uniqueDates.length; i++) {
    const currentDate = uniqueDates[i];
    const expectedDate = format(subDays(today, i), "yyyy-MM-dd");
    
    if (currentDate === expectedDate || (i === 0 && currentDate === yesterday)) {
      currentStreak++;
    } else {
      break;
    }
  }
  
  // Calculate longest streak
  for (let i = 0; i < uniqueDates.length; i++) {
    if (i === 0 || differenceInDays(new Date(uniqueDates[i-1]), new Date(uniqueDates[i])) === 1) {
      tempStreak++;
      longestStreak = Math.max(longestStreak, tempStreak);
    } else {
      tempStreak = 1;
    }
  }
  
  return {
    currentStreak,
    longestStreak,
    lastLogDate: uniqueDates[0] || null
  };
};

export const getGradeDistribution = (logs: RecitationLog[]): GradeDistribution[] => {
  const gradeColors = {
    'Excellent': '#10b981',
    'Very Good': '#3b82f6', 
    'Good': '#f59e0b',
    'Average': '#f97316',
    'Failed': '#ef4444'
  };
  
  const gradeCounts = logs.reduce((acc, log) => {
    if (log.grade) {
      acc[log.grade] = (acc[log.grade] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);
  
  const total = Object.values(gradeCounts).reduce((sum, count) => sum + count, 0);
  
  return Object.entries(gradeCounts).map(([grade, count]) => ({
    grade,
    count,
    percentage: total > 0 ? Math.round((count / total) * 100) : 0,
    color: gradeColors[grade as keyof typeof gradeColors] || '#6b7280'
  }));
};

export const getMistakeTrends = (logs: RecitationLog[], days: number = 7): MistakeTrend[] => {
  const dateRange = Array.from({ length: days }, (_, i) => {
    const date = subDays(new Date(), i);
    return format(date, "yyyy-MM-dd");
  }).reverse();
  
  return dateRange.map(date => {
    const dayLogs = logs.filter(log => log.date === date);
    
    const mistakeTypes = dayLogs.reduce((acc, log) => {
      log.mistakeCounts.forEach(count => {
        acc.mistakes += count.mistakes;
        acc.stucks += count.stucks;
        acc.marked += count.markedMistakes;
      });
      return acc;
    }, { mistakes: 0, stucks: 0, marked: 0 });
    
    const totalMistakes = mistakeTypes.mistakes + mistakeTypes.stucks + mistakeTypes.marked;
    
    return {
      date: format(new Date(date), "MM/dd"),
      totalMistakes,
      averageMistakes: dayLogs.length > 0 ? Math.round(totalMistakes / dayLogs.length * 10) / 10 : 0,
      mistakeTypes
    };
  });
};

export const getContentPerformance = (logs: RecitationLog[]): ContentPerformance[] => {
  const contentMap = new Map<string, {
    sessions: RecitationLog[];
    type: 'surah' | 'juz';
  }>();
  
  logs.forEach(log => {
    if (log.surahName) {
      const key = `surah-${log.surahName}`;
      if (!contentMap.has(key)) {
        contentMap.set(key, { sessions: [], type: 'surah' });
      }
      contentMap.get(key)!.sessions.push(log);
    }
    
    if (log.juzNumber) {
      const key = `juz-${log.juzNumber}`;
      if (!contentMap.has(key)) {
        contentMap.set(key, { sessions: [], type: 'juz' });
      }
      contentMap.get(key)!.sessions.push(log);
    }
  });
  
  const gradeValues = {
    'Excellent': 5,
    'Very Good': 4,
    'Good': 3,
    'Average': 2,
    'Failed': 1
  };
  
  return Array.from(contentMap.entries()).map(([key, data]) => {
    const content = key.split('-')[1];
    const sessions = data.sessions;
    
    const totalMistakes = sessions.reduce((sum, log) => 
      sum + log.mistakeCounts.reduce((mistakeSum, mc) => 
        mistakeSum + mc.mistakes + mc.stucks + mc.markedMistakes, 0), 0);
    
    const averageMistakes = sessions.length > 0 ? totalMistakes / sessions.length : 0;
    
    const gradesWithValues = sessions.filter(s => s.grade).map(s => gradeValues[s.grade as keyof typeof gradeValues]);
    const averageGrade = gradesWithValues.length > 0 
      ? gradesWithValues.reduce((sum, grade) => sum + grade, 0) / gradesWithValues.length 
      : 0;
    
    return {
      content,
      type: data.type,
      totalSessions: sessions.length,
      averageGrade: Math.round(averageGrade * 10) / 10,
      averageMistakes: Math.round(averageMistakes * 10) / 10,
      needsImprovement: averageGrade < 3 || averageMistakes > 5
    };
  }).sort((a, b) => b.totalSessions - a.totalSessions);
};

export const getRecitationTypeStats = (logs: RecitationLog[]): RecitationTypeStats[] => {
  const typeMap = new Map<RecitationType, RecitationLog[]>();
  
  logs.forEach(log => {
    if (!typeMap.has(log.recitationType)) {
      typeMap.set(log.recitationType, []);
    }
    typeMap.get(log.recitationType)!.push(log);
  });
  
  const gradeValues = {
    'Excellent': 5,
    'Very Good': 4,
    'Good': 3,
    'Average': 2,
    'Failed': 1
  };
  
  return Array.from(typeMap.entries()).map(([type, typeLogs]) => {
    const totalMistakes = typeLogs.reduce((sum, log) => 
      sum + log.mistakeCounts.reduce((mistakeSum, mc) => 
        mistakeSum + mc.mistakes + mc.stucks + mc.markedMistakes, 0), 0);
    
    const gradesWithValues = typeLogs.filter(log => log.grade).map(log => gradeValues[log.grade as keyof typeof gradeValues]);
    const averageGrade = gradesWithValues.length > 0 
      ? gradesWithValues.reduce((sum, grade) => sum + grade, 0) / gradesWithValues.length 
      : 0;
    
    const sortedLogs = [...typeLogs].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    return {
      type,
      totalSessions: typeLogs.length,
      averageGrade: Math.round(averageGrade * 10) / 10,
      totalMistakes,
      lastSession: sortedLogs[0]?.date || null
    };
  });
};

export const getWeeklyProgress = (logs: RecitationLog[], weeks: number = 4): WeeklyProgress[] => {
  const weekRanges = Array.from({ length: weeks }, (_, i) => {
    const date = subDays(new Date(), i * 7);
    const weekStart = startOfWeek(date);
    const weekEnd = endOfWeek(date);
    return {
      start: weekStart,
      end: weekEnd,
      label: format(weekStart, "MMM dd")
    };
  }).reverse();
  
  const gradeValues = {
    'Excellent': 5,
    'Very Good': 4,
    'Good': 3,
    'Average': 2,
    'Failed': 1
  };
  
  return weekRanges.map(week => {
    const weekLogs = logs.filter(log => {
      const logDate = new Date(log.date);
      return logDate >= week.start && logDate <= week.end;
    });
    
    const totalMistakes = weekLogs.reduce((sum, log) => 
      sum + log.mistakeCounts.reduce((mistakeSum, mc) => 
        mistakeSum + mc.mistakes + mc.stucks + mc.markedMistakes, 0), 0);
    
    const gradesWithValues = weekLogs.filter(log => log.grade).map(log => gradeValues[log.grade as keyof typeof gradeValues]);
    const averageGrade = gradesWithValues.length > 0 
      ? gradesWithValues.reduce((sum, grade) => sum + grade, 0) / gradesWithValues.length 
      : 0;
    
    return {
      week: week.label,
      sessionsCount: weekLogs.length,
      averageGrade: Math.round(averageGrade * 10) / 10,
      totalMistakes
    };
  });
};
