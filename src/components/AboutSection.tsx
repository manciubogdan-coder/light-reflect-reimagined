
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
const AboutSection = () => {
  return <section className="py-24 relative bg-circuit-pattern bg-cover bg-fixed bg-no-repeat bg-center before:absolute before:inset-0 before:bg-dark-matter/80">
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h4 className="text-electric-blue font-tech text-xl mb-3">
              <span className="inline-block w-10 h-px bg-electric-blue mr-2"></span>
              Despre Noi
            </h4>
            <h2 className="text-3xl md:text-4xl font-tech font-bold mb-6">
              Light Reflect <span className="text-neon-red">Electrical</span>
            </h2>
            
            <p className="text-white/70 mb-6">
              Avem o experiență solidă în domeniu și am dezvoltat sisteme inovatoare 
              care redefinesc standardele de confort și eficiență energetică în România și Europa.
            </p>
            
            <div className="tech-border p-4 mb-6">
              <p className="text-electric-blue font-tech text-lg">
                Capacitate de mobilizare prin rețeaua proprie de electricieni certificați
              </p>
            </div>

            {/* Efficiency Comparison Table */}
            <div className="mb-8">
              <h3 className="text-2xl md:text-3xl font-tech font-bold mb-6 text-white">
                Eficiență în <span className="text-electric-blue">Cifre</span>
              </h3>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-white/20">
                      <th className="py-3 pr-4 text-white/60 font-tech text-sm">Etapa Proiectului</th>
                      <th className="py-3 px-4 text-white/60 font-tech text-sm text-center">Metoda Clasică</th>
                      <th className="py-3 pl-4 text-electric-blue font-tech text-sm text-center">Metoda Light Reflect</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-white/10">
                      <td className="py-4 pr-4 text-white/80 text-sm">Trasare & canelare</td>
                      <td className="py-4 px-4 text-white/60 text-center font-tech">4-5 zile</td>
                      <td className="py-4 pl-4 text-electric-blue text-center font-tech font-bold">2 zile</td>
                    </tr>
                    <tr className="border-b border-white/10">
                      <td className="py-4 pr-4 text-white/80 text-sm">Cablare & infrastructură</td>
                      <td className="py-4 px-4 text-white/60 text-center font-tech">6-7 zile</td>
                      <td className="py-4 pl-4 text-electric-blue text-center font-tech font-bold">3 zile</td>
                    </tr>
                    <tr className="border-b border-white/10">
                      <td className="py-4 pr-4 text-white/80 text-sm">Montaj aparataj & tablou</td>
                      <td className="py-4 px-4 text-white/60 text-center font-tech">3-4 zile</td>
                      <td className="py-4 pl-4 text-center">
                        <span className="text-electric-blue font-tech font-bold">2 zile</span>
                        <p className="text-electric-blue/70 text-xs mt-1">Proiectare prealabilă în Planner5D inclusă.</p>
                      </td>
                    </tr>
                    <tr className="bg-electric-blue/10 rounded-lg">
                      <td className="py-4 pr-4 text-white font-tech font-bold text-sm">TOTAL TIMP EXECUȚIE</td>
                      <td className="py-4 px-4 text-white/60 text-center font-tech">13-16 zile</td>
                      <td className="py-4 pl-4 text-electric-blue text-center font-tech font-bold text-xl">7 zile</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            
            <Link to="/despre-noi" className="font-tech text-electric-blue group flex items-center gap-2">
              <span>Află mai multe despre noi</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </div>
          
          <div className="tech-panel relative overflow-visible">
            <div className="absolute -top-4 -left-4 w-24 h-24 rounded-full bg-electric-blue/5 border border-electric-blue/20"></div>
            <div className="absolute -bottom-8 -right-8 w-32 h-32 rounded-full bg-neon-red/5 border border-neon-red/20"></div>
            
            {/* Mission & Vision */}
            <div className="mb-6 relative z-10">
              <h3 className="text-2xl font-tech font-bold mb-3 text-white">Misiunea Noastră</h3>
              <p className="text-white/70">
                Să transformăm modul în care oamenii interacționează cu energia electrică, 
                oferind soluții inteligente și accesibile pentru o lume mai sustenabilă.
              </p>
            </div>
            
            {/* Values */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ValueCard title="Inovație Continuă" description="Investim constant în cercetare pentru a dezvolta soluții de ultimă generație." />
              <ValueCard title="Excelență Tehnică" description="Fiecare instalație este realizată la cele mai înalte standarde de calitate." />
              <ValueCard title="Sustenabilitate" description="Promovăm tehnologii cu impact redus asupra mediului și consum eficient." />
              <ValueCard title="Centrare pe Client" description="Adaptăm fiecare soluție la nevoile și preferințele specifice ale clienților." />
            </div>
          </div>
        </div>
      </div>
    </section>;
};
interface StatProps {
  value: string;
  label: string;
}
const Stat = ({
  value,
  label
}: StatProps) => <div className="tech-border p-4">
    <div className="text-2xl md:text-3xl font-tech font-bold text-electric-blue mb-1">{value}</div>
    <div className="text-white/60 text-sm">{label}</div>
  </div>;
interface ValueCardProps {
  title: string;
  description: string;
}
const ValueCard = ({
  title,
  description
}: ValueCardProps) => <div className="tech-border p-4 hover:bg-electric-blue/5 transition-colors duration-300">
    <h4 className="font-tech text-white mb-2">{title}</h4>
    <p className="text-white/60 text-sm">{description}</p>
  </div>;
export default AboutSection;
