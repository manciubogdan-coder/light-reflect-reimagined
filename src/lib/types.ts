
export interface CableCalculatorForm {
  power: string;
  currentType: string;
  voltage: string;
  length: string;
  material: string;
  installationType: string;
  simultaneityFactor: string;
  voltageDrop: string;
  calculationType: string;
}

export interface CalculationResult {
  section: number;
  current: number;
  voltageDrop: number;
  voltageDropPercentage: number;
  fuseRating: number;
  reasonForSelection?: string;
  warnings?: string;
  comparisonTable?: Array<{
    section: number;
    currentCapacity: number;
    voltageDropPercentage: number;
    meetsRequirements: boolean;
    reason: string;
  }>;
  contextualRecommendation?: string;
}

export interface PowerCalculatorForm {
  buildingType: string;
  simultaneityFactor: number;
  includePowerFactor: boolean;
  appliances: PowerAppliance[];
}

export interface PowerAppliance {
  id: string;
  type: string;
  name: string;
  quantity: number;
  power: number;
  powerFactor?: number;
  group?: string;
}

export interface PowerCalculationResult {
  totalPower: number;
  totalPowerKW: number;
  recommendedSupplyType: string;
  recommendedContractPower: number;
  recommendedMainBreaker: string;
  warnings: string[];
  applianceGroups?: {
    [key: string]: {
      groupName: string;
      totalPower: number;
      appliances: PowerAppliance[];
    }
  };
}

export interface ApplianceTemplate {
  id: string;
  name: string;
  defaultPower: number;
  defaultPowerFactor?: number;
  icon?: string;
  category: string;
}

// Fixed interface for calculatorul de iluminat
export interface LightingCalculatorForm {
  roomType: string;
  area: string;
  roomHeight?: string;
  lightingLevel: string;
  lightSourceType: string;
  fixtureType: string;
}

export interface LightingCalculationResult {
  totalPower: number;
  recommendedFixtures: LightingFixtureRecommendation[];
  professionalRecommendation: string;
  warnings: string[];
}

export interface LightingFixtureRecommendation {
  fixtureType: string;
  fixtureCount: number;
  fixtureFlux: number;
  totalFlux: number;
  power: number;
}

export interface RoomTypeInfo {
  name: string;
  defaultLux: number;
  description?: string;
}
