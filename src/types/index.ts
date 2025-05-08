
export type UserRole = 'student' | 'teacher';

export type RecitationType = 'Sabaq' | 'Last 3 Sabaqs' | 'Sabaq Dhor' | 'Dhor';

export type MistakePortion = 'Full' | 'Half' | 'Quarter';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  profileImage?: string;
  teacherId?: string; // for students, reference to their teacher
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
  createdAt: string;
}
