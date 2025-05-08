
import React from "react";
import { User } from "@/types";
import UserProfile from "./UserProfile";
import { Link } from "react-router-dom";

interface StudentListProps {
  students: User[];
}

const StudentList: React.FC<StudentListProps> = ({ students }) => {
  if (!students || students.length === 0) {
    return (
      <div className="text-center p-6 bg-muted rounded-lg">
        <p className="text-muted-foreground">No students found</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {students.map((student) => (
        <Link key={student.id} to={`/profile/${student.id}`}>
          <div className="transform transition duration-200 hover:scale-[1.02]">
            <UserProfile user={student} />
          </div>
        </Link>
      ))}
    </div>
  );
};

export default StudentList;
