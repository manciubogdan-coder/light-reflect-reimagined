
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Bolt, ArrowRight } from "lucide-react";
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
    <section className="relative min-h-screen flex items-center pt-20">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-grid-lines bg-[size:50px_50px] opacity-20"></div>
        
        {/* Vertical Lines */}
        <div className="absolute top-0 left-1/4 w-px h-full bg-electric-blue/10"></div>
        <div className="absolute top-0 left-1/2 w-px h-full bg-electric-blue/10"></div>
        <div className="absolute top-0 left-3/4 w-px h-full bg-electric-blue/10"></div>
        
        {/* Animated Particles */}
        <div className="absolute top-1/4 left-1/4 w-2 h-2 rounded-full bg-electric-blue animate-pulse"></div>
        <div className="absolute top-3/4 left-1/2 w-3 h-3 rounded-full bg-hologram-blue animate-float"></div>
        <div className="absolute top-1/3 left-3/4 w-2 h-2 rounded-full bg-neon-red animate-pulse"></div>
      </div>

      <div className="container mx-auto px-4 flex flex-col lg:flex-row items-center gap-12 z-10">
        <div 
          className={`w-full lg:w-1/2 transform transition-all duration-1000 ${
            isLoaded ? "translate-x-0 opacity-100" : "-translate-x-20 opacity-0"
          }`}
        >
          <h4 className="text-electric-blue font-tech text-xl mb-3">
            <span className="inline-block w-10 h-px bg-electric-blue mr-2"></span>
            Smart Energy. Smart Future.
          </h4>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-tech font-bold mb-6">
            Viitorul <span className="text-neon-red">Electric</span> Începe Acum
          </h1>
          <ElectricText 
            text="Aducem lumină în casa ta"
            className="text-xl md:text-2xl font-tech text-white/80 mb-8"
            delay={1000}
          />
          <p className="text-white/60 mb-8 max-w-xl">
            Light Reflect Electrical este liderul european în tehnologia instalațiilor electrice 
            inteligente. Folosim tehnologie avansată pentru a aduce soluții smart în casa ta.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <HolographicButton to="/contact">
              Solicită o ofertă inteligentă
            </HolographicButton>
            <Link to="/servicii" className="tech-border py-3 px-6 text-center font-tech uppercase tracking-wider text-white hover:bg-electric-blue/10 transition-all duration-300">
              Descoperă Serviciile
            </Link>
          </div>
        </div>
        
        <div 
          className={`w-full lg:w-1/2 transition-all duration-1000 delay-300 ${
            isLoaded ? "translate-x-0 opacity-100" : "translate-x-20 opacity-0"
          }`}
        >
          <div className="relative">
            {/* Electrician Image */}
            <div className="relative z-10 tech-border p-2 bg-dark-matter/50 rounded-lg animate-float">
              <img 
                src="/public/lovable-uploads/9081ef31-81b5-4f9b-9248-872b2d6d6389.png" 
                alt="Light Reflect Electrician" 
                className="rounded-lg"
              />
              
              {/* Pulse Effect Around Image */}
              <div className="absolute -inset-1 rounded-lg border border-electric-blue/30 animate-pulse-glow"></div>
              
              {/* Decorative Elements */}
              <div className="absolute -top-10 -right-10 w-20 h-20 bg-electric-blue/5 rounded-full backdrop-blur-sm border border-electric-blue/20"></div>
              <div className="absolute -bottom-5 -left-5 w-10 h-10 bg-neon-red/10 rounded-full backdrop-blur-sm border border-neon-red/20"></div>
            </div>
            
            {/* Stats Card */}
            <div className="absolute bottom-4 right-4 tech-panel z-20 translate-y-16 md:translate-y-0 md:-right-10 w-64 animate-scale-in">
              <div className="flex justify-between items-center mb-3">
                <h5 className="font-tech text-electric-blue">Proiecte Realizate</h5>
                <Bolt className="w-5 h-5 text-neon-red" />
              </div>
              <div className="flex items-end gap-2">
                <span className="text-3xl font-tech text-white">237+</span>
                <span className="text-green-400 text-sm">↑ 24% față de 2023</span>
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
    </section>
  );
};

export default Hero;
