
import { useState, useEffect } from "react";
import Nav from "../components/Nav";
import Hero from "../components/Hero";
import ServicesSection from "../components/ServicesSection";
import AboutSection from "../components/AboutSection";

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
      <BackgroundParticles />
      <GlowingCircuit />
      <HologramOverlay />
      <Nav />
      <Hero />
      <ServicesSection />
      <AboutSection />
      
      <Footer />
    </div>
  );
};

export default Index;
