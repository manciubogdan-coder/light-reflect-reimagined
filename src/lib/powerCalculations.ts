
import { PowerCalculatorForm, PowerCalculationResult, PowerAppliance } from "./types";

const DEFAULT_POWER_FACTOR = 0.85;

export const APPLIANCE_TEMPLATES = [
  { id: 'tv', name: 'TV LED', defaultPower: 100, category: 'Electrocasnice' },
  { id: 'fridge', name: 'Frigider', defaultPower: 150, category: 'Electrocasnice' },
  { id: 'washing-machine', name: 'Mașină de spălat', defaultPower: 2000, category: 'Electrocasnice' },
  { id: 'electric-oven', name: 'Cuptor electric', defaultPower: 3000, category: 'Electrocasnice' },
  { id: 'electric-stove', name: 'Plită electrică', defaultPower: 6000, category: 'Electrocasnice' },
  { id: 'microwave', name: 'Cuptor cu microunde', defaultPower: 800, category: 'Electrocasnice' },
  { id: 'dishwasher', name: 'Mașină de spălat vase', defaultPower: 1500, category: 'Electrocasnice' },
  { id: 'electric-kettle', name: 'Fierbător electric', defaultPower: 2000, category: 'Electrocasnice' },
  { id: 'toaster', name: 'Prăjitor de pâine', defaultPower: 850, category: 'Electrocasnice' },
  { id: 'coffee-machine', name: 'Espressor cafea', defaultPower: 1500, category: 'Electrocasnice' },
  { id: 'led-light', name: 'Bec LED', defaultPower: 15, category: 'Iluminat' },
  { id: 'fluorescent-light', name: 'Tub fluorescent', defaultPower: 35, category: 'Iluminat' },
  { id: 'ac', name: 'Aer condiționat', defaultPower: 1200, category: 'Climatizare' },
  { id: 'electric-heater', name: 'Calorifer electric', defaultPower: 2000, category: 'Climatizare' },
  { id: 'water-heater', name: 'Boiler electric', defaultPower: 2000, category: 'Climatizare' },
  { id: 'hair-dryer', name: 'Uscător de păr', defaultPower: 1800, category: 'Personale' },
  { id: 'computer', name: 'Computer / PC', defaultPower: 300, category: 'Electronice' },
  { id: 'laptop', name: 'Laptop', defaultPower: 65, category: 'Electronice' },
  { id: 'monitor', name: 'Monitor', defaultPower: 50, category: 'Electronice' },
  { id: 'router', name: 'Router WiFi', defaultPower: 20, category: 'Electronice' },
  { id: 'power-drill', name: 'Mașină de găurit', defaultPower: 800, category: 'Scule' },
  { id: 'angle-grinder', name: 'Polizor unghiular', defaultPower: 2000, category: 'Scule' },
  { id: 'circular-saw', name: 'Fierăstrău circular', defaultPower: 1500, category: 'Scule' },
  { id: 'vacuum-cleaner', name: 'Aspirator', defaultPower: 1200, category: 'Curățenie' },
  { id: 'electric-car', name: 'Încărcător mașină electrică', defaultPower: 7200, category: 'Automobile' }
];

// Default simultaneity factors by building type
const SIMULTANEITY_FACTORS = {
  residential: 0.8,
  office: 0.7,
  workshop: 1.0,
  commercial: 0.65,
  industrial: 0.9
};

// Recommended main breaker sizes (amperes)
const BREAKER_SIZES = [16, 20, 25, 32, 40, 50, 63, 80, 100, 125, 160, 200, 250, 315, 400];

export const calculatePowerRequirements = (data: PowerCalculatorForm): PowerCalculationResult => {
  // Group appliances if specified
  const applianceGroups: { [key: string]: { groupName: string, totalPower: number, appliances: PowerAppliance[] } } = {};
  let groupedAppliances = false;
  
  data.appliances.forEach(appliance => {
    if (appliance.group) {
      groupedAppliances = true;
      if (!applianceGroups[appliance.group]) {
        applianceGroups[appliance.group] = {
          groupName: appliance.group,
          totalPower: 0,
          appliances: []
        };
      }
      
      const powerWithFactor = appliance.power * appliance.quantity;
      applianceGroups[appliance.group].totalPower += powerWithFactor;
      applianceGroups[appliance.group].appliances.push(appliance);
    }
  });

  // Calculate total power consumption
  let totalPower = 0;
  
  data.appliances.forEach(appliance => {
    let appliancePower = appliance.power * appliance.quantity;
    
    // Apply power factor if enabled
    if (data.includePowerFactor && appliance.powerFactor) {
      appliancePower = appliancePower / appliance.powerFactor;
    }
    
    totalPower += appliancePower;
  });
  
  // Apply simultaneity factor
  const simultaneityFactor = data.simultaneityFactor;
  const adjustedPower = totalPower * simultaneityFactor;
  
  // Convert to kilowatts for display
  const totalPowerKW = adjustedPower / 1000;
  
  // Determine recommendations
  const recommendedSupplyType = totalPowerKW > 8 ? 'trifazic' : 'monofazic';
  
  // Calculate recommended contract power (kVA)
  // We add 20% margin for safety
  const recommendedContractPower = Math.ceil(totalPowerKW * 1.2);
  
  // Calculate main breaker size
  let mainBreakerSize: number;
  
  if (recommendedSupplyType === 'monofazic') {
    // Single phase: I = P / (U * cos(phi))
    // Assuming 230V and power factor 0.9
    const current = (adjustedPower * 1.2) / (230 * 0.9);
    mainBreakerSize = findNextBreakerSize(current);
  } else {
    // Three phase: I = P / (sqrt(3) * U * cos(phi))
    // Assuming 400V and power factor 0.9
    const current = (adjustedPower * 1.2) / (Math.sqrt(3) * 400 * 0.9);
    mainBreakerSize = findNextBreakerSize(current);
  }
  
  // Generate warnings
  const warnings: string[] = [];
  
  if (totalPowerKW > 8) {
    warnings.push('Trecerea pe rețea trifazică este indicată pentru stabilitate și echilibrarea sarcinilor.');
  }
  
  if (totalPowerKW > 30) {
    warnings.push('Consum foarte mare. Se recomandă consultarea unui electrician autorizat ANRE pentru proiectarea instalației.');
  }

  return {
    totalPower: adjustedPower,
    totalPowerKW: totalPowerKW,
    recommendedSupplyType,
    recommendedContractPower,
    recommendedMainBreaker: `${mainBreakerSize}A`,
    warnings,
    applianceGroups: groupedAppliances ? applianceGroups : undefined
  };
};

// Helper function to find the next standard breaker size
function findNextBreakerSize(current: number): number {
  for (const size of BREAKER_SIZES) {
    if (size >= current) {
      return size;
    }
  }
  return BREAKER_SIZES[BREAKER_SIZES.length - 1]; // Return largest if current is too high
}

// Get default simultaneity factor based on building type
export const getDefaultSimultaneityFactor = (buildingType: string): number => {
  return SIMULTANEITY_FACTORS[buildingType as keyof typeof SIMULTANEITY_FACTORS] || 0.8;
};
