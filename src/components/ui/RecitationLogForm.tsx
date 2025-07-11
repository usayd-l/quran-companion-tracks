import React, { useState, useEffect } from "react";
import { RecitationType, MistakePortion, User, MistakeCount, Grade } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { getUsersByClassroomId, saveLog } from "@/services/localStorage";
import { useAuth } from "@/context/AuthContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import StudentList from "@/components/ui/StudentList";
import { X } from "lucide-react";
import UserProfile from "@/components/ui/UserProfile";
import { v4 as uuidv4 } from 'uuid';
import { useToast } from "@/hooks/use-toast";
import { getAbsenceReasons } from "@/services/supabaseService";

// List of Surahs for the dropdown
const SURAHS = [
  "Al-Fatihah", "Al-Baqarah", "Aal-E-Imran", "An-Nisa", "Al-Ma'idah", 
  "Al-An'am", "Al-A'raf", "Al-Anfal", "At-Tawbah", "Yunus", 
  // Add all 114 surahs...
];

interface RecitationLogFormProps {
  user: User;
  studentId?: string; // Optional: If the teacher is logging for a student
  onSuccess?: () => void;
}

const RecitationLogForm: React.FC<RecitationLogFormProps> = ({ 
  user, 
  studentId,
  onSuccess 
}) => {
  const navigate = useNavigate();
  const { authState } = useAuth();
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [recitationType, setRecitationType] = useState<RecitationType>("Sabaq");
  const [surahName, setSurahName] = useState<string>("");
  const [ayahStart, setAyahStart] = useState<string>("");
  const [ayahEnd, setAyahEnd] = useState<string>("");
  const [juzNumber, setJuzNumber] = useState<string>("");
  const [pageStart, setPageStart] = useState<string>("");
  const [pageEnd, setPageEnd] = useState<string>("");
  const [testerName, setTesterName] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [grade, setGrade] = useState<Grade | undefined>(undefined);
  const [needsRepeat, setNeedsRepeat] = useState<boolean>(false);
  
  // Mistake tracking states
  const [includeMistakeTracking, setIncludeMistakeTracking] = useState<boolean>(false);
  const [portionType, setPortionType] = useState<MistakePortion>("Full");
  const [mistakeCounts, setMistakeCounts] = useState<MistakeCount[]>([
    { portion: "Full", mistakes: 0, stucks: 0, markedMistakes: 0 }
  ]);
  
  // New states for student selection
  const [selectedStudentId, setSelectedStudentId] = useState<string | undefined>(studentId);
  const [selectedStudent, setSelectedStudent] = useState<User | null>(null);
  const [isStudentDialogOpen, setIsStudentDialogOpen] = useState(false);
  const [students, setStudents] = useState<User[]>([]);
  
  // Check if current user is a teacher
  const isTeacher = user.role === "teacher";
  
  const [attendanceStatus, setAttendanceStatus] = useState<"present" | "absent" | "late">("present");
  const [absenceReason, setAbsenceReason] = useState<string>("");
  const [absenceReasons, setAbsenceReasons] = useState<{id: number, reason: string}[]>([]);

  // Fetch students if the user is a teacher
  useEffect(() => {
    if (isTeacher) {
      const teacherStudents = getUsersByClassroomId(user.classroomId || '');
      setStudents(teacherStudents);
      
      // If studentId is provided and exists in the students list, set the selected student
      if (studentId) {
        const student = teacherStudents.find(s => s.id === studentId);
        if (student) {
          setSelectedStudent(student);
          setSelectedStudentId(studentId);
        }
      }
    }
  }, [isTeacher, user.id, studentId, user.classroomId]);

  useEffect(() => {
    // Fetch absence reasons once
    getAbsenceReasons().then(setAbsenceReasons);
  }, []);

  const handlePortionTypeChange = (value: MistakePortion) => {
    setPortionType(value);
    
    // Reset mistake counts based on new portion type
    if (value === "Full") {
      setMistakeCounts([
        { portion: "Full", mistakes: 0, stucks: 0, markedMistakes: 0 }
      ]);
    } else if (value === "Half") {
      setMistakeCounts([
        { portion: "Half", mistakes: 0, stucks: 0, markedMistakes: 0 },
        { portion: "Half", mistakes: 0, stucks: 0, markedMistakes: 0 }
      ]);
    } else if (value === "Quarter") {
      setMistakeCounts([
        { portion: "Quarter", mistakes: 0, stucks: 0, markedMistakes: 0 },
        { portion: "Quarter", mistakes: 0, stucks: 0, markedMistakes: 0 },
        { portion: "Quarter", mistakes: 0, stucks: 0, markedMistakes: 0 },
        { portion: "Quarter", mistakes: 0, stucks: 0, markedMistakes: 0 }
      ]);
    }
  };

  const updateMistakeCount = (index: number, field: keyof Omit<MistakeCount, 'portion'>, value: number) => {
    const newMistakeCounts = [...mistakeCounts];
    newMistakeCounts[index] = {
      ...newMistakeCounts[index],
      [field]: value
    };
    setMistakeCounts(newMistakeCounts);
  };
  
  const handleSelectStudent = (student: User) => {
    setSelectedStudent(student);
    setSelectedStudentId(student.id);
    setIsStudentDialogOpen(false);
  };
  
  const clearSelectedStudent = () => {
    setSelectedStudent(null);
    setSelectedStudentId(undefined);
  };

  const { toast } = useToast();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // New: If absent/late, require reason, skip rest of log form except tester/notes
    if ((attendanceStatus === "absent" || attendanceStatus === "late") && !absenceReason) {
      toast({
        title: "Absence Reason Required",
        description: "Please select or specify a reason for absence/late.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      console.log("Starting log submission...");
      console.log("Current auth state:", authState);
      
      // Determine the user ID for the log (current user or selected student)
      const logUserId = selectedStudentId || user.id;
      
      // Create a new log object
      const newLog = {
        id: uuidv4(),
        userId: logUserId,
        date,
        recitationType,
        surahName: recitationType === "Sabaq" || recitationType === "Last 3 Sabaqs" ? surahName : undefined,
        ayahStart: ["Sabaq", "Last 3 Sabaqs", "Sabaq Dhor", "Dhor"].includes(recitationType) ? parseInt(ayahStart) : undefined,
        ayahEnd: ["Sabaq", "Last 3 Sabaqs", "Sabaq Dhor", "Dhor"].includes(recitationType) ? parseInt(ayahEnd) : undefined,
        juzNumber: recitationType === "Sabaq Dhor" || recitationType === "Dhor" ? parseInt(juzNumber) : undefined,
        pagesCount: (recitationType === "Sabaq Dhor" || recitationType === "Dhor") && pageStart && pageEnd ? parseInt(pageEnd) - parseInt(pageStart) + 1 : undefined,
        mistakeCounts: attendanceStatus === "present" && includeMistakeTracking ? mistakeCounts : [],
        testerName,
        notes,
        grade,
        needsRepeat,
        createdAt: new Date().toISOString(),
        attendanceStatus,
        absenceReason: (attendanceStatus === "absent" || attendanceStatus === "late") ? absenceReason : undefined,
      };
      
      console.log("Saving log:", newLog);
      
      // Add the new log to localStorage
      saveLog(newLog);
      
      console.log("Log saved successfully");
      
      toast({
        title: "Log Created",
        description: "Recitation log has been successfully saved.",
      });
      
      // Call onSuccess callback if provided
      if (onSuccess) {
        console.log("Calling onSuccess callback");
        onSuccess();
      } else {
        // If no onSuccess callback, navigate to home
        console.log("Navigating to home");
        navigate("/");
      }
      
      console.log("Form submission completed");
    } catch (error) {
      console.error("Error saving log:", error);
      toast({
        title: "Error",
        description: "Failed to save the recitation log. Please try again.",
        variant: "destructive",
      });
    }
  };

  const renderRecitationFields = () => {
    if (recitationType === "Sabaq" || recitationType === "Last 3 Sabaqs") {
      return (
        <div className="space-y-4">
          <div>
            <Label htmlFor="surahName">Surah Name</Label>
            <Select value={surahName} onValueChange={setSurahName}>
              <SelectTrigger id="surahName">
                <SelectValue placeholder="Select Surah" />
              </SelectTrigger>
              <SelectContent>
                {SURAHS.map((surah) => (
                  <SelectItem key={surah} value={surah}>{surah}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="ayahStart">Starting Ayah</Label>
              <Input
                id="ayahStart"
                type="number"
                min="1"
                value={ayahStart}
                onChange={(e) => setAyahStart(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="ayahEnd">Ending Ayah</Label>
              <Input
                id="ayahEnd"
                type="number"
                min={ayahStart ? parseInt(ayahStart) : 1}
                value={ayahEnd}
                onChange={(e) => setAyahEnd(e.target.value)}
                required
              />
            </div>
          </div>
        </div>
      );
    } else if (recitationType === "Sabaq Dhor" || recitationType === "Dhor") {
      return (
        <div className="space-y-4">
          <div>
            <Label htmlFor="juzNumber">Juz Number</Label>
            <Input
              id="juzNumber"
              type="number"
              min="1"
              max="30"
              value={juzNumber}
              onChange={(e) => setJuzNumber(e.target.value)}
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="pageStart">Starting Page</Label>
              <Input
                id="pageStart"
                type="number"
                min="1"
                value={pageStart}
                onChange={(e) => setPageStart(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="pageEnd">Ending Page</Label>
              <Input
                id="pageEnd"
                type="number"
                min={pageStart ? parseInt(pageStart) : 1}
                value={pageEnd}
                onChange={(e) => setPageEnd(e.target.value)}
                required
              />
            </div>
          </div>
        </div>
      );
    }
    
    return null;
  };

  const renderMistakeInputs = () => {
    return (
      <div className="space-y-4">
        <div>
          <Label>Portion Type</Label>
          <RadioGroup 
            value={portionType} 
            onValueChange={(value) => handlePortionTypeChange(value as MistakePortion)}
            className="flex space-x-4 mt-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Full" id="full" />
              <Label htmlFor="full">Full</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Half" id="half" />
              <Label htmlFor="half">Half</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Quarter" id="quarter" />
              <Label htmlFor="quarter">Quarter</Label>
            </div>
          </RadioGroup>
        </div>
        
        {mistakeCounts.map((count, index) => (
          <Card key={index} className="border border-muted">
            <CardHeader className="py-2 px-4">
              <CardTitle className="text-sm font-medium">
                {portionType === "Full" ? "Full" : 
                 portionType === "Half" ? `Half ${index + 1}` : 
                 `Quarter ${index + 1}`}
              </CardTitle>
            </CardHeader>
            <CardContent className="py-2 px-4">
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <Label htmlFor={`mistakes-${index}`} className="text-xs">Mistakes</Label>
                  <Input
                    id={`mistakes-${index}`}
                    type="number"
                    min="0"
                    value={count.mistakes}
                    onChange={(e) => updateMistakeCount(index, 'mistakes', parseInt(e.target.value) || 0)}
                  />
                </div>
                <div>
                  <Label htmlFor={`stucks-${index}`} className="text-xs">Stucks</Label>
                  <Input
                    id={`stucks-${index}`}
                    type="number"
                    min="0"
                    value={count.stucks}
                    onChange={(e) => updateMistakeCount(index, 'stucks', parseInt(e.target.value) || 0)}
                  />
                </div>
                <div>
                  <Label htmlFor={`marked-${index}`} className="text-xs">Marked</Label>
                  <Input
                    id={`marked-${index}`}
                    type="number"
                    min="0"
                    value={count.markedMistakes}
                    onChange={(e) => updateMistakeCount(index, 'markedMistakes', parseInt(e.target.value) || 0)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  // New: Attendance section at top
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Attendance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-2">
            <Label>Attendance Status:</Label>
            <RadioGroup value={attendanceStatus} onValueChange={v => setAttendanceStatus(v as any)} className="flex flex-row gap-2">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="present" id="att-present" />
                <Label htmlFor="att-present">Present</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="absent" id="att-absent" />
                <Label htmlFor="att-absent">Absent</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="late" id="att-late" />
                <Label htmlFor="att-late">Late</Label>
              </div>
            </RadioGroup>
          </div>
          {(attendanceStatus === "absent" || attendanceStatus === "late") && (
            <div className="mt-2">
              <Label htmlFor="absence-reason">Reason for {attendanceStatus === 'absent' ? 'Absence' : 'Being Late'}</Label>
              <Select value={absenceReason} onValueChange={v => setAbsenceReason(v)}>
                <SelectTrigger id="absence-reason">
                  <SelectValue placeholder="Select Reason" />
                </SelectTrigger>
                <SelectContent>
                  {absenceReasons.map(r =>
                    <SelectItem value={r.reason} key={r.id}>{r.reason}</SelectItem>
                  )}
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
              {absenceReason === "Other" && (
                <Input
                  className="mt-1"
                  placeholder="Specify other reason..."
                  value={absenceReason === "Other" ? absenceReason : ""}
                  onChange={e => setAbsenceReason(e.target.value)}
                />
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {attendanceStatus === "present" && (
        <>
          {/* Student Selection for Teachers */}
          {isTeacher && (
            <Card>
              <CardHeader>
                <CardTitle>Student</CardTitle>
              </CardHeader>
              <CardContent>
                {selectedStudent ? (
                  <div className="relative">
                    <UserProfile user={selectedStudent} />
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="absolute top-2 right-2 h-6 w-6 p-0 rounded-full text-muted-foreground"
                      onClick={clearSelectedStudent}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ) : (
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => setIsStudentDialogOpen(true)}
                  >
                    Select Student
                  </Button>
                )}
                
                <Dialog open={isStudentDialogOpen} onOpenChange={setIsStudentDialogOpen}>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Select a Student</DialogTitle>
                    </DialogHeader>
                    
                    <StudentList 
                      students={students} 
                      selectable={true}
                      onSelectStudent={handleSelectStudent}
                    />
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          )}
          
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="recitationType">Recitation Type</Label>
                <Select value={recitationType} onValueChange={(value) => setRecitationType(value as RecitationType)}>
                  <SelectTrigger id="recitationType">
                    <SelectValue placeholder="Select Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Sabaq">Sabaq</SelectItem>
                    <SelectItem value="Last 3 Sabaqs">Last 3 Sabaqs</SelectItem>
                    <SelectItem value="Sabaq Dhor">Sabaq Dhor</SelectItem>
                    <SelectItem value="Dhor">Dhor</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {renderRecitationFields()}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Assessment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="grade">Grade</Label>
                <Select value={grade} onValueChange={(value) => setGrade(value as Grade)}>
                  <SelectTrigger id="grade">
                    <SelectValue placeholder="Select Grade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Excellent">Excellent</SelectItem>
                    <SelectItem value="Very Good">Very Good</SelectItem>
                    <SelectItem value="Good">Good</SelectItem>
                    <SelectItem value="Average">Average</SelectItem>
                    <SelectItem value="Failed">Failed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="needsRepeat" 
                  checked={needsRepeat}
                  onCheckedChange={(checked) => setNeedsRepeat(checked as boolean)}
                />
                <Label htmlFor="needsRepeat">Needs to repeat</Label>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Checkbox 
                  id="includeMistakeTracking" 
                  checked={includeMistakeTracking}
                  onCheckedChange={(checked) => setIncludeMistakeTracking(checked as boolean)}
                />
                <Label htmlFor="includeMistakeTracking" className="cursor-pointer">Mistake Tracking</Label>
              </CardTitle>
            </CardHeader>
            {includeMistakeTracking && (
              <CardContent>
                {renderMistakeInputs()}
              </CardContent>
            )}
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Additional Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="testerName">Tester Name</Label>
                <Input
                  id="testerName"
                  value={testerName}
                  onChange={(e) => setTesterName(e.target.value)}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="notes">Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  placeholder="Any additional notes about this recitation..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        </>
      )}
      <div className="flex justify-end space-x-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => navigate(-1)}
        >
          Cancel
        </Button>
        <Button type="submit" className="bg-primary hover:bg-primary/90">
          Save Log
        </Button>
      </div>
    </form>
  );
};

export default RecitationLogForm;
