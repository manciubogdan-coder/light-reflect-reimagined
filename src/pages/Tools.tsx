
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import CableCalculator from "@/components/tools/CableCalculator";
import { Calculator } from "lucide-react";

const Tools = () => {
  return (
    <div className="min-h-screen bg-dark-matter flex flex-col">
      <Nav />
      <main className="flex-1 container mx-auto px-4 py-16">
        <div className="mb-12 text-center">
          <h1 className="font-tech text-3xl md:text-4xl text-hologram-blue mb-4 flex items-center justify-center gap-3">
            <Calculator className="w-8 h-8" />
            Light Reflect Tools
          </h1>
          <p className="text-white/80">
            Suite de instrumente profesionale pentru calcule electrice
          </p>
        </div>
        <CableCalculator />
      </main>
      <Footer />
    </div>
  );
};

export default Tools;
