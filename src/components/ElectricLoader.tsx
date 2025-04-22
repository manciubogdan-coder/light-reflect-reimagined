
import { useEffect, useState } from "react";

const ElectricLoader = () => {
  const [progress, setProgress] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + Math.random() * 10;
        return newProgress >= 100 ? 100 : newProgress;
      });
    }, 200);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-dark-matter z-50">
      <div className="text-center">
        <div className="relative mb-8">
          <div className="w-24 h-24 rounded-full border-t-2 border-r-2 border-electric-blue animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 rounded-full border-b-2 border-l-2 border-neon-red animate-spin"></div>
          </div>
        </div>
        <h1 className="text-4xl font-tech font-bold tracking-wider mb-3">
          <span className="text-neon-red">LIGHT</span>
          <span className="text-white">REFLECT</span>
        </h1>
        <p className="text-electric-blue font-tech tracking-widest text-sm">ELECTRICAL</p>
        
        <div className="mt-8 max-w-xs mx-auto">
          <div className="h-1 w-full bg-electric-blue/20 rounded overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-electric-blue to-hologram-blue transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-white/60 mt-3 text-sm font-future">
            {progress < 100 ? "Inițializare interfață..." : "Ready"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ElectricLoader;
