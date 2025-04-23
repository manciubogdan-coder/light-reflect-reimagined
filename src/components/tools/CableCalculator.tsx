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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { calculateCableSection } from "@/lib/cableCalculations";
import { CableCalculatorForm } from "@/lib/types";
import { toast } from "@/components/ui/use-toast";

const CableCalculator = () => {
  const [formData, setFormData] = useState<CableCalculatorForm>({
    power: "",
    currentType: "monofazic",
    voltage: "230",
    length: "",
    material: "cupru",
    installationType: "aer",
    simultaneityFactor: "1",
    voltageDrop: "3",
    calculationType: "standard"
  });

  const [result, setResult] = useState<any>(null);
  const [showAdvancedTable, setShowAdvancedTable] = useState(false);

  const handleCurrentTypeChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      currentType: value,
      voltage: value === "monofazic" ? "230" : "400"
    }));
  };

  const handleChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const calculationResult = calculateCableSection(formData);
    setResult(calculationResult);
  };

  const handleEmailResults = () => {
    toast({
      title: "Funcționalitate în dezvoltare",
      description: "Trimiterea rezultatelor pe email va fi disponibilă în curând.",
    });
  };

  const handleContactRequest = () => {
    toast({
      title: "Cerere înregistrată",
      description: "Vă vom contacta în curând pentru un deviz personalizat.",
    });
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

      <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="power">Puterea totală (W)</Label>
            <Input
              id="power"
              type="number"
              value={formData.power}
              onChange={(e) => handleChange("power", e.target.value)}
              placeholder="ex: 2000"
              required
              className="bg-dark-matter border-electric-blue/30"
            />
          </div>

          <div className="space-y-2">
            <Label>Tip curent</Label>
            <Select
              value={formData.currentType}
              onValueChange={handleCurrentTypeChange}
            >
              <SelectTrigger className="bg-dark-matter border-electric-blue/30">
                <SelectValue placeholder="Selectează tipul de curent" />
              </SelectTrigger>
              <SelectContent className="bg-dark-matter border-electric-blue/30">
                <SelectItem value="monofazic">Monofazic</SelectItem>
                <SelectItem value="trifazic">Trifazic</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="voltage">Tensiune (V)</Label>
            <Input
              id="voltage"
              type="number"
              value={formData.voltage}
              onChange={(e) => handleChange("voltage", e.target.value)}
              placeholder={formData.currentType === "monofazic" ? "230" : "400"}
              className="bg-dark-matter border-electric-blue/30"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="length">Lungimea cablului (m)</Label>
            <Input
              id="length"
              type="number"
              value={formData.length}
              onChange={(e) => handleChange("length", e.target.value)}
              placeholder="ex: 25"
              required
              className="bg-dark-matter border-electric-blue/30"
            />
          </div>

          <div className="space-y-2">
            <Label>Material conductor</Label>
            <Select
              value={formData.material}
              onValueChange={(value) => handleChange("material", value)}
            >
              <SelectTrigger className="bg-dark-matter border-electric-blue/30">
                <SelectValue placeholder="Selectează materialul" />
              </SelectTrigger>
              <SelectContent className="bg-dark-matter border-electric-blue/30">
                <SelectItem value="cupru">Cupru</SelectItem>
                <SelectItem value="aluminiu">Aluminiu</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Mod de pozare</Label>
            <Select
              value={formData.installationType}
              onValueChange={(value) => handleChange("installationType", value)}
            >
              <SelectTrigger className="bg-dark-matter border-electric-blue/30">
                <SelectValue placeholder="Selectează modul de pozare" />
              </SelectTrigger>
              <SelectContent className="bg-dark-matter border-electric-blue/30">
                <SelectItem value="aer">În aer</SelectItem>
                <SelectItem value="ingropat">Îngropat</SelectItem>
                <SelectItem value="tub">În tub</SelectItem>
                <SelectItem value="canal">În canal</SelectItem>
              </SelectContent>
            </Select>
          </div>

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
              className="bg-dark-matter border-electric-blue/30"
            />
          </div>

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
              className="bg-dark-matter border-electric-blue/30"
            />
          </div>

          <div className="space-y-2">
            <Label>Tip calcul</Label>
            <Select
              value={formData.calculationType}
              onValueChange={(value) => handleChange("calculationType", value)}
            >
              <SelectTrigger className="bg-dark-matter border-electric-blue/30">
                <SelectValue placeholder="Selectează tipul de calcul" />
              </SelectTrigger>
              <SelectContent className="bg-dark-matter border-electric-blue/30">
                <SelectItem value="standard">Minim conform standard</SelectItem>
                <SelectItem value="sensitive">Recomandat pentru echipamente sensibile</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-center gap-4">
          <Button type="submit" className="w-full md:w-auto">
            Calculează
          </Button>
          {result && (
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setShowAdvancedTable(!showAdvancedTable)}
              className="w-full md:w-auto"
            >
              {showAdvancedTable ? "Ascunde" : "Afișează"} tabel comparativ
            </Button>
          )}
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
          
          {showAdvancedTable && result.comparisonTable && (
            <div className="mt-6 overflow-x-auto">
              <h4 className="text-lg font-tech text-hologram-blue mb-3">Tabel comparativ secțiuni</h4>
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-electric-blue/30">
                    <TableHead className="text-white/70">Secțiune (mm²)</TableHead>
                    <TableHead className="text-white/70">Capacitate curent (A)</TableHead>
                    <TableHead className="text-white/70">Cădere tensiune (%)</TableHead>
                    <TableHead className="text-white/70">Status</TableHead>
                    <TableHead className="text-white/70">Motivare</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {result.comparisonTable.map((row) => (
                    <TableRow key={row.section} className={row.section === result.section ? "bg-hologram-blue/10 border-b border-electric-blue/20" : "border-b border-electric-blue/20"}>
                      <TableCell>{row.section}</TableCell>
                      <TableCell>{row.currentCapacity.toFixed(1)}</TableCell>
                      <TableCell>{row.voltageDropPercentage.toFixed(2)}%</TableCell>
                      <TableCell>
                        <span className={row.meetsRequirements ? "text-green-500" : "text-red-500"}>
                          {row.meetsRequirements ? "✓ OK" : "✗ Respins"}
                        </span>
                      </TableCell>
                      <TableCell>{row.reason}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
          
          {result.reasonForSelection && (
            <div className="mt-4 p-4 border border-hologram-blue/50 rounded-md bg-hologram-blue/10">
              <p className="text-hologram-blue font-tech">Justificare: {result.reasonForSelection}</p>
            </div>
          )}
          
          {result.warnings && (
            <div className="mt-4 p-4 border border-neon-red rounded-md">
              <p className="text-neon-red">{result.warnings}</p>
            </div>
          )}
          
          {result.contextualRecommendation && (
            <div className="mt-4 p-4 border border-hologram-blue/50 rounded-md bg-hologram-blue/10">
              <p className="text-hologram-blue font-tech">💡 Notă suplimentară: {result.contextualRecommendation}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CableCalculator;
