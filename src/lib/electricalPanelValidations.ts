
import { PanelComponent, ValidationRule, ValidationResult } from './electricalPanelTypes';
import { v4 as uuidv4 } from 'uuid';

// Helper functions
const hasDifferentialProtection = (component: PanelComponent): boolean => 
  component.diffProtection !== undefined && component.diffProtection !== 'none';

const isSocket = (component: PanelComponent): boolean =>
  component.description.toLowerCase().includes('priză') || 
  component.description.toLowerCase().includes('prize') ||
  component.description.toLowerCase().includes('socket');

const isBathroom = (component: PanelComponent): boolean =>
  component.description.toLowerCase().includes('baie') ||
  component.description.toLowerCase().includes('bath');

const isKitchen = (component: PanelComponent): boolean =>
  component.description.toLowerCase().includes('bucătărie') ||
  component.description.toLowerCase().includes('kitchen');

const isLighting = (component: PanelComponent): boolean =>
  component.description.toLowerCase().includes('iluminat') ||
  component.description.toLowerCase().includes('lighting');

const getCurrent = (rating: string): number => {
  return parseInt(rating, 10);
};

// Validation rules
export const VALIDATION_RULES: ValidationRule[] = [
  {
    id: uuidv4(),
    description: "Verificare protecție diferențială pentru prize",
    checkFunction: (components: PanelComponent[]): ValidationResult | null => {
      const socketComponents = components.filter(isSocket);
      const unprotectedSockets = socketComponents.filter(
        comp => !hasDifferentialProtection(comp) && 
        !components.some(
          other => other.type === 'rcd' && 
          other.phases.some(phase => comp.phases.includes(phase))
        )
      );
      
      if (unprotectedSockets.length > 0) {
        return {
          type: 'warning',
          message: "Prize fără protecție diferențială detectate",
          affectedComponents: unprotectedSockets.map(c => c.id),
          normative: "HD 60364-4-41",
          recommendation: "Adăugați un dispozitiv diferențial (RCD) de 30mA pentru circuitele de prize"
        };
      }
      return null;
    }
  },
  {
    id: uuidv4(),
    description: "Verificare protecție diferențială pentru băi",
    checkFunction: (components: PanelComponent[]): ValidationResult | null => {
      const bathroomComponents = components.filter(isBathroom);
      const unprotectedBathroom = bathroomComponents.filter(
        comp => !hasDifferentialProtection(comp) && 
        !components.some(
          other => other.type === 'rcd' && 
          other.phases.some(phase => comp.phases.includes(phase))
        )
      );
      
      if (unprotectedBathroom.length > 0) {
        return {
          type: 'error',
          message: "Circuite de baie fără protecție diferențială",
          affectedComponents: unprotectedBathroom.map(c => c.id),
          normative: "HD 60364-7-701",
          recommendation: "Este obligatoriu să utilizați protecție diferențială de 30mA pentru orice circuit din baie"
        };
      }
      return null;
    }
  },
  {
    id: uuidv4(),
    description: "Verificare SPD pentru protecția generală",
    checkFunction: (components: PanelComponent[]): ValidationResult | null => {
      const hasSPD = components.some(c => c.type === 'spd');
      
      if (!hasSPD) {
        return {
          type: 'info',
          message: "Nu există protecție la supratensiune (SPD)",
          normative: "HD 60364-4-443",
          recommendation: "Se recomandă instalarea unui dispozitiv SPD pentru protecția echipamentelor sensibile"
        };
      }
      return null;
    }
  },
  {
    id: uuidv4(),
    description: "Verificare secționare fiecare circuit",
    checkFunction: (components: PanelComponent[]): ValidationResult | null => {
      // Group by phases
      const phaseCircuits = components
        .filter(c => c.type !== 'spd' && c.type !== 'rcd')
        .reduce((acc, comp) => {
          comp.phases.forEach(phase => {
            if (!['N', 'PE'].includes(phase)) {
              if (!acc[phase]) acc[phase] = [];
              acc[phase].push(comp);
            }
          });
          return acc;
        }, {} as Record<string, PanelComponent[]>);
      
      const phasesMissingBreaker = Object.entries(phaseCircuits)
        .filter(([_, comps]) => !comps.some(c => c.type === 'breaker' || c.type === 'rcbo'))
        .map(([phase]) => phase);
      
      if (phasesMissingBreaker.length > 0) {
        return {
          type: 'warning',
          message: `Faze fără întrerupător principal: ${phasesMissingBreaker.join(', ')}`,
          normative: "HD 60364-4-43",
          recommendation: "Fiecare circuit activ trebuie să aibă protecție la supracurent"
        };
      }
      return null;
    }
  },
  {
    id: uuidv4(),
    description: "Verificare încărcare pe faze",
    checkFunction: (components: PanelComponent[]): ValidationResult | null => {
      // Calculate load per phase
      const phaseLoads = {
        L1: 0,
        L2: 0,
        L3: 0
      };
      
      components
        .filter(c => c.type === 'breaker' || c.type === 'rcbo')
        .forEach(comp => {
          const current = getCurrent(comp.rating);
          comp.phases.forEach(phase => {
            if (phase === 'L1') phaseLoads.L1 += current;
            if (phase === 'L2') phaseLoads.L2 += current;
            if (phase === 'L3') phaseLoads.L3 += current;
          });
        });
      
      // Check if we have a three-phase panel
      const isThreePhase = components.some(c => c.phases.includes('L2') || c.phases.includes('L3'));
      
      if (isThreePhase) {
        const loads = [phaseLoads.L1, phaseLoads.L2, phaseLoads.L3];
        const maxLoad = Math.max(...loads);
        const minLoad = Math.min(...loads);
        
        if (maxLoad > 0 && (maxLoad - minLoad) / maxLoad > 0.2) {
          return {
            type: 'warning',
            message: "Încărcare dezechilibrată pe faze",
            normative: "HD 60364-5-52",
            recommendation: `Distribuiți consumatorii mai echilibrat. Încărcare actuală: L1=${phaseLoads.L1}A, L2=${phaseLoads.L2}A, L3=${phaseLoads.L3}A`
          };
        }
      }
      return null;
    }
  }
];

