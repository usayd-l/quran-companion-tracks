
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Filter, X, Calendar as CalendarIcon } from "lucide-react";
import { RecitationType } from "@/types";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface LogsFilterProps {
  selectedTypes: RecitationType[];
  selectedDate?: Date;
  onFilterChange: (types: RecitationType[]) => void;
  onDateChange: (date?: Date) => void;
  showDatePicker?: boolean;
}

const recitationTypes: RecitationType[] = ['Sabaq', 'Last 3 Sabaqs', 'Sabaq Dhor', 'Dhor'];

const LogsFilter: React.FC<LogsFilterProps> = ({ 
  selectedTypes, 
  selectedDate,
  onFilterChange, 
  onDateChange,
  showDatePicker = true
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDateOpen, setIsDateOpen] = useState(false);

  const toggleType = (type: RecitationType) => {
    if (selectedTypes.includes(type)) {
      onFilterChange(selectedTypes.filter(t => t !== type));
    } else {
      onFilterChange([...selectedTypes, type]);
    }
  };

  const clearFilters = () => {
    onFilterChange([]);
    if (showDatePicker) {
      onDateChange(undefined);
    }
  };

  const hasFilters = selectedTypes.length > 0 || (showDatePicker && selectedDate);

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="relative">
            <Filter className="h-4 w-4 mr-2" />
            Type Filter
            {selectedTypes.length > 0 && (
              <Badge variant="secondary" className="ml-2 h-5 w-5 p-0 flex items-center justify-center text-xs">
                {selectedTypes.length}
              </Badge>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-56 p-3" align="end">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-sm">Filter by Type</h4>
              {selectedTypes.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onFilterChange([])}
                  className="h-auto p-0 text-xs text-muted-foreground hover:text-foreground"
                >
                  Clear
                </Button>
              )}
            </div>
            
            <div className="space-y-2">
              {recitationTypes.map((type) => (
                <div
                  key={type}
                  className={`flex items-center justify-between p-2 rounded cursor-pointer hover:bg-muted ${
                    selectedTypes.includes(type) ? 'bg-primary/10 border border-primary/20' : ''
                  }`}
                  onClick={() => toggleType(type)}
                >
                  <span className="text-sm">{type}</span>
                  {selectedTypes.includes(type) && (
                    <div className="w-2 h-2 bg-primary rounded-full" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </PopoverContent>
      </Popover>

      {showDatePicker && (
        <Popover open={isDateOpen} onOpenChange={setIsDateOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className={cn(
                "justify-start text-left font-normal",
                !selectedDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="h-4 w-4 mr-2" />
              {selectedDate ? format(selectedDate, "MMM d, yyyy") : "Select Date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => {
                onDateChange(date);
                setIsDateOpen(false);
              }}
              initialFocus
              className="pointer-events-auto"
            />
          </PopoverContent>
        </Popover>
      )}
      
      {hasFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={clearFilters}
          className="text-muted-foreground hover:text-foreground"
        >
          Clear All
        </Button>
      )}

      {selectedTypes.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {selectedTypes.map((type) => (
            <Badge
              key={type}
              variant="secondary"
              className="text-xs cursor-pointer hover:bg-secondary/80"
              onClick={() => toggleType(type)}
            >
              {type}
              <X className="h-3 w-3 ml-1" />
            </Badge>
          ))}
        </div>
      )}

      {showDatePicker && selectedDate && (
        <Badge
          variant="secondary"
          className="text-xs cursor-pointer hover:bg-secondary/80"
          onClick={() => onDateChange(undefined)}
        >
          {format(selectedDate, "MMM d, yyyy")}
          <X className="h-3 w-3 ml-1" />
        </Badge>
      )}
    </div>
  );
};

export default LogsFilter;
