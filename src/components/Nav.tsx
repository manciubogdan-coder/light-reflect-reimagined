
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Bolt, Menu, X } from "lucide-react";

const Nav = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <nav 
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled 
          ? "py-2 bg-dark-matter/90 backdrop-blur-md border-b border-electric-blue/20" 
          : "py-5 bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-10 h-10 flex items-center justify-center relative">
            <Bolt className="text-neon-red w-6 h-6 absolute animate-pulse" />
            <div className="w-full h-full rounded-full border-2 border-neon-red animate-pulse-glow"></div>
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-tech font-bold tracking-wider text-white">
              <span className="text-neon-red">LIGHT</span>REFLECT
            </span>
            <span className="text-xs font-tech tracking-widest text-electric-blue-light">ELECTRICAL</span>
          </div>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          <NavLink href="/">Acasă</NavLink>
          <NavLink href="/servicii">Servicii</NavLink>
          <NavLink href="/despre-noi">Despre Noi</NavLink>
          <NavLink href="/proiecte">Proiecte</NavLink>
          <NavLink href="/franciza">Franciză</NavLink>
          <NavLink href="/blog">Blog</NavLink>
          <Link to="/contact" className="electric-button">
            Contact
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className="md:hidden text-white p-2"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-dark-matter/95 backdrop-blur-lg border-b border-electric-blue/20">
          <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
            <MobileNavLink href="/" onClick={() => setIsMobileMenuOpen(false)}>Acasă</MobileNavLink>
            <MobileNavLink href="/servicii" onClick={() => setIsMobileMenuOpen(false)}>Servicii</MobileNavLink>
            <MobileNavLink href="/despre-noi" onClick={() => setIsMobileMenuOpen(false)}>Despre Noi</MobileNavLink>
            <MobileNavLink href="/proiecte" onClick={() => setIsMobileMenuOpen(false)}>Proiecte</MobileNavLink>
            <MobileNavLink href="/franciza" onClick={() => setIsMobileMenuOpen(false)}>Franciză</MobileNavLink>
            <MobileNavLink href="/blog" onClick={() => setIsMobileMenuOpen(false)}>Blog</MobileNavLink>
            <Link 
              to="/contact" 
              className="electric-button w-full text-center mt-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Contact
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => {
  return (
    <Link 
      to={href} 
      className="text-white font-tech text-sm tracking-wider relative group"
    >
      <span>{children}</span>
      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-electric-blue group-hover:w-full transition-all duration-300"></span>
    </Link>
  );
};

const MobileNavLink = ({ 
  href, 
  children, 
  onClick 
}: { 
  href: string; 
  children: React.ReactNode; 
  onClick: () => void 
}) => {
  return (
    <Link 
      to={href} 
      className="text-white font-tech text-base tracking-wider py-2 border-b border-electric-blue/10 w-full block"
      onClick={onClick}
    >
      {children}
    </Link>
  );
};

export default Nav;
