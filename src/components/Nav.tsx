import { Link, useLocation } from "react-router-dom";

const Nav = () => {
  const location = useLocation();

  return (
    <nav className="fixed left-0 top-0 w-full z-50 flex items-center justify-between py-3 px-4 bg-dark-matter/90 backdrop-blur md:px-10 border-b border-electric-blue/10">
      <div className="flex items-center gap-3 font-tech text-2xl">
        <Link to="/" className="text-hologram-blue hover:text-electric-blue transition-all duration-200">
          LIGHT<span className="text-neon-red">REFLECT</span>
        </Link>
      </div>
      <div className="flex gap-1 md:gap-6 text-lg font-tech">
        <NavLinkStyled to="/" active={location.pathname === "/"}>Acasă</NavLinkStyled>
        <NavLinkStyled to="/servicii" active={location.pathname.startsWith("/servicii")}>Servicii</NavLinkStyled>
        <NavLinkStyled to="/projects" active={location.pathname === "/projects"}>Proiecte</NavLinkStyled>
        <NavLinkStyled to="/about" active={location.pathname === "/about"}>Despre</NavLinkStyled>
        <NavLinkStyled to="/contact" active={location.pathname === "/contact"}>Contact</NavLinkStyled>
      </div>
      {/* ...poți adăuga alt conținut/sumar utilizator/etc... */}
    </nav>
  );
};

const NavLinkStyled = ({ to, active, children }: { to: string; active: boolean; children: React.ReactNode }) => (
  <Link 
    to={to} 
    className={
      "relative px-3 py-1 rounded transition-all duration-200 hover:bg-electric-blue/10 " +
      (active 
        ? "text-hologram-blue bg-electric-blue/10 after:absolute after:left-0 after:right-0 after:-bottom-1 after:h-0.5 after:bg-hologram-blue after:rounded"
        : "text-white/80"
      )
    }
  >
    {children}
  </Link>
);

export default Nav;
