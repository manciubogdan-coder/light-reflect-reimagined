
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";

const Nav = () => {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  
  // Track scroll for navbar background change
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav 
      className={`fixed left-0 top-0 w-full z-50 transition-all duration-500 ${
        scrolled 
          ? 'py-2 backdrop-blur-xl bg-dark-matter/80 border-b border-electric-blue/20' 
          : 'py-4 bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 flex items-center justify-between relative">
        {/* Logo */}
        <Link 
          to="/" 
          className="font-tech text-2xl group relative overflow-hidden cyber-scan"
          data-text="LIGHTREFLECT"
        >
          <span className="text-hologram-blue transition-colors duration-300 group-hover:text-electric-blue">
            LIGHT<span className="text-neon-red">REFLECT</span>
          </span>
          <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-electric-blue to-transparent transform scale-x-0 transition-transform duration-300 group-hover:scale-x-100"></span>
        </Link>
        
        {/* Mobile Toggle */}
        <button 
          className="block md:hidden text-white p-2 rounded-md"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        
        {/* Desktop Menu */}
        <div className="hidden md:flex gap-1 md:gap-6 text-lg font-tech">
          <NavLinkStyled to="/" active={location.pathname === "/"}>Acasă</NavLinkStyled>
          <NavLinkStyled to="/servicii" active={location.pathname.startsWith("/servicii")}>Servicii</NavLinkStyled>
          <NavLinkStyled to="/projects" active={location.pathname === "/projects"}>Proiecte</NavLinkStyled>
          <NavLinkStyled to="/about" active={location.pathname === "/about"}>Despre</NavLinkStyled>
          <NavLinkStyled to="/contact" active={location.pathname === "/contact"}>Contact</NavLinkStyled>
        </div>
        
        {/* Mobile Menu */}
        <div 
          className={`absolute top-full left-0 w-full glass-panel md:hidden transform transition-transform duration-300 ease-in-out ${
            menuOpen ? 'translate-y-0 opacity-100' : '-translate-y-10 opacity-0 pointer-events-none'
          }`}
        >
          <div className="py-4 px-6 flex flex-col gap-4">
            <MobileNavLink to="/" active={location.pathname === "/"} onClick={() => setMenuOpen(false)}>Acasă</MobileNavLink>
            <MobileNavLink to="/servicii" active={location.pathname.startsWith("/servicii")} onClick={() => setMenuOpen(false)}>Servicii</MobileNavLink>
            <MobileNavLink to="/projects" active={location.pathname === "/projects"} onClick={() => setMenuOpen(false)}>Proiecte</MobileNavLink>
            <MobileNavLink to="/about" active={location.pathname === "/about"} onClick={() => setMenuOpen(false)}>Despre</MobileNavLink>
            <MobileNavLink to="/contact" active={location.pathname === "/contact"} onClick={() => setMenuOpen(false)}>Contact</MobileNavLink>
          </div>
        </div>
      </div>
      
      {/* Scanner beam - horizontal line that moves up and down under the nav */}
      <div className="absolute bottom-0 left-0 w-full h-px overflow-hidden">
        <div className="h-full w-full bg-gradient-to-r from-transparent via-hologram-blue to-transparent animate-circuit-flow" style={{ backgroundSize: '200% 100%' }}></div>
      </div>
    </nav>
  );
};

const NavLinkStyled = ({ to, active, children }: { to: string; active: boolean; children: React.ReactNode }) => (
  <Link 
    to={to} 
    className={`
      relative px-3 py-1 rounded transition-all duration-300 overflow-hidden
      before:content-[''] before:absolute before:inset-0 before:bg-electric-blue/0 before:transition-all before:duration-300
      hover:before:bg-electric-blue/10
      ${active 
        ? "text-hologram-blue after:absolute after:left-0 after:right-0 after:-bottom-1 after:h-0.5 after:bg-hologram-blue after:rounded neon-glow" 
        : "text-white/80"
      }
    `}
  >
    <span className="relative z-10">{children}</span>
  </Link>
);

const MobileNavLink = ({ to, active, children, onClick }: { to: string; active: boolean; children: React.ReactNode; onClick: () => void }) => (
  <Link 
    to={to} 
    onClick={onClick}
    className={`
      py-2 px-4 w-full block transition-all duration-300
      ${active 
        ? "bg-electric-blue/10 text-hologram-blue border-l-2 border-hologram-blue pl-4" 
        : "text-white/80 hover:bg-electric-blue/5 hover:pl-6"
      }
    `}
  >
    {children}
  </Link>
);

export default Nav;
