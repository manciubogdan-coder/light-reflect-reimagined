
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { Handshake } from "lucide-react";

const Franciza = () => (
  <div className="min-h-screen bg-dark-matter flex flex-col">
    <Nav />
    <main className="flex-1 flex items-center justify-center py-16">
      <div className="max-w-2xl w-full tech-panel hologram p-8 text-center">
        <Handshake className="mx-auto mb-4 text-hologram-blue w-10 h-10" />
        <h1 className="font-tech text-3xl md:text-4xl text-hologram-blue mb-4">Franciză</h1>
        <p className="text-white/80 mb-3">
          Fii parte din rețeaua Light Reflect Electrical! În curând vei afla cum poți prelua modelul nostru de succes în orașul tău.
        </p>
        <p className="text-white/70">
          Lansăm curând programul de franciză națională și internațională.
        </p>
      </div>
    </main>
    <Footer />
  </div>
);

export default Franciza;
