
export type UserRole = 'student' | 'teacher' | 'super_admin';

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
  age?: number;
  parent_email?: string;
  enrollment_date?: string;
  student_identifier?: string;
  classroom_config_id?: string;
  institution_id?: string;
}

export interface Classroom {
  id: string;
  name: string;
  teacherId: string;
  classCode: string;
  institution_id?: string;
}

export interface ClassroomConfig {
  id: string;
  classroom_id: string;
  attendance_days: number;
  session_type: string;
  program_type?: string;
  created_at: string;
}

export interface Institution {
  id: string;
  name: string;
  created_at: string;
}

export interface AbsenceReason {
  id: number;
  reason: string;
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
  pagesCount?: number; // new -- replaces pageStart/pageEnd
  mistakeCounts: MistakeCount[];
  testerName: string;
  notes?: string;
  grade?: Grade;
  needsRepeat?: boolean;
  createdAt: string;
  userName?: string; // For teacher views
  attendanceStatus?: string;  // 'present'/'absent'/'late'
  absenceReason?: string;
}
export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
}
export interface AnalyticsData {
  attendanceRate?: number;
  consistency?: { date: string; count: number; }[];
  mistakes?: {
    date: string;
    mistakes: number;
    stucks: number;
    marked: number;
  }[];
  recentContent?: {
    type: 'surah' | 'juz';
    name: string;
    count: number;
  }[];
  qualityProgression?: {
    date: string;
    grade: Grade;
  }[];
}
