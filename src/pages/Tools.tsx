
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { Calculator, Cable, Grid2X2, Settings } from "lucide-react";
import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const Tools = () => {
  const tools = [
    {
      id: "cable-calculator",
      title: "Calculator Secțiune Cablu Electric",
      description: "Calculează rapid secțiunea optimă pentru cablurile tale electrice",
      icon: <Cable className="w-12 h-12 text-hologram-blue" />,
      link: "/tools/cable-calculator"
    },
    {
      id: "power-calculator",
      title: "Calculator Putere Electrică",
      description: "Estimează necesarul de putere pentru instalațiile electrice",
      icon: <Calculator className="w-12 h-12 text-hologram-blue" />,
      link: "/tools/power-calculator",
      comingSoon: false // Changed from true
    },
    {
      id: "lighting-calculator",
      title: "Calculator Iluminat",
      description: "Determină necesarul de corpuri de iluminat pentru spațiul tău",
      icon: <Grid2X2 className="w-12 h-12 text-hologram-blue" />,
      comingSoon: true
    },
    {
      id: "energy-efficiency",
      title: "Eficiență Energetică",
      description: "Calculează economia și perioada de amortizare pentru soluțiile LED",
      icon: <Settings className="w-12 h-12 text-hologram-blue" />,
      comingSoon: true
    }
  ];

  return (
    <div className="min-h-screen bg-dark-matter flex flex-col">
      <Nav />
      <main className="flex-1 container mx-auto px-4 py-16">
        <div className="mb-12 text-center">
          <h1 className="font-tech text-3xl md:text-4xl text-hologram-blue mb-4 flex items-center justify-center gap-3">
            <Calculator className="w-8 h-8" />
            Light Reflect Tools
          </h1>
          <p className="text-white/80 max-w-2xl mx-auto">
            Suite de instrumente profesionale pentru calcule electrice dezvoltate
            de experții Light Reflect pentru a vă ajuta în proiectele dumneavoastră.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((tool) => (
            <Card key={tool.id} className="bg-dark-matter border-electric-blue/30 hover:border-electric-blue/60 transition-all duration-300 overflow-hidden relative tech-border">
              <CardHeader className="pb-2">
                <div className="mb-4 flex justify-center">{tool.icon}</div>
                <CardTitle className="text-hologram-blue text-xl font-tech text-center">{tool.title}</CardTitle>
                <CardDescription className="text-white/70 text-center">{tool.description}</CardDescription>
              </CardHeader>
              <CardFooter className="pt-4 flex justify-center">
                {tool.comingSoon ? (
                  <Button variant="outline" disabled className="w-full">
                    În curând
                  </Button>
                ) : (
                  <Button variant="outline" asChild className="w-full z-20 relative">
                    <Link to={tool.link}>Accesează</Link>
                  </Button>
                )}
              </CardFooter>
              <div className="absolute bottom-0 left-0 w-full h-1 overflow-hidden">
                <div className="h-full w-full bg-gradient-to-r from-transparent via-hologram-blue to-transparent animate-circuit-flow"></div>
              </div>
            </Card>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Tools;
