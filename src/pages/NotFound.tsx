
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Zap } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-matter relative">
      <div className="absolute inset-0 bg-circuit-pattern opacity-20 z-0" />
      <div className="absolute inset-0 bg-gradient-to-br from-dark-matter/80 via-hologram-blue/10 to-electric-blue/10 opacity-80 z-0" />
      
      <div className="tech-panel p-10 max-w-md w-full relative z-10 animate-pulse">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-hologram-blue/20 flex items-center justify-center">
            <Zap className="text-neon-red w-10 h-10 animate-pulse" />
          </div>
          <h1 className="text-6xl font-tech font-bold mb-4 text-hologram-blue">404</h1>
          <p className="text-xl text-white/80 mb-6">Eroare Temporală Detectată</p>
          <p className="text-white/60 mb-8">Pagina pe care încerci să o accesezi nu există în această dimensiune.</p>
          <Link to="/" className="electric-button font-tech text-lg tracking-wider inline-block relative overflow-hidden">
            <span className="relative z-10">Înapoi la Realitate</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
