
import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Bolt, ArrowRight, Zap } from "lucide-react";
import HolographicButton from "./HolographicButton";
import ElectricText from "./ElectricText";

const Hero = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    setTimeout(() => {
      setIsLoaded(true);
    }, 500);
    
    const handleMouseMove = (e: MouseEvent) => {
      if (heroRef.current) {
        const { left, top, width, height } = heroRef.current.getBoundingClientRect();
        const x = (e.clientX - left) / width;
        const y = (e.clientY - top) / height;
        setMousePosition({ x, y });
      }
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Calculate tilt and parallax effects based on mouse position
  const calculateTilt = (intensity = 10) => {
    const tiltX = (mousePosition.y - 0.5) * intensity;
    const tiltY = (mousePosition.x - 0.5) * -intensity;
    return { tiltX, tiltY };
  };
  
  const { tiltX, tiltY } = calculateTilt();

  return (
    <section ref={heroRef} className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-grid-lines bg-[size:50px_50px] opacity-20"></div>
        
        {/* Dynamic background gradients that follow mouse */}
        <div 
          className="absolute w-full h-full opacity-30 pointer-events-none transition-all duration-200 ease-out"
          style={{
            background: `radial-gradient(circle at ${mousePosition.x * 100}% ${mousePosition.y * 100}%, rgba(0, 119, 255, 0.15), transparent 50%)`,
          }}
        />
        
        {/* Vertical Lines */}
        <div className="absolute top-0 left-1/4 w-px h-full bg-electric-blue/10"></div>
        <div className="absolute top-0 left-1/2 w-px h-full bg-electric-blue/10"></div>
        <div className="absolute top-0 left-3/4 w-px h-full bg-electric-blue/10"></div>
        
        {/* Animated Particles */}
        <div className="absolute top-1/4 left-1/4 w-2 h-2 rounded-full bg-electric-blue animate-pulse"></div>
        <div className="absolute top-3/4 left-1/2 w-3 h-3 rounded-full bg-hologram-blue animate-float"></div>
        <div className="absolute top-1/3 left-3/4 w-2 h-2 rounded-full bg-neon-red animate-pulse"></div>
        
        {/* Floating Elements */}
        <div className="absolute top-1/5 right-1/4 w-24 h-24 rounded-full border border-hologram-blue/20 floating" style={{ animationDelay: '0.5s' }}></div>
        <div className="absolute bottom-1/4 left-1/5 w-16 h-16 rounded-full border border-neon-red/20 floating" style={{ animationDelay: '1.2s' }}></div>
        
        {/* Circuit Lines */}
        <div className="absolute top-1/3 left-0 w-1/3 h-px bg-gradient-to-r from-transparent via-electric-blue/30 to-transparent"></div>
        <div className="absolute bottom-1/4 right-0 w-1/3 h-px bg-gradient-to-l from-transparent via-hologram-blue/30 to-transparent"></div>
      </div>

      <div className="container mx-auto px-4 flex flex-col lg:flex-row items-center gap-12 z-10">
        <div 
          className={`w-full lg:w-1/2 transform transition-all duration-1000 ${
            isLoaded ? "translate-x-0 opacity-100" : "-translate-x-20 opacity-0"
          }`}
        >
          <div className="flex items-center gap-3 mb-3">
            <span className="inline-block w-10 h-px bg-electric-blue"></span>
            <h4 className="text-electric-blue font-tech text-xl flex items-center gap-2">
              <span>Smart Energy</span>
              <Zap className="w-5 h-5 text-electric-blue animate-pulse" />
              <span>Smart Future</span>
            </h4>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-tech font-bold mb-6 relative glitch" data-text="Viitorul Electric Începe Acum">
            Viitorul <span className="text-neon-red relative inline-block">
              Electric
              <span className="absolute -inset-1 bg-neon-red/10 blur-md -z-10 rounded"></span>
            </span> Începe Acum
          </h1>
          
          <ElectricText 
            text="Aducem lumină în casa ta"
            className="text-xl md:text-2xl font-tech text-white/80 mb-8"
            delay={1000}
            glitchProb={0.2}
          />
          
          <p className="text-white/60 mb-8 max-w-xl backdrop-blur-sm bg-dark-matter/30 p-4 rounded-lg">
            Light Reflect Electrical este liderul european în tehnologia instalațiilor electrice 
            inteligente. Folosim tehnologie avansată pentru a aduce soluții smart în casa ta.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <HolographicButton to="/contact" className="neon-glow">
              Solicită o ofertă inteligentă
            </HolographicButton>
            
            <Link to="/servicii" className="tech-border py-3 px-6 text-center font-tech uppercase tracking-wider text-white hover:bg-electric-blue/10 transition-all duration-300 group relative overflow-hidden">
              <span className="relative z-10">Descoperă Serviciile</span>
              <span className="absolute inset-0 bg-gradient-to-r from-electric-blue/0 via-electric-blue/10 to-electric-blue/0 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-700"></span>
            </Link>
          </div>
          
          {/* Holographic data points */}
          <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="glass-panel p-3 text-center">
              <span className="text-hologram-blue font-tech text-xl">99.8%</span>
              <p className="text-xs text-white/60">Eficiență</p>
            </div>
            <div className="glass-panel p-3 text-center">
              <span className="text-electric-blue font-tech text-xl">10+</span>
              <p className="text-xs text-white/60">Ani experiență</p>
            </div>
            <div className="glass-panel p-3 text-center">
              <span className="text-neon-red font-tech text-xl">A++</span>
              <p className="text-xs text-white/60">Certificare</p>
            </div>
            <div className="glass-panel p-3 text-center">
              <span className="text-hologram-blue font-tech text-xl">24/7</span>
              <p className="text-xs text-white/60">Suport</p>
            </div>
          </div>
        </div>
        
        <div 
          className={`w-full lg:w-1/2 transition-all duration-1000 delay-300 ${
            isLoaded ? "translate-x-0 opacity-100" : "translate-x-20 opacity-0"
          }`}
        >
          <div 
            className="relative holographic-card"
            style={{ 
              transform: `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`,
              transition: 'transform 0.1s ease-out'
            }}
          >
            {/* Electrician Image */}
            <div className="relative z-10 tech-border p-2 bg-dark-matter/50 rounded-lg animate-float">
              <img 
                src="/lovable-uploads/9081ef31-81b5-4f9b-9248-872b2d6d6389.png" 
                alt="Light Reflect Electrician" 
                className="rounded-lg"
                style={{ 
                  transform: `translateX(${tiltY * -15}px) translateY(${tiltX * -15}px)`,
                  transition: 'transform 0.1s ease-out'
                }}
              />
              
              {/* Inner Glow */}
              <div className="absolute -inset-1 rounded-lg border border-electric-blue/30 animate-pulse-glow"></div>
              
              {/* Scan line effect */}
              <div className="absolute inset-0 overflow-hidden rounded-lg cyber-scan"></div>
              
              {/* HUD Elements */}
              <div className="absolute top-2 left-2 flex items-center gap-2">
                <div className="w-2 h-2 bg-hologram-blue rounded-full animate-pulse"></div>
                <span className="font-tech text-xs text-hologram-blue">SYS.ACTIVE</span>
              </div>
              
              <div className="absolute bottom-2 right-2 flex items-center gap-2">
                <span className="font-tech text-xs text-electric-blue">ID.8734</span>
                <div className="w-2 h-2 bg-electric-blue rounded-full animate-pulse"></div>
              </div>
              
              {/* Decorative Elements */}
              <div 
                className="absolute -top-10 -right-10 w-20 h-20 bg-electric-blue/5 rounded-full backdrop-blur-sm border border-electric-blue/20"
                style={{ 
                  transform: `translateX(${tiltY * 20}px) translateY(${tiltX * 20}px)`,
                  transition: 'transform 0.1s ease-out'
                }}
              ></div>
              <div 
                className="absolute -bottom-5 -left-5 w-10 h-10 bg-neon-red/10 rounded-full backdrop-blur-sm border border-neon-red/20"
                style={{ 
                  transform: `translateX(${tiltY * 10}px) translateY(${tiltX * 10}px)`,
                  transition: 'transform 0.1s ease-out'
                }}
              ></div>
            </div>
            
            {/* Stats Card */}
            <div 
              className="absolute bottom-4 right-4 tech-panel z-20 translate-y-16 md:translate-y-0 md:-right-10 w-64 animate-scale-in neon-glow"
              style={{ 
                transform: `translateX(${tiltY * 25}px) translateY(${tiltX * 25}px)`,
                transition: 'transform 0.1s ease-out'
              }}
            >
              <div className="flex justify-between items-center mb-3">
                <h5 className="font-tech text-electric-blue">Proiecte Realizate</h5>
                <Bolt className="w-5 h-5 text-neon-red animate-pulse" />
              </div>
              <div className="flex items-end gap-2">
                <span className="text-3xl font-tech text-white">237+</span>
                <span className="text-green-400 text-sm">↑ 24% față de 2023</span>
              </div>
              
              {/* Progress bar */}
              <div className="w-full h-1 bg-electric-blue/20 rounded mt-3 overflow-hidden">
                <div className="h-full w-3/4 bg-gradient-to-r from-electric-blue to-hologram-blue"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scrolling Indicator */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center">
        <span className="text-white/50 text-sm font-tech mb-2">Scroll Down</span>
        <div className="w-5 h-10 rounded-full border border-electric-blue/30 flex justify-center pt-2">
          <div className="w-1.5 h-1.5 rounded-full bg-electric-blue animate-bounce"></div>
        </div>
      </div>
      
      {/* Tech corners */}
      <div className="absolute top-5 left-5 w-16 h-16 border-l-2 border-t-2 border-electric-blue/30"></div>
      <div className="absolute top-5 right-5 w-16 h-16 border-r-2 border-t-2 border-electric-blue/30"></div>
      <div className="absolute bottom-5 left-5 w-16 h-16 border-l-2 border-b-2 border-electric-blue/30"></div>
      <div className="absolute bottom-5 right-5 w-16 h-16 border-r-2 border-b-2 border-electric-blue/30"></div>
    </section>
  );
};

export default Hero;
