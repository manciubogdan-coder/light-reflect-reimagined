
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

  // Calculate minimum section based on voltage drop
  // For monophasic: S = (2 * ρ * L * I) / (ΔU)
  // For triphasic: S = (√3 * ρ * L * I) / (ΔU)
  const maxAllowedVoltageDrop = voltage * maxVoltageDrop / 100; // Convert % to actual voltage
  
  const sectionByVoltageDrop = data.currentType === "monofazic"
    ? (2 * resistivity * length * current) / maxAllowedVoltageDrop
    : (Math.sqrt(3) * resistivity * length * current) / maxAllowedVoltageDrop;

  // Calculate minimum section based on current density (A/mm²)
  // Using values from I7 normative
  let currentDensity;
  if (data.material === "cupru") {
    currentDensity = data.installationType === "aer" ? 5 : 4;
  } else {
    // Aluminum
    currentDensity = data.installationType === "aer" ? 3 : 2.5;
  }
  
  const sectionByCurrent = current / currentDensity;

  // Take the larger of the two calculated sections
  let baseSection = Math.max(sectionByVoltageDrop, sectionByCurrent);

  // Adjust section based on installation type (applies correction factors from I7)
  const installationFactors = {
    aer: 1,
    ingropat: 1.2,
    tub: 1.3,
    canal: 1.15
  };
  
  // Apply installation factor
  baseSection *= installationFactors[data.installationType as keyof typeof installationFactors];

  // Standard sections (mm²)
  const standardSections = [1.5, 2.5, 4, 6, 10, 16, 25, 35, 50, 70, 95, 120];
  
  // Find the smallest standard section that satisfies both current and voltage drop requirements
  let section = standardSections[standardSections.length - 1]; // Default to largest if none fits
  
  for (const stdSection of standardSections) {
    // Calculate voltage drop with this section
    const testVoltageDrop = data.currentType === "monofazic"
      ? (2 * length * current * resistivity) / stdSection
      : (Math.sqrt(3) * length * current * resistivity) / stdSection;
    
    const testVoltageDropPercentage = (testVoltageDrop / voltage) * 100;
    
    // Calculate current capacity
    const currentCapacity = data.material === "cupru" 
      ? stdSection * (data.installationType === "aer" ? 5 : 4)
      : stdSection * (data.installationType === "aer" ? 3 : 2.5);
      
    // If this section satisfies both conditions, use it
    if (testVoltageDropPercentage <= maxVoltageDrop && current <= currentCapacity) {
      section = stdSection;
      break;
    }
  }

  // Calculate actual voltage drop with the selected section
  const actualVoltageDrop = data.currentType === "monofazic"
    ? (2 * length * current * resistivity) / section
    : (Math.sqrt(3) * length * current * resistivity) / section;
  
  const voltageDropPercentage = (actualVoltageDrop / voltage) * 100;

  // Maximum current capacity for the selected section
  const maxCurrentCapacity = data.material === "cupru" 
    ? section * (data.installationType === "aer" ? 5 : 4)
    : section * (data.installationType === "aer" ? 3 : 2.5);

  // Determine recommended fuse rating based on I7 normative
  const standardFuses = [6, 10, 16, 20, 25, 32, 40, 50, 63, 80, 100, 125, 160, 200, 250];
  
  // Find a fuse that's above the calculated current but below the cable's capacity
  const fuseRating = standardFuses.find(f => f >= current && f <= maxCurrentCapacity) || 
                    standardFuses.find(f => f >= current) || 
                    standardFuses[standardFuses.length - 1];

  // Generate warnings if needed
  let warnings = "";
  if (voltageDropPercentage > maxVoltageDrop) {
    warnings += "ATENȚIE: Cu toate secțiunile standard, căderea de tensiune depășește limita admisibilă! ";
  }
  if (section >= 95) {
    warnings += "ATENȚIE: Secțiune mare - recomandăm consultarea unui specialist! ";
  }
  if (current > maxCurrentCapacity) {
    warnings += "ATENȚIE: Curentul nominal depășește capacitatea cablului! ";
  }

  return {
    section,
    current: parseFloat(current.toFixed(2)),
    voltageDrop: parseFloat(actualVoltageDrop.toFixed(2)),
    voltageDropPercentage: parseFloat(voltageDropPercentage.toFixed(2)),
    fuseRating,
    warnings: warnings || undefined
  };
};
