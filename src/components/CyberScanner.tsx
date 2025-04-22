import { useEffect, useState } from "react";

const CyberScanner = () => {
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    // Start scanning after a delay
    const timeout = setTimeout(() => {
      setIsScanning(true);
    }, 1200); // apare mai repede, dar efectul e mult mai subtil

    return () => clearTimeout(timeout);
  }, []);

  if (!isScanning) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-30 mix-blend-lighten select-none">
      {/* Efect de fire electrice si circuite subtile */}
      {/* Fără linii de scanare deranjante – doar un decor electric */}
      <div className="absolute inset-0">
        {/* Rețea de circuite electrice */}
        <div className="absolute left-1/4 top-0 w-0.5 h-full bg-gradient-to-b from-electric-blue/40 via-hologram-blue/20 to-neon-red/10 animate-pulse"></div>
        <div className="absolute right-1/3 bottom-0 w-0.5 h-full bg-gradient-to-t from-hologram-blue/10 via-neon-red/15 to-electric-blue/30 animate-pulse" style={{animationDelay: "1s"}}></div>
        <div className="absolute left-0 top-1/2 h-0.5 w-full bg-gradient-to-r from-neon-red/20 via-hologram-blue/40 to-electric-blue/10"></div>

        {/* Prize/circuite — Lucide icons */}
        <div className="absolute top-10 left-1/3 opacity-40">
          <svg width={32} height={32} fill="none" stroke="#00FFFF" strokeWidth={2}>
            <circle cx={16} cy={16} r={12} strokeOpacity={0.6} />
            <rect x={11} y={10} width={10} height={12} rx={2} stroke="#ea384c" strokeOpacity={0.6} />
          </svg>
        </div>
        <div className="absolute bottom-14 right-16 opacity-30 rotate-6">
          <svg width={34} height={24} fill="none" stroke="#0077FF" strokeWidth={2}>
            <rect x={6} y={6} width={22} height={12} rx={4} />
            <line x1={17} y1={6} x2={17} y2={18} stroke="#00FFFF" strokeDasharray="2 3"/>
          </svg>
        </div>
      </div>

      {/* Colțuri electronice */}
      <div className="absolute top-8 left-8 w-12 h-12 border-l-2 border-t-2 border-electric-blue/60 rounded-tl-md border-dashed" />
      <div className="absolute top-8 right-8 w-12 h-12 border-r-2 border-t-2 border-hologram-blue/60 rounded-tr-md border-dashed" />
      <div className="absolute bottom-8 left-8 w-12 h-12 border-l-2 border-b-2 border-neon-red/60 rounded-bl-md border-dashed" />
      <div className="absolute bottom-8 right-8 w-12 h-12 border-r-2 border-b-2 border-electric-blue/60 rounded-br-md border-dashed" />
    </div>
  );
};

export default CyberScanner;
