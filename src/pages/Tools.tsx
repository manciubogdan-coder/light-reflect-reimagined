
import React from "react";
import { Link } from "react-router-dom";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Calculator, Zap, Lightbulb, Gauge, CircuitBoard, UserCheck } from "lucide-react";

const Tools = () => (
  <div className="min-h-screen bg-dark-matter flex flex-col">
    <Nav />
    <main className="flex-1 container mx-auto px-4 py-16">
      <div className="mb-12 text-center">
        <h1 className="font-tech text-3xl md:text-4xl lg:text-5xl text-electric-blue mb-4">
          Instrumente <span className="text-neon-red">Tehnice</span>
        </h1>
        <p className="text-white/80 max-w-2xl mx-auto">
          Calculatoare și instrumente interactive pentru profesioniștii din industria electrică
          și pentru amatorii care doresc să-și aprofundeze cunoștințele.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <ToolCard
          icon={<Calculator className="h-8 w-8 text-electric-blue" />}
          title="Calculator Dimensionare Cabluri"
          description="Calculează secțiunea optimă a cablurilor electrice în funcție de curent, lungime și instalare."
          link="/tools/cable-calculator"
        />
        
        <ToolCard
          icon={<Zap className="h-8 w-8 text-electric-blue" />}
          title="Calculator Putere Electrică"
          description="Determină puterea electrică necesară pentru diferite aplicații și instalații."
          link="/tools/power-calculator"
        />
        
        <ToolCard
          icon={<Lightbulb className="h-8 w-8 text-electric-blue" />}
          title="Calculator Iluminat"
          description="Află numărul și tipul corpurilor de iluminat necesare pentru diverse spații."
          link="/tools/lighting-calculator"
        />
        
        <ToolCard
          icon={<Gauge className="h-8 w-8 text-electric-blue" />}
          title="Calculator Eficiență Energetică"
          description="Estimează consumul electric și potențialul de economisire pentru diferite echipamente."
          link="/tools/energy-efficiency"
        />
        
        <ToolCard
          icon={<CircuitBoard className="h-8 w-8 text-electric-blue" />}
          title="Calculator Curent de Scurtcircuit"
          description="Determină curentul de scurtcircuit în instalațiile electrice și protecțiile necesare."
          link="/tools/short-circuit-calculator"
        />
        
        <ToolCard
          icon={<UserCheck className="h-8 w-8 text-electric-blue" />}
          title="Quiz: Ce Tip de Electrician Ești?"
          description="Descoperă-ți profilul profesional prin acest quiz interactiv cu 10 întrebări."
          link="/tools/electrician-quiz"
          highlighted={true}
        />
      </div>
    </main>
    <Footer />
  </div>
);

interface ToolCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  link: string;
  highlighted?: boolean;
}

const ToolCard = ({ icon, title, description, link, highlighted = false }: ToolCardProps) => (
  <Card className={`bg-dark-matter/50 border border-electric-blue/30 hover:border-electric-blue/60 transition-all ${
    highlighted ? 'ring-2 ring-electric-blue ring-opacity-30' : ''
  }`}>
    <CardHeader>
      <div className="mb-4">{icon}</div>
      <CardTitle className="font-tech text-white text-xl">{title}</CardTitle>
      <CardDescription className="text-white/60">{description}</CardDescription>
    </CardHeader>
    <CardFooter>
      <Link
        to={link}
        className="group w-full flex items-center justify-between text-electric-blue hover:text-electric-blue/80 transition-colors"
      >
        <span>Deschide instrumentul</span>
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
      </Link>
    </CardFooter>
  </Card>
);

export default Tools;
