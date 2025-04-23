
import { CableCalculatorForm, CalculationResult } from "./types";

export const calculateCableSection = (data: CableCalculatorForm): CalculationResult => {
  // Convert string inputs to numbers
  const power = parseFloat(data.power);
  const voltage = parseFloat(data.voltage);
  const length = parseFloat(data.length);
  const simultaneityFactor = parseFloat(data.simultaneityFactor);
  const maxVoltageDrop = parseFloat(data.voltageDrop);

  // Calculate nominal current
  const current = data.currentType === "monofazic"
    ? (power * simultaneityFactor) / voltage
    : (power * simultaneityFactor) / (voltage * Math.sqrt(3));

  // Material resistivity (Ω·mm²/m)
  const resistivity = data.material === "cupru" ? 0.0175 : 0.028;

  // Calculate minimum section based on current density
  let baseSection = current / (data.material === "cupru" ? 5 : 3);

  // Adjust section based on installation type
  const installationFactors = {
    aer: 1,
    ingropat: 1.2,
    tub: 1.3,
    canal: 1.15
  };
  
  baseSection *= installationFactors[data.installationType as keyof typeof installationFactors];

  // Calculate voltage drop for this section
  const voltageDrop = (2 * length * current * resistivity) / baseSection;
  const voltageDropPercentage = (voltageDrop / voltage) * 100;

  // Adjust section if voltage drop is too high
  if (voltageDropPercentage > maxVoltageDrop) {
    baseSection = (2 * length * current * resistivity) / (maxVoltageDrop * voltage / 100);
  }

  // Round up to nearest standard section
  const standardSections = [1.5, 2.5, 4, 6, 10, 16, 25, 35, 50, 70, 95, 120];
  const section = standardSections.find(s => s >= baseSection) || standardSections[standardSections.length - 1];

  // Determine recommended fuse rating (next standard value above calculated current)
  const standardFuses = [6, 10, 16, 20, 25, 32, 40, 50, 63, 80, 100, 125, 160, 200, 250];
  const fuseRating = standardFuses.find(f => f >= current) || standardFuses[standardFuses.length - 1];

  // Generate warnings if needed
  let warnings = "";
  if (voltageDropPercentage > maxVoltageDrop) {
    warnings += "ATENȚIE: Căderea de tensiune depășește limita admisibilă! ";
  }
  if (section >= 95) {
    warnings += "ATENȚIE: Secțiune mare - recomandăm consultarea unui specialist! ";
  }

  return {
    section,
    current: parseFloat(current.toFixed(2)),
    voltageDrop: parseFloat(voltageDrop.toFixed(2)),
    voltageDropPercentage: parseFloat(voltageDropPercentage.toFixed(2)),
    fuseRating,
    warnings: warnings || undefined
  };
};
