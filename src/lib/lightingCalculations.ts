
import { LightingCalculationResult, LightingCalculatorForm, LightingFixtureRecommendation } from "./types";

// Constante pentru calcule
const SOURCE_EFFICIENCY = {
  led: 100, // lm/W
  fluorescent: 60, // lm/W
  incandescent: 15 // lm/W
};

const FIXTURE_FLUX = {
  "led-small": 1500, // lm
  "led-medium": 3000, // lm
  "led-large": 6000 // lm
};

// Valorile standard de iluminare pentru diferite tipuri de încăperi (lux)
export const ROOM_TYPES = {
  living: { name: "Living", defaultLux: 150, description: "Spațiu de relaxare și socializare" },
  bedroom: { name: "Dormitor", defaultLux: 100, description: "Spațiu de odihnă" },
  kitchen: { name: "Bucătărie", defaultLux: 250, description: "Prepararea și consumul alimentelor" },
  bathroom: { name: "Baie", defaultLux: 250, description: "Igienă personală" },
  office: { name: "Birou", defaultLux: 500, description: "Activități de concentrare și lucru la calculator" },
  store: { name: "Magazin", defaultLux: 700, description: "Spațiu comercial" },
  workshop: { name: "Atelier", defaultLux: 700, description: "Activități precise manuale" },
  warehouse: { name: "Hală industrială", defaultLux: 1000, description: "Procese industriale" }
};

/**
 * Calculează necesarul de iluminat
 */
export const calculateLighting = (formData: LightingCalculatorForm): LightingCalculationResult => {
  // Extragerea datelor din formular
  const area = parseFloat(formData.area);
  const lightingLevel = parseInt(formData.lightingLevel);
  const sourceEfficiency = SOURCE_EFFICIENCY[formData.lightSourceType as keyof typeof SOURCE_EFFICIENCY];
  
  // Calcul flux luminos total necesar (lm) = Suprafața (m²) × Nivel iluminare (lux)
  const totalLumensNeeded = area * lightingLevel;
  
  // Calcul putere totală necesară (W) = Flux luminos / Eficiență sursă
  const totalPower = Math.ceil(totalLumensNeeded / sourceEfficiency);

  // Calcularea recomandărilor pentru corpuri de iluminat
  const recommendedFixtures: LightingFixtureRecommendation[] = [];
  
  // Pentru fiecare tip de corp de iluminat, calculăm câte ar fi necesare
  Object.entries(FIXTURE_FLUX).forEach(([fixtureType, flux]) => {
    // Calculul numărului de corpuri
    const fixtureCount = Math.ceil(totalLumensNeeded / flux);
    
    // Puterea consumată de aceste corpuri
    const fixturePower = Math.ceil((flux * fixtureCount) / sourceEfficiency);
    
    // Adăugarea recomandării
    recommendedFixtures.push({
      fixtureType: getFixtureTypeName(fixtureType),
      fixtureCount,
      fixtureFlux: flux,
      totalFlux: flux * fixtureCount,
      power: fixturePower
    });
  });

  // Sortarea recomandărilor în funcție de numărul de corpuri (preferăm mai puține corpuri)
  recommendedFixtures.sort((a, b) => a.fixtureCount - b.fixtureCount);

  // Generarea recomandării profesionale pe baza celei mai bune opțiuni
  const bestOption = recommendedFixtures[0];
  const professionalRecommendation = `Optim: ${bestOption.fixtureCount} ${getBestFixtureDescription(bestOption.fixtureType, formData.roomType)} de ${bestOption.fixtureFlux} lm pentru o iluminare uniformă.`;

  // Verificare pentru avertismente
  const warnings: string[] = [];
  if (area < 5) {
    warnings.push("Suprafața introdusă este foarte mică. Verificați măsurătorile.");
  }
  if (area > 1000) {
    warnings.push("Pentru suprafețe foarte mari, este recomandat un studiu DIALux detaliat.");
  }

  return {
    totalPower,
    recommendedFixtures,
    professionalRecommendation,
    warnings
  };
};

/**
 * Convertește codul corpului de iluminat în nume afișabil
 */
const getFixtureTypeName = (fixtureType: string): string => {
  const names: {[key: string]: string} = {
    "led-small": "Corpuri LED mici",
    "led-medium": "Corpuri LED medii",
    "led-large": "Panouri LED mari"
  };
  
  return names[fixtureType] || fixtureType;
};

/**
 * Generează o descriere pentru tipul optim de corp de iluminat în funcție de încăpere
 */
const getBestFixtureDescription = (fixtureType: string, roomType: string): string => {
  if (roomType === "living" || roomType === "bedroom") {
    return "spoturi LED încastrabile";
  } else if (roomType === "kitchen" || roomType === "bathroom") {
    return "corpuri LED impermeabile";
  } else if (roomType === "office") {
    return "panouri LED cu lumină neutră";
  } else if (roomType === "store") {
    return "spoturi LED directionabile";
  } else if (roomType === "workshop" || roomType === "warehouse") {
    return "corpuri industriale LED";
  }
  
  // Implicit pentru alte situații
  return "corpuri LED";
};
