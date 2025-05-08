
import { User, RecitationLog, RecitationType } from "../types";

export const mockUsers: User[] = [
  {
    id: "1",
    name: "Ahmad Ali",
    role: "student",
    teacherId: "3",
    profileImage: "https://ui-avatars.com/api/?name=Ahmad+Ali&background=E9F0E6&color=4A6741"
  },
  {
    id: "2",
    name: "Fatima Hassan",
    role: "student",
    teacherId: "3",
    profileImage: "https://ui-avatars.com/api/?name=Fatima+Hassan&background=E9F0E6&color=4A6741"
  },
  {
    id: "3",
    name: "Yusuf Khan",
    role: "teacher",
    profileImage: "https://ui-avatars.com/api/?name=Yusuf+Khan&background=D3B88C&color=2D2A26"
  },
  {
    id: "4",
    name: "Aisha Mohammad",
    role: "student",
    profileImage: "https://ui-avatars.com/api/?name=Aisha+Mohammad&background=E9F0E6&color=4A6741"
  }
];

export const mockLogs: RecitationLog[] = [
  {
    id: "1",
    userId: "1",
    date: "2023-05-07",
    recitationType: "Sabaq" as RecitationType,
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
    testerName: "Yusuf Khan",
    notes: "Good progress today",
    createdAt: new Date().toISOString()
  },
  {
    id: "2",
    userId: "1",
    date: "2023-05-06",
    recitationType: "Sabaq Dhor" as RecitationType,
    juzNumber: 1,
    pageStart: 1,
    pageEnd: 4,
    mistakeCounts: [
      {
        portion: "Half",
        mistakes: 3,
        stucks: 0,
        markedMistakes: 1
      },
      {
        portion: "Half",
        mistakes: 1,
        stucks: 1,
        markedMistakes: 0
      }
    ],
    testerName: "Yusuf Khan",
    createdAt: new Date().toISOString()
  },
  {
    id: "3",
    userId: "2",
    date: "2023-05-07",
    recitationType: "Dhor" as RecitationType,
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
      },
      {
        portion: "Quarter",
        mistakes: 0,
        stucks: 0,
        markedMistakes: 1
      },
      {
        portion: "Quarter",
        mistakes: 1,
        stucks: 0,
        markedMistakes: 0
      }
    ],
    testerName: "Yusuf Khan",
    notes: "Needs to review more carefully",
    createdAt: new Date().toISOString()
  }
];

// Helper function to get logs for a specific user
export const getLogsByUserId = (userId: string): RecitationLog[] => {
  return mockLogs.filter(log => log.userId === userId);
};

// Helper function to get students for a specific teacher
export const getStudentsByTeacherId = (teacherId: string): User[] => {
  return mockUsers.filter(user => user.teacherId === teacherId);
};

// Helper function to get user by ID
export const getUserById = (userId: string): User | undefined => {
  return mockUsers.find(user => user.id === userId);
};

// Helper function to get log by ID
export const getLogById = (logId: string): RecitationLog | undefined => {
  return mockLogs.find(log => log.id === logId);
};

// Mock currently logged in user (for demonstration)
export const currentUser = mockUsers[2]; // Teacher Yusuf Khan
