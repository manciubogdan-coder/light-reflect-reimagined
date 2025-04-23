

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
  contextualRecommendation?: string;  // Add new optional field
}

