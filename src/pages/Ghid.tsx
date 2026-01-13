import { Helmet } from "react-helmet-async";
import Nav from "@/components/Nav";
import LeadMagnetSection from "@/components/LeadMagnetSection";

const Ghid = () => {
  return (
    <div className="min-h-screen bg-dark-matter flex flex-col">
      <Helmet>
        <title>Ghidul Eficienței Electrice | Light Reflect</title>
        <meta name="description" content="Descarcă gratuit Manualul Eficienței Electrice - 50 pagini cu standarde de proiectare și execuție pentru dezvoltatori. Proiectare Digitală 3D, Execuție în 7 zile, Reducere costuri 15%." />
      </Helmet>
      
      <Nav />
      
      <main className="flex-1 flex items-center justify-center pt-20">
        <LeadMagnetSection />
      </main>
    </div>
  );
};

export default Ghid;
