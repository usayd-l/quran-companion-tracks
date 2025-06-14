
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Filter, X } from "lucide-react";
import { RecitationType } from "@/types";

interface LogsFilterProps {
  selectedTypes: RecitationType[];
  onFilterChange: (types: RecitationType[]) => void;
}

const recitationTypes: RecitationType[] = ['Sabaq', 'Last 3 Sabaqs', 'Sabaq Dhor', 'Dhor'];

const LogsFilter: React.FC<LogsFilterProps> = ({ selectedTypes, onFilterChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleType = (type: RecitationType) => {
    if (selectedTypes.includes(type)) {
      onFilterChange(selectedTypes.filter(t => t !== type));
    } else {
      onFilterChange([...selectedTypes, type]);
    }
  };

  const clearFilters = () => {
    onFilterChange([]);
  };

  const hasFilters = selectedTypes.length > 0;

  return (
    <div className="flex items-center gap-2">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="relative">
            <Filter className="h-4 w-4 mr-2" />
            Filter
            {hasFilters && (
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
              {hasFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="h-auto p-0 text-xs text-muted-foreground hover:text-foreground"
                >
                  Clear all
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
      
      {hasFilters && (
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
    </div>
  );
};

export default LogsFilter;
