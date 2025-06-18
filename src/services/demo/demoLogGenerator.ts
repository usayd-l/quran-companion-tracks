
import { RecitationLog, Grade, RecitationType } from "@/types";
import { demoStudents, studentPerformanceProfiles } from "./demoUsers";

const surahs = ["Al-Baqarah", "Al-Imran", "An-Nisa", "Al-Maidah", "Al-An'am", "Al-A'raf", "Al-Anfal", "At-Tawbah"];
const grades: Grade[] = ["Excellent", "Very Good", "Good", "Average", "Failed"];
const recitationTypes: RecitationType[] = ["Sabaq", "Last 3 Sabaqs", "Sabaq Dhor", "Dhor"];
const absenceReasons = ['Sick', 'Vacation', 'Family Emergency', 'Transport Issues', 'Other'];

// Helper function to check if a date is a weekend (Friday = 5, Saturday = 6)
const isWeekend = (date: Date): boolean => {
  const day = date.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  return day === 5 || day === 6; // Friday or Saturday
};

// Helper function to get school days (excluding weekends) from today going backwards
const getSchoolDaysFromToday = (daysBack: number): Date[] => {
  const schoolDays: Date[] = [];
  let currentDate = new Date(); // Start from today
  let daysChecked = 0;
  
  while (schoolDays.length < daysBack && daysChecked < 100) { // Safety limit
    if (!isWeekend(currentDate)) {
      schoolDays.push(new Date(currentDate));
    }
    currentDate.setDate(currentDate.getDate() - 1);
    daysChecked++;
  }
  
  return schoolDays.reverse(); // Return in chronological order (oldest first)
};

export const generateDemoLogs = (): RecitationLog[] => {
  const today = new Date();
  console.log('Generating demo logs for the last 14 school days from:', today.toDateString());
  const logs: RecitationLog[] = [];
  
  // Get the last 14 school days (excluding weekends)
  const schoolDays = getSchoolDaysFromToday(14);
  console.log('School days generated:', schoolDays.length, schoolDays.map(d => d.toDateString()));
  
  schoolDays.forEach((date, dayIndex) => {
    console.log(`Generating logs for ${date.toDateString()}`);
    
    demoStudents.forEach((student) => {
      const profile = studentPerformanceProfiles[student.id] || { performanceLevel: 1, attendanceRate: 0.8 };
      
      // Determine attendance for this day
      const isPresent = Math.random() < profile.attendanceRate;
      const isLate = isPresent && Math.random() < 0.1; // 10% chance of being late if present
      
      let attendanceStatus = 'absent';
      if (isPresent) {
        attendanceStatus = isLate ? 'late' : 'present';
      }
      
      // Only create logs if student is present
      if (attendanceStatus === 'present' || attendanceStatus === 'late') {
        // Generate 1-3 recitation logs per day for present students
        const numLogs = Math.floor(Math.random() * 3) + 1;
        
        for (let logIndex = 0; logIndex < numLogs; logIndex++) {
          const recitationType = recitationTypes[Math.floor(Math.random() * recitationTypes.length)];
          const isJuzBased = recitationType === "Dhor" || recitationType === "Sabaq Dhor";
          
          // Performance-based mistake calculation
          let baseMistakes, baseStucks, gradeIndex, needsRepeat;
          
          switch (profile.performanceLevel) {
            case 0: // Excellent student
              baseMistakes = Math.floor(Math.random() * 2); // 0-1 mistakes
              baseStucks = Math.floor(Math.random() * 1); // 0 stucks
              gradeIndex = Math.floor(Math.random() * 2); // Excellent or Very Good
              needsRepeat = false;
              break;
            case 1: // Good student
              baseMistakes = Math.floor(Math.random() * 4) + 1; // 1-4 mistakes
              baseStucks = Math.floor(Math.random() * 2); // 0-1 stucks
              gradeIndex = Math.floor(Math.random() * 3) + 1; // Very Good, Good, or Average
              needsRepeat = baseMistakes > 3;
              break;
            case 2: // Needs improvement
              baseMistakes = Math.floor(Math.random() * 8) + 3; // 3-10 mistakes
              baseStucks = Math.floor(Math.random() * 4) + 1; // 1-4 stucks
              gradeIndex = Math.floor(Math.random() * 3) + 2; // Good, Average, or Failed
              needsRepeat = baseMistakes > 5;
              break;
            default:
              baseMistakes = 2;
              baseStucks = 1;
              gradeIndex = 2;
              needsRepeat = false;
          }
          
          // Adjust grade based on total issues
          const totalIssues = baseMistakes + baseStucks;
          if (totalIssues === 0) gradeIndex = 0; // Excellent
          else if (totalIssues <= 2) gradeIndex = Math.min(gradeIndex, 1); // Very Good
          else if (totalIssues > 8) gradeIndex = 4; // Failed
          
          const logId = `demo-log-${student.id}-${date.getTime()}-${logIndex}`;
          
          const log: RecitationLog = {
            id: logId,
            userId: student.id,
            date: date.toISOString().split('T')[0],
            recitationType: recitationType,
            mistakeCounts: [
              {
                portion: "Full",
                mistakes: baseMistakes,
                stucks: baseStucks,
                markedMistakes: Math.floor(Math.random() * 2)
              }
            ],
            testerName: "Demo Teacher",
            notes: totalIssues === 0 ? "مَا شَاءَ ٱللَّٰهُ - Perfect recitation!" :
                   totalIssues <= 2 ? "Excellent work, keep it up!" :
                   totalIssues <= 5 ? "Good effort, practice more" :
                   "Needs more practice and review",
            grade: grades[gradeIndex],
            needsRepeat,
            createdAt: date.toISOString(),
            userName: student.name,
            attendanceStatus,
            absenceReason: attendanceStatus === 'late' ? 'Transport Issues' : undefined
          };
          
          // Add specific content based on recitation type
          if (isJuzBased) {
            log.juzNumber = Math.floor(Math.random() * 30) + 1;
            log.pagesCount = Math.floor(Math.random() * 10) + 1;
          } else {
            log.surahName = surahs[Math.floor(Math.random() * surahs.length)];
            log.ayahStart = Math.floor(Math.random() * 10) + 1;
            log.ayahEnd = log.ayahStart + Math.floor(Math.random() * 15) + 5;
          }
          
          logs.push(log);
        }
      } else {
        // Create attendance-only record for absent students
        const attendanceRecord: RecitationLog = {
          id: `demo-attendance-${student.id}-${date.getTime()}`,
          userId: student.id,
          date: date.toISOString().split('T')[0],
          recitationType: "Sabaq", // Placeholder
          mistakeCounts: [],
          testerName: "Demo Teacher",
          createdAt: date.toISOString(),
          userName: student.name,
          attendanceStatus: 'absent',
          absenceReason: absenceReasons[Math.floor(Math.random() * absenceReasons.length)]
        };
        
        logs.push(attendanceRecord);
      }
    });
  });
  
  const sortedLogs = logs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  console.log('Generated demo logs:', sortedLogs.length, 'total logs');
  console.log('Date range:', sortedLogs[sortedLogs.length - 1]?.date, 'to', sortedLogs[0]?.date);
  
  return sortedLogs;
};
