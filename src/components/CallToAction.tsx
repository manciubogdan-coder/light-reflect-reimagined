
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const CallToAction = () => {
  return (
    <section className="py-24 relative">
      <div className="absolute inset-0 overflow-hidden">
        <div className="circuit-line absolute top-0 w-full"></div>
        <div className="circuit-line absolute bottom-0 w-full"></div>
      </div>

      <div className="container mx-auto px-4">
        <div className="tech-panel max-w-5xl mx-auto relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-electric-blue/5 blur-3xl"></div>
          <div className="absolute -bottom-16 -left-16 w-64 h-64 rounded-full bg-neon-red/5 blur-3xl"></div>
          
          <div className="relative z-10 flex flex-col lg:flex-row items-center gap-8 py-8">
            <div className="w-full lg:w-2/3">
              <h4 className="text-electric-blue font-tech text-xl mb-3">
                <span className="inline-block w-10 h-px bg-electric-blue mr-2"></span>
                Join Light Reflect Network
              </h4>
              <h2 className="text-3xl md:text-4xl font-tech font-bold mb-4">
                Devino Parte din <span className="text-neon-red">Franciză</span>
              </h2>
              <p className="text-white/70 mb-6">
                Extinde-ți afacerea cu Light Reflect Electrical! Oferim un model de franciză 
                scalabil, cu instruire completă și acces la tehnologii de vârf în domeniul 
                instalațiilor electrice inteligente.
              </p>
              <ul className="space-y-3 mb-6">
                <BenefitItem>Formare tehnică avansată și certificare</BenefitItem>
                <BenefitItem>Acces la furnizori premium și prețuri competitive</BenefitItem>
                <BenefitItem>Sistem de management al clienților și proiectelor</BenefitItem>
                <BenefitItem>Suport continuu și actualizări tehnologice</BenefitItem>
              </ul>
            </div>
            
            <div className="w-full lg:w-1/3 bg-electric-blue/10 p-6 rounded-lg border border-electric-blue/30">
              <h3 className="text-2xl font-tech font-bold text-white mb-4 text-center">
                Contactează-ne Acum
              </h3>
              <p className="text-white/70 text-center mb-6">
                Programează o întâlnire pentru a discuta oportunitatea de franciză și pentru a primi 
                documentația completă.
              </p>
              <Link 
                to="/franciza" 
                className="electric-button w-full flex items-center justify-center gap-2"
              >
                <span>Află mai multe</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const BenefitItem = ({ children }: { children: React.ReactNode }) => (
  <li className="flex items-start gap-3">
    <div className="w-5 h-5 rounded-full bg-electric-blue/20 flex items-center justify-center mt-1">
      <div className="w-2 h-2 rounded-full bg-electric-blue"></div>
    </div>
    <span className="text-white/80">{children}</span>
  </li>
);

export default CallToAction;
