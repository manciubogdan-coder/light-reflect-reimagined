
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
