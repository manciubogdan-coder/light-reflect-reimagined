
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { Users } from "lucide-react";

const Cariere = () => (
  <div className="min-h-screen bg-dark-matter flex flex-col">
    <Nav />
    <main className="flex-1 flex items-center justify-center py-16">
      <div className="max-w-2xl w-full tech-panel hologram p-8 text-center">
        <Users className="mx-auto mb-4 text-hologram-blue w-10 h-10" />
        <h1 className="font-tech text-3xl md:text-4xl text-hologram-blue mb-4">Cariere</h1>
        <p className="text-white/80 mb-3">
          Căutăm specialiști pasionați să ni se alăture! Dacă vrei să lucrezi într-o echipă inovatoare, aplică pe pagina aceasta în curând.
        </p>
        <p className="text-white/70">
          Lansăm periodic posturi și oportunități noi.
        </p>
      </div>
    </main>
    <Footer />
  </div>
);

export default Cariere;
