
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
  
  // Current density based on material and installation (A/mm²) - per I7 normative
  let currentDensity;
  if (data.material === "cupru") {
    currentDensity = data.installationType === "aer" ? 5 : 4;
  } else {
    // Aluminum
    currentDensity = data.installationType === "aer" ? 3 : 2.5;
  }

  // For sensitive equipment, DECREASE current density requirements by 30%
  // This forces selection of a LARGER cable section for the same current
  if (data.calculationType === "sensitive") {
    currentDensity *= 0.7;
  }

  let selectedSection = 0;
  let actualVoltageDrop = 0;
  let voltageDropPercentage = 0;
  let reasonForSelection = "";
  
  // Comparison table for advanced users
  const comparisonTable = standardSections.map(section => {
    // Calculate max current capacity based on section and material
    const maxCurrentCapacity = section * currentDensity;
    const currentCapacityMet = current <= maxCurrentCapacity;
    
    // Calculate voltage drop for this section
    let testVoltageDrop;
    if (data.currentType === "monofazic") {
      testVoltageDrop = (2 * length * current * resistivity) / section;
    } else {
      testVoltageDrop = (Math.sqrt(3) * length * current * resistivity) / section;
    }
    
    const testVoltageDropPercentage = (testVoltageDrop / voltage) * 100;
    const voltageDropMet = testVoltageDropPercentage <= maxVoltageDrop;

    return {
      section,
      currentCapacity: maxCurrentCapacity,
      voltageDropPercentage: testVoltageDropPercentage,
      meetsRequirements: currentCapacityMet && voltageDropMet
    };
  });

  // Find FIRST (smallest) section that meets both requirements
  // This ensures we don't oversize unnecessarily
  for (const section of standardSections) {
    // Calculate max current capacity based on section
    const maxCurrentCapacity = section * currentDensity;
    
    // Check if section meets current capacity requirement
    if (current <= maxCurrentCapacity) {
      // Calculate voltage drop for this section
      let testVoltageDrop;
      if (data.currentType === "monofazic") {
        testVoltageDrop = (2 * length * current * resistivity) / section;
      } else {
        testVoltageDrop = (Math.sqrt(3) * length * current * resistivity) / section;
      }
      
      const testVoltageDropPercentage = (testVoltageDrop / voltage) * 100;
      
      // Check if section meets voltage drop requirement
      if (testVoltageDropPercentage <= maxVoltageDrop) {
        // This is the first section that meets both requirements
        selectedSection = section;
        actualVoltageDrop = testVoltageDrop;
        voltageDropPercentage = testVoltageDropPercentage;
        
        // Add reasoning based on calculation type
        if (data.calculationType === "sensitive") {
          reasonForSelection = `Secțiunea ${section} mm² este recomandată pentru echipamente sensibile, oferind o marjă de siguranță suplimentară`;
        } else {
          reasonForSelection = `Secțiunea ${section} mm² este prima secțiune standard care îndeplinește cerințele minime`;
        }
        break; // Exit the loop - we found our section
      }
    }
  }

  // If no section was found
  if (selectedSection === 0) {
    selectedSection = standardSections[standardSections.length - 1];
    reasonForSelection = "Nicio secțiune standard nu îndeplinește ambele cerințe. Se recomandă consultarea unui specialist.";
    
    // Calculate final values for largest section
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
  // Using standard fuse ratings per I7
  const standardFuses = [6, 10, 16, 20, 25, 32, 40, 50, 63, 80, 100, 125, 160, 200, 250];
  
  // According to I7, the fuse should be sized between the circuit current and cable capacity
  // but we need to find the nearest standard fuse size without exceeding cable capacity
  let fuseRating = standardFuses[0]; // Default to smallest
  for (const fuse of standardFuses) {
    if (fuse >= current && fuse <= maxCurrentCapacity) {
      fuseRating = fuse;
      break; // Found the first suitable fuse
    }
  }
  
  // If we couldn't find a suitable fuse (current > all standard fuses)
  // use the largest standard fuse that doesn't exceed cable capacity
  if (fuseRating < current) {
    for (let i = standardFuses.length - 1; i >= 0; i--) {
      if (standardFuses[i] <= maxCurrentCapacity) {
        fuseRating = standardFuses[i];
        break;
      }
    }
  }

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
  if (current > fuseRating) {
    warnings += "ATENȚIE: Curentul nominal depășește capacitatea siguranței recomandate! ";
  }

  // Debug information
  console.log("Calculând pentru:", {
    power,
    currentType: data.currentType,
    voltage,
    length,
    material: data.material,
    installationType: data.installationType,
    simultaneityFactor,
    maxVoltageDrop,
    calculationType: data.calculationType,
    current,
    adjustedCurrentDensity: currentDensity
  });
  
  console.log("Rezultat:", {
    selectedSection,
    current,
    actualVoltageDrop,
    voltageDropPercentage,
    reasonForSelection
  });

  return {
    section: selectedSection,
    current: parseFloat(current.toFixed(2)),
    voltageDrop: parseFloat(actualVoltageDrop.toFixed(2)),
    voltageDropPercentage: parseFloat(voltageDropPercentage.toFixed(2)),
    fuseRating,
    reasonForSelection,
    warnings: warnings || undefined,
    comparisonTable
  };
};
