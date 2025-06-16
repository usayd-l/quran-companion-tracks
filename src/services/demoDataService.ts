
import { Classroom, Grade } from "@/types";

// Demo classroom for demo teacher
export const demoClassroom: Classroom = {
  id: "demo-classroom-id",
  name: "Demo Quran Class",
  teacherId: "demo-teacher-id",
  classCode: "DEMO123"
};

// Additional demo classrooms
export const demoClassrooms: Classroom[] = [
  demoClassroom,
  {
    id: "demo-classroom-2",
    name: "Advanced Hifz Class",
    teacherId: "demo-teacher-id",
    classCode: "ADV456"
  }
];

// Expanded demo students for the classrooms
export const demoStudents = [
  {
    id: "demo-student-id", // Main demo student
    name: "Demo Student",
    role: "student" as const,
    email: "student@demo.com",
    profileImage: "https://ui-avatars.com/api/?name=Demo+Student&background=E9F0E6&color=4A6741",
    classroomId: "demo-classroom-id"
  },
  {
    id: "demo-student-1",
    name: "Ahmad Ali",
    role: "student" as const,
    email: "ahmad@demo.com",
    profileImage: "https://ui-avatars.com/api/?name=Ahmad+Ali&background=E9F0E6&color=4A6741",
    classroomId: "demo-classroom-id"
  },
  {
    id: "demo-student-2", 
    name: "Fatima Hassan",
    role: "student" as const,
    email: "fatima@demo.com",
    profileImage: "https://ui-avatars.com/api/?name=Fatima+Hassan&background=E9F0E6&color=4A6741",
    classroomId: "demo-classroom-id"
  },
  {
    id: "demo-student-3",
    name: "Omar Ibrahim",
    role: "student" as const,
    email: "omar@demo.com",
    profileImage: "https://ui-avatars.com/api/?name=Omar+Ibrahim&background=E9F0E6&color=4A6741",
    classroomId: "demo-classroom-id"
  },
  {
    id: "demo-student-4",
    name: "Aisha Rahman",
    role: "student" as const,
    email: "aisha@demo.com",
    profileImage: "https://ui-avatars.com/api/?name=Aisha+Rahman&background=E9F0E6&color=4A6741",
    classroomId: "demo-classroom-id"
  },
  {
    id: "demo-student-5",
    name: "Yusuf Ahmed",
    role: "student" as const,
    email: "yusuf@demo.com",
    profileImage: "https://ui-avatars.com/api/?name=Yusuf+Ahmed&background=E9F0E6&color=4A6741",
    classroomId: "demo-classroom-id"
  },
  {
    id: "demo-student-6",
    name: "Mariam Khan",
    role: "student" as const,
    email: "mariam@demo.com",
    profileImage: "https://ui-avatars.com/api/?name=Mariam+Khan&background=E9F0E6&color=4A6741",
    classroomId: "demo-classroom-2"
  },
  {
    id: "demo-student-7",
    name: "Hassan Mohamed",
    role: "student" as const,
    email: "hassan@demo.com",
    profileImage: "https://ui-avatars.com/api/?name=Hassan+Mohamed&background=E9F0E6&color=4A6741",
    classroomId: "demo-classroom-2"
  }
];

// Generate realistic demo logs with logical patterns
const generateDemoLogs = () => {
  const surahs = ["Al-Baqarah", "Al-Imran", "An-Nisa", "Al-Maidah", "Al-An'am", "Al-A'raf", "Al-Anfal", "At-Tawbah"];
  const grades: Grade[] = ["Excellent", "Very Good", "Good", "Average", "Failed"];
  const recitationTypes = ["Sabaq", "Last 3 Sabaqs", "Sabaq Dhor", "Dhor"];
  const attendanceOptions = ['present', 'absent', 'late'];
  const absenceReasons = ['Sick', 'Vacation', 'Family Emergency', 'Transport Issues', 'Other'];
  
  const logs: any[] = [];
  
  // Define student performance profiles
  const studentProfiles = {
    "demo-student-id": { performanceLevel: 1, attendanceRate: 0.9 }, // Good performer
    "demo-student-1": { performanceLevel: 0, attendanceRate: 0.95 }, // Excellent performer
    "demo-student-2": { performanceLevel: 1, attendanceRate: 0.85 }, // Good performer
    "demo-student-3": { performanceLevel: 2, attendanceRate: 0.75 }, // Needs improvement
    "demo-student-4": { performanceLevel: 0, attendanceRate: 0.9 }, // Excellent performer
    "demo-student-5": { performanceLevel: 2, attendanceRate: 0.7 }, // Needs improvement
    "demo-student-6": { performanceLevel: 1, attendanceRate: 0.88 }, // Good performer
    "demo-student-7": { performanceLevel: 0, attendanceRate: 0.92 }, // Excellent performer
  };
  
  // Generate logs for the last 30 days
  for (let dayOffset = 0; dayOffset < 30; dayOffset++) {
    const date = new Date();
    date.setDate(date.getDate() - dayOffset);
    
    demoStudents.forEach((student) => {
      const profile = studentProfiles[student.id] || { performanceLevel: 1, attendanceRate: 0.8 };
      
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
          
          const log: any = {
            id: `demo-log-${student.id}-${dayOffset}-${logIndex}`,
            userId: student.id,
            date: date.toISOString().split('T')[0],
            recitationType: recitationType as any,
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
        const attendanceRecord: any = {
          id: `demo-attendance-${student.id}-${dayOffset}`,
          userId: student.id,
          date: date.toISOString().split('T')[0],
          recitationType: "Sabaq" as any, // Placeholder
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
  }
  
  return logs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

// Generate the demo logs
export const demoLogs = generateDemoLogs();

// Demo service functions that mimic the Supabase service API
export const demoDataService = {
  getUserById: async (userId: string) => {
    if (userId === "demo-teacher-id") {
      return {
        id: "demo-teacher-id",
        name: "Demo Teacher", 
        role: "teacher" as const,
        email: "teacher@demo.com",
        profileImage: "https://ui-avatars.com/api/?name=Demo+Teacher&background=D3B88C&color=2D2A26"
      };
    }
    return demoStudents.find(student => student.id === userId) || null;
  },

  getUsersByClassroomId: async (classroomId: string) => {
    return demoStudents.filter(student => student.classroomId === classroomId);
  },

  getClassroomsByTeacherId: async (teacherId: string) => {
    if (teacherId === "demo-teacher-id") {
      return demoClassrooms;
    }
    return [];
  },

  getLogsByUserId: async (userId: string) => {
    console.log('Getting logs for user:', userId);
    const userLogs = demoLogs.filter(log => log.userId === userId);
    console.log('Found logs:', userLogs.length);
    return userLogs;
  },

  getLogsByClassroomId: async (classroomId: string) => {
    const classroomStudentIds = demoStudents
      .filter(student => student.classroomId === classroomId)
      .map(student => student.id);
    return demoLogs.filter(log => classroomStudentIds.includes(log.userId));
  },

  getLogById: async (logId: string) => {
    return demoLogs.find(log => log.id === logId) || null;
  },

  saveLog: async (log: any) => {
    // In demo mode, just return the log with a generated ID
    const newLog = {
      ...log,
      id: `demo-log-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    demoLogs.unshift(newLog); // Add to beginning for newest first
    return newLog;
  }
};
