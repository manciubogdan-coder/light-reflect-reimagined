
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
  
  // Calculate transformer impedance (Ω)
  const transformerZ = (voltage * voltage * transformerImpedance) / transformerPower;
  
  // Calculate cable impedance (Ω)
  const resistivity = RESISTIVITY[cableMaterial as keyof typeof RESISTIVITY];
  const cableR = (resistivity * cableLength) / cableSection;
  
  // Approximate cable reactance (Ω) - simplified model
  const cableX = 0.08 * cableLength / 1000;
  
  // Total impedance (Ω) - simplified calculation
  const totalZ = Math.sqrt(Math.pow(transformerZ, 2) + Math.pow(cableR, 2) + Math.pow(cableX, 2));
  
  // Calculate short circuit current (A)
  const shortCircuitCurrent = voltage / (Math.sqrt(3) * totalZ);
  
  // Determine limiting factor
  const limitingFactor = transformerZ > cableR ? "transformator" : "cablu";
  
  // Determine minimum breaker rating based on short circuit current
  // The breaker must be able to interrupt the calculated short circuit current
  let minBreakerRating = 0;
  for (const rating of STANDARD_BREAKER_SIZES) {
    if (rating * 10 >= shortCircuitCurrent) {
      minBreakerRating = rating;
      break;
    }
  }
  
  // If no breaker is suitable, recommend the largest available
  if (minBreakerRating === 0) {
    minBreakerRating = STANDARD_BREAKER_SIZES[STANDARD_BREAKER_SIZES.length - 1];
  }
  
  // Calculate recommended breaker rating based on short circuit current
  // Recommended rating should be at least 25% greater than minimum for safety margin
  let recommendedBreakerRating = 0;
  const safetyMarginCurrent = shortCircuitCurrent * 1.25;
  
  for (const rating of STANDARD_BREAKER_SIZES) {
    if (rating * 10 >= safetyMarginCurrent) {
      recommendedBreakerRating = rating;
      break;
    }
  }
  
  if (recommendedBreakerRating === 0) {
    recommendedBreakerRating = STANDARD_BREAKER_SIZES[STANDARD_BREAKER_SIZES.length - 1];
  }
  
  // Calculate recommended cable section based on short circuit current and voltage drop
  let recommendedCableSection = cableSection;
  
  // Increase section if needed for voltage drop
  const currentCapacity = CURRENT_CAPACITY[cableMaterial as keyof typeof CURRENT_CAPACITY];
  for (const section of STANDARD_SECTIONS) {
    if (section >= cableSection && currentCapacity[section as keyof typeof currentCapacity] >= minBreakerRating) {
      recommendedCableSection = section;
      break;
    }
  }
  
  // Generate recommendations
  const recommendations: string[] = [];
  const warnings: string[] = [];
  
  if (shortCircuitCurrent > 10000) {
    recommendations.push("Curentul de scurtcircuit depășește 10kA. Recomandăm întrerupătoare cu capacitate mare de rupere.");
  }
  
  if (limitingFactor === "transformator") {
    recommendations.push("Impedanța transformatorului este factorul limitativ principal. Verificați parametrii transformatorului.");
  } else {
    recommendations.push("Rezistența cablului este factorul limitativ principal. Considerați secțiuni mai mari pentru a reduce căderea de tensiune.");
  }
  
  if (minBreakerRating < 32) {
    recommendations.push("Curentul de scurtcircuit calculat permite utilizarea întrerupătoarelor standard de joasă tensiune.");
  } else {
    recommendations.push("Utilizați întreruptoare cu capacitate de rupere ridicată (MCB sau MCCB) pentru acest nivel de curent.");
  }
  
  if (recommendedCableSection > cableSection) {
    recommendations.push(`Recomandăm creșterea secțiunii cablului la ${recommendedCableSection}mm² pentru menținerea căderilor de tensiune în limite acceptabile.`);
  }
  
  if (shortCircuitCurrent < 1000) {
    warnings.push("Curentul de scurtcircuit calculat este neobișnuit de mic. Verificați parametrii de intrare.");
  }
  
  if (shortCircuitCurrent > 50000) {
    warnings.push("Curentul de scurtcircuit este foarte mare. Verificați corectitudinea parametrilor și asigurați-vă că echipamentele de protecție sunt dimensionate corespunzător.");
  }
  
  return {
    shortCircuitCurrent: parseFloat(shortCircuitCurrent.toFixed(2)),
    limitingFactor,
    minBreakerRating,
    recommendedBreakerRating,
    recommendedCableSection,
    recommendations,
    warnings
  };
};
