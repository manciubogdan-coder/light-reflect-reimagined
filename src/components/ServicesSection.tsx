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
            icon={<Home />}
            title="Smart Home"
            description="Sisteme complete de automatizare a locuinței, controlabile prin smartphone sau voce."
          />
          <ServiceCard 
            icon={<Bolt />}
            title="Panouri Solare"
            description="Soluții de energie regenerabilă cu panouri fotovoltaice de ultimă generație."
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

        <div className="mt-16 tech-panel max-w-4xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-8">
            <div className="w-full lg:w-1/2">
              <h3 className="text-2xl font-tech font-bold mb-4">
                Soluții Smart Complete
              </h3>
              <p className="text-white/60 mb-4">
                Pachetele noastre integrează toate sistemele electrice într-o singură interfață ușor de utilizat, oferind control total și monitorizare în timp real.
              </p>
              <ul className="space-y-2">
                <Feature>Control de la distanță prin aplicație mobilă</Feature>
                <Feature>Monitorizare în timp real a consumului energetic</Feature>
                <Feature>Integrare cu asistenți vocali (Google, Alexa, Siri)</Feature>
                <Feature>Alertare în caz de anomalii sau defecțiuni</Feature>
              </ul>
            </div>
            <div className="w-full lg:w-1/2 tech-border p-4 hologram">
              <div className="aspect-video relative overflow-hidden rounded">
                <MonitorSmartphone className="absolute inset-0 text-electric-blue w-full h-full p-10 opacity-20" />
                <div className="absolute inset-0 bg-circuit-blue/20 backdrop-blur-sm"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <Bolt className="w-16 h-16 text-hologram-blue mx-auto mb-4 animate-pulse" />
                    <h4 className="text-hologram-blue font-tech text-xl">Smart Control Panel</h4>
                    <p className="text-white/80 mt-2">Tot controlul într-un singur loc</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
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
