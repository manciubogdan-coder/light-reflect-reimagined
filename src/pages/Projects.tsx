
import { Hexagon } from "lucide-react";
import ElectricText from "../components/ElectricText";

const projects = [
  {
    title: "Casa Viitorului 3.0",
    desc: "Soluție completă smart home, monitorizare A.I., integrare energie solară.",
    year: "2024",
    tech: ["Automatizări", "AI", "Panouri Solare"]
  },
  {
    title: "Smart Factory",
    desc: "Instalație electrică industrială, control digital, zero downtime.",
    year: "2023",
    tech: ["Fabricație", "Monitorizare Digitală", "Securitate"]
  },
  {
    title: "Proiect Urban LightGrid",
    desc: "Rețea de iluminat public cu control wireless și senzoristică avansată.",
    year: "2024",
    tech: ["IoT", "Wireless", "Senzori"]
  }
];

const Projects = () => (
  <section className="relative min-h-[80vh] flex flex-col justify-center py-24">
    <div className="absolute inset-0 bg-gradient-to-br from-dark-matter/80 via-hologram-blue/10 to-electric-blue/10 opacity-80 z-0" />
    <div className="container mx-auto px-4 z-10 relative">
      <ElectricText text="Proiecte din viitor" className="text-3xl md:text-4xl font-tech text-hologram-blue mb-12 text-center" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.map((p, i) => (
          <div key={i} className="tech-panel p-6 glass morphism-hover transition hover:scale-105 hover:shadow-[0_0_40px_10px_rgba(0,119,255,0.2)] flex flex-col items-center relative">
            <Hexagon className="w-12 h-12 mb-4 text-hologram-blue animate-float"/>
            <h3 className="font-tech text-xl text-white mb-2">{p.title}</h3>
            <p className="text-white/70 mb-4 text-center">{p.desc}</p>
            <div className="flex flex-wrap gap-2 mb-2">
              {p.tech.map((t, idx) => (
                <span className="text-xs px-3 py-1 bg-electric-blue/20 text-hologram-blue rounded-full font-tech" key={idx}>{t}</span>
              ))}
            </div>
            <span className="absolute top-4 right-4 font-tech text-hologram-blue/60 text-sm">{p.year}</span>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default Projects;
