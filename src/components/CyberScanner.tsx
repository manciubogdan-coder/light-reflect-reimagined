
import { useEffect, useState } from "react";

const CyberScanner = () => {
  const [isScanning, setIsScanning] = useState(false);
  
  useEffect(() => {
    // Start scanning after a delay
    const timeout = setTimeout(() => {
      setIsScanning(true);
    }, 2000);
    
    return () => clearTimeout(timeout);
  }, []);
  
  if (!isScanning) return null;
  
  return (
    <div className="fixed inset-0 pointer-events-none z-40">
      {/* Horizontal scan line */}
      <div 
        className="absolute left-0 w-full h-[2px] bg-hologram-blue/30"
        style={{
          boxShadow: '0 0 10px rgba(0, 255, 255, 0.7), 0 0 20px rgba(0, 255, 255, 0.3)',
          animation: 'scanHorizontal 8s linear infinite'
        }}
      />
      
      {/* Vertical scan line */}
      <div 
        className="absolute top-0 h-full w-[2px] bg-electric-blue/30"
        style={{
          boxShadow: '0 0 10px rgba(0, 119, 255, 0.7), 0 0 20px rgba(0, 119, 255, 0.3)',
          animation: 'scanVertical 12s linear infinite'
        }}
      />
      
      {/* Corner elements */}
      <div className="absolute top-5 left-5 w-12 h-12 border-l-2 border-t-2 border-electric-blue/70" />
      <div className="absolute top-5 right-5 w-12 h-12 border-r-2 border-t-2 border-electric-blue/70" />
      <div className="absolute bottom-5 left-5 w-12 h-12 border-l-2 border-b-2 border-electric-blue/70" />
      <div className="absolute bottom-5 right-5 w-12 h-12 border-r-2 border-b-2 border-electric-blue/70" />
      
      <style>
        {`
          @keyframes scanHorizontal {
            0% { top: -10px; }
            50% { top: 100vh; }
            50.1% { top: 100vh; }
            100% { top: -10px; }
          }
          
          @keyframes scanVertical {
            0% { left: -10px; }
            50% { left: 100vw; }
            50.1% { left: 100vw; }
            100% { left: -10px; }
          }
        `}
      </style>
    </div>
  );
};

export default CyberScanner;
