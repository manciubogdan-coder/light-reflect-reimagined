
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Zap, Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
    
    // Check if this is a direct browser access (not from navigation)
    const isDirectAccess = !document.referrer.includes(window.location.host);
    if (isDirectAccess) {
      // If it's a direct access to a specific path, try to handle common cases
      handleDirectAccess(location.pathname);
    }
  }, [location.pathname]);

  // Handle direct access to URLs
  const handleDirectAccess = (path: string) => {
    // Common path patterns to try to recover from
    if (path.includes('/tools/electrician-quiz')) {
      // For quiz URLs, we need to extract profile parameter if any
      const profileMatch = path.match(/\/tools\/electrician-quiz\/([a-zA-Z0-9_-]+)/);
      if (profileMatch && profileMatch[1]) {
        // Redirect to the correct format with query parameter
        navigate(`/tools/electrician-quiz?profile=${profileMatch[1]}`, { replace: true });
        return;
      }
    }
  };

  // Try to determine if this is an electrician quiz URL
  const isQuizUrl = location.pathname.includes('/tools/electrician-quiz');
  
  const handleReturn = () => {
    // If looks like an electrician quiz link, redirect there
    if (isQuizUrl) {
      navigate('/tools/electrician-quiz');
    } else {
      // Otherwise go back or home
      if (window.history.length > 1) {
        navigate(-1);
      } else {
        navigate('/');
      }
    }
  };

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
          <p className="text-white/60 mb-8">
            {isQuizUrl 
              ? "Link-ul către quiz-ul de electrician este incomplet. Te putem redirecta către quiz."
              : "Pagina pe care încerci să o accesezi nu există în această dimensiune."}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={handleReturn}
              className="electric-button font-tech text-lg tracking-wider inline-block relative overflow-hidden"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              <span>{isQuizUrl ? 'Mergi la quiz' : 'Înapoi'}</span>
            </Button>
            
            <Link to="/" className="electric-button font-tech text-lg tracking-wider inline-block relative overflow-hidden">
              <Home className="mr-2 h-4 w-4" />
              <span className="relative z-10">Pagina principală</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
