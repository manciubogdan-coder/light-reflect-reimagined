import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { initGA, logPageView } from "./lib/analytics";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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

const App = () => {
  const location = useLocation();

  useEffect(() => {
    initGA();
  }, []);

  useEffect(() => {
    logPageView(location.pathname);
  }, [location]);

  return (
    <QueryClientProvider client={queryClient}>
      <HelmetProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <CustomCursor />
          <BrowserRouter>
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
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </HelmetProvider>
    </QueryClientProvider>
  );
};

export default App;
