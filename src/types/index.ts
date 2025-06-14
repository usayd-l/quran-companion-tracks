
export type UserRole = 'student' | 'teacher';

export type RecitationType = 'Sabaq' | 'Last 3 Sabaqs' | 'Sabaq Dhor' | 'Dhor';

export type MistakePortion = 'Full' | 'Half' | 'Quarter';

export type Grade = 'Excellent' | 'Very Good' | 'Good' | 'Average' | 'Failed';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  profileImage?: string;
  classroomId?: string;
  classroomName?: string;
  email?: string;
}

export interface Classroom {
  id: string;
  name: string;
  teacherId: string;
  classCode: string;
}

export interface MistakeCount {
  portion: MistakePortion;
  mistakes: number;
  stucks: number;
  markedMistakes: number;
}

export interface RecitationLog {
  id: string;
  userId: string;
  date: string;
  recitationType: RecitationType;
  surahName?: string;
  ayahStart?: number;
  ayahEnd?: number;
  juzNumber?: number;
  pageStart?: number;
  pageEnd?: number;
  mistakeCounts: MistakeCount[];
  testerName: string;
  notes?: string;
  grade?: Grade;
  needsRepeat?: boolean;
  createdAt: string;
  userName?: string; // For teacher views
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
}

export interface AnalyticsData {
  consistency: {
    date: string;
    count: number;
  }[];
  mistakes: {
    date: string;
    mistakes: number;
    stucks: number;
    marked: number;
  }[];
  recentContent: {
    type: 'surah' | 'juz';
    name: string;
    count: number;
  }[];
}
