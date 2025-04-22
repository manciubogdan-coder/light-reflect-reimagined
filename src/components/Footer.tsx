import { Link } from "react-router-dom";
import { Facebook, Youtube, Mail, Phone, MapPin, Bolt } from "lucide-react";

const Footer = () => {
  return (
    <footer className="pt-16 pb-6 bg-dark-matter relative">
      <div className="circuit-line absolute top-0 w-full"></div>
      
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 flex items-center justify-center relative">
                <Bolt className="text-neon-red w-5 h-5 absolute" />
                <div className="w-full h-full rounded-full border-2 border-neon-red"></div>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-tech font-bold tracking-wider text-white">
                  <span className="text-neon-red">LIGHT</span>REFLECT
                </span>
                <span className="text-xs font-tech tracking-widest text-electric-blue-light">ELECTRICAL</span>
              </div>
            </Link>
            <p className="text-white/60 mb-6">
              Lider în instalații electrice inteligente și soluții Smart Home, 
              oferind servicii de înaltă calitate în România și Europa.
            </p>
            <div className="flex items-center gap-4">
              <SocialLink href="https://www.facebook.com/profile.php?id=61550260625143" icon={<Facebook className="w-4 h-4" />} />
              <SocialLink href="https://www.youtube.com/@lightreflectelectrical" icon={<Youtube className="w-4 h-4" />} />
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-tech font-bold text-white mb-4">Servicii</h3>
            <ul className="space-y-2">
              <FooterLink href="/servicii/tablouri-electrice">Tablouri Electrice Smart</FooterLink>
              <FooterLink href="/servicii/smart-home">Smart Home</FooterLink>
              <FooterLink href="/servicii/panouri-solare">Panouri Solare</FooterLink>
              <FooterLink href="/servicii/sigurante">Siguranțe Automate</FooterLink>
              <FooterLink href="/servicii/iluminat-inteligent">Iluminat Inteligent</FooterLink>
              <FooterLink href="/servicii/proiectare">Proiectare Electrică</FooterLink>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-tech font-bold text-white mb-4">Companie</h3>
            <ul className="space-y-2">
              <FooterLink href="/despre-noi">Despre Noi</FooterLink>
              <FooterLink href="/proiecte">Proiecte</FooterLink>
              <FooterLink href="/franciza">Franciză</FooterLink>
              <FooterLink href="/blog">Blog</FooterLink>
              <FooterLink href="/cariere">Cariere</FooterLink>
              <FooterLink href="/contact">Contact</FooterLink>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-tech font-bold text-white mb-4">Contact</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-electric-blue shrink-0 mt-1" />
                <span className="text-white/70">
                  România, Salonta, Str. Andrei Mureșanu nr. 32
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-electric-blue shrink-0" />
                <a href="tel:0752954772" className="text-white/70 hover:text-white transition-colors duration-300">
                  0752 954 772
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-electric-blue shrink-0" />
                <a href="mailto:manciubogdan999@gmail.com" className="text-white/70 hover:text-white transition-colors duration-300">
                  manciubogdan999@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="circuit-line mb-6"></div>
        
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-white/50 text-sm mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} Light Reflect Electrical. Toate drepturile rezervate.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a href="/termeni-si-conditii" className="text-white/50 text-sm hover:text-white transition-colors duration-300">
              Termeni și Condiții
            </a>
            <a href="/politica-de-confidentialitate" className="text-white/50 text-sm hover:text-white transition-colors duration-300">
              Politica de Confidențialitate
            </a>
            <a href="/cookies" className="text-white/50 text-sm hover:text-white transition-colors duration-300">
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

interface SocialLinkProps {
  href: string;
  icon: React.ReactNode;
}

const SocialLink = ({ href, icon }: SocialLinkProps) => (
  <a 
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="w-8 h-8 rounded-full bg-electric-blue/10 flex items-center justify-center text-electric-blue hover:bg-electric-blue hover:text-white transition-all duration-300"
  >
    {icon}
  </a>
);

interface FooterLinkProps {
  href: string;
  children: React.ReactNode;
}

const FooterLink = ({ href, children }: FooterLinkProps) => (
  <li>
    <Link 
      to={href}
      className="text-white/70 hover:text-white transition-colors duration-300 hover:pl-1 block"
    >
      {children}
    </Link>
  </li>
);

export default Footer;
