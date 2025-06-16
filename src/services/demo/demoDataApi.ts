
import { demoTeacher, demoStudents, demoClassrooms } from "./demoUsers";
import { generateDemoLogs } from "./demoLogGenerator";

// Generate the demo logs once
const demoLogs = generateDemoLogs();

// Demo service functions that mimic the Supabase service API
export const demoDataService = {
  getUserById: async (userId: string) => {
    console.log('Getting user by ID:', userId);
    if (userId === "demo-teacher-id") {
      return demoTeacher;
    }
    const student = demoStudents.find(student => student.id === userId);
    console.log('Found student:', student);
    return student || null;
  },

  getUsersByClassroomId: async (classroomId: string) => {
    console.log('Getting users by classroom ID:', classroomId);
    const students = demoStudents.filter(student => student.classroomId === classroomId);
    console.log('Found students:', students.length);
    return students;
  },

  getClassroomsByTeacherId: async (teacherId: string) => {
    console.log('Getting classrooms by teacher ID:', teacherId);
    if (teacherId === "demo-teacher-id") {
      return demoClassrooms;
    }
    return [];
  },

  getLogsByUserId: async (userId: string) => {
    console.log('Getting logs for user:', userId);
    const userLogs = demoLogs.filter(log => log.userId === userId);
    console.log('Found logs:', userLogs.length);
    return userLogs;
  },

  getLogsByClassroomId: async (classroomId: string) => {
    console.log('Getting logs for classroom:', classroomId);
    const classroomStudentIds = demoStudents
      .filter(student => student.classroomId === classroomId)
      .map(student => student.id);
    const classroomLogs = demoLogs.filter(log => classroomStudentIds.includes(log.userId));
    console.log('Found classroom logs:', classroomLogs.length);
    return classroomLogs;
  },

  getLogById: async (logId: string) => {
    return demoLogs.find(log => log.id === logId) || null;
  },

  saveLog: async (log: any) => {
    // In demo mode, just return the log with a generated ID
    const newLog = {
      ...log,
      id: `demo-log-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    demoLogs.unshift(newLog); // Add to beginning for newest first
    console.log('Saved new log:', newLog);
    return newLog;
  }
};
