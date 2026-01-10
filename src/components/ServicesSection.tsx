import { useState } from "react";
import { 
  Lightbulb, 
  Home, 
  Bolt, 
  Settings,
  MonitorSmartphone
} from "lucide-react";

const ServicesSection = () => {
  return (
    <section className="py-24 relative">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="circuit-line absolute top-0 w-full"></div>
        <div className="circuit-line absolute bottom-0 w-full"></div>
      </div>

      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h4 className="text-electric-blue font-tech text-xl mb-3">
            <span className="inline-block w-10 h-px bg-electric-blue mr-2"></span>
            Servicii Inteligente
            <span className="inline-block w-10 h-px bg-electric-blue ml-2"></span>
          </h4>
          <h2 className="text-3xl md:text-4xl font-tech font-bold mb-4">
            Tehnologie <span className="text-neon-red">Avansată</span> Pentru Casa Ta
          </h2>
          <p className="text-white/60 max-w-2xl mx-auto">
            Oferim o gamă completă de servicii de instalații electrice inteligente, 
            proiectate pentru a aduce eficiență, siguranță și confort în casa ta.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <ServiceCard 
            icon={<Lightbulb />}
            title="Tablouri Electrice Smart"
            description="Tablouri electrice cu monitorizare în timp real a consumului și protecție avansată împotriva suprasarcinilor."
          />
          <ServiceCard 
            icon={<Settings />}
            title="Siguranțe Automate"
            description="Siguranțe electrice cu întrerupere automată în caz de defecte, protejând echipamentele și locuința."
          />
          <ServiceCard 
            icon={<Settings />}
            title="Montaj Linii Industriale de Ambalat"
            description="Instalare și punere în funcțiune a liniilor industriale de ambalat pentru diverse domenii de producție."
          />
          <ServiceCard 
            icon={<Settings />}
            title="Mentenanță Utilaje de Ambalat & Industriale"
            description="Servicii de mentenanță și reparații pentru utilaje de ambalat și echipamente industriale."
          />
        </div>

      </div>
    </section>
  );
};

interface ServiceCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const ServiceCard = ({ icon, title, description }: ServiceCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="tech-panel hoverable-card group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="w-14 h-14 rounded-full bg-electric-blue/10 flex items-center justify-center mb-4 group-hover:bg-electric-blue/20 transition-all duration-300">
        <div className={`text-electric-blue transition-transform duration-300 ${isHovered ? 'scale-110' : ''}`}>
          {icon}
        </div>
      </div>
      <h3 className="text-xl font-tech font-bold mb-3 group-hover:text-electric-blue transition-colors duration-300">
        {title}
      </h3>
      <p className="text-white/60 group-hover:text-white/80 transition-colors duration-300">
        {description}
      </p>
    </div>
  );
};

const Feature = ({ children }: { children: React.ReactNode }) => (
  <li className="flex items-center gap-2">
    <div className="w-5 h-5 rounded-full bg-electric-blue/20 flex items-center justify-center">
      <div className="w-2 h-2 rounded-full bg-electric-blue"></div>
    </div>
    <span className="text-white/80">{children}</span>
  </li>
);

export default ServicesSection;
