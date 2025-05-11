import { User, RecitationLog, Classroom } from "@/types";
import { v4 as uuidv4 } from 'uuid';

// Keys for localStorage
const USERS_KEY = 'quranCompanion_users';
const LOGS_KEY = 'quranCompanion_logs';
const CLASSROOMS_KEY = 'quranCompanion_classrooms';
const CURRENT_USER_KEY = 'quranCompanionUser';

// Demo accounts
const demoTeacher: User = {
  id: "teacher1",
  name: "Demo Teacher",
  email: "teacher@demo.com",
  password: "password123",
  role: "teacher",
  profileImage: "https://ui-avatars.com/api/?name=Demo+Teacher&background=D3B88C&color=2D2A26"
};

const demoStudent: User = {
  id: "student1",
  name: "Demo Student",
  email: "student@demo.com",
  password: "password123",
  role: "student",
  classroomId: "classroom1",
  profileImage: "https://ui-avatars.com/api/?name=Demo+Student&background=E9F0E6&color=4A6741"
};

// Initialize localStorage with demo data if it doesn't exist
export const initializeLocalStorage = () => {
  // Initialize users
  if (!localStorage.getItem(USERS_KEY)) {
    localStorage.setItem(USERS_KEY, JSON.stringify([
      demoTeacher,
      demoStudent,
      ...mockUsers.map(user => ({
        ...user,
        password: "password123",
      }))
    ]));
  }
  
  // Initialize logs
  if (!localStorage.getItem(LOGS_KEY)) {
    localStorage.setItem(LOGS_KEY, JSON.stringify(mockLogs));
  }
  
  // Initialize classrooms
  if (!localStorage.getItem(CLASSROOMS_KEY)) {
    const demoClassroom: Classroom = {
      id: "classroom1",
      name: "Demo Quran Class",
      teacherId: "teacher1",
      classCode: "DEMO123"
    };
    
    localStorage.setItem(CLASSROOMS_KEY, JSON.stringify([demoClassroom]));
    
    // Update demo student to be part of the classroom
    const users = getUsers();
    const updatedUsers = users.map(user => {
      if (user.id === "student1") {
        return { ...user, classroomId: "classroom1" };
      }
      return user;
    });
    
    localStorage.setItem(USERS_KEY, JSON.stringify(updatedUsers));
  }
};

// Import the mock data to initialize
import { mockUsers, mockLogs } from "@/data/mockData";

// User functions
export const getUsers = (): User[] => {
  const users = localStorage.getItem(USERS_KEY);
  return users ? JSON.parse(users) : [];
};

export const getUserById = (userId: string): User | undefined => {
  const users = getUsers();
  return users.find(user => user.id === userId);
};

export const getUsersByClassroomId = (classroomId: string): User[] => {
  const users = getUsers();
  return users.filter(user => user.classroomId === classroomId && user.role === "student");
};

export const saveUser = (user: User): User => {
  const users = getUsers();
  
  // Check if user exists
  const existingUserIndex = users.findIndex(u => u.id === user.id);
  
  if (existingUserIndex >= 0) {
    // Update existing user
    users[existingUserIndex] = user;
  } else {
    // Add new user
    users.push(user);
  }
  
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
  return user;
};

export const findUserByEmail = (email: string): User | undefined => {
  const users = getUsers();
  return users.find(user => user.email === email);
};

export const authenticateUser = (email: string, password: string): User | undefined => {
  const users = getUsers();
  return users.find(user => user.email === email && user.password === password);
};

export const getCurrentUser = (): User | null => {
  const userStr = localStorage.getItem(CURRENT_USER_KEY);
  if (!userStr) return null;
  
  try {
    return JSON.parse(userStr);
  } catch (error) {
    console.error('Failed to parse current user', error);
    return null;
  }
};

export const saveCurrentUser = (user: User | null) => {
  if (user) {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(CURRENT_USER_KEY);
  }
};

// Log functions
export const getLogs = (): RecitationLog[] => {
  const logs = localStorage.getItem(LOGS_KEY);
  return logs ? JSON.parse(logs) : [];
};

export const getLogsByUserId = (userId: string): RecitationLog[] => {
  const logs = getLogs();
  return logs.filter(log => log.userId === userId);
};

export const getLogById = (logId: string): RecitationLog | undefined => {
  const logs = getLogs();
  return logs.find(log => log.id === logId);
};

export const saveLog = (log: RecitationLog): RecitationLog => {
  const logs = getLogs();
  
  // Check if log exists
  const existingLogIndex = logs.findIndex(l => l.id === log.id);
  
  if (existingLogIndex >= 0) {
    // Update existing log
    logs[existingLogIndex] = log;
  } else {
    // Add new log with an ID if it doesn't have one
    if (!log.id) {
      log.id = uuidv4();
    }
    logs.push(log);
  }
  
  localStorage.setItem(LOGS_KEY, JSON.stringify(logs));
  return log;
};

// Classroom functions
export const getClassrooms = (): Classroom[] => {
  const classrooms = localStorage.getItem(CLASSROOMS_KEY);
  return classrooms ? JSON.parse(classrooms) : [];
};

export const getClassroomById = (classroomId: string): Classroom | undefined => {
  const classrooms = getClassrooms();
  return classrooms.find(classroom => classroom.id === classroomId);
};

export const getClassroomsByTeacherId = (teacherId: string): Classroom[] => {
  const classrooms = getClassrooms();
  return classrooms.filter(classroom => classroom.teacherId === teacherId);
};

export const getClassroomByCode = (classCode: string): Classroom | undefined => {
  const classrooms = getClassrooms();
  return classrooms.find(classroom => classroom.classCode === classCode);
};

export const saveClassroom = (classroom: Classroom): Classroom => {
  const classrooms = getClassrooms();
  
  // Check if classroom exists
  const existingClassroomIndex = classrooms.findIndex(c => c.id === classroom.id);
  
  if (existingClassroomIndex >= 0) {
    // Update existing classroom
    classrooms[existingClassroomIndex] = classroom;
  } else {
    // Add new classroom with an ID if it doesn't have one
    if (!classroom.id) {
      classroom.id = uuidv4();
    }
    classrooms.push(classroom);
  }
  
  localStorage.setItem(CLASSROOMS_KEY, JSON.stringify(classrooms));
  return classroom;
};
