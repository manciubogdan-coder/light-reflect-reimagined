
import ElectricText from "../components/ElectricText";
import { Atom, Layers2, Zap } from "lucide-react";
import Nav from "../components/Nav";
import Footer from "../components/Footer";

const coreFacts = [
  "Peste 15 ani experiență în tehnologii avansate",
  "Integrare totală cu sisteme smart home și AI",
  "Echipamente certificate pentru viitorul energiei",
  "Proiecte complet monitorizate digital - 100%"
]

const About = () => {
  return (
    <div className="min-h-screen bg-dark-matter overflow-hidden">
      <Nav />
      <section className="relative py-24 min-h-[80vh] flex flex-col items-center justify-center">
        <div className="absolute inset-0 bg-circuit-pattern opacity-30 z-0" />
        <div className="relative z-10 max-w-3xl w-full tech-panel hologram backdrop-blur-lg p-10 shadow-2xl animate-scale-in">
          <div className="flex flex-col items-center gap-3 mb-8">
            <ElectricText text="Despre Light Reflect" delay={400} className="text-3xl md:text-4xl font-tech text-hologram-blue mb-2" />
            <span className="text-white/70 text-lg text-center max-w-lg">
              Lider europen în instalații electrice ultra-moderne, cu accent pe inovație pură și eficiență energetică pentru generațiile viitoare.
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
            <div className="flex flex-col gap-5">
              {coreFacts.map((fact, idx) => (
                <div key={idx} className="flex items-center gap-4">
                  <span className="w-10 h-10 flex items-center justify-center rounded-full bg-hologram-blue/20 animate-float">
                    {idx % 2 === 0 ? <Layers2 className="text-hologram-blue" /> : <Atom className="text-electric-blue" />}
                  </span>
                  <span className="font-tech text-white text-lg">{fact}</span>
                </div>
              ))}
            </div>
            <div className="flex flex-col justify-center text-center p-4 rounded-xl bg-electric-blue/20 border border-hologram-blue/40 shadow-lg animate-fade-in">
              <Zap className="w-12 h-12 mx-auto text-neon-red animate-bounce mb-3"/>
              <h4 className="font-tech text-xl text-hologram-blue mb-2">Viziunea noastră</h4>
              <p className="text-white/80">
                Construim infrastructura electrică a viitorului, unde inovația și siguranța nu sunt opțiuni, ci standarde.
              </p>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default About;
