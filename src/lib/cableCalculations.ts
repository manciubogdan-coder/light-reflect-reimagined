
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
  
  // Current capacity per section according to HD 60364-5-52
  // Different values for copper and aluminum
  const currentCapacityCopper: Record<number, number> = {
    1.5: 18.5,
    2.5: 25,
    4: 34,
    6: 44,
    10: 60,
    16: 80,
    25: 100,
    35: 125,
    50: 150,
    70: 190,
    95: 230,
    120: 260
  };
  
  // Aluminum has approximately 78% of copper's current capacity
  const currentCapacityAluminum: Record<number, number> = {
    2.5: 20, // Aluminum usually starts at 2.5mm²
    4: 27,
    6: 35,
    10: 48,
    16: 63,
    25: 78,
    35: 96,
    50: 117,
    70: 150,
    95: 180,
    120: 205
  };
  
  // Select the appropriate table based on material
  const currentCapacityTable = data.material === "cupru" ? currentCapacityCopper : currentCapacityAluminum;
  
  let selectedSection = 0;
  let actualVoltageDrop = 0;
  let voltageDropPercentage = 0;
  let reasonForSelection = "";
  
  // Comparison table for advanced users
  const comparisonTable = standardSections
    // Filter sections - aluminum usually doesn't have 1.5mm²
    .filter(section => !(data.material === "aluminiu" && section === 1.5))
    .map(section => {
      // Get current capacity from table for this section (default to 0 if not found)
      const maxCurrentCapacity = currentCapacityTable[section] || 0;
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

  // Find appropriate section based on both current capacity and voltage drop
  for (const section of standardSections) {
    // Skip 1.5mm² for aluminum as it's not commonly used
    if (data.material === "aluminiu" && section === 1.5) continue;
    
    const maxCurrentCapacity = currentCapacityTable[section] || 0;
    
    // Check current capacity requirement
    if (current <= maxCurrentCapacity) {
      // Calculate voltage drop
      let testVoltageDrop;
      if (data.currentType === "monofazic") {
        testVoltageDrop = (2 * length * current * resistivity) / section;
      } else {
        testVoltageDrop = (Math.sqrt(3) * length * current * resistivity) / section;
      }
      
      const testVoltageDropPercentage = (testVoltageDrop / voltage) * 100;
      
      // Check if section meets voltage drop requirement
      if (testVoltageDropPercentage <= maxVoltageDrop) {
        selectedSection = section;
        actualVoltageDrop = testVoltageDrop;
        voltageDropPercentage = testVoltageDropPercentage;

        // Special logic for selection reasoning
        if (data.calculationType === "sensitive") {
          // For sensitive equipment, recommend one size up
          const nextSectionIndex = standardSections.indexOf(section) + 1;
          if (nextSectionIndex < standardSections.length) {
            const nextSection = standardSections[nextSectionIndex];
            selectedSection = nextSection;
            actualVoltageDrop = (testVoltageDrop * section) / nextSection;
            voltageDropPercentage = (actualVoltageDrop / voltage) * 100;
            reasonForSelection = `Pentru echipamente sensibile se recomandă supradimensionarea la ${nextSection} mm² pentru o marjă de siguranță suplimentară`;
          } else {
            reasonForSelection = `Secțiunea ${section} mm² este cea mai mare disponibilă, adecvată pentru echipamente sensibile`;
          }
        } else {
          // For standard calculations, use optimal selection logic
          if (section === 1.5) {
            reasonForSelection = `Secțiunea ${section} mm² este tehnic validă dar nu recomandată profesional`;
            // Try to use 2.5mm² if possible
            const nextSection = 2.5;
            const nextMaxCurrentCapacity = currentCapacityTable[nextSection] || 0;
            const nextVoltageDrop = (testVoltageDrop * section) / nextSection;
            const nextVoltageDropPercentage = (nextVoltageDrop / voltage) * 100;
            if (current <= nextMaxCurrentCapacity && nextVoltageDropPercentage <= maxVoltageDrop) {
              selectedSection = nextSection;
              actualVoltageDrop = nextVoltageDrop;
              voltageDropPercentage = nextVoltageDropPercentage;
              reasonForSelection = `Secțiunea ${nextSection} mm² este recomandată pentru o soluție optimă și profesională`;
            }
          } else {
            reasonForSelection = `Secțiunea ${section} mm² este optimă pentru acest circuit`;
          }
        }
        break;
      }
    }
  }

  // If no section was found
  if (selectedSection === 0) {
    // Find the largest section that minimizes voltage drop
    let minVoltageDropPercentage = Infinity;
    let bestSection = standardSections[standardSections.length - 1];
    
    for (const section of standardSections) {
      if (data.material === "aluminiu" && section === 1.5) continue;
      
      let testVoltageDrop;
      if (data.currentType === "monofazic") {
        testVoltageDrop = (2 * length * current * resistivity) / section;
      } else {
        testVoltageDrop = (Math.sqrt(3) * length * current * resistivity) / section;
      }
      
      const testVoltageDropPercentage = (testVoltageDrop / voltage) * 100;
      
      if (testVoltageDropPercentage < minVoltageDropPercentage) {
        minVoltageDropPercentage = testVoltageDropPercentage;
        bestSection = section;
      }
    }
    
    selectedSection = bestSection;
    reasonForSelection = "Nicio secțiune standard nu îndeplinește toate cerințele. Se recomandă consultarea unui specialist sau alte soluții de cablaj.";
    
    // Calculate final values for selected section
    if (data.currentType === "monofazic") {
      actualVoltageDrop = (2 * length * current * resistivity) / selectedSection;
    } else {
      actualVoltageDrop = (Math.sqrt(3) * length * current * resistivity) / selectedSection;
    }
    voltageDropPercentage = (actualVoltageDrop / voltage) * 100;
  }

  // Determine recommended fuse rating based on current and cable capacity
  const standardFuses = [6, 10, 16, 20, 25, 32, 40, 50, 63, 80, 100, 125, 160, 200, 250];
  let fuseRating = standardFuses[0];
  const maxCurrentCapacity = currentCapacityTable[selectedSection] || 0;

  // Find appropriate fuse rating
  for (const fuse of standardFuses) {
    if (fuse >= current && fuse <= maxCurrentCapacity * 0.9) {  // Using 90% of max capacity for safety
      fuseRating = fuse;
      break;
    }
  }

  // Generate warnings if needed
  let warnings = "";
  if (voltageDropPercentage > maxVoltageDrop) {
    warnings += "ATENȚIE: Căderea de tensiune depășește limita admisibilă! ";
  }
  if (selectedSection === 1.5) {
    warnings += "ATENȚIE: Secțiunea 1.5mm² nu este recomandată profesional pentru acest circuit! ";
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
    voltage,
    length,
    material: data.material,
    installationType: data.installationType,
    simultaneityFactor,
    maxVoltageDrop,
    calculationType: data.calculationType,
    current
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
