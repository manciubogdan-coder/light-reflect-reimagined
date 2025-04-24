import { ShortCircuitCalculatorForm, ShortCircuitResult } from "./types";

// Material resistivity (Ω·mm²/m)
const RESISTIVITY = {
  "cupru": 0.0175,
  "aluminiu": 0.028
};

// Standard breaker sizes (A)
const STANDARD_BREAKER_SIZES = [10, 16, 20, 25, 32, 40, 50, 63, 80, 100, 125, 160, 200, 250, 315, 400, 500, 630, 800, 1000, 1250, 1600];

// Standard cable sections (mm²)
const STANDARD_SECTIONS = [1.5, 2.5, 4, 6, 10, 16, 25, 35, 50, 70, 95, 120, 150, 185, 240, 300];

// Current capacity per section (A) for copper and aluminum
const CURRENT_CAPACITY = {
  "cupru": {
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
    120: 200,
    150: 230,
    185: 260,
    240: 300,
    300: 340
  },
  "aluminiu": {
    2.5: 16,
    4: 20,
    6: 25,
    10: 35,
    16: 50,
    25: 63,
    35: 80,
    50: 100,
    70: 120,
    95: 140,
    120: 160,
    150: 180,
    185: 210,
    240: 250,
    300: 290
  }
};

