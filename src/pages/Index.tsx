
import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import Nav from "../components/Nav";
import Hero from "../components/Hero";
import ServicesSection from "../components/ServicesSection";
import AboutSection from "../components/AboutSection";
import LeadMagnetSection from "../components/LeadMagnetSection";

import Footer from "../components/Footer";
import BackgroundParticles from "../components/BackgroundParticles";
import GlowingCircuit from "../components/GlowingCircuit";
import ElectricLoader from "../components/ElectricLoader";
import HologramOverlay from "../components/HologramOverlay";

const Index = () => {
  const [isLoading, setIsLoading] = useState(true);

  // Simulate initial loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <ElectricLoader />;
  }

  return (
    <div className="min-h-screen bg-dark-matter overflow-hidden relative">
      <Helmet>
        <title>Light Reflect Electrical | Instalații Electrice Smart România</title>
        <meta name="description" content="Instalații electrice smart, tablouri, automatizări și soluții Smart Home în România. Garanție, certificări și echipă de profesioniști." />
        <link rel="canonical" href="https://light-reflect-reimagined.lovable.app/" />
        <meta property="og:title" content="Light Reflect Electrical | Instalații Electrice Smart" />
        <meta property="og:description" content="Instalații electrice smart, tablouri, automatizări și soluții Smart Home în România." />
        <meta property="og:url" content="https://light-reflect-reimagined.lovable.app/" />
      </Helmet>
      <BackgroundParticles />
      <GlowingCircuit />
      <HologramOverlay />
      <Nav />
      <Hero />
      <LeadMagnetSection />
      <ServicesSection />
      <AboutSection />
      
      <Footer />
    </div>
  );
};

export default Index;
