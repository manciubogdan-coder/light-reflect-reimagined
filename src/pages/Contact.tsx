import ElectricText from "../components/ElectricText";
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import { Helmet } from "react-helmet-async";

const Contact = () => {
  const localBusinessJsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "Light Reflect Electrical",
    image: "https://light-reflect-reimagined.lovable.app/og-image.jpg",
    url: "https://light-reflect-reimagined.lovable.app/contact",
    telephone: "+40752954772",
    email: "office@lightreflect.ro",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Str. Andrei Mureșanu nr. 32",
      addressLocality: "Salonta",
      addressRegion: "Bihor",
      addressCountry: "RO"
    }
  };

  return (
    <div className="min-h-screen bg-dark-matter">
      <Helmet>
        <title>Contact Light Reflect Electrical | Telefon, email, adresă</title>
        <meta name="description" content="Contactează Light Reflect Electrical pentru instalații electrice profesionale. Telefon +40 752 954 772, email office@lightreflect.ro, Salonta, Bihor." />
        <link rel="canonical" href="https://light-reflect-reimagined.lovable.app/contact" />
        <meta property="og:title" content="Contact Light Reflect Electrical" />
        <meta property="og:description" content="Telefon, email și adresă pentru proiecte de instalații electrice." />
        <meta property="og:url" content="https://light-reflect-reimagined.lovable.app/contact" />
        <script type="application/ld+json">{JSON.stringify(localBusinessJsonLd)}</script>
      </Helmet>
      <Nav />
      <section className="relative min-h-[80vh] flex flex-col items-center justify-center py-24">
        {/* Background with lines and particles */}
        <div className="absolute inset-0 bg-circuit-pattern bg-cover bg-center opacity-20 z-0" />
        <div className="absolute inset-0 bg-gradient-to-br from-dark-matter/80 via-hologram-blue/10 to-electric-blue/10 z-0" />

        {/* Contact Info Section */}
        <div className="relative z-20 max-w-xl w-full tech-panel shadow-xl p-8">
          <ElectricText as="h1" text="Contact" className="text-3xl md:text-4xl font-tech mb-8 text-hologram-blue text-center" />
          
          <div className="space-y-6 text-center">
            <div className="flex items-center justify-center gap-3">
              <span className="text-electric-blue text-xl">📞</span>
              <a href="tel:+40752954772" className="text-white/90 font-tech text-lg hover:text-electric-blue transition-colors">
                +40 752 954 772
              </a>
            </div>
            
            <div className="flex items-center justify-center gap-3">
              <span className="text-electric-blue text-xl">✉️</span>
              <a href="mailto:office@lightreflect.ro" className="text-white/90 font-tech text-lg hover:text-electric-blue transition-colors">
                office@lightreflect.ro
              </a>
            </div>
            
            <div className="flex items-center justify-center gap-3">
              <span className="text-electric-blue text-xl">📍</span>
              <span className="text-white/90 font-tech text-lg">
                Str. Andrei Mureșanu nr. 32, Salonta, Bihor, România
              </span>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Contact;
