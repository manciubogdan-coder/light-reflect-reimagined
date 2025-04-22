
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { Briefcase } from "lucide-react";

const Proiecte = () => (
  <div className="min-h-screen bg-dark-matter flex flex-col">
    <Nav />
    <main className="flex-1 flex items-center justify-center py-16">
      <div className="max-w-2xl w-full tech-panel hologram p-8 text-center">
        <Briefcase className="mx-auto mb-4 text-hologram-blue w-10 h-10" />
        <h1 className="font-tech text-3xl md:text-4xl text-hologram-blue mb-4">Proiecte</h1>
        <p className="text-white/80 mb-3">
          Am implementat peste 1200 de proiecte electrice la nivel rezidențial și comercial, fiecare cu rigurozitate și atenție la detalii.
        </p>
        <p className="text-white/70">
          În curând vei putea explora câteva dintre proiectele noastre reprezentative!
        </p>
      </div>
    </main>
    <Footer />
  </div>
);

export default Proiecte;
