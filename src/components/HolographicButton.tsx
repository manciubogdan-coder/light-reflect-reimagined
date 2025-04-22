
import { useState, useRef, useEffect } from "react";
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
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const buttonRef = useRef<HTMLAnchorElement>(null);
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (buttonRef.current && isHovered) {
        const rect = buttonRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        setMousePosition({ x, y });
      }
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isHovered]);
  
  return (
    <Link
      ref={buttonRef}
      to={to}
      className={`relative group overflow-hidden electric-button cyber-scan ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Holographic effect layers */}
      <div className="absolute inset-0 bg-electric-blue/10 group-hover:bg-electric-blue/20 transition-colors duration-300"></div>
      
      <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${isHovered ? 'animate-pulse-glow' : ''}`}>
        <div className="absolute inset-0 bg-gradient-to-r from-electric-blue/0 via-hologram-blue/20 to-electric-blue/0 animate-circuit-flow"></div>
      </div>
      
      {/* Radial highlight that follows mouse */}
      {isHovered && (
        <div 
          className="absolute w-32 h-32 rounded-full bg-hologram-blue/20 -translate-x-1/2 -translate-y-1/2 pointer-events-none mix-blend-screen"
          style={{
            left: mousePosition.x,
            top: mousePosition.y,
            transition: 'all 0.05s ease-out'
          }}
        />
      )}
      
      {/* Border glow */}
      <div className="absolute inset-0 border border-electric-blue/30 group-hover:border-electric-blue/60 transition-colors duration-300"></div>
      
      {/* Diagonal corner accents */}
      <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-hologram-blue group-hover:w-3 group-hover:h-3 transition-all duration-300"></div>
      <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-hologram-blue group-hover:w-3 group-hover:h-3 transition-all duration-300"></div>
      <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-hologram-blue group-hover:w-3 group-hover:h-3 transition-all duration-300"></div>
      <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-hologram-blue group-hover:w-3 group-hover:h-3 transition-all duration-300"></div>
      
      {/* Content */}
      <div className="relative flex items-center justify-center gap-2 z-10">
        <span>{children}</span>
        {showArrow && (
          <ArrowRight className={`w-4 h-4 transition-transform duration-300 ${isHovered ? 'translate-x-1' : ''}`} />
        )}
      </div>
      
      {/* Loading/Processing indicator - activated on hover */}
      {isHovered && (
        <div className="absolute bottom-1 left-0 w-full h-0.5 bg-transparent overflow-hidden">
          <div className="h-full w-full bg-gradient-to-r from-electric-blue via-hologram-blue to-electric-blue bg-[length:200%_100%] animate-circuit-flow"></div>
        </div>
      )}
    </Link>
  );
};

export default HolographicButton;
