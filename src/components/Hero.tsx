
import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Bolt, Lightbulb, Plug, CircuitBoard, BatteryCharging } from "lucide-react";
import HolographicButton from "./HolographicButton";
import ElectricText from "./ElectricText";

const Hero = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setIsLoaded(true);
    }, 500);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      {/* Background Electric Circuits (ascunse pe mobile) */}
      <div className="absolute inset-0 overflow-hidden hidden lg:block">
        <div className="absolute inset-0 bg-grid-lines bg-[size:50px_50px] opacity-25"></div>
        <div className="absolute top-0 left-1/5 w-px h-full bg-hologram-blue/20 animate-pulse"></div>
        <div className="absolute top-0 left-2/4 w-px h-full bg-electric-blue/20 animate-pulse"></div>
        <div className="absolute bottom-0 right-1/3 h-px w-1/2 bg-gradient-to-l from-neon-red/15 via-hologram-blue/20 to-electric-blue/10"></div>
        {/* Electric icons */}
        <Lightbulb className="absolute top-32 left-16 text-neon-red/50 w-9 h-9 animate-spin-slow" />
        <Plug className="absolute bottom-20 left-1/2 text-electric-blue/40 w-10 h-10 animate-float" />
        <CircuitBoard className="absolute top-1/3 right-10 text-hologram-blue/40 w-16 h-16 animate-spin-slow" />
        <BatteryCharging className="absolute bottom-12 right-1/4 text-neon-red/40 w-8 h-8 animate-pulse" />
      </div>

      <div className="container mx-auto px-4 flex flex-col lg:flex-row items-center gap-10 lg:gap-12 z-10">
        <div 
          className={`w-full lg:w-1/2 transition-all duration-700 ${
            isLoaded ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="flex items-center gap-3 mb-2 lg:mb-3">
            <span className="hidden lg:inline-block w-10 h-px bg-electric-blue"></span>
            <h4 className="text-electric-blue font-tech text-lg lg:text-xl flex items-center gap-1 lg:gap-2">
              <span>Smart Energy</span>
              <Bolt className="w-4 h-4 lg:w-5 lg:h-5 text-electric-blue animate-pulse" />
              <span className="hidden sm:inline">Smart Future</span>
            </h4>
          </div>

          {/* TITLU compact și clar pe mobil */}
          <h1 className="text-2xl md:text-4xl lg:text-6xl font-tech font-bold mb-3 lg:mb-6 relative select-none">
            Viitorul{" "}
            <span className="text-neon-red relative inline-block">
              Electric
              <span className="hidden lg:block absolute -inset-1 bg-neon-red/10 blur-md -z-10 rounded"></span>
            </span>
            <span className="hidden lg:flex absolute left-full ml-4 top-2 gap-2">
              <Plug className="w-7 h-7 text-electric-blue/60 rotate-12" />
              <CircuitBoard className="w-8 h-8 text-hologram-blue/40" />
            </span>
            <span className="block lg:hidden text-electric-blue font-tech mt-1 text-lg">începe acum</span>
          </h1>

          <ElectricText 
            text="Instalații electrice făcute ca la carte. Cu oameni serioși, echipamente moderne și un plan clar: să devenim rețeaua #1 de electricieni din Europa."
            className="text-base md:text-xl lg:text-2xl font-tech text-white/80 mb-4 lg:mb-8"
            delay={800}
            glitchProb={0}
          />

          <p className="text-white/70 mb-5 max-w-xl backdrop-blur-sm bg-dark-matter/20 p-2 rounded-lg border border-electric-blue/5 text-base lg:mb-8 lg:bg-dark-matter/30 lg:p-4 lg:border-electric-blue/10">
            Light Reflect Electrical este liderul european în tehnologia instalațiilor electrice inteligente. Folosim tehnologie avansată pentru a aduce soluții smart în casa ta.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 lg:gap-4">
            <HolographicButton to="/contact" className="neon-glow">
              Solicită o ofertă
            </HolographicButton>
            <Link 
              to="/servicii" 
              className="tech-border py-2 px-4 text-center font-tech uppercase tracking-wider text-white hover:bg-electric-blue/10 transition-all duration-300 group relative overflow-hidden text-sm lg:text-base"
            >
              <span className="relative z-10">Vezi Serviciile</span>
              <span className="hidden lg:block absolute inset-0 bg-gradient-to-r from-electric-blue/0 via-electric-blue/10 to-electric-blue/0 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-700"></span>
            </Link>
          </div>

          {/* Doar o statistică relevantă pe mobil */}
          <div className="mt-7 grid grid-cols-2 gap-3 lg:mt-10 lg:grid-cols-4 lg:gap-4">
            <div className="glass-panel p-2 text-center flex flex-col items-center gap-1">
              <span className="text-hologram-blue font-tech text-lg lg:text-xl flex items-center gap-1">
                99.8% <Lightbulb size={18} className="inline text-hologram-blue" />
              </span>
              <p className="text-xs text-white/60">Eficiență</p>
            </div>
            {/* Celelalte statistici doar pe desktop */}
            <div className="hidden lg:flex glass-panel p-3 text-center flex-col items-center gap-1">
              <span className="text-electric-blue font-tech text-xl flex items-center gap-1">
                10+ <Plug size={18} className="inline text-electric-blue" />
              </span>
              <p className="text-xs text-white/60">Ani experiență</p>
            </div>
            <div className="hidden lg:flex glass-panel p-3 text-center flex-col items-center gap-1">
              <span className="text-neon-red font-tech text-xl flex items-center gap-1">
                A++ <CircuitBoard size={19} className="inline text-neon-red" />
              </span>
              <p className="text-xs text-white/60">Certificare</p>
            </div>
            <div className="hidden lg:flex glass-panel p-3 text-center flex-col items-center gap-1">
              <span className="text-hologram-blue font-tech text-xl flex items-center gap-1">
                24/7 <BatteryCharging size={17} className="inline text-hologram-blue" />
              </span>
              <p className="text-xs text-white/60">Suport</p>
            </div>
          </div>
        </div>

        {/* Imaginea principală, simplificată pe mobil (fără overlays și stats extra) */}
        <div 
          className={`w-full lg:w-1/2 transition-all duration-1000 delay-300 ${
            isLoaded ? "opacity-100" : "opacity-0"
          } flex justify-center`}
        >
          <div className="relative w-56 sm:w-72 md:w-80 lg:w-auto holographic-card">
            <div className="relative z-10 tech-border p-1 sm:p-2 bg-dark-matter/60 rounded-lg animate-float">
              <img 
                src="/lovable-uploads/9081ef31-81b5-4f9b-9248-872b2d6d6389.png" 
                alt="Light Reflect Electrician" 
                className="rounded-lg w-full h-auto object-cover max-h-72 sm:max-h-80 lg:max-h-max"
                style={{
                  transition: 'transform 0.2s cubic-bezier(.4,2,.6,1)'
                }}
              />
              {/* Glow și decorații doar pe desktop */}
              <div className="hidden lg:block absolute -inset-1 rounded-lg border border-electric-blue/30 animate-pulse-glow"></div>
              <div className="hidden lg:block absolute -top-7 left-10 rotate-12 opacity-40">
                <Plug className="w-8 h-8 text-hologram-blue/70" />
              </div>
              <div className="hidden lg:block absolute bottom-0 right-0 opacity-30">
                <CircuitBoard className="w-10 h-10 text-electric-blue/60" />
              </div>
              <div className="hidden lg:block absolute top-0 left-2 opacity-20">
                <Lightbulb className="w-7 h-7 text-neon-red/60" />
              </div>
              <div className="hidden lg:block absolute inset-0 overflow-hidden rounded-lg cyber-scan" />
              <div className="hidden lg:flex absolute top-2 left-2 items-center gap-2">
                <div className="w-2 h-2 bg-hologram-blue rounded-full animate-pulse"></div>
                <span className="font-tech text-xs text-hologram-blue">SYS.ACTIVE</span>
              </div>
              <div className="hidden lg:flex absolute bottom-2 right-2 items-center gap-2">
                <span className="font-tech text-xs text-electric-blue">ID.8734</span>
                <div className="w-2 h-2 bg-electric-blue rounded-full animate-pulse"></div>
              </div>
              <svg className="hidden lg:block absolute left-0 top-0 z-0 opacity-15" width={64} height={40}><polyline points="2,20 30,3 62,15 60,36 10,38 2,20" fill="none" stroke="#00FFFF" strokeWidth="2" strokeDasharray="5,5"/></svg>
            </div>

            {/* Statistici extra și card doar pe desktop */}
            <div className="hidden lg:block absolute bottom-4 right-4 tech-panel z-20 w-64 neon-glow">
              <div className="flex justify-between items-center mb-3">
                <h5 className="font-tech text-electric-blue flex gap-1 items-center">Proiecte <Bolt className="w-4 h-4" /> Realizate</h5>
              </div>
              <div className="flex items-end gap-2">
                <span className="text-3xl font-tech text-white">237+</span>
                <span className="text-green-400 text-sm">↑ 24% față de 2023</span>
              </div>
              <div className="w-full h-1 bg-electric-blue/20 rounded mt-3 overflow-hidden">
                <div className="h-full w-3/4 bg-gradient-to-r from-electric-blue to-hologram-blue"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Down indicator - doar pe desktop */}
      <div className="hidden lg:flex absolute bottom-10 left-1/2 transform -translate-x-1/2 flex-col items-center">
        <span className="text-white/50 text-sm font-tech mb-2">Scroll Down</span>
        <div className="w-5 h-10 rounded-full border border-electric-blue/30 flex justify-center pt-2">
          <div className="w-1.5 h-1.5 rounded-full bg-electric-blue animate-bounce"></div>
        </div>
      </div>

      {/* Tech corners doar pe desktop */}
      <div className="hidden lg:block absolute top-6 left-6 w-16 h-16 border-l-2 border-t-2 border-electric-blue/30 rounded-tl-lg"></div>
      <div className="hidden lg:block absolute top-6 right-6 w-16 h-16 border-r-2 border-t-2 border-hologram-blue/30 rounded-tr-lg"></div>
      <div className="hidden lg:block absolute bottom-6 left-6 w-16 h-16 border-l-2 border-b-2 border-neon-red/30 rounded-bl-lg"></div>
      <div className="hidden lg:block absolute bottom-6 right-6 w-16 h-16 border-r-2 border-b-2 border-electric-blue/30 rounded-br-lg"></div>
    </section>
  );
};

export default Hero;
