export type ComponentType = 
  | 'breaker' 
  | 'rcd' 
  | 'rcbo' 
  | 'spd' 
  | 'isolator' 
  | 'contactor'
  | 'fuse'
  | 'terminal'
  | 'timeRelay'
  | 'phaseRelay'
  | 'separator';

export interface PanelComponent {
  id: string;
  type: ComponentType;
  name: string;
  description: string;
  position: number;
  width: number; // number of modules
  curve?: CurveType;
  rating: RatingType;
  diffProtection?: DiffProtectionType;
  phases: PhaseType[];
  connections?: string[]; // IDs of connected components
  heat?: number; // Heat generation in watts
}

export interface ValidationRule {
  id: string;
  description: string;
  checkFunction: (panel: PanelComponent[]) => ValidationResult | null;
}

export interface ValidationResult {
  type: 'warning' | 'error' | 'info';
  message: string;
  affectedComponents?: string[]; // IDs of affected components
  normative?: string; // Reference to the electrical code/standard
  recommendation?: string;
}

export interface PanelConfiguration {
  id: string;
  name: string;
  components: PanelComponent[];
  moduleCount: number;
  supplyType: 'single-phase' | 'three-phase';
  mainRating?: RatingType;
}

export interface PhaseLoad {
  phase: PhaseType;
  current: number;
  components: PanelComponent[];
}

export interface PanelAnalysis {
  totalCurrent: number;
  phaseLoads: PhaseLoad[];
  recommendedMainBreaker: RatingType;
  isBalanced: boolean;
  balance: {
    maxImbalance: number;
    recommendations: string[];
  };
  temperature: number; // Estimated panel temperature in Celsius
  usedSpace: number; // Percentage of used space
  hasSufficientVentilation: boolean; // Whether panel has at least 30% free space
  recommendations: string[]; // General recommendations
}

// Heat generation per amp for different component types (in watts)
export const COMPONENT_HEAT_FACTORS: Record<ComponentType, number> = {
  breaker: 0.8,
  rcd: 1.2,
  rcbo: 1.4,
  spd: 0.5,
  isolator: 0.3,
  contactor: 1.0,
  fuse: 0.7,
  separator: 0.1,
  terminal: 0.05,
  timeRelay: 2,
  phaseRelay: 2
};

// Base ambient temperature
export const BASE_AMBIENT_TEMP = 20;

export const COMPONENT_TEMPLATES: Record<ComponentType, Partial<PanelComponent>> = {
  breaker: {
    type: 'breaker',
    width: 1,
    diffProtection: 'none',
    phases: ['L1'],
  },
  rcd: {
    type: 'rcd',
    width: 2,
    diffProtection: '30mA',
    phases: ['L1', 'N'],
  },
  rcbo: {
    type: 'rcbo', 
    width: 1,
    diffProtection: '30mA',
    phases: ['L1', 'N'],
  },
  spd: {
    type: 'spd',
    width: 3,
    phases: ['L1', 'L2', 'L3', 'N', 'PE'],
  },
  isolator: {
    type: 'isolator',
    width: 1,
    phases: ['L1'],
  },
  contactor: {
    type: 'contactor',
    width: 1,
    phases: ['L1'],
  },
  fuse: {
    type: 'fuse',
    width: 3,
    rating: '63',
    phases: ['L1', 'L2', 'L3']
  },
  separator: {
    type: 'separator',
    width: 3,
    rating: '63',
    phases: ['L1', 'L2', 'L3']
  },
  terminal: {
    type: 'terminal',
    width: 2,
    rating: '63',
    phases: ['L1', 'L2', 'L3', 'N', 'PE']
  },
  timeRelay: {
    width: 2,
    rating: '16',
    phases: ['L1'],
    heat: 2,
    description: 'Releu de timp'
  },
  phaseRelay: {
    width: 2,
    rating: '16',
    phases: ['L1', 'L2', 'L3'],
    heat: 2,
    description: 'Releu de fază'
  }
};

export const EDUCATION_TIPS = [
  {
    id: "bathroom-rcd",
    title: "Protecție pentru băi",
    content: "Toate prizele din băi trebuie protejate cu un dispozitiv diferențial de 30mA conform normativului HD 60364.",
    trigger: ["bathroom", "bath", "baie"]
  },
  {
    id: "kitchen-protection",
    title: "Circuite bucătărie",
    content: "Se recomandă circuite separate pentru aparatele mari consumatoare din bucătărie (cuptor, plită, mașină de spălat).",
    trigger: ["kitchen", "bucătărie"]
  },
  {
    id: "phase-balance",
    title: "Echilibrare faze",
    content: "Într-un sistem trifazat, încărcarea trebuie distribuită cât mai echilibrat între cele trei faze pentru eficiență maximă.",
    trigger: ["balancing", "echilibrare", "trifazic", "three-phase"]
  },
  {
    id: "selective-protection",
    title: "Protecție selectivă",
    content: "Dispozitivele de protecție trebuie coordonate astfel încât doar cel mai apropiat de defect să declanșeze.",
    trigger: ["selective", "selectivitate"]
  },
  {
    id: "surge-protection",
    title: "Protecție la supratensiune",
    content: "Utilizarea unui dispozitiv SPD (Surge Protection Device) protejează echipamentele sensibile împotriva supratensiunilor.",
    trigger: ["surge", "spd", "supratensiune"]
  },
  {
    id: "ventilation",
    title: "Ventilare tablou",
    content: "Tabloul electric trebuie să aibă minim 30% spațiu liber pentru ventilație adecvată conform normativelor.",
    trigger: ["ventilation", "ventilare", "spatiu", "aerisire"]
  },
  {
    id: "terminal-blocks",
    title: "Cleme de distribuție",
    content: "Utilizarea clemelor de distribuție asigură o conexiune sigură și organizată a circuitelor în tablou.",
    trigger: ["terminal", "cleme", "distributie"]
  }
];
