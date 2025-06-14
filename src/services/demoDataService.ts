
import { RecitationLog, Classroom } from "@/types";

// Demo classroom for demo teacher
export const demoClassroom: Classroom = {
  id: "demo-classroom-id",
  name: "Demo Quran Class",
  teacherId: "demo-teacher-id",
  classCode: "DEMO123"
};

// Demo students for the classroom
export const demoStudents = [
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
  }
];

// Demo recitation logs
export const demoLogs: RecitationLog[] = [
  {
    id: "demo-log-1",
    userId: "demo-student-1",
    date: "2023-12-07",
    recitationType: "Sabaq",
    surahName: "Al-Baqarah",
    ayahStart: 1,
    ayahEnd: 5,
    mistakeCounts: [
      {
        portion: "Full",
        mistakes: 2,
        stucks: 1,
        markedMistakes: 0
      }
    ],
    testerName: "Demo Teacher",
    notes: "Good progress today",
    grade: "Good",
    needsRepeat: false,
    createdAt: new Date().toISOString(),
    userName: "Ahmad Ali"
  },
  {
    id: "demo-log-2",
    userId: "demo-student-2", 
    date: "2023-12-07",
    recitationType: "Dhor",
    juzNumber: 2,
    pageStart: 21,
    pageEnd: 25,
    mistakeCounts: [
      {
        portion: "Quarter",
        mistakes: 1,
        stucks: 0,
        markedMistakes: 0
      },
      {
        portion: "Quarter", 
        mistakes: 2,
        stucks: 0,
        markedMistakes: 0
      }
    ],
    testerName: "Demo Teacher",
    notes: "Needs to review more carefully",
    grade: "Average",
    needsRepeat: true,
    createdAt: new Date().toISOString(),
    userName: "Fatima Hassan"
  }
];

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
    if (classroomId === "demo-classroom-id") {
      return demoStudents;
    }
    return [];
  },

  getClassroomsByTeacherId: async (teacherId: string) => {
    if (teacherId === "demo-teacher-id") {
      return [demoClassroom];
    }
    return [];
  },

  getLogsByUserId: async (userId: string) => {
    return demoLogs.filter(log => log.userId === userId);
  },

  getLogsByClassroomId: async (classroomId: string) => {
    if (classroomId === "demo-classroom-id") {
      return demoLogs;
    }
    return [];
  },

  saveLog: async (log: any) => {
    // In demo mode, just return the log with a generated ID
    return {
      ...log,
      id: `demo-log-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
  }
};
