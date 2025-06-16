
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

// Generate realistic demo logs with varied data
const generateDemoLogs = () => {
  const surahs = ["Al-Baqarah", "Al-Imran", "An-Nisa", "Al-Maidah", "Al-An'am", "Al-A'raf", "Al-Anfal", "At-Tawbah"];
  const grades: Grade[] = ["Excellent", "Very Good", "Good", "Average", "Failed"];
  const recitationTypes = ["Sabaq", "Last 3 Sabaqs", "Sabaq Dhor", "Dhor"];
  const attendanceOptions = ['present', 'absent', 'late'];
  const absenceReasons = ['Sick', 'Vacation', 'Family Emergency', 'Late Arrival', 'Transport Issues', 'No Reason', 'Other'];
  
  const logs: any[] = [];
  
  // Generate logs for ALL demo students including the main demo student
  demoStudents.forEach((student, studentIndex) => {
    // Generate 30 logs for each student
    for (let i = 0; i < 30; i++) {
      const daysAgo = Math.floor(Math.random() * 90); // Spread over 90 days
      const date = new Date();
      date.setDate(date.getDate() - daysAgo);
      
      const recitationType = recitationTypes[Math.floor(Math.random() * recitationTypes.length)];
      const isJuzBased = recitationType === "Dhor" || recitationType === "Sabaq Dhor";
      
      // Vary mistake counts based on student performance level
      const performanceLevel = studentIndex % 3; // 0: excellent, 1: good, 2: needs improvement
      let baseMistakes, baseStucks, gradeIndex;
      
      switch (performanceLevel) {
        case 0: // Excellent student
          baseMistakes = Math.floor(Math.random() * 3);
          baseStucks = Math.floor(Math.random() * 2);
          gradeIndex = Math.floor(Math.random() * 2); // Excellent or Very Good
          break;
        case 1: // Good student
          baseMistakes = Math.floor(Math.random() * 6) + 1;
          baseStucks = Math.floor(Math.random() * 3) + 1;
          gradeIndex = Math.floor(Math.random() * 3) + 1; // Very Good, Good, or Average
          break;
        case 2: // Needs improvement
          baseMistakes = Math.floor(Math.random() * 10) + 3;
          baseStucks = Math.floor(Math.random() * 5) + 2;
          gradeIndex = Math.floor(Math.random() * 3) + 2; // Good, Average, or Failed
          break;
        default:
          baseMistakes = 2;
          baseStucks = 1;
          gradeIndex = 2;
      }

      // Determine attendance status
      const attendanceStatus = attendanceOptions[Math.floor(Math.random() * attendanceOptions.length)];
      const absenceReason = attendanceStatus === 'absent' || attendanceStatus === 'late' 
        ? absenceReasons[Math.floor(Math.random() * absenceReasons.length)]
        : undefined;
      
      const log: any = {
        id: `demo-log-${student.id}-${i}`,
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
        notes: i % 4 === 0 ? [
          "Good progress today", 
          "Needs more practice with Tajweed",
          "Excellent memorization",
          "Focus on pronunciation",
          "Keep up the good work",
          "مَا شَاءَ ٱللَّٰهُ - Excellent recitation",
          "Need to work on fluency",
          "Great improvement from last session"
        ][Math.floor(Math.random() * 8)] : undefined,
        grade: grades[gradeIndex],
        needsRepeat: baseMistakes > 5,
        createdAt: date.toISOString(),
        userName: student.name,
        attendanceStatus,
        absenceReason
      };
      
      // Add specific content based on recitation type
      if (isJuzBased) {
        log.juzNumber = Math.floor(Math.random() * 30) + 1;
        log.pagesCount = Math.floor(Math.random() * 15) + 1;
      } else {
        log.surahName = surahs[Math.floor(Math.random() * surahs.length)];
        log.ayahStart = Math.floor(Math.random() * 10) + 1;
        log.ayahEnd = log.ayahStart + Math.floor(Math.random() * 20) + 5;
      }
      
      logs.push(log);
    }
  });
  
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
