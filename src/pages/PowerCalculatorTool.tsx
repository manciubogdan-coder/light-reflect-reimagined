
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import PowerCalculator from "@/components/tools/PowerCalculator";
import { Calculator } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const PowerCalculatorTool = () => {
  return (
    <div className="min-h-screen bg-dark-matter flex flex-col">
      <Nav />
      <main className="flex-1 container mx-auto px-4 py-16">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="font-tech text-2xl md:text-3xl text-hologram-blue flex items-center gap-3">
            <Calculator className="w-6 h-6" />
            Calculator Putere Electrică
          </h1>
          <Button variant="outline" asChild size="sm">
            <Link to="/tools">
              Înapoi la Tools
            </Link>
          </Button>
        </div>
        <PowerCalculator />
      </main>
      <Footer />
    </div>
  );
};

export default PowerCalculatorTool;
