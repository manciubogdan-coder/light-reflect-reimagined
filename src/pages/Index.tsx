
import { useState, useEffect } from "react";
import Nav from "../components/Nav";
import Hero from "../components/Hero";
import ServicesSection from "../components/ServicesSection";
import AboutSection from "../components/AboutSection";
import ProjectsSection from "../components/ProjectsSection";
import CallToAction from "../components/CallToAction";
import Footer from "../components/Footer";
import BackgroundParticles from "../components/BackgroundParticles";
import GlowingCircuit from "../components/GlowingCircuit";
import ElectricLoader from "../components/ElectricLoader";

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
    <div className="min-h-screen bg-dark-matter overflow-hidden">
      <BackgroundParticles />
      <GlowingCircuit />
      <Nav />
      <Hero />
      <ServicesSection />
      <AboutSection />
      <ProjectsSection />
      <CallToAction />
      <Footer />
    </div>
  );
};

export default Index;
