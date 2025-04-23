
import { useState } from "react";
import { Calculator } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { calculateCableSection } from "@/lib/cableCalculations";
import { CableCalculatorForm } from "@/lib/types";

const CableCalculator = () => {
  const [formData, setFormData] = useState<CableCalculatorForm>({
    power: "",
    currentType: "monofazic",
    voltage: "230",
    length: "",
    material: "cupru",
    installationType: "aer",
    simultaneityFactor: "1",
    voltageDrop: "3"
  });

  const [result, setResult] = useState<any>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const calculationResult = calculateCableSection(formData);
    setResult(calculationResult);
  };

  const handleChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="max-w-4xl mx-auto tech-panel p-6">
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-tech text-hologram-blue mb-2 flex items-center justify-center gap-2">
          <Calculator className="w-6 h-6" />
          Calculator Secțiune Cablu Electric
        </h2>
        <p className="text-white/70">
          Calculează rapid secțiunea optimă pentru cablurile tale electrice
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Power Input */}
          <div className="space-y-2">
            <Label htmlFor="power">Puterea totală (W)</Label>
            <Input
              id="power"
              type="number"
              value={formData.power}
              onChange={(e) => handleChange("power", e.target.value)}
              placeholder="ex: 2000"
              required
            />
          </div>

          {/* Current Type */}
          <div className="space-y-2">
            <Label>Tip curent</Label>
            <Select
              value={formData.currentType}
              onValueChange={(value) => handleChange("currentType", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selectează tipul de curent" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="monofazic">Monofazic</SelectItem>
                <SelectItem value="trifazic">Trifazic</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Voltage */}
          <div className="space-y-2">
            <Label htmlFor="voltage">Tensiune (V)</Label>
            <Input
              id="voltage"
              type="number"
              value={formData.voltage}
              onChange={(e) => handleChange("voltage", e.target.value)}
              placeholder={formData.currentType === "monofazic" ? "230" : "400"}
            />
          </div>

          {/* Cable Length */}
          <div className="space-y-2">
            <Label htmlFor="length">Lungimea cablului (m)</Label>
            <Input
              id="length"
              type="number"
              value={formData.length}
              onChange={(e) => handleChange("length", e.target.value)}
              placeholder="ex: 25"
              required
            />
          </div>

          {/* Conductor Material */}
          <div className="space-y-2">
            <Label>Material conductor</Label>
            <Select
              value={formData.material}
              onValueChange={(value) => handleChange("material", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selectează materialul" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cupru">Cupru</SelectItem>
                <SelectItem value="aluminiu">Aluminiu</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Installation Type */}
          <div className="space-y-2">
            <Label>Mod de pozare</Label>
            <Select
              value={formData.installationType}
              onValueChange={(value) => handleChange("installationType", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selectează modul de pozare" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="aer">În aer</SelectItem>
                <SelectItem value="ingropat">Îngropat</SelectItem>
                <SelectItem value="tub">În tub</SelectItem>
                <SelectItem value="canal">În canal</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Simultaneity Factor */}
          <div className="space-y-2">
            <Label htmlFor="simultaneityFactor">Coeficient simultaneitate</Label>
            <Input
              id="simultaneityFactor"
              type="number"
              value={formData.simultaneityFactor}
              onChange={(e) => handleChange("simultaneityFactor", e.target.value)}
              placeholder="ex: 1"
              min="0"
              max="1"
              step="0.1"
            />
          </div>

          {/* Voltage Drop */}
          <div className="space-y-2">
            <Label htmlFor="voltageDrop">Cădere maximă admisibilă de tensiune (%)</Label>
            <Input
              id="voltageDrop"
              type="number"
              value={formData.voltageDrop}
              onChange={(e) => handleChange("voltageDrop", e.target.value)}
              placeholder="ex: 3"
              min="0"
              max="10"
              step="0.1"
            />
          </div>
        </div>

        <div className="flex justify-center gap-4">
          <Button type="submit" className="w-full md:w-auto">
            Calculează
          </Button>
        </div>
      </form>

      {result && (
        <div className="mt-8 space-y-4 p-6 tech-border">
          <h3 className="text-xl font-tech text-hologram-blue mb-4">Rezultate calcul</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-white/70">Secțiunea minimă recomandată:</p>
              <p className="text-xl font-tech text-electric-blue">{result.section} mm²</p>
            </div>
            <div>
              <p className="text-white/70">Curent nominal calculat:</p>
              <p className="text-xl font-tech text-electric-blue">{result.current} A</p>
            </div>
            <div>
              <p className="text-white/70">Cădere de tensiune estimată:</p>
              <p className="text-xl font-tech text-electric-blue">{result.voltageDrop} V ({result.voltageDropPercentage}%)</p>
            </div>
            <div>
              <p className="text-white/70">Siguranță recomandată:</p>
              <p className="text-xl font-tech text-electric-blue">{result.fuseRating} A</p>
            </div>
          </div>
          {result.warnings && (
            <div className="mt-4 p-4 border border-neon-red rounded-md">
              <p className="text-neon-red">{result.warnings}</p>
            </div>
          )}
          <div className="mt-6 flex flex-col items-center gap-4">
            <Button variant="outline" className="w-full md:w-auto">
              Trimite rezultatele pe email
            </Button>
            <Button variant="outline" className="w-full md:w-auto">
              Contactează-ne pentru un deviz oficial
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CableCalculator;
