
import { useEffect } from "react";
import { initGA, logPageView } from "./lib/analytics";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Contact from "./pages/Contact";
import About from "./pages/About";
import Servicii from "./pages/Servicii";
import CustomCursor from "./components/CustomCursor";
import TermeniSiConditii from "./pages/TermeniSiConditii";
import PoliticaDeConfidentialitate from "./pages/PoliticaDeConfidentialitate";
import Cookies from "./pages/Cookies";
import DespreNoi from "./pages/DespreNoi";
import Proiecte from "./pages/Proiecte";
import Franciza from "./pages/Franciza";
import Blog from "./pages/Blog";
import Cariere from "./pages/Cariere";
import Tools from "./pages/Tools";
import CableCalculatorTool from "./pages/CableCalculatorTool";
import PowerCalculatorTool from "./pages/PowerCalculatorTool";
import LightingCalculatorTool from "./pages/LightingCalculatorTool";
import EnergyEfficiencyTool from "./pages/EnergyEfficiencyTool";
import ShortCircuitCalculatorTool from "./pages/ShortCircuitCalculatorTool";
import ElectricianQuiz from "./pages/ElectricianQuiz";
import Parteneriat from "./pages/Parteneriat";
import PanelConfiguratorTool from "./pages/PanelConfiguratorTool";

const queryClient = new QueryClient();

// Create a separate component for routes to use the useLocation hook
const AppRoutes = () => {
  const location = useLocation();

  useEffect(() => {
    logPageView(location.pathname);
  }, [location]);

  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/about" element={<About />} />
      <Route path="/servicii" element={<Servicii />} />
      <Route path="/despre-noi" element={<DespreNoi />} />
      <Route path="/proiecte" element={<Proiecte />} />
      <Route path="/franciza" element={<Franciza />} />
      <Route path="/blog" element={<Blog />} />
      <Route path="/cariere" element={<Cariere />} />
      <Route path="/tools" element={<Tools />} />
      <Route path="/tools/cable-calculator" element={<CableCalculatorTool />} />
      <Route path="/tools/power-calculator" element={<PowerCalculatorTool />} />
      <Route path="/tools/lighting-calculator" element={<LightingCalculatorTool />} />
      <Route path="/tools/energy-efficiency" element={<EnergyEfficiencyTool />} />
      <Route path="/tools/short-circuit-calculator" element={<ShortCircuitCalculatorTool />} />
      <Route path="/tools/electrician-quiz" element={<ElectricianQuiz />} />
      <Route path="/tools/panel-configurator" element={<PanelConfiguratorTool />} />
      <Route path="/parteneriat" element={<Parteneriat />} />
      <Route path="/termeni-si-conditii" element={<TermeniSiConditii />} />
      <Route path="/politica-de-confidentialitate" element={<PoliticaDeConfidentialitate />} />
      <Route path="/cookies" element={<Cookies />} />
      
      {/* Add explicit path handlers for direct access URLs */}
      <Route path="/tools/electrician-quiz/:profile" element={<ElectricianQuiz />} />
      
      {/* 404 handler must be last */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => {
  useEffect(() => {
    initGA();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <HelmetProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <CustomCursor />
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </TooltipProvider>
      </HelmetProvider>
    </QueryClientProvider>
  );
};

export default App;
