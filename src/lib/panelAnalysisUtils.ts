
import { PanelComponent, PhaseType, PhaseLoad, PanelAnalysis, RatingType, COMPONENT_HEAT_FACTORS } from './electricalPanelTypes';

export function analyzePanel(
  components: PanelComponent[],
  supplyType: 'single-phase' | 'three-phase',
  moduleCount: number = 36
): PanelAnalysis {
  // Initialize phase loads
  const phaseMap: Record<PhaseType, PanelComponent[]> = {
    'L1': [],
    'L2': [],
    'L3': [],
    'N': [],
    'PE': []
  };
  
  // Group components by phase
  components.forEach(component => {
    component.phases.forEach(phase => {
      if (phaseMap[phase]) {
        phaseMap[phase].push(component);
      }
    });
  });
  
  // Calculate current per phase
  const phaseLoads: PhaseLoad[] = Object.entries(phaseMap).map(([phase, comps]) => {
    const phaseCurrent = comps.reduce((sum, comp) => sum + parseFloat(comp.rating), 0);
    return {
      phase: phase as PhaseType,
      current: phaseCurrent,
      components: comps
    };
  });
  
  // Calculate total current (take the highest phase for three-phase)
  const totalCurrent = supplyType === 'three-phase' 
    ? Math.max(...['L1', 'L2', 'L3'].map(phase => 
        phaseLoads.find(pl => pl.phase === phase)?.current || 0
      ))
    : phaseLoads.find(pl => pl.phase === 'L1')?.current || 0;
  
  // Determine recommended breaker size
  const standardRatings: RatingType[] = ['6', '10', '16', '20', '25', '32', '40', '50', '63'];
  let recommendedMainBreaker: RatingType = '6'; 
  
  for (const rating of standardRatings) {
    if (parseFloat(rating) >= totalCurrent * 1.25) { // 25% safety margin
      recommendedMainBreaker = rating;
      break;
    }
  }
  
  // Check phase balance (for three-phase only)
  let isBalanced = true;
  let maxImbalance = 0;
  let balanceRecommendations: string[] = [];
  
  if (supplyType === 'three-phase') {
    const phaseCurrents = ['L1', 'L2', 'L3'].map(phase => 
      phaseLoads.find(pl => pl.phase === phase)?.current || 0
    );
    
    const minCurrent = Math.min(...phaseCurrents);
    const maxCurrent = Math.max(...phaseCurrents);
    
    if (minCurrent === 0) {
      isBalanced = false;
      balanceRecommendations.push('Adăugați sarcini pe toate fazele pentru o distribuție echilibrată.');
    } else {
      maxImbalance = (maxCurrent - minCurrent) / maxCurrent * 100;
      isBalanced = maxImbalance <= 15; // 15% is generally acceptable imbalance
      
      if (!isBalanced) {
        balanceRecommendations.push(`Dezechilibru de ${maxImbalance.toFixed(1)}% între faze. Recomandare: redistribuiți sarcinile pentru echilibrare.`);
      }
    }
  }
  
  // Calculate heat generation and temperature
  let totalHeat = 0;
  components.forEach(component => {
    const current = parseFloat(component.rating);
    const heatFactor = COMPONENT_HEAT_FACTORS[component.type] || 0.5;
    totalHeat += current * heatFactor;
  });
  
  // Calculate temperature (simplified model - base temp + heat factor)
  const temperature = 20 + (totalHeat * 0.15); // base ambient + heat factor
  
  // Calculate used space
  const totalModulesUsed = components.reduce((acc, comp) => acc + comp.width, 0);
  const usedSpace = (totalModulesUsed / moduleCount) * 100;
  const hasSufficientVentilation = usedSpace <= 70; // 30% free space requirement
  
  // Generate recommendations
  const recommendations: string[] = [];
  
  // Add recommendations based on analysis
  if (!hasSufficientVentilation) {
    recommendations.push('Tabloul nu are suficient spațiu liber pentru ventilație. Minim 30% din spațiu trebuie să rămână liber conform normativelor.');
  }
  
  if (temperature > 45) {
    recommendations.push(`Temperatura estimată de ${temperature.toFixed(1)}°C este ridicată. Verificați ventilația tabloului.`);
  }
  
  if (supplyType === 'three-phase') {
    recommendations.push(`Siguranță principală recomandată: ${recommendedMainBreaker}A trifazic.`);
    recommendations.push(...balanceRecommendations);
  } else {
    recommendations.push(`Siguranță principală recomandată: ${recommendedMainBreaker}A.`);
  }
  
  return {
    totalCurrent,
    phaseLoads,
    recommendedMainBreaker,
    isBalanced,
    balance: {
      maxImbalance,
      recommendations: balanceRecommendations
    },
    temperature,
    usedSpace,
    hasSufficientVentilation,
    recommendations
  };
}
