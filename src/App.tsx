import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
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
          <Route path="/termeni-si-conditii" element={<TermeniSiConditii />} />
          <Route path="/politica-de-confidentialitate" element={<PoliticaDeConfidentialitate />} />
          <Route path="/cookies" element={<Cookies />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
