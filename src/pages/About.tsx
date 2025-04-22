
import ElectricText from "../components/ElectricText";
import { Cable, ShieldCheck, CheckCircle, Home, Users, Cpu, FileCheck2, Wrench } from "lucide-react";
import Nav from "../components/Nav";
import Footer from "../components/Footer";

const highlights = [
  {
    icon: <ShieldCheck className="text-hologram-blue w-8 h-8" />,
    title: "Garanție & Siguranță",
    desc: "Garanție pentru fiecare lucrare. Teste de izolație și verificări la fiecare etapă."
  },
  {
    icon: <FileCheck2 className="text-electric-blue w-8 h-8" />,
    title: "Certificări & Documente",
    desc: "Predăm documente oficiale: proces verbal, raport de testare, certificat de garanție."
  },
  {
    icon: <CheckCircle className="text-neon-red w-8 h-8" />,
    title: "Transparență & Prețuri",
    desc: "Comunicare clară, transparență completă și echipe punctuale la fiecare proiect."
  }
];

const services = [
  {
    icon: <Home className="w-6 h-6 text-hologram-blue" />,
    label: "Instalații electrice pentru case, birouri, spații comerciale și industriale"
  },
  {
    icon: <Cpu className="w-6 h-6 text-electric-blue" />,
    label: "Automatizări, tablouri electrice & soluții smart home"
  },
  {
    icon: <FileCheck2 className="w-6 h-6 text-hologram-blue" />,
    label: "Audituri și testări electrice certificate"
  },
  {
    icon: <Wrench className="w-6 h-6 text-hologram-blue" />,
    label: "Servicii de urgență și mentenanță periodică"
  },
];

const About = () => {
  return (
    <div className="min-h-screen bg-dark-matter overflow-hidden">
      <Nav />
      <section className="relative py-24 min-h-[80vh] flex flex-col items-center justify-center">
        {/* Decorative background wires/cables */}
        <div className="absolute inset-0 px-2 pointer-events-none z-0">
          <div className="absolute top-0 left-1/4 w-1/3 h-px bg-hologram-blue/40 blur-sm animate-marquee-horizontal" />
          <div className="absolute bottom-0 right-1/4 w-1/4 h-px bg-electric-blue/30 blur-[2px] animate-marquee-reverse" />
          <div className="absolute top-20 left-12 h-44 w-1 bg-neon-red/50 rounded-full blur-[1px] animate-glow" />
          <div className="absolute bottom-20 right-16 h-32 w-1 bg-hologram-blue/30 rounded-full blur-[1px] animate-glow" />
        </div>
        <div className="relative z-10 max-w-3xl w-full tech-panel hologram backdrop-blur-lg p-10 shadow-2xl">
          <ElectricText 
            text="Despre Light Reflect Electrical"
            className="text-3xl md:text-4xl font-tech text-hologram-blue mb-3 text-center"
          />
          <p className="text-center text-white/80 text-lg mb-10">
            Aducem lumină în casa ta – cu grijă, precizie și responsabilitate.
          </p>

          {/* Intro */}
          <div className="mb-8">
            <p className="text-white/80 text-center">
              La <span className="text-electric-blue font-semibold">Light Reflect Electrical</span>, credem că fiecare cablu, fiecare conexiune și fiecare întrerupător trebuie să funcționeze impecabil, pentru că vorbim despre siguranța și confortul casei tale.<br /><br />
              Suntem o echipă de profesioniști în instalații electrice, cu o misiune simplă dar ambițioasă: <span className="text-hologram-blue font-semibold">să ridicăm standardul în domeniul electric, punând în centrul atenției calitatea lucrărilor, seriozitatea execuției și transparența totală în relația cu clienții noștri.</span>
            </p>
          </div>
          
          {/* Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
            {highlights.map((item, idx) => (
              <div key={idx} className="flex flex-col items-center text-center">
                <div className="mb-2">{item.icon}</div>
                <div className="font-tech text-white">{item.title}</div>
                <div className="text-sm text-white/60">{item.desc}</div>
              </div>
            ))}
          </div>
          
          {/* Cine suntem */}
          <div className="mb-10">
            <h2 className="text-xl font-tech text-hologram-blue text-center mb-3">Cine suntem</h2>
            <p className="text-white/80 mb-3 text-center">
              Suntem mai mult decât o firmă de instalații electrice.<br />
              Suntem constructori de încredere, parteneri de cursă lungă și inovatori într-un domeniu care cere rigoare, dar și viziune.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <div className="flex items-center gap-2">
                <Cable className="w-7 h-7 text-electric-blue" />
                <span className="text-white/80">Am pornit cu un singur om și o viziune:</span>
              </div>
              <span className="font-tech text-hologram-blue">să facem lucrurile corect din prima și să construim o rețea națională și apoi europeană de profesioniști în electricitate.</span>
            </div>
          </div>

          {/* Servicii oferite */}
          <div className="mb-12">
            <h2 className="text-xl font-tech text-hologram-blue text-center mb-4">
              Ce oferim
            </h2>
            <ul className="flex flex-col gap-3 mb-5">
              {services.map((service, i) => (
                <li key={i} className="flex items-center gap-3 text-white/90">
                  <span>{service.icon}</span>
                  <span>{service.label}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* De ce Light Reflect */}
          <div className="bg-electric-blue/10 rounded-xl p-6 mb-10 border border-hologram-blue/30">
            <h2 className="font-tech text-hologram-blue mb-3 text-center">De ce Light Reflect?</h2>
            <ul className="flex flex-col gap-2 text-white/80 text-center">
              <li>✅ Garanție pentru fiecare lucrare</li>
              <li>✅ Teste de izolație și verificări incluse în fiecare etapă</li>
              <li>✅ Documente oficiale predate la final: proces verbal, raport de testare, certificat de garanție</li>
              <li>✅ Comunicare clară, prețuri transparente, echipe punctuale</li>
            </ul>
          </div>

          {/* Viziunea */}
          <div className="mb-4 text-center">
            <h2 className="font-tech text-hologram-blue mb-2">Viziunea noastră</h2>
            <p className="text-white/80">
              Peste 5 ani, Light Reflect Electrical va fi o rețea francizabilă de profesioniști, <br />
              prezentă în toate marile orașe ale Europei.<br />
              Ne dezvoltăm sistematic: cu proceduri clare, echipe bine instruite și o platformă digitală proprie – <span className="text-electric-blue font-semibold">Light Reflect OS</span>, care ne ajută să fim eficienți, organizați și mereu aproape de client.
            </p>
          </div>
        </div>

        <div className="w-full flex flex-col items-center mt-4">
          <span className="text-white/60 text-center">Fie că îți construiești o casă, îți modernizezi biroul sau cauți un partener de încredere în domeniul instalațiilor electrice – suntem aici.<br/><span className="text-hologram-blue font-tech">Light Reflect Electrical – Aducem lumină în casa ta!</span></span>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default About;
