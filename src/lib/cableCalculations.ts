
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

  // Standard sections (mm²) - from smallest to largest
  const standardSections = [1.5, 2.5, 4, 6, 10, 16, 25, 35, 50, 70, 95, 120];
  
  // Calculate maximum allowed voltage drop in volts
  const maxAllowedVoltageDrop = voltage * maxVoltageDrop / 100;

  // Current density based on material and installation (A/mm²)
  let currentDensity;
  if (data.material === "cupru") {
    currentDensity = data.installationType === "aer" ? 5 : 4;
  } else {
    // Aluminum
    currentDensity = data.installationType === "aer" ? 3 : 2.5;
  }

  // Find smallest section that meets both current capacity and voltage drop requirements
  let selectedSection = 0;
  let actualVoltageDrop = 0;
  let voltageDropPercentage = 0;
  let reasonForSelection = "";
  
  console.log(`Calculating for: ${current.toFixed(2)}A, ${maxVoltageDrop}% max voltage drop`);
  
  // Check each standard section from smallest to largest
  for (let i = 0; i < standardSections.length; i++) {
    const section = standardSections[i];
    
    // Check current capacity
    const maxCurrentCapacity = section * currentDensity;
    const currentCapacityMet = current <= maxCurrentCapacity;
    
    // Calculate voltage drop with this section
    let testVoltageDrop;
    if (data.currentType === "monofazic") {
      testVoltageDrop = (2 * length * current * resistivity) / section;
    } else {
      testVoltageDrop = (Math.sqrt(3) * length * current * resistivity) / section;
    }
    
    const testVoltageDropPercentage = (testVoltageDrop / voltage) * 100;
    const voltageDropMet = testVoltageDropPercentage <= maxVoltageDrop;
    
    console.log(`Testing section ${section} mm²: Current capacity: ${maxCurrentCapacity.toFixed(2)}A (${currentCapacityMet ? "OK" : "FAIL"}), Voltage drop = ${testVoltageDropPercentage.toFixed(2)}% (${voltageDropMet ? "OK" : "FAIL"})`);
    
    // Track reasons for selection or rejection
    if (!currentCapacityMet) {
      reasonForSelection = `Secțiunea ${section} mm² nu suportă curentul necesar de ${current.toFixed(2)}A (max: ${maxCurrentCapacity.toFixed(2)}A)`;
    } else if (!voltageDropMet) {
      reasonForSelection = `Secțiunea ${section} mm² ar cauza o cădere de tensiune de ${testVoltageDropPercentage.toFixed(2)}% (max: ${maxVoltageDrop}%)`;
    } else {
      // Both requirements are met
      selectedSection = section;
      actualVoltageDrop = testVoltageDrop;
      voltageDropPercentage = testVoltageDropPercentage;
      reasonForSelection = `Secțiunea ${section} mm² este cea mai economică care îndeplinește ambele cerințe`;
      console.log(`Selected section: ${selectedSection} mm² - meets both requirements`);
      break; // Found the smallest suitable section, stop here
    }
  }

  // If no section meets both requirements, use the largest available
  if (selectedSection === 0) {
    console.log("No section meets both requirements, selecting largest available");
    selectedSection = standardSections[standardSections.length - 1];
    reasonForSelection = "Nicio secțiune standard nu îndeplinește ambele cerințe. Se recomandă consultarea unui specialist.";
    
    // Recalculate voltage drop with this section
    if (data.currentType === "monofazic") {
      actualVoltageDrop = (2 * length * current * resistivity) / selectedSection;
    } else {
      actualVoltageDrop = (Math.sqrt(3) * length * current * resistivity) / selectedSection;
    }
    
    voltageDropPercentage = (actualVoltageDrop / voltage) * 100;
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
    reasonForSelection,
    warnings: warnings || undefined
  };
};
