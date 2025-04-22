
import { useState, useEffect, useRef } from "react";

interface ElectricTextProps {
  text: string;
  delay?: number;
  className?: string;
  typeDelay?: number;
  glitchProb?: number;
  neonEffect?: boolean;
}

const ElectricText = ({ 
  text, 
  delay = 0,
  className = "",
  typeDelay = 100,
  glitchProb = 0.1,
  neonEffect = false
}: ElectricTextProps) => {
  const [displayText, setDisplayText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [glitchIndex, setGlitchIndex] = useState<number | null>(null);
  const [isGlitching, setIsGlitching] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Random glitch effect
  useEffect(() => {
    if (!isTyping && displayText === text) {
      const glitchInterval = setInterval(() => {
        if (Math.random() < glitchProb * 0.5) {
          setIsGlitching(true);
          setGlitchIndex(Math.floor(Math.random() * text.length));
          
          setTimeout(() => {
            setIsGlitching(false);
            setGlitchIndex(null);
          }, 150);
        }
      }, 2000);
      
      return () => clearInterval(glitchInterval);
    }
  }, [isTyping, displayText, text, glitchProb]);
  
  // Typing effect
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    let interval: NodeJS.Timeout;
    let typingIndex = 0;
    
    // Start typing after delay
    timeout = setTimeout(() => {
      setIsTyping(true);
      
      interval = setInterval(() => {
        if (typingIndex < text.length) {
          setDisplayText(text.substring(0, typingIndex + 1));
          typingIndex++;
          
          // Random glitch effect during typing
          if (Math.random() < glitchProb) {
            setGlitchIndex(Math.floor(Math.random() * typingIndex));
            setTimeout(() => setGlitchIndex(null), 150);
          }
        } else {
          setIsTyping(false);
          clearInterval(interval);
        }
      }, typeDelay);
    }, delay);
    
    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, [text, delay, typeDelay, glitchProb]);
  
  return (
    <div 
      ref={containerRef}
      className={`${className} ${isTyping ? 'blinking-cursor' : ''} ${neonEffect ? 'neon-text' : ''}`}
      style={neonEffect ? { textShadow: '0 0 5px rgba(0, 119, 255, 0.7), 0 0 10px rgba(0, 119, 255, 0.5)' } : undefined}
    >
      {displayText.split('').map((char, index) => (
        <span 
          key={index}
          className={`inline-block transition-all duration-150 ${
            index === glitchIndex 
              ? 'text-electric-blue-light translate-y-[2px] animate-flicker' 
              : ''
          }`}
          style={{
            transform: isGlitching && Math.random() > 0.7 ? `translateX(${Math.random() * 4 - 2}px)` : 'none',
            opacity: isGlitching && index % 5 === 0 ? 0.7 : 1
          }}
        >
          {char}
        </span>
      ))}
    </div>
  );
};

export default ElectricText;
