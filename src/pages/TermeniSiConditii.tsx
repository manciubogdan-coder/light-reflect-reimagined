
import Footer from "@/components/Footer";
import Nav from "@/components/Nav";
import { FileText } from "lucide-react";

const TermeniSiConditii = () => (
  <div className="min-h-screen bg-dark-matter flex flex-col">
    <Nav />
    <main className="flex-1 flex flex-col items-center justify-center p-6">
      <div className="max-w-2xl bg-black/60 rounded-xl p-8 mx-auto shadow-lg border border-electric-blue flex flex-col items-center">
        <FileText className="w-10 h-10 text-electric-blue mb-3" />
        <h1 className="text-3xl font-tech mb-4 text-electric-blue">Termeni și condiții</h1>
        <p className="text-white/80 text-lg text-center">
          Aceasta este pagina de Termeni și Condiții.
        </p>
        <p className="text-white/60 mt-4 text-sm text-center">
          (Conținutul complet va fi actualizat aici.)
        </p>
      </div>
    </main>
    <Footer />
  </div>
);

export default TermeniSiConditii;
