
// Re-export everything from the refactored demo modules
export { demoTeacher, demoStudents, demoClassrooms } from "./demo/demoUsers";
export { generateDemoLogs } from "./demo/demoLogGenerator";
export { demoDataService } from "./demo/demoDataApi";

// For backwards compatibility, also export individual items
export const demoClassroom = {
  id: "demo-classroom-id",
  name: "Demo Quran Class",
  teacherId: "demo-teacher-id",
  classCode: "DEMO123"
};

// Generate and export demo logs
export const demoLogs = generateDemoLogs();
