
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { Info } from "lucide-react";

const DespreNoi = () => (
  <div className="min-h-screen bg-dark-matter flex flex-col">
    <Nav />
    <main className="flex-1 flex items-center justify-center py-16">
      <div className="max-w-2xl w-full tech-panel hologram p-8 text-center">
        <Info className="mx-auto mb-4 text-hologram-blue w-10 h-10" />
        <h1 className="font-tech text-3xl md:text-4xl text-hologram-blue mb-4">Despre Noi</h1>
        <p className="text-white/80 mb-3">
          Light Reflect Electrical – Echipa de profesioniști care aduce standarde superioare în instalații electrice, cu experiență vastă în domeniu și sute de proiecte realizate cu succes.
        </p>
        <p className="text-white/70">
          Descoperă povestea, valorile și viziunea noastră în domeniu!
        </p>
      </div>
    </main>
    <Footer />
  </div>
);

export default DespreNoi;
