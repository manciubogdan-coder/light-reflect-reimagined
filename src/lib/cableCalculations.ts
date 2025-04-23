
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

  // Standard sections (mm²)
  const standardSections = [1.5, 2.5, 4, 6, 10, 16, 25, 35, 50, 70, 95, 120];
  
  // Calculate maximum allowed voltage drop in volts
  const maxAllowedVoltageDrop = voltage * maxVoltageDrop / 100;

  // Find the smallest standard section that satisfies both current and voltage drop requirements
  let selectedSection = 0;
  let actualVoltageDrop = 0;
  let voltageDropPercentage = 0;

  // Current density based on material and installation (A/mm²)
  let currentDensity;
  if (data.material === "cupru") {
    currentDensity = data.installationType === "aer" ? 5 : 4;
  } else {
    // Aluminum
    currentDensity = data.installationType === "aer" ? 3 : 2.5;
  }

  // Test each standard section
  for (const section of standardSections) {
    // Calculate voltage drop with this section
    const testVoltageDrop = data.currentType === "monofazic"
      ? (2 * length * current * resistivity) / section
      : (Math.sqrt(3) * length * current * resistivity) / section;
    
    const testVoltageDropPercentage = (testVoltageDrop / voltage) * 100;
    
    // Calculate current capacity for this section
    const testCurrentCapacity = section * currentDensity;
    
    console.log(`Testing section ${section} mm²: Voltage drop = ${testVoltageDropPercentage.toFixed(2)}%, max allowed = ${maxVoltageDrop}%, current = ${current.toFixed(2)}A, capacity = ${testCurrentCapacity.toFixed(2)}A`);
    
    // If this section meets both voltage drop and current requirements
    if (testVoltageDropPercentage <= maxVoltageDrop && current <= testCurrentCapacity) {
      selectedSection = section;
      actualVoltageDrop = testVoltageDrop;
      voltageDropPercentage = testVoltageDropPercentage;
      console.log(`Selected section: ${selectedSection} mm² - meets both requirements`);
      break; // Found the smallest suitable section
    }
  }

  // If no section was found that meets both requirements, use the largest available
  if (selectedSection === 0) {
    selectedSection = standardSections[standardSections.length - 1];
    // Recalculate voltage drop with the largest section
    actualVoltageDrop = data.currentType === "monofazic"
      ? (2 * length * current * resistivity) / selectedSection
      : (Math.sqrt(3) * length * current * resistivity) / selectedSection;
    voltageDropPercentage = (actualVoltageDrop / voltage) * 100;
    console.log(`No section meets both requirements, using largest: ${selectedSection} mm²`);
  }

  // Maximum current capacity for the selected section
  const maxCurrentCapacity = selectedSection * currentDensity;

  // Determine recommended fuse rating based on I7 normative
  const standardFuses = [6, 10, 16, 20, 25, 32, 40, 50, 63, 80, 100, 125, 160, 200, 250];
  
  // Find a fuse that's above the calculated current but below the cable's capacity
  const fuseRating = standardFuses.find(f => f >= current && f <= maxCurrentCapacity) || 
                    standardFuses.find(f => f >= current) || 
                    standardFuses[standardFuses.length - 1];

  // Generate warnings if needed
  let warnings = "";
  if (voltageDropPercentage > maxVoltageDrop) {
    warnings += "ATENȚIE: Cu secțiunea selectată, căderea de tensiune depășește limita admisibilă! ";
  }
  if (selectedSection >= 95) {
    warnings += "ATENȚIE: Secțiune mare - recomandăm consultarea unui specialist! ";
  }
  if (current > maxCurrentCapacity) {
    warnings += "ATENȚIE: Curentul nominal depășește capacitatea cablului! ";
  }

  return {
    section: selectedSection,
    current: parseFloat(current.toFixed(2)),
    voltageDrop: parseFloat(actualVoltageDrop.toFixed(2)),
    voltageDropPercentage: parseFloat(voltageDropPercentage.toFixed(2)),
    fuseRating,
    warnings: warnings || undefined
  };
};
