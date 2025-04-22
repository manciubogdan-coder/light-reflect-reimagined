
import Footer from "@/components/Footer";
import Nav from "@/components/Nav";
import { Cookie } from "lucide-react";

const Cookies = () => (
  <div className="min-h-screen bg-dark-matter flex flex-col">
    <Nav />
    <main className="flex-1 flex flex-col items-center justify-center p-6">
      <div className="max-w-2xl bg-black/60 rounded-xl p-8 mx-auto shadow-lg border border-neon-red flex flex-col items-center">
        <Cookie className="w-10 h-10 text-neon-red mb-3" />
        <h1 className="text-3xl font-tech mb-4 text-neon-red">Politica de Cookies</h1>
        <div className="text-white/80 text-left text-base space-y-5">
          <p>
            <strong>1. Ce sunt cookie-urile?</strong><br />
            Cookie-urile sunt fișiere mici plasate pe dispozitivul dvs. pentru a asigura buna funcționare a site-ului și pentru a îmbunătăți experiența de navigare.
          </p>
          <p>
            <strong>2. Ce tipuri de cookie-uri folosim?</strong><br />
            Folosim cookie-uri de sesiune și persistente pentru analiză, funcționalități esențiale și preferințe de utilizator.
          </p>
          <p>
            <strong>3. Cum puteți controla cookie-urile?</strong><br />
            Puteți modifica setările browserului pentru a bloca sau șterge cookie-urile, însă acest lucru poate afecta funcționalitatea site-ului.
          </p>
          <p>
            <strong>4. Cookie-uri pentru statistici</strong><br />
            Acest site poate utiliza cookie-uri pentru a analiza traficul și modul de utilizare, fără a identifica utilizatorii în mod individual.
          </p>
          <p>
            Pentru mai multe detalii despre cookie-uri sau drepturile dvs. vă rugăm să ne contactați la <a href="mailto:manciubogdan999@gmail.com" className="text-neon-red underline">manciubogdan999@gmail.com</a>.
          </p>
        </div>
      </div>
    </main>
    <Footer />
  </div>
);

export default Cookies;

