
import React from "react";
import { User, Users } from "lucide-react";
import { UserRole } from "@/types";
import { cn } from "@/lib/utils";

interface RoleSelectionCardProps {
  role: UserRole;
  selectedRole: UserRole;
  onSelect: (role: UserRole) => void;
}

const RoleSelectionCard: React.FC<RoleSelectionCardProps> = ({
  role,
  selectedRole,
  onSelect,
}) => {
  const isSelected = role === selectedRole;

  const roleConfig = {
    student: {
      title: "Individual Memorizer",
      Icon: User,
      bgColor: "bg-[#F2FCE2]",
      selectedBgColor: "bg-[#E9F0E6]",
      borderColor: "border-[#4A6741]",
    },
    teacher: {
      title: "Teacher",
      Icon: Users,
      bgColor: "bg-[#D3E4FD]",
      selectedBgColor: "bg-[#C0D5F2]",
      borderColor: "border-[#2D2A26]",
    },
  };

  const config = roleConfig[role];

  return (
    <div
      className={cn(
        "rounded-lg p-6 cursor-pointer transition-all border-2",
        isSelected ? config.selectedBgColor : config.bgColor,
        isSelected ? `${config.borderColor} shadow-md` : "border-transparent",
        "hover:shadow-md"
      )}
      onClick={() => onSelect(role)}
    >
      <div className="flex flex-col items-center justify-center space-y-3">
        <config.Icon
          size={48}
          className={cn(
            "transition-colors",
            isSelected ? "text-primary" : "text-gray-600"
          )}
        />
        <p className="font-medium text-center">{config.title}</p>
      </div>
    </div>
  );
};

export default RoleSelectionCard;
