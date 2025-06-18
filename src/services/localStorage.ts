
import { User, Classroom, RecitationLog } from "@/types";
import { demoTeacher, demoStudents, demoClassrooms } from "./demoDataService";
import { generateDemoLogs } from "./demo/demoLogGenerator";

const STORAGE_KEYS = {
  currentUser: "quran_tracker_current_user",
  users: "quran_tracker_users", 
  classrooms: "quran_tracker_classrooms",
  logs: "quran_tracker_logs",
  isInitialized: "quran_tracker_initialized"
};

export const initializeLocalStorage = () => {
  console.log('Initializing localStorage with demo data...');
  
  // Always reinitialize to ensure fresh demo data with current dates
  try {
    // Save demo teacher
    console.log('Saving demo teacher:', demoTeacher);
    localStorage.setItem(STORAGE_KEYS.currentUser, JSON.stringify(demoTeacher));
    
    // Save all demo users (teacher + students)
    const allUsers = [demoTeacher, ...demoStudents];
    console.log('Saving all users:', allUsers.length);
    localStorage.setItem(STORAGE_KEYS.users, JSON.stringify(allUsers));
    
    // Save demo classrooms
    console.log('Saving demo classrooms:', demoClassrooms.length);
    localStorage.setItem(STORAGE_KEYS.classrooms, JSON.stringify(demoClassrooms));
    
    // Generate fresh demo logs for the last 14 days
    const freshDemoLogs = generateDemoLogs();
    console.log('Saving fresh demo logs:', freshDemoLogs.length);
    localStorage.setItem(STORAGE_KEYS.logs, JSON.stringify(freshDemoLogs));
    
    // Mark as initialized
    localStorage.setItem(STORAGE_KEYS.isInitialized, "true");
    
    console.log('Demo data initialization complete!');
    console.log('Students in classrooms:', demoStudents.map(s => ({ name: s.name, classroomId: s.classroomId })));
    console.log('Sample logs:', freshDemoLogs.slice(0, 3).map(l => ({ date: l.date, userName: l.userName, userId: l.userId })));
    
  } catch (error) {
    console.error('Error initializing localStorage:', error);
  }
};

export const getCurrentUser = (): User | null => {
  try {
    const userStr = localStorage.getItem(STORAGE_KEYS.currentUser);
    return userStr ? JSON.parse(userStr) : null;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};

export const setCurrentUser = (user: User | null) => {
  try {
    if (user) {
      localStorage.setItem(STORAGE_KEYS.currentUser, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEYS.currentUser);
    }
  } catch (error) {
    console.error('Error setting current user:', error);
  }
};

export const getAllUsers = (): User[] => {
  try {
    const usersStr = localStorage.getItem(STORAGE_KEYS.users);
    return usersStr ? JSON.parse(usersStr) : [];
  } catch (error) {
    console.error('Error getting users:', error);
    return [];
  }
};

export const saveUser = (user: User) => {
  try {
    const users = getAllUsers();
    const existingUserIndex = users.findIndex(u => u.id === user.id);
    
    if (existingUserIndex >= 0) {
      users[existingUserIndex] = user;
    } else {
      users.push(user);
    }
    
    localStorage.setItem(STORAGE_KEYS.users, JSON.stringify(users));
  } catch (error) {
    console.error('Error saving user:', error);
  }
};

export const getAllClassrooms = (): Classroom[] => {
  try {
    const classroomsStr = localStorage.getItem(STORAGE_KEYS.classrooms);
    return classroomsStr ? JSON.parse(classroomsStr) : [];
  } catch (error) {
    console.error('Error getting classrooms:', error);
    return [];
  }
};

export const saveClassroom = (classroom: Classroom) => {
  try {
    const classrooms = getAllClassrooms();
    const existingClassroomIndex = classrooms.findIndex(c => c.id === classroom.id);
    
    if (existingClassroomIndex >= 0) {
      classrooms[existingClassroomIndex] = classroom;
    } else {
      classrooms.push(classroom);
    }
    
    localStorage.setItem(STORAGE_KEYS.classrooms, JSON.stringify(classrooms));
  } catch (error) {
    console.error('Error saving classroom:', error);
  }
};

export const getAllLogs = (): RecitationLog[] => {
  try {
    const logsStr = localStorage.getItem(STORAGE_KEYS.logs);
    return logsStr ? JSON.parse(logsStr) : [];
  } catch (error) {
    console.error('Error getting logs:', error);
    return [];
  }
};

export const saveLog = (log: RecitationLog) => {
  try {
    const logs = getAllLogs();
    const existingLogIndex = logs.findIndex(l => l.id === log.id);
    
    if (existingLogIndex >= 0) {
      logs[existingLogIndex] = log;
    } else {
      logs.unshift(log); // Add to beginning for newest first
    }
    
    localStorage.setItem(STORAGE_KEYS.logs, JSON.stringify(logs));
  } catch (error) {
    console.error('Error saving log:', error);
  }
};

export const clearAllData = () => {
  try {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
    console.log('All localStorage data cleared');
  } catch (error) {
    console.error('Error clearing localStorage:', error);
  }
};

export const getUserById = (userId: string): User | null => {
  try {
    const users = getAllUsers();
    return users.find(user => user.id === userId) || null;
  } catch (error) {
    console.error('Error getting user by ID:', error);
    return null;
  }
};

export const getUsersByClassroomId = (classroomId: string): User[] => {
  try {
    const users = getAllUsers();
    return users.filter(user => user.classroomId === classroomId);
  } catch (error) {
    console.error('Error getting users by classroom ID:', error);
    return [];
  }
};

export const getLogsByUserId = (userId: string): RecitationLog[] => {
  try {
    const logs = getAllLogs();
    return logs.filter(log => log.userId === userId);
  } catch (error) {
    console.error('Error getting logs by user ID:', error);
    return [];
  }
};

export const getClassroomByCode = (classCode: string): Classroom | null => {
  try {
    const classrooms = getAllClassrooms();
    return classrooms.find(classroom => classroom.classCode === classCode) || null;
  } catch (error) {
    console.error('Error getting classroom by code:', error);
    return null;
  }
};