export const calculateShortCircuit = (data: ShortCircuitCalculatorForm): ShortCircuitResult => {
  // Parse input data
  const transformerPower = parseFloat(data.transformerPower) * 1000; // Convert from kVA to VA
  const transformerImpedance = parseFloat(data.transformerImpedance) / 100; // Convert from % to decimal
  const cableLength = parseFloat(data.cableLength);
  const cableMaterial = data.cableMaterial;
  const cableSection = parseFloat(data.cableSection);
  const voltageDrop = parseFloat(data.voltageDrop);
  
  // Line-to-line voltage (V) - assuming standard three-phase 400V system
  const voltage = 400;
  const phaseVoltage = voltage / Math.sqrt(3); // Phase to neutral voltage
  
  // Calculate transformer nominal current (A)
  const transformerNominalCurrent = transformerPower / (Math.sqrt(3) * voltage);
  
  // Calculate transformer short circuit current without cable (A)
  const transformerShortCircuitCurrent = transformerNominalCurrent * (100 / parseFloat(data.transformerImpedance));
  
  // Calculate transformer impedance (Ω)
  const transformerZ = (voltage * voltage * transformerImpedance) / transformerPower;
  
  // Calculate cable impedance (Ω)
  const resistivity = RESISTIVITY[cableMaterial as keyof typeof RESISTIVITY];
  const cableR = (resistivity * cableLength) / cableSection;
  
  // Approximate cable reactance (Ω) - simplified model
  const cableX = 0.08 * cableLength / 1000;
  
  // Total impedance (Ω) - simplified calculation
  const totalZ = Math.sqrt(Math.pow(transformerZ, 2) + Math.pow(cableR, 2) + Math.pow(cableX, 2));
  
  // Cable impedance (for user display)
  const cableZ = Math.sqrt(Math.pow(cableR, 2) + Math.pow(cableX, 2));
  
  // Calculate short circuit current at transformer terminals (A)
  const shortCircuitCurrentTransformer = transformerShortCircuitCurrent;
  
  // Calculate short circuit current at end of cable (A)
  const shortCircuitCurrent = phaseVoltage / cableZ;
  
  // Alternative method: Calculate short circuit current (A) with combined impedances
  const shortCircuitCurrentCombined = voltage / (Math.sqrt(3) * totalZ);
  
  // Calculate voltage drop during short circuit (V)
  const shortCircuitVoltageDrop = shortCircuitCurrent * cableZ;
  
  // Calculate voltage drop percentage during short circuit
  const shortCircuitVoltageDropPercentage = (shortCircuitVoltageDrop / phaseVoltage) * 100;
  
  // Determine limiting factor
  const limitingFactor = transformerZ > cableR ? "transformator" : "cablu";
  
  // Determine nominal voltage drops (at normal operation)
  const nominalVoltageDrop = (transformerNominalCurrent * cableR);
  const nominalVoltageDropPercentage = (nominalVoltageDrop / phaseVoltage) * 100;
  
  // Additional recommendations based on voltage drop
  if (nominalVoltageDropPercentage > parseFloat(data.voltageDrop)) {
    warnings.push(`ATENȚIE: Pe traseul de ${cableLength}m cu ${cableSection} mm² ${data.cableMaterial}, 
    pierzi ~${nominalVoltageDrop.toFixed(1)}V (${nominalVoltageDropPercentage.toFixed(1)}%) → 
    peste limita de ${data.voltageDrop}%.`);
    
    // Add recommendation for voltage drop mitigation
    recommendations.push(`Pentru reducerea căderii de tensiune sub ${data.voltageDrop}%, 
    considerați mărirea secțiunii cablului sau reducerea lungimii traseului.`);
  }
  
  // Calculate minimum breaker rating based on short circuit current
  // The breaker must be able to interrupt the calculated short circuit current
  let minBreakerRating = 0;
  for (const rating of STANDARD_BREAKER_SIZES) {
    if (rating * 10 >= shortCircuitCurrentCombined) {
      minBreakerRating = rating;
      break;
    }
  }
  
  // If no breaker is suitable, recommend the largest available
  if (minBreakerRating === 0) {
    minBreakerRating = STANDARD_BREAKER_SIZES[STANDARD_BREAKER_SIZES.length - 1];
  }
  
  // Calculate recommended breaker rating
  // We'll use a more practical approach based on real-world requirements
  let recommendedBreakerRating = 0;
  
  // For currents below 6000A, a standard MCCB with 6kA breaking capacity is typically sufficient
  // For higher currents, more specialized equipment may be needed
  
  for (const rating of STANDARD_BREAKER_SIZES) {
    if (rating >= transformerNominalCurrent * 1.25 && rating <= 630) { // Typical safety margin
      recommendedBreakerRating = rating;
      break;
    }
  }
  
  if (recommendedBreakerRating === 0) {
    // Fall back to a standard value if our logic didn't find a suitable rating
    recommendedBreakerRating = 400; // A common default for medium-sized installations
    
    // For very large transformers/short circuits
    if (transformerNominalCurrent > 400) {
      recommendedBreakerRating = 630;
    }
  }
  
  // Calculate recommended cable section based on short circuit current and voltage drop
  let recommendedCableSection = cableSection;
  
  // Increase section if needed for voltage drop
  const currentCapacity = CURRENT_CAPACITY[cableMaterial as keyof typeof CURRENT_CAPACITY];
  for (const section of STANDARD_SECTIONS) {
    if (section >= cableSection && currentCapacity[section as keyof typeof currentCapacity] >= transformerNominalCurrent) {
      recommendedCableSection = section;
      break;
    }
  }
  
  // Generate recommendations
  const recommendations: string[] = [];
  const warnings: string[] = [];
  
  if (shortCircuitCurrentCombined > 10000) {
    recommendations.push("Curentul de scurtcircuit depășește 10kA. Recomandăm întrerupătoare cu capacitate mare de rupere.");
  }
  
  // More specific recommendations based on the calculations
  recommendations.push(`Folosiți întrerupător MCCB de ${recommendedBreakerRating}A cu Icu ≥ ${Math.ceil(shortCircuitCurrentCombined / 1000) + 2}kA pentru protecție completă la scurtcircuit.`);
  
  if (limitingFactor === "transformator") {
    recommendations.push("Impedanța transformatorului este factorul limitativ principal. Verificați parametrii transformatorului.");
  } else {
    recommendations.push("Rezistența cablului este factorul limitativ principal. Considerați secțiuni mai mari pentru a reduce căderea de tensiune.");
  }
  
  if (recommendedCableSection > cableSection) {
    recommendations.push(`Recomandăm creșterea secțiunii cablului la ${recommendedCableSection}mm² pentru menținerea căderilor de tensiune în limite acceptabile.`);
  }
  
  if (shortCircuitCurrentCombined < 1000) {
    warnings.push("Curentul de scurtcircuit calculat este neobișnuit de mic. Verificați parametrii de intrare.");
  }
  
  if (shortCircuitCurrentCombined > 50000) {
    warnings.push("Curentul de scurtcircuit este foarte mare. Verificați corectitudinea parametrilor și asigurați-vă că echipamentele de protecție sunt dimensionate corespunzător.");
  }
  
  return {
    shortCircuitCurrent: parseFloat(shortCircuitCurrentCombined.toFixed(2)),
    transformerNominalCurrent: parseFloat(transformerNominalCurrent.toFixed(2)),
    transformerShortCircuitCurrent: parseFloat(transformerShortCircuitCurrent.toFixed(2)),
    cableShortCircuitCurrent: parseFloat(shortCircuitCurrent.toFixed(2)),
    voltageDropShortCircuit: parseFloat(shortCircuitVoltageDrop.toFixed(2)),
    voltageDropPercentageShortCircuit: parseFloat(shortCircuitVoltageDropPercentage.toFixed(2)),
    voltageDropNominal: parseFloat(nominalVoltageDrop.toFixed(2)),
    voltageDropPercentageNominal: parseFloat(nominalVoltageDropPercentage.toFixed(2)),
    limitingFactor,
    transformerImpedance: parseFloat((transformerZ).toFixed(4)),
    cableImpedance: parseFloat((cableZ).toFixed(4)),
    totalImpedance: parseFloat(totalZ.toFixed(4)),
    minBreakerRating,
    recommendedBreakerRating,
    recommendedCableSection,
    recommendations,
    warnings
  };
};
