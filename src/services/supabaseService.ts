
import { supabase } from "@/integrations/supabase/client";
import { User, RecitationLog, Classroom, ClassroomConfig, Institution, AbsenceReason } from "@/types";
import { demoDataService } from "./demoDataService";

// Helper function to check if we're in demo mode
const isDemoMode = () => {
  return localStorage.getItem('demoUser') !== null;
};

export const getInstitutionById = async (id: string): Promise<Institution | null> => {
  if (isDemoMode()) return null;
  const { data, error } = await supabase.from('institutions').select('*').eq('id', id).single();
  if (error || !data) return null;
  return { id: data.id, name: data.name, created_at: data.created_at };
};

export const getAbsenceReasons = async (): Promise<AbsenceReason[]> => {
  if (isDemoMode()) {
    return [
      { id: 1, reason: "Sick" }, { id: 2, reason: "Vacation" }, { id: 3, reason: "Family Emergency" },
      { id: 4, reason: "Late Arrival" }, { id: 5, reason: "Transport Issues" },
      { id: 6, reason: "No Reason" }, { id: 7, reason: "Other" }
    ];
  }
  const { data } = await supabase.from('absence_reasons').select('*');
  return data ?? [];
};

export const getClassroomConfig = async (classroomId: string): Promise<ClassroomConfig | null> => {
  if (isDemoMode()) return null;
  const { data, error } = await supabase.from('classroom_configs').select('*').eq('classroom_id', classroomId).maybeSingle();
  if (error || !data) return null;
  return data as ClassroomConfig;
};

export const saveClassroomConfig = async (config: Omit<ClassroomConfig, "id" | "created_at">) => {
  if (isDemoMode()) return true;
  const { data, error } = await supabase.from('classroom_configs').insert([config]).select().single();
  if (error) {
    console.error("Error saving classroom config", error);
    return null;
  }
  return data as ClassroomConfig;
};

export const updateProfileWithExtras = async (userId: string, payload: Partial<User>) => {
  if (isDemoMode()) return true;
  const { error } = await supabase.from("profiles").update(payload).eq("id", userId);
  return !error;
};

// User/Profile functions
export const getUserById = async (userId: string): Promise<User | null> => {
  if (isDemoMode()) {
    return await demoDataService.getUserById(userId);
  }

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error || !data) {
    console.error('Error fetching user:', error);
    return null;
  }

  // Get user email from auth if available
  const { data: { user: authUser } } = await supabase.auth.getUser();
  const email = authUser?.id === data.id ? authUser.email || '' : '';

  return {
    id: data.id,
    name: data.name,
    role: data.role,
    profileImage: data.profile_image,
    email,
    age: data.age,
    parent_email: data.parent_email,
    enrollment_date: data.enrollment_date,
    student_identifier: data.student_identifier,
    classroom_config_id: data.classroom_config_id,
    institution_id: data.institution_id
  };
};

export const getUsersByClassroomId = async (classroomId: string): Promise<User[]> => {
  if (isDemoMode()) {
    return await demoDataService.getUsersByClassroomId(classroomId);
  }

  const { data, error } = await supabase
    .from('classroom_members')
    .select(`
      student:profiles!student_id (
        id,
        name,
        role,
        profile_image,
        age,
        parent_email,
        enrollment_date,
        student_identifier,
        classroom_config_id,
        institution_id
      )
    `)
    .eq('classroom_id', classroomId);

  if (error) {
    console.error('Error fetching classroom users:', error);
    return [];
  }

  return data.map((item: any) => ({
    id: item.student.id,
    name: item.student.name,
    role: item.student.role,
    profileImage: item.student.profile_image,
    classroomId,
    email: '', // Email not available in this context
    age: item.student.age,
    parent_email: item.student.parent_email,
    enrollment_date: item.student.enrollment_date,
    student_identifier: item.student.student_identifier,
    classroom_config_id: item.student.classroom_config_id,
    institution_id: item.student.institution_id
  }));
};

// Classroom functions
export const getClassroomsByTeacherId = async (teacherId: string): Promise<Classroom[]> => {
  if (isDemoMode()) {
    return await demoDataService.getClassroomsByTeacherId(teacherId);
  }

  const { data, error } = await supabase
    .from('classrooms')
    .select('*')
    .eq('teacher_id', teacherId);

  if (error) {
    console.error('Error fetching classrooms:', error);
    return [];
  }

  return data.map(classroom => ({
    id: classroom.id,
    name: classroom.name,
    teacherId: classroom.teacher_id,
    classCode: classroom.class_code,
    institution_id: classroom.institution_id
  }));
};

