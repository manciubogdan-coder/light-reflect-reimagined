import { useState } from "react";
import { 
  Lightbulb, 
  Home, 
  Settings,
  Award, // Lucide icon for quality
  Zap
} from "lucide-react";
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import ElectricText from "../components/ElectricText";

const Servicii = () => {
  return (
    <div className="min-h-screen bg-dark-matter overflow-hidden">
      <Nav />
      <section className="py-24 relative min-h-screen">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-circuit-pattern opacity-20 z-0" />
          <div className="absolute inset-0 bg-gradient-to-br from-dark-matter/80 via-hologram-blue/10 to-electric-blue/10 z-0" />
          <div className="circuit-line absolute top-0 w-full"></div>
          <div className="circuit-line absolute bottom-0 w-full"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <ElectricText 
              text="Servicii Instalații Electrice" 
              className="text-3xl md:text-4xl font-tech mb-6 text-hologram-blue"
            />
            <p className="text-white/60 max-w-2xl mx-auto">
              Descoperă gama noastră completă de servicii electrice avansate, proiectate pentru a aduce locuința ta în viitor.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
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
              icon={<Award className="text-yellow-300" />}
              title="Accent pe Calitate"
              description="Folosim doar materiale premium și asigurăm standarde superioare pentru fiecare proiect."
            />
            <ServiceCard 
              icon={<Settings />}
              title="Siguranțe Automate"
              description="Siguranțe electrice cu întrerupere automată în caz de defecte, protejând echipamentele și locuința."
            />
            <ServiceCard 
              icon={<Zap />}
              title="Încărcătoare Vehicule Electrice"
              description="Stații de încărcare pentru vehicule electrice, integrate cu sistemul electric al locuinței."
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

          <div className="tech-panel p-8 max-w-4xl mx-auto hologram backdrop-blur-sm">
            <h3 className="text-2xl font-tech text-hologram-blue mb-4 text-center">
              Procesul Nostru Futurist
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <ProcessStep 
                number="01" 
                title="Analiză & Design" 
                description="Evaluăm nevoile și proiectăm sistemul electric ideal pentru casa ta."
              />
              <ProcessStep 
                number="02" 
                title="Implementare" 
                description="Instalăm toate componentele utilizând tehnologie de ultimă generație."
              />
              <ProcessStep 
                number="03" 
                title="Monitorizare" 
                description="Configurăm și testăm toate sistemele pentru performanță optimă."
              />
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
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

interface ProcessStepProps {
  number: string;
  title: string;
  description: string;
}

const ProcessStep = ({ number, title, description }: ProcessStepProps) => (
  <div className="flex flex-col items-center text-center">
    <div className="w-16 h-16 rounded-full flex items-center justify-center bg-hologram-blue/20 mb-4 relative">
      <span className="text-2xl font-tech text-hologram-blue">{number}</span>
      <div className="absolute -inset-1 rounded-full border border-hologram-blue/40 animate-pulse"></div>
    </div>
    <h4 className="text-xl font-tech text-white mb-2">{title}</h4>
    <p className="text-white/60">{description}</p>
  </div>
);

export default Servicii;
