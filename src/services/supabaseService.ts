import { User, Classroom, RecitationLog } from "@/types";
import { demoDataService } from "./demoDataService";
import { 
  getCurrentUser, 
  getAllUsers, 
  getAllClassrooms, 
  getAllLogs,
  saveUser,
  saveClassroom,
  saveLog
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
