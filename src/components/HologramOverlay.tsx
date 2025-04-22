
import { SquareCode, Plug, CircuitBoard, Lightbulb, SquareDashed, Square } from "lucide-react";

const HologramOverlay = () => (
  <div className="pointer-events-none fixed inset-0 z-20 select-none mix-blend-lighten overflow-hidden">
    {/* Linii electrice și elemente de panou */}
    <div className="absolute left-1/4 top-[10vh] w-0.5 h-[55vh] bg-gradient-to-b from-hologram-blue/70 via-electric-blue/50 to-neon-red/10 animate-pulse" />
    <div className="absolute right-1/5 bottom-[12vh] w-0.5 h-[40vh] bg-gradient-to-t from-electric-blue/10 via-hologram-blue/40 to-neon-red/30 animate-pulse" />
    <div className="absolute top-2/3 left-8 w-[240px] h-px bg-gradient-to-r from-hologram-blue/40 via-electric-blue/30 to-transparent blur-sm" />
    <div className="absolute bottom-12 right-10 w-[180px] h-px bg-gradient-to-l from-neon-red/25 via-electric-blue/25 to-transparent blur-sm" />

    {/* Holographic squares */}
    <SquareCode className="absolute top-20 left-[13vw] text-hologram-blue/40 w-10 h-10 animate-spin-slow" />
    <Plug className="absolute top-2/3 left-[80vw] text-electric-blue/40 w-12 h-12 animate-float" />
    <CircuitBoard className="absolute bottom-[30vh] right-[18vw] text-electric-blue w-14 h-14 animate-spin-slow" />
    <SquareDashed className="absolute bottom-16 left-[30vw] text-neon-red/30 w-12 h-12 animate-float" />
    <Square className="absolute top-14 right-[20vw] text-hologram-blue/50 w-9 h-9 animate-spin-slow" />
    <Lightbulb className="absolute top-1/3 right-10 text-neon-red/40 w-11 h-11 animate-pulse" />

    {/* Holographic grid overlay */}
    <div className="absolute inset-0 bg-grid-lines bg-[size:60px_60px] opacity-10" />
  </div>
);

export default HologramOverlay;
