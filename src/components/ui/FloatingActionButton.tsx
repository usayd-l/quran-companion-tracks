
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface FloatingActionButtonProps {
  onClick: () => void;
}

const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({ onClick }) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      setIsScrolled(scrollTop > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-300">
      <Button
        onClick={onClick}
        className={`
          transition-all duration-300 shadow-lg hover:shadow-xl
          ${isScrolled 
            ? 'rounded-full h-12 w-12 p-0 bg-transparent backdrop-blur-md border-2 border-[#4A6741] text-[#4A6741] hover:bg-[#4A6741]/10' 
            : 'rounded-full h-14 px-6 bg-[#4A6741] hover:bg-[#4A6741]/90 text-white'
          }
        `}
      >
        <Plus className={`transition-all duration-300 ${isScrolled ? 'h-5 w-5' : 'h-5 w-5 mr-2'}`} />
        {!isScrolled && <span>New Log</span>}
      </Button>
    </div>
  );
};

export default FloatingActionButton;
