
import { useState, useEffect } from "react";

interface ElectricTextProps {
  text: string;
  delay?: number;
  className?: string;
  typeDelay?: number;
  glitchProb?: number;
}

const ElectricText = ({ 
  text, 
  delay = 0,
  className = "",
  typeDelay = 100,
  glitchProb = 0.1
}: ElectricTextProps) => {
  const [displayText, setDisplayText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [glitchIndex, setGlitchIndex] = useState<number | null>(null);
  
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
          
          // Random glitch effect
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
    <div className={`${className} ${isTyping ? 'blinking-cursor' : ''}`}>
      {displayText.split('').map((char, index) => (
        <span 
          key={index}
          className={`inline-block transition-all duration-150 ${
            index === glitchIndex 
              ? 'text-electric-blue-light translate-y-[2px] animate-flicker' 
              : ''
          }`}
        >
          {char}
        </span>
      ))}
    </div>
  );
};

export default ElectricText;