export function validatePanel(components: PanelComponent[]): ValidationResult[] {
  return VALIDATION_RULES
    .map(rule => rule.checkFunction(components))
    .filter((result): result is ValidationResult => result !== null);
}

export function analyzePanel(components: PanelComponent[], supplyType: 'single-phase' | 'three-phase'): { 
  totalCurrent: number;
  phaseCurrents: Record<string, number>;
  recommendedMainBreaker: string;
  recommendations: string[];
} {
  // Calculate load per phase
  const phaseCurrents = {
    L1: 0,
    L2: 0,
    L3: 0
  };
  
  components
    .filter(c => c.type === 'breaker' || c.type === 'rcbo')
    .forEach(comp => {
      const current = getCurrent(comp.rating);
      comp.phases.forEach(phase => {
        if (phase === 'L1') phaseCurrents.L1 += current;
        if (phase === 'L2') phaseCurrents.L2 += current;
        if (phase === 'L3') phaseCurrents.L3 += current;
      });
    });
  
  let totalCurrent: number;
  let recommendedMainBreaker: string;
  const recommendations: string[] = [];
  
  if (supplyType === 'single-phase') {
    totalCurrent = phaseCurrents.L1;
    
    if (totalCurrent <= 16) recommendedMainBreaker = '20';
    else if (totalCurrent <= 25) recommendedMainBreaker = '32';
    else if (totalCurrent <= 40) recommendedMainBreaker = '50';
    else recommendedMainBreaker = '63';
    
    if (totalCurrent > 40) {
      recommendations.push("Consumul total depășește 40A. Considerați trecerea la alimentare trifazică pentru o distribuție mai bună a sarcinii.");
    }
  } else {
    // For three-phase, use the most loaded phase for main breaker sizing
    totalCurrent = Math.max(phaseCurrents.L1, phaseCurrents.L2, phaseCurrents.L3);
    
    if (totalCurrent <= 16) recommendedMainBreaker = '20';
    else if (totalCurrent <= 25) recommendedMainBreaker = '32';
    else if (totalCurrent <= 40) recommendedMainBreaker = '50';
    else if (totalCurrent <= 50) recommendedMainBreaker = '63';
    else recommendedMainBreaker = '80';
    
    // Check phase balance
    const loads = [phaseCurrents.L1, phaseCurrents.L2, phaseCurrents.L3];
    const maxLoad = Math.max(...loads);
    const minLoad = Math.min(...loads);
    
    if (maxLoad > 0 && (maxLoad - minLoad) / maxLoad > 0.2) {
      recommendations.push(`Dezechilibru între faze: L1=${phaseCurrents.L1}A, L2=${phaseCurrents.L2}A, L3=${phaseCurrents.L3}A. Redistribuiți circuitele pentru o încărcare mai echilibrată.`);
    }
  }
  
  return {
    totalCurrent,
    phaseCurrents,
    recommendedMainBreaker,
    recommendations
  };
}
