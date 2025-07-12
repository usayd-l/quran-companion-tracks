
import { supabase } from "@/integrations/supabase/client";
import { User, Classroom, RecitationLog } from "@/types";
import { demoDataService } from "./demoDataService";
import { 
  getCurrentUser, 
  getAllUsers, 
  getAllClassrooms, 
  getAllLogs,
  saveUser,
  saveClassroom,
  saveLog,
  getUserById as getLocalUserById,
  getUsersByClassroomId as getLocalUsersByClassroomId,
  getLogsByUserId as getLocalLogsByUserId,
  getClassroomByCode as getLocalClassroomByCode
} from "./localStorage";

// Demo mode flag - in a real app this would be an environment variable
const DEMO_MODE = true;

export const getUserById = async (userId: string): Promise<User | null> => {
  if (DEMO_MODE) {
    console.log('Demo mode: Getting user by ID:', userId);
    return getLocalUserById(userId);
  }
  
  // Real Supabase implementation
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle();
    
  if (error) {
    console.error('Error fetching user:', error);
    return null;
  }
  
  return data ? {
    id: data.id,
    name: data.name,
    role: data.role,
    profileImage: data.profile_image,
    age: data.age,
    enrollmentDate: data.enrollment_date,
    parentEmail: data.parent_email,
    studentIdentifier: data.student_identifier,
    classroomId: data.classroom_config_id,
    institutionId: data.institution_id
  } as User : null;
};

export const getUsersByClassroomId = async (classroomId: string): Promise<User[]> => {
  if (DEMO_MODE) {
    console.log('Demo mode: Getting users by classroom ID:', classroomId);
    return getLocalUsersByClassroomId(classroomId);
  }
  
  // Real Supabase implementation would go here
  throw new Error("Supabase not configured");
};

export const getClassroomsByTeacherId = async (teacherId: string): Promise<Classroom[]> => {
  if (DEMO_MODE) {
    console.log('Demo mode: Getting classrooms by teacher ID:', teacherId);
    const classrooms = getAllClassrooms();
    return classrooms.filter(classroom => classroom.teacherId === teacherId);
  }
  
  // Real Supabase implementation would go here
  throw new Error("Supabase not configured");
};

export const getLogsByUserId = async (userId: string): Promise<RecitationLog[]> => {
  if (DEMO_MODE) {
    console.log('Demo mode: Getting logs for user:', userId);
    return getLocalLogsByUserId(userId);
  }
  
  // Real Supabase implementation would go here
  throw new Error("Supabase not configured");
};

export const getLogsByClassroomId = async (classroomId: string): Promise<RecitationLog[]> => {
  if (DEMO_MODE) {
    console.log('Demo mode: Getting logs for classroom:', classroomId);
    const allLogs = getAllLogs();
    const classroomStudents = getLocalUsersByClassroomId(classroomId);
    const studentIds = classroomStudents.map(student => student.id);
    return allLogs.filter(log => studentIds.includes(log.userId));
  }
  
  // Real Supabase implementation would go here
  throw new Error("Supabase not configured");
};

export const getLogById = async (logId: string): Promise<RecitationLog | null> => {
  if (DEMO_MODE) {
    const logs = getAllLogs();
    return logs.find(log => log.id === logId) || null;
  }
  
  // Real Supabase implementation would go here
  throw new Error("Supabase not configured");
};

export const saveRecitationLog = async (log: any): Promise<RecitationLog> => {
  if (DEMO_MODE) {
    console.log('Demo mode: Saving log:', log);
    const newLog = {
      ...log,
      id: `demo-log-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    saveLog(newLog);
    return newLog;
  }
  
  // Real Supabase implementation would go here
  throw new Error("Supabase not configured");
};

export const getClassroomByCode = async (classCode: string): Promise<Classroom | null> => {
  if (DEMO_MODE) {
    console.log('Demo mode: Getting classroom by code:', classCode);
    return getLocalClassroomByCode(classCode);
  }
  
  // Real Supabase implementation would go here
  throw new Error("Supabase not configured");
};

export const joinClassroom = async (userId: string, classroomId: string): Promise<boolean> => {
  if (DEMO_MODE) {
    console.log('Demo mode: Joining classroom:', { userId, classroomId });
    const user = getLocalUserById(userId);
    if (user) {
      const updatedUser = { ...user, classroomId };
      saveUser(updatedUser);
      return true;
    }
    return false;
  }
  
  // Real Supabase implementation would go here
  throw new Error("Supabase not configured");
};

export const getAbsenceReasons = async (): Promise<{id: number, reason: string}[]> => {
  if (DEMO_MODE) {
    console.log('Demo mode: Getting absence reasons');
    return [
      { id: 1, reason: "Sick" },
      { id: 2, reason: "Family Emergency" },
      { id: 3, reason: "Doctor Appointment" },
      { id: 4, reason: "School Event" },
      { id: 5, reason: "Travel" },
      { id: 6, reason: "Weather" }
    ];
  }
  
  // Real Supabase implementation would go here
  throw new Error("Supabase not configured");
};
