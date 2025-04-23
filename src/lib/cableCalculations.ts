
import { CableCalculatorForm, CalculationResult } from "./types";

export const calculateCableSection = (data: CableCalculatorForm): CalculationResult => {
  // Convert string inputs to numbers
  const power = parseFloat(data.power);
  const voltage = parseFloat(data.voltage);
  const length = parseFloat(data.length);
  const simultaneityFactor = parseFloat(data.simultaneityFactor);
  const maxVoltageDrop = parseFloat(data.voltageDrop);

  // Calculate nominal current (with simultaneity factor)
  const current = (power * simultaneityFactor) / voltage;

  // Material resistivity (Ω·mm²/m)
  const resistivity = data.material === "cupru" ? 0.0175 : 0.028;
  
  // Standard sections (mm²)
  const standardSections = [1.5, 2.5, 4, 6, 10, 16, 25, 35, 50, 70, 95, 120];
  
  // Current capacity per section according to professional standards
  // For copper, in air, 30°C
  const currentCapacityCopper: Record<number, number> = {
    1.5: 16,
    2.5: 20,
    4: 25,
    6: 32,
    10: 45,
    16: 63,
    25: 80,
    35: 100,
    50: 125,
    70: 150,
    95: 180,
    120: 200
  };
  
  // Aluminum has approximately 78% of copper's current capacity
  const currentCapacityAluminum: Record<number, number> = {
    2.5: 16,  // Aluminum usually starts at 2.5mm²
    4: 20,
    6: 25,
    10: 35,
    16: 50,
    25: 63,
    35: 80,
    50: 100,
    70: 120,
    95: 140,
    120: 160
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
      // Get current capacity from table for this section
      const maxCurrentCapacity = currentCapacityTable[section] || 0;
      const currentCapacityMet = current <= maxCurrentCapacity;
      
      // Calculate voltage drop for this section (dus-întors = 2 * length)
      const testVoltageDrop = (2 * length * current * resistivity) / section;
      const testVoltageDropPercentage = (testVoltageDrop / voltage) * 100;
      const voltageDropMet = testVoltageDropPercentage <= maxVoltageDrop;

      // Determine if this section meets all requirements
      const meetsRequirements = currentCapacityMet && voltageDropMet;

      // Generate reason for accepting or rejecting this section
      let reason = "";
      if (!currentCapacityMet) {
        reason = `Curentul ${current.toFixed(2)}A depășește capacitatea de ${maxCurrentCapacity}A`;
      } else if (!voltageDropMet) {
        reason = `Căderea de tensiune ${testVoltageDropPercentage.toFixed(2)}% depășește limita de ${maxVoltageDrop}%`;
      } else {
        reason = "Secțiune validă";
      }

      return {
        section,
        currentCapacity: maxCurrentCapacity,
        voltageDropPercentage: testVoltageDropPercentage,
        meetsRequirements,
        reason
      };
    });

  // Find appropriate section based on both current capacity and voltage drop
  for (const section of standardSections) {
    // Skip 1.5mm² for aluminum as it's not commonly used
    if (data.material === "aluminiu" && section === 1.5) continue;
    
    const maxCurrentCapacity = currentCapacityTable[section] || 0;
    
    // Check current capacity requirement
    if (current <= maxCurrentCapacity) {
      // Calculate voltage drop (dus-întors = 2 * length)
      const testVoltageDrop = (2 * length * current * resistivity) / section;
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
            // Generally avoid 1.5mm² for professional use unless necessary
            const nextSection = 2.5;
            const nextMaxCurrentCapacity = currentCapacityTable[nextSection] || 0;
            const nextVoltageDrop = (testVoltageDrop * section) / nextSection;
            const nextVoltageDropPercentage = (nextVoltageDrop / voltage) * 100;
            
            if (current <= nextMaxCurrentCapacity && nextVoltageDropPercentage <= maxVoltageDrop) {
              selectedSection = nextSection;
              actualVoltageDrop = nextVoltageDrop;
              voltageDropPercentage = nextVoltageDropPercentage;
              reasonForSelection = `Secțiunea ${nextSection} mm² este recomandată profesional, deși ${section} mm² ar fi suficientă tehnic`;
            } else {
              reasonForSelection = `Secțiunea ${section} mm² este tehnic validă dar nu recomandată profesional`;
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
    reasonForSelection = "Nicio secțiune standard nu poate susține sarcina în condițiile date. Verifică dacă lungimea sau consumul sunt corecte.";
    // Return largest section data for display
    selectedSection = standardSections[standardSections.length - 1];
    
    // Calculate values for the largest section just for display
    const maxSection = selectedSection;
    actualVoltageDrop = (2 * length * current * resistivity) / maxSection;
    voltageDropPercentage = (actualVoltageDrop / voltage) * 100;
  }

  // Determine recommended fuse rating
  // Find the standard fuse rating just above the current value
  const standardFuses = [6, 10, 16, 20, 25, 32, 40, 50, 63, 80, 100, 125, 160, 200, 250];
  let fuseRating = 0;
  
  for (const fuse of standardFuses) {
    if (fuse >= current) {
      fuseRating = fuse;
      break;
    }
  }
  
  // If no fuse found (current too high), use the largest available
  if (fuseRating === 0 && standardFuses.length > 0) {
    fuseRating = standardFuses[standardFuses.length - 1];
  }

  // Verify if fuse rating is compatible with selected cable
  const maxCurrentForSection = currentCapacityTable[selectedSection] || 0;
  if (fuseRating > maxCurrentForSection) {
    fuseRating = maxCurrentForSection;
  }

  // Generate warnings if needed
  let warnings = "";
  if (selectedSection === 0) {
    warnings += "ATENȚIE: Nicio secțiune standard nu îndeplinește toate cerințele! ";
  }
  if (voltageDropPercentage > maxVoltageDrop) {
    warnings += "ATENȚIE: Căderea de tensiune depășește limita admisibilă! ";
  }
  if (current > maxCurrentForSection) {
    warnings += "ATENȚIE: Curentul nominal depășește capacitatea cablului! ";
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
