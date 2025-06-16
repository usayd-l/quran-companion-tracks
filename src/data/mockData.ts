
import { User, RecitationLog, RecitationType } from "../types";

// This file contains initial mock data - now deprecated since we use Supabase
// All data operations should use the services/supabaseService.ts module instead

export const mockUsers: User[] = [
  {
    id: "1",
    name: "Ahmad Ali",
    role: "student",
    classroomId: "class1",
    email: "ahmad@example.com",
    profileImage: "https://ui-avatars.com/api/?name=Ahmad+Ali&background=E9F0E6&color=4A6741"
  },
  {
    id: "2",
    name: "Fatima Hassan",
    role: "student",
    classroomId: "class1",
    email: "fatima@example.com",
    profileImage: "https://ui-avatars.com/api/?name=Fatima+Hassan&background=E9F0E6&color=4A6741"
  },
  {
    id: "3",
    name: "Yusuf Khan",
    role: "teacher",
    email: "yusuf@example.com",
    profileImage: "https://ui-avatars.com/api/?name=Yusuf+Khan&background=D3B88C&color=2D2A26"
  },
  {
    id: "4",
    name: "Aisha Mohammad",
    role: "student",
    email: "aisha@example.com",
    profileImage: "https://ui-avatars.com/api/?name=Aisha+Mohammad&background=E9F0E6&color=4A6741"
  }
];

// Export mockLogs so it can be updated when new logs are created
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
    pagesCount: 4,
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
    pagesCount: 5,
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

// This file now only exports the initial mock data
// All data operations are handled through the supabase service
