
import { supabase } from "@/integrations/supabase/client";
import { User, RecitationLog, Classroom } from "@/types";

// User/Profile functions
export const getUserById = async (userId: string): Promise<User | null> => {
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
    email
  };
};

export const getUsersByClassroomId = async (classroomId: string): Promise<User[]> => {
  const { data, error } = await supabase
    .from('classroom_members')
    .select(`
      student:profiles!student_id (
        id,
        name,
        role,
        profile_image
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
    email: '' // Email not available in this context
  }));
};

// Classroom functions
export const getClassroomsByTeacherId = async (teacherId: string): Promise<Classroom[]> => {
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
    classCode: classroom.class_code
  }));
};

export const getClassroomByCode = async (classCode: string): Promise<Classroom | null> => {
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
    classCode: data.class_code
  };
};

export const saveClassroom = async (classroom: Omit<Classroom, 'id'>): Promise<Classroom | null> => {
  const { data, error } = await supabase
    .from('classrooms')
    .insert({
      name: classroom.name,
      teacher_id: classroom.teacherId,
      class_code: classroom.classCode
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
    classCode: data.class_code
  };
};

export const joinClassroom = async (userId: string, classroomId: string): Promise<boolean> => {
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
    pageStart: log.page_start,
    pageEnd: log.page_end,
    testerName: log.tester_name,
    notes: log.notes,
    createdAt: log.created_at,
    mistakeCounts: log.mistake_counts.map((mc: any) => ({
      portion: mc.portion,
      mistakes: mc.mistakes,
      stucks: mc.stucks,
      markedMistakes: mc.marked_mistakes
    }))
  }));
};

export const getLogsByClassroomId = async (classroomId: string): Promise<RecitationLog[]> => {
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
    pageStart: log.page_start,
    pageEnd: log.page_end,
    testerName: log.tester_name,
    notes: log.notes,
    createdAt: log.created_at,
    mistakeCounts: log.mistake_counts.map((mc: any) => ({
      portion: mc.portion,
      mistakes: mc.mistakes,
      stucks: mc.stucks,
      markedMistakes: mc.marked_mistakes
    })),
    userName: log.user?.name
  }));
};

export const getLogById = async (logId: string): Promise<RecitationLog | null> => {
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
    pageStart: data.page_start,
    pageEnd: data.page_end,
    testerName: data.tester_name,
    notes: data.notes,
    createdAt: data.created_at,
    mistakeCounts: data.mistake_counts.map((mc: any) => ({
      portion: mc.portion,
      mistakes: mc.mistakes,
      stucks: mc.stucks,
      markedMistakes: mc.marked_mistakes
    }))
  };
};

export const saveLog = async (log: Omit<RecitationLog, 'id' | 'createdAt'>): Promise<RecitationLog | null> => {
  // First, insert the log
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
      page_start: log.pageStart,
      page_end: log.pageEnd,
      tester_name: log.testerName,
      notes: log.notes
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
    pageStart: logData.page_start,
    pageEnd: logData.page_end,
    testerName: logData.tester_name,
    notes: logData.notes,
    createdAt: logData.created_at,
    mistakeCounts: log.mistakeCounts
  };
};

// Get logs grouped by date
export const getLogsByDate = async (userId: string, date: string): Promise<RecitationLog[]> => {
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
    pageStart: log.page_start,
    pageEnd: log.page_end,
    testerName: log.tester_name,
    notes: log.notes,
    createdAt: log.created_at,
    mistakeCounts: log.mistake_counts.map((mc: any) => ({
      portion: mc.portion,
      mistakes: mc.mistakes,
      stucks: mc.stucks,
      markedMistakes: mc.marked_mistakes
    }))
  }));
};

// Get unique dates for a user
export const getLogDates = async (userId: string): Promise<string[]> => {
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
