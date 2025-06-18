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
    return demoDataService.getUserById(userId);
  }
  
  // Real Supabase implementation would go here
  throw new Error("Supabase not configured");
};

export const getUsersByClassroomId = async (classroomId: string): Promise<User[]> => {
  if (DEMO_MODE) {
    console.log('Demo mode: Getting users by classroom ID:', classroomId);
    return demoDataService.getUsersByClassroomId(classroomId);
  }
  
  // Real Supabase implementation would go here
  throw new Error("Supabase not configured");
};

export const getClassroomsByTeacherId = async (teacherId: string): Promise<Classroom[]> => {
  if (DEMO_MODE) {
    console.log('Demo mode: Getting classrooms by teacher ID:', teacherId);
    return demoDataService.getClassroomsByTeacherId(teacherId);
  }
  
  // Real Supabase implementation would go here
  throw new Error("Supabase not configured");
};

export const getLogsByUserId = async (userId: string): Promise<RecitationLog[]> => {
  if (DEMO_MODE) {
    console.log('Demo mode: Getting logs for user:', userId);
    return demoDataService.getLogsByUserId(userId);
  }
  
  // Real Supabase implementation would go here
  throw new Error("Supabase not configured");
};

export const getLogsByClassroomId = async (classroomId: string): Promise<RecitationLog[]> => {
  if (DEMO_MODE) {
    console.log('Demo mode: Getting logs for classroom:', classroomId);
    return demoDataService.getLogsByClassroomId(classroomId);
  }
  
  // Real Supabase implementation would go here
  throw new Error("Supabase not configured");
};

export const getLogById = async (logId: string): Promise<RecitationLog | null> => {
  if (DEMO_MODE) {
    return demoDataService.getLogById(logId);
  }
  
  // Real Supabase implementation would go here
  throw new Error("Supabase not configured");
};

export const saveRecitationLog = async (log: any): Promise<RecitationLog> => {
  if (DEMO_MODE) {
    console.log('Demo mode: Saving log:', log);
    return demoDataService.saveLog(log);
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
