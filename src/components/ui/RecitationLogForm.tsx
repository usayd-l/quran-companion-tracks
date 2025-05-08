
import React, { useState } from "react";
import { RecitationType, MistakePortion, User, MistakeCount } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
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
  const [portionType, setPortionType] = useState<MistakePortion>("Full");
  const [mistakeCounts, setMistakeCounts] = useState<MistakeCount[]>([
    { portion: "Full", mistakes: 0, stucks: 0, markedMistakes: 0 }
  ]);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real app, we would save this data to a database
    // For now, we'll just navigate back and show a success message
    console.log({
      userId: studentId || user.id,
      date,
      recitationType,
      surahName: recitationType === "Sabaq" || recitationType === "Last 3 Sabaqs" ? surahName : undefined,
      ayahStart: recitationType === "Sabaq" || recitationType === "Last 3 Sabaqs" ? parseInt(ayahStart) : undefined,
      ayahEnd: recitationType === "Sabaq" || recitationType === "Last 3 Sabaqs" ? parseInt(ayahEnd) : undefined,
      juzNumber: recitationType === "Sabaq Dhor" || recitationType === "Dhor" ? parseInt(juzNumber) : undefined,
      pageStart: recitationType === "Sabaq Dhor" || recitationType === "Dhor" ? parseInt(pageStart) : undefined,
      pageEnd: recitationType === "Sabaq Dhor" || recitationType === "Dhor" ? parseInt(pageEnd) : undefined,
      mistakeCounts,
      testerName,
      notes,
      createdAt: new Date().toISOString()
    });
    
    if (onSuccess) {
      onSuccess();
    }
    
    navigate(-1);
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

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
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
          <CardTitle>Mistake Tracking</CardTitle>
        </CardHeader>
        <CardContent>
          {renderMistakeInputs()}
        </CardContent>
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
