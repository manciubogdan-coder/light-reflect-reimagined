
import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

interface HolographicButtonProps {
  to: string;
  children: React.ReactNode;
  className?: string;
  showArrow?: boolean;
}

const HolographicButton = ({ to, children, className = "", showArrow = true }: HolographicButtonProps) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <Link
      to={to}
      className={`relative group overflow-hidden electric-button ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Holographic effect layers */}
      <div className="absolute inset-0 bg-electric-blue/10 group-hover:bg-electric-blue/20 transition-colors duration-300"></div>
      
      <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${isHovered ? 'animate-pulse-glow' : ''}`}>
        <div className="absolute inset-0 bg-gradient-to-r from-electric-blue/0 via-hologram-blue/20 to-electric-blue/0 animate-circuit-flow"></div>
      </div>
      
      {/* Border glow */}
      <div className="absolute inset-0 border border-electric-blue/30 group-hover:border-electric-blue/60 transition-colors duration-300"></div>
      
      {/* Content */}
      <div className="relative flex items-center justify-center gap-2 z-10">
        <span>{children}</span>
        {showArrow && (
          <ArrowRight className={`w-4 h-4 transition-transform duration-300 ${isHovered ? 'translate-x-1' : ''}`} />
        )}
      </div>
    </Link>
  );
};

export default HolographicButton;
