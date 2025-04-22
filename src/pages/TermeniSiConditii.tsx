
import Footer from "@/components/Footer";
import Nav from "@/components/Nav";
import { FileText } from "lucide-react";

const TermeniSiConditii = () => (
  <div className="min-h-screen bg-dark-matter flex flex-col">
    <Nav />
    <main className="flex-1 flex flex-col items-center justify-center p-6">
      <div className="max-w-2xl bg-black/60 rounded-xl p-8 mx-auto shadow-lg border border-electric-blue flex flex-col items-center">
        <FileText className="w-10 h-10 text-electric-blue mb-3" />
        <h1 className="text-3xl font-tech mb-4 text-electric-blue">Termeni și Condiții</h1>
        <div className="text-white/80 text-left text-base space-y-5">
          <p>
            <strong>1. Acceptarea termenilor</strong><br />
            Prin accesarea și utilizarea acestui website, sunteți de acord cu toți termenii și condițiile prezentate mai jos. Dacă nu sunteți de acord cu aceste condiții, vă rugăm să nu utilizați acest site.
          </p>
          <p>
            <strong>2. Descrierea serviciului</strong><br />
            Light Reflect Electrical oferă informații despre serviciile de instalații electrice, soluții Smart Home și alte produse aferente. Conținutul este cu titlu informativ și nu reprezintă o ofertă contractuală.
          </p>
          <p>
            <strong>3. Drepturi de autor</strong><br />
            Conținutul acestui site (texte, imagini, logo-uri, design) este protejat de legea drepturilor de autor. Folosirea fără acordul nostru scris este interzisă.
          </p>
          <p>
            <strong>4. Limitarea răspunderii</strong><br />
            Nu garantăm că informațiile de pe site sunt mereu corecte sau actualizate, iar utilizarea datelor se face pe propria răspundere. Nu răspundem pentru daune rezultate din folosirea site-ului.
          </p>
          <p>
            <strong>5. Protecția datelor</strong><br />
            Orice date personale furnizate vor fi prelucrate conform 
            <a href="/politica-de-confidentialitate" className="text-electric-blue underline ml-1">Politicii de Confidențialitate</a>.
          </p>
          <p>
            <strong>6. Modificări</strong><br />
            Ne rezervăm dreptul de a modifica acești termeni oricând, fără o notificare prealabilă. Versiunea curentă va fi disponibilă permanent pe această pagină.
          </p>
          <p>
            Pentru întrebări ne puteți contacta la <a href="mailto:manciubogdan999@gmail.com" className="text-electric-blue underline">manciubogdan999@gmail.com</a>.
          </p>
        </div>
      </div>
    </main>
    <Footer />
  </div>
);

export default TermeniSiConditii;

