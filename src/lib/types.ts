
export interface CableCalculatorForm {
  power: string;
  currentType: string;
  voltage: string;
  length: string;
  material: string;
  installationType: string;
  simultaneityFactor: string;
  voltageDrop: string;
}

export interface CalculationResult {
  section: number;
  current: number;
  voltageDrop: number;
  voltageDropPercentage: number;
  fuseRating: number;
  reasonForSelection?: string;
  warnings?: string;
}