export const getClassroomByCode = async (classCode: string): Promise<Classroom | null> => {
  if (isDemoMode()) {
    // In demo mode, only accept the demo class code
    if (classCode === "DEMO123") {
      return demoDataService.getClassroomsByTeacherId("demo-teacher-id").then(classrooms => classrooms[0] || null);
    }
    return null;
  }

  const { data, error } = await supabase
    .from('classrooms')
    .select('*')
    .eq('class_code', classCode)
    .single();

  if (error || !data) {
    return null;
  }

  return {
    id: data.id,
    name: data.name,
    teacherId: data.teacher_id,
    classCode: data.class_code,
    institution_id: data.institution_id
  };
};

export const saveClassroom = async (classroom: Omit<Classroom, 'id'>): Promise<Classroom | null> => {
  if (isDemoMode()) {
    // In demo mode, return the classroom with a demo ID
    return {
      ...classroom,
      id: `demo-classroom-${Date.now()}`
    };
  }

  const { data, error } = await supabase
    .from('classrooms')
    .insert({
      name: classroom.name,
      teacher_id: classroom.teacherId,
      class_code: classroom.classCode,
      institution_id: classroom.institution_id
    })
    .select()
    .single();

  if (error) {
    console.error('Error saving classroom:', error);
    return null;
  }

  return {
    id: data.id,
    name: data.name,
    teacherId: data.teacher_id,
    classCode: data.class_code,
    institution_id: data.institution_id
  };
};

export const joinClassroom = async (userId: string, classroomId: string): Promise<boolean> => {
  if (isDemoMode()) {
    // In demo mode, always return success
    return true;
  }

  const { error } = await supabase
    .from('classroom_members')
    .insert({
      classroom_id: classroomId,
      student_id: userId
    });

  if (error) {
    console.error('Error joining classroom:', error);
    return false;
  }

  return true;
};

// Log functions
export const getLogsByUserId = async (userId: string): Promise<RecitationLog[]> => {
  if (isDemoMode()) {
    return await demoDataService.getLogsByUserId(userId);
  }

  const { data, error } = await supabase
    .from('recitation_logs')
    .select(`
      *,
      mistake_counts (*)
    `)
    .eq('user_id', userId)
    .order('date', { ascending: false });

  if (error) {
    console.error('Error fetching logs:', error);
    return [];
  }

  return data.map(log => ({
    id: log.id,
    userId: log.user_id,
    date: log.date,
    recitationType: log.recitation_type,
    surahName: log.surah_name,
    ayahStart: log.ayah_start,
    ayahEnd: log.ayah_end,
    juzNumber: log.juz_number,
    pagesCount: log.pages_count,
    testerName: log.tester_name,
    notes: log.notes,
    createdAt: log.created_at,
    mistakeCounts: log.mistake_counts.map((mc: any) => ({
      portion: mc.portion,
      mistakes: mc.mistakes,
      stucks: mc.stucks,
      markedMistakes: mc.marked_mistakes
    })),
    attendanceStatus: log.attendance_status,
    absenceReason: log.absence_reason
  }));
};

export const getLogsByClassroomId = async (classroomId: string): Promise<RecitationLog[]> => {
  if (isDemoMode()) {
    return await demoDataService.getLogsByClassroomId(classroomId);
  }

  // First get all student IDs in the classroom
  const { data: members, error: membersError } = await supabase
    .from('classroom_members')
    .select('student_id')
    .eq('classroom_id', classroomId);

  if (membersError || !members) {
    console.error('Error fetching classroom members:', membersError);
    return [];
  }

  const studentIds = members.map(m => m.student_id);

  if (studentIds.length === 0) {
    return [];
  }

  const { data, error } = await supabase
    .from('recitation_logs')
    .select(`
      *,
      mistake_counts (*),
      user:profiles!user_id (name)
    `)
    .in('user_id', studentIds)
    .order('date', { ascending: false });

  if (error) {
    console.error('Error fetching classroom logs:', error);
    return [];
  }

  return data.map(log => ({
    id: log.id,
    userId: log.user_id,
    date: log.date,
    recitationType: log.recitation_type,
    surahName: log.surah_name,
    ayahStart: log.ayah_start,
    ayahEnd: log.ayah_end,
    juzNumber: log.juz_number,
    pagesCount: log.pages_count,
    testerName: log.tester_name,
    notes: log.notes,
    createdAt: log.created_at,
    mistakeCounts: log.mistake_counts.map((mc: any) => ({
      portion: mc.portion,
      mistakes: mc.mistakes,
      stucks: mc.stucks,
      markedMistakes: mc.marked_mistakes
    })),
    userName: log.user?.name,
    attendanceStatus: log.attendance_status,
    absenceReason: log.absence_reason
  }));
};

