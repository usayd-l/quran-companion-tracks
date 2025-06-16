
import { User, Classroom } from "@/types";

// Demo teacher
export const demoTeacher: User = {
  id: "demo-teacher-id",
  name: "Demo Teacher", 
  role: "teacher" as const,
  email: "teacher@demo.com",
  profileImage: "https://ui-avatars.com/api/?name=Demo+Teacher&background=D3B88C&color=2D2A26"
};

// Demo classrooms
export const demoClassrooms: Classroom[] = [
  {
    id: "demo-classroom-id",
    name: "Demo Quran Class",
    teacherId: "demo-teacher-id",
    classCode: "DEMO123"
  },
  {
    id: "demo-classroom-2",
    name: "Advanced Hifz Class",
    teacherId: "demo-teacher-id",
    classCode: "ADV456"
  }
];

// Demo students with varied performance profiles
export const demoStudents: User[] = [
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

// Student performance profiles for generating realistic data
export const studentPerformanceProfiles = {
  "demo-student-id": { performanceLevel: 1, attendanceRate: 0.9 }, // Good performer
  "demo-student-1": { performanceLevel: 0, attendanceRate: 0.95 }, // Excellent performer
  "demo-student-2": { performanceLevel: 1, attendanceRate: 0.85 }, // Good performer
  "demo-student-3": { performanceLevel: 2, attendanceRate: 0.75 }, // Needs improvement
  "demo-student-4": { performanceLevel: 0, attendanceRate: 0.9 }, // Excellent performer
  "demo-student-5": { performanceLevel: 2, attendanceRate: 0.7 }, // Needs improvement
  "demo-student-6": { performanceLevel: 1, attendanceRate: 0.88 }, // Good performer
  "demo-student-7": { performanceLevel: 0, attendanceRate: 0.92 }, // Excellent performer
};
