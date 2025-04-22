import Footer from "@/components/Footer";
import Nav from "@/components/Nav";
import { Shield } from "lucide-react";

const PoliticaDeConfidentialitate = () => (
  <div className="min-h-screen bg-dark-matter flex flex-col">
    <Nav />
    <main className="flex-1 flex flex-col items-center justify-center p-6 pt-24 mt-4">
      <div className="max-w-2xl bg-black/60 rounded-xl p-8 mx-auto shadow-lg border border-hologram-blue flex flex-col items-center">
        <Shield className="w-10 h-10 text-hologram-blue mb-3" />
        <h1 className="text-3xl font-tech mb-4 text-hologram-blue">Politica de Confidențialitate</h1>
        <div className="text-white/80 text-left text-base space-y-5">
          <p>
            <strong>1. Ce date colectăm?</strong><br />
            Putem colecta date personale precum: nume, prenume, adresa de email, număr de telefon, adresa, sau alte date comunicate de dvs. prin formulare de contact sau cereri de ofertă.
          </p>
          <p>
            <strong>2. Scopul colectării datelor</strong><br />
            Datele sunt folosite pentru a vă răspunde la solicitări, a vă oferi informații și a îmbunătăți serviciile noastre.
          </p>
          <p>
            <strong>3. Cine are acces la date</strong><br />
            Datele dvs. nu sunt vândute sau comunicate către terți, cu excepția partenerilor implicați strict în prestarea serviciilor solicitate de dvs.
          </p>
          <p>
            <strong>4. Securitatea datelor</strong><br />
            Luăm măsuri tehnice și organizatorice pentru a proteja datele dvs. împotriva accesului, modificării sau divulgării neautorizate.
          </p>
          <p>
            <strong>5. Drepturile dvs.</strong><br />
            Aveți dreptul să solicitați accesul la datele personale, rectificarea sau ștergerea acestora, restricționarea prelucrării sau portarea lor. Pentru orice solicitare, ne puteți contacta la <a href="mailto:manciubogdan999@gmail.com" className="text-hologram-blue underline">manciubogdan999@gmail.com</a>.
          </p>
          <p>
            <strong>6. Modificări ale politicii</strong><br />
            Această politică poate fi actualizată periodic. Versiunea curentă va fi publicată permanent pe această pagină.
          </p>
        </div>
      </div>
    </main>
    <Footer />
  </div>
);

export default PoliticaDeConfidentialitate;