export const getLogById = async (logId: string): Promise<RecitationLog | null> => {
  if (isDemoMode()) {
    // In demo mode, find the log in our demo data
    const { demoLogs } = await import('./demoDataService');
    return demoLogs.find(log => log.id === logId) || null;
  }

  const { data, error } = await supabase
    .from('recitation_logs')
    .select(`
      *,
      mistake_counts (*)
    `)
    .eq('id', logId)
    .single();

  if (error || !data) {
    console.error('Error fetching log:', error);
    return null;
  }

  return {
    id: data.id,
    userId: data.user_id,
    date: data.date,
    recitationType: data.recitation_type,
    surahName: data.surah_name,
    ayahStart: data.ayah_start,
    ayahEnd: data.ayah_end,
    juzNumber: data.juz_number,
    pagesCount: data.pages_count,
    testerName: data.tester_name,
    notes: data.notes,
    createdAt: data.created_at,
    mistakeCounts: data.mistake_counts.map((mc: any) => ({
      portion: mc.portion,
      mistakes: mc.mistakes,
      stucks: mc.stucks,
      markedMistakes: mc.marked_mistakes
    })),
    attendanceStatus: data.attendance_status,
    absenceReason: data.absence_reason
  };
};

export const saveLog = async (log: Omit<RecitationLog, 'id' | 'createdAt'>): Promise<RecitationLog | null> => {
  // New: support attendanceStatus, absenceReason, pagesCount
  if (isDemoMode()) {
    return await demoDataService.saveLog(log);
  }

  // New: drop page_start/page_end, support pagesCount, attendance fields, absenceReason
  const { data: logData, error: logError } = await supabase
    .from('recitation_logs')
    .insert({
      user_id: log.userId,
      date: log.date,
      recitation_type: log.recitationType,
      surah_name: log.surahName,
      ayah_start: log.ayahStart,
      ayah_end: log.ayahEnd,
      juz_number: log.juzNumber,
      pages_count: log.pagesCount,
      tester_name: log.testerName,
      notes: log.notes,
      attendance_status: log.attendanceStatus,
      absence_reason: log.absenceReason
    })
    .select()
    .single();

  if (logError || !logData) {
    console.error('Error saving log:', logError);
    return null;
  }

  // Then, insert the mistake counts
  const mistakeCountsData = log.mistakeCounts.map(count => ({
    log_id: logData.id,
    portion: count.portion,
    mistakes: count.mistakes,
    stucks: count.stucks,
    marked_mistakes: count.markedMistakes
  }));

  const { error: mistakeError } = await supabase
    .from('mistake_counts')
    .insert(mistakeCountsData);

  if (mistakeError) {
    console.error('Error saving mistake counts:', mistakeError);
    // Try to clean up the log if mistake counts failed
    await supabase.from('recitation_logs').delete().eq('id', logData.id);
    return null;
  }

  return {
    id: logData.id,
    userId: logData.user_id,
    date: logData.date,
    recitationType: logData.recitation_type,
    surahName: logData.surah_name,
    ayahStart: logData.ayah_start,
    ayahEnd: logData.ayah_end,
    juzNumber: logData.juz_number,
    pagesCount: logData.pages_count,
    testerName: logData.tester_name,
    notes: logData.notes,
    createdAt: logData.created_at,
    mistakeCounts: log.mistakeCounts,
    attendanceStatus: logData.attendance_status,
    absenceReason: logData.absence_reason
  };
};

// Get logs grouped by date
export const getLogsByDate = async (userId: string, date: string): Promise<RecitationLog[]> => {
  if (isDemoMode()) {
    const logs = await demoDataService.getLogsByUserId(userId);
    return logs.filter(log => log.date === date);
  }

  const { data, error } = await supabase
    .from('recitation_logs')
    .select(`
      *,
      mistake_counts (*)
    `)
    .eq('user_id', userId)
    .eq('date', date)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching logs by date:', error);
    return [];
  }

  return data.map(log => ({
    id: log.id,
    userId: log.user_id,
    date: log.date,
    recitationType: log.recitation_type,
    surahName: log.surah_name,
    ayahStart: log.ayah_start,
    ayahEnd: log.ayah_end,
    juzNumber: log.juz_number,
    pagesCount: log.pages_count,
    testerName: log.tester_name,
    notes: log.notes,
    createdAt: log.created_at,
    mistakeCounts: log.mistake_counts.map((mc: any) => ({
      portion: mc.portion,
      mistakes: mc.mistakes,
      stucks: mc.stucks,
      markedMistakes: mc.marked_mistakes
    })),
    attendanceStatus: log.attendance_status,
    absenceReason: log.absence_reason
  }));
};

// Get unique dates for a user
export const getLogDates = async (userId: string): Promise<string[]> => {
  if (isDemoMode()) {
    const logs = await demoDataService.getLogsByUserId(userId);
    const uniqueDates = [...new Set(logs.map(log => log.date))];
    return uniqueDates.sort().reverse();
  }

  const { data, error } = await supabase
    .from('recitation_logs')
    .select('date')
    .eq('user_id', userId)
    .order('date', { ascending: false });

  if (error) {
    console.error('Error fetching log dates:', error);
    return [];
  }

  // Remove duplicates and return sorted dates
  const uniqueDates = [...new Set(data.map(log => log.date))];
  return uniqueDates;
};
