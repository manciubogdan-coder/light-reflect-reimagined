
import { useState, useEffect } from 'react';
import { PanelComponent, ComponentType, RatingType, DiffProtectionType, PhaseType } from '@/lib/electricalPanelTypes';
import { v4 as uuidv4 } from 'uuid';
import { analyzePanel } from '@/lib/electricalPanelValidations';

type SuggestionSeverity = 'high' | 'medium' | 'low';

interface AISuggestion {
  id: string;
  title: string;
  description: string;
  componentType: ComponentType;
  position: number;
  severity: SuggestionSeverity;
  educationalTip?: string;
  normative?: string;
  rating?: RatingType;
  diffProtection?: DiffProtectionType;
  phases?: PhaseType[];
  name?: string;
  width?: number;
}

export function useAISuggestions(
  components: PanelComponent[],
  moduleCount: number,
  supplyType: 'single-phase' | 'three-phase'
) {
  const [suggestions, setSuggestions] = useState<AISuggestion[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeHoverSuggestion, setActiveHoverSuggestion] = useState<string | null>(null);

  // Generate AI suggestions based on panel configuration
  useEffect(() => {
    const generateSuggestions = async () => {
      setIsAnalyzing(true);

      // Simulate a brief delay for the "AI analysis" effect
      await new Promise(resolve => setTimeout(resolve, 1000));

      const newSuggestions: AISuggestion[] = [];
      const analysis = analyzePanel(components, supplyType);
      
      // Check for bathroom circuits without differential protection
      const hasBathroomCircuit = components.some(component => 
        component.description.toLowerCase().includes('baie') || 
        component.description.toLowerCase().includes('bath')
      );
      
      const hasBathroomRCD = components.some(component => 
        (component.type === 'rcd' || component.type === 'rcbo') &&
        (component.description.toLowerCase().includes('baie') || 
         component.description.toLowerCase().includes('bath'))
      );
      
      if (hasBathroomCircuit && !hasBathroomRCD) {
        // Find a good position for the RCBO
        const availablePosition = findAvailablePosition(components, moduleCount, 1);
        
        if (availablePosition !== -1) {
          newSuggestions.push({
            id: uuidv4(),
            title: 'RCBO pentru circuite baie',
            description: 'Siguranță diferențială pentru protecția circuitelor din baie',
            componentType: 'rcbo',
            position: availablePosition,
            severity: 'high',
            educationalTip: 'Prizele din baie trebuie protejate cu dispozitiv diferențial de 30mA conform normativului HD 60364-7-701.',
            normative: 'HD 60364-7-701',
            rating: '16' as RatingType,
            diffProtection: '30mA' as DiffProtectionType,
            name: 'RCBO Baie'
          });
        }
      }

      // Check if there are multiple lighting circuits without RCD
      const lightingCircuits = components.filter(component => 
        component.description.toLowerCase().includes('light') ||
        component.description.toLowerCase().includes('lumin') || 
        component.description.toLowerCase().includes('ilumin')
      );
      
      const hasLightingRCD = components.some(component => 
        component.type === 'rcd' && (
          component.description.toLowerCase().includes('light') ||
          component.description.toLowerCase().includes('lumin') || 
          component.description.toLowerCase().includes('ilumin')
        )
      );
      
      if (lightingCircuits.length >= 3 && !hasLightingRCD) {
        // Find a good position for the RCD
        const availablePosition = findAvailablePosition(components, moduleCount, 2);
        
        if (availablePosition !== -1) {
          newSuggestions.push({
            id: uuidv4(),
            title: 'RCD pentru iluminat',
            description: 'Protecție diferențială pentru circuitele de iluminat',
            componentType: 'rcd',
            position: availablePosition,
            severity: 'medium',
            educationalTip: 'Gruparea circuitelor de iluminat sub un RCD comun de 100mA oferă protecție suplimentară împotriva electrocutării.',
            normative: 'HD 60364-4-41',
            rating: '40' as RatingType,
            diffProtection: '100mA' as DiffProtectionType,
            name: 'RCD Iluminat'
          });
        }
      }

      // Check for surge protection
      const hasSPD = components.some(component => component.type === 'spd');
      
      if (!hasSPD && moduleCount > 12) {
        // Find a good position for the SPD
        const availablePosition = findAvailablePosition(components, moduleCount, 3);
        
        if (availablePosition !== -1) {
          newSuggestions.push({
            id: uuidv4(),
            title: 'Protecție la supratensiune',
            description: 'SPD pentru protecția echipamentelor electronice sensibile',
            componentType: 'spd',
            position: availablePosition,
            severity: 'medium',
            educationalTip: 'Un dispozitiv SPD protejează echipamentele sensibile împotriva supratensiunilor cauzate de trăsnete sau comutații în rețeaua electrică.',
            normative: 'HD 60364-4-443',
            name: 'SPD Tip 2'
          });
        }
      }

      // Check for phase imbalance in three-phase systems
      if (supplyType === 'three-phase') {
        const phaseLoads = {
          L1: 0,
          L2: 0,
          L3: 0
        };
        
        components.forEach(comp => {
          if (comp.phases.includes('L1' as PhaseType)) phaseLoads.L1++;
          if (comp.phases.includes('L2' as PhaseType)) phaseLoads.L2++;
          if (comp.phases.includes('L3' as PhaseType)) phaseLoads.L3++;
        });
        
        const maxLoad = Math.max(phaseLoads.L1, phaseLoads.L2, phaseLoads.L3);
        const minLoad = Math.min(phaseLoads.L1, phaseLoads.L2, phaseLoads.L3);
        
        if (maxLoad > 0 && (maxLoad - minLoad) / maxLoad > 0.3) {
          // Find which phase has the minimum load
          let targetPhase: PhaseType = 'L1';
          if (phaseLoads.L2 === minLoad) targetPhase = 'L2';
          else if (phaseLoads.L3 === minLoad) targetPhase = 'L3';
          
          // Find a circuit to suggest migration
          const circuits = components.filter(comp => 
            comp.type === 'breaker' && 
            !comp.phases.includes(targetPhase)
          );
          
          if (circuits.length > 0) {
            newSuggestions.push({
              id: uuidv4(),
              title: 'Reechilibrare faze',
              description: `Redistribuiți circuitele pentru a echilibra încărcarea pe faza ${targetPhase}`,
              componentType: 'breaker', // This is a special suggestion that doesn't create a component directly
              position: -1, // No specific position
              severity: 'medium',
              educationalTip: `Încărcările pe faze: L1=${phaseLoads.L1}, L2=${phaseLoads.L2}, L3=${phaseLoads.L3}. Distribuirea echilibrată a sarcinii prelungește durata de viață a instalației și reduce pierderile.`,
              normative: 'HD 60364-5-52'
            });
          }
        }
      }

      // Check for main breaker
      const hasMainBreaker = components.some(comp => 
        (comp.type === 'breaker' || comp.type === 'isolator') && 
        comp.position === 0
      );
      
      if (!hasMainBreaker && components.length > 0) {
        newSuggestions.push({
          id: uuidv4(),
          title: 'Întrerupător general',
          description: 'Adăugați un întrerupător general pentru tablou',
          componentType: 'isolator',
          position: 0,
          severity: 'high',
          educationalTip: 'Un întrerupător general permite deconectarea rapidă a întregului tablou în situații de urgență.',
          normative: 'HD 60364-4-46',
          // Fix: Cast the string to RatingType
          rating: analysis.recommendedMainBreaker as RatingType,
          name: 'Întrerupător General'
        });
      }

      setSuggestions(newSuggestions);
      setIsAnalyzing(false);
    };

    generateSuggestions();
  }, [components, moduleCount, supplyType]);

  // Find the first available position for a component of a given width
  const findAvailablePosition = (
    components: PanelComponent[],
    moduleCount: number,
    componentWidth: number
  ): number => {
    const occupiedPositions = new Set<number>();
    
    components.forEach(component => {
      for (let i = 0; i < component.width; i++) {
        occupiedPositions.add(component.position + i);
      }
    });
    
    // Find first available position that can fit the component
    for (let pos = 0; pos < moduleCount - componentWidth + 1; pos++) {
      let canFit = true;
      
      for (let i = 0; i < componentWidth; i++) {
        if (occupiedPositions.has(pos + i)) {
          canFit = false;
          break;
        }
      }
      
      if (canFit) return pos;
    }
    
    return -1; // No available position found
  };

  // Auto-complete the panel with standard components
  const completePanel = (): AISuggestion[] => {
    const standardSuggestions: AISuggestion[] = [];
    const analysis = analyzePanel(components, supplyType);
    
    // Ensure we have a main breaker
    const hasMainBreaker = components.some(comp => 
      (comp.type === 'breaker' || comp.type === 'isolator') && 
      comp.position === 0
    );
    
    if (!hasMainBreaker) {
      const availablePosition = findAvailablePosition(components, moduleCount, 2);
      if (availablePosition !== -1) {
        standardSuggestions.push({
          id: uuidv4(),
          title: 'Întrerupător general',
          description: 'Întrerupător general pentru tablou',
          componentType: 'isolator',
          position: 0,
          severity: 'high',
          // Fix: Cast the string to RatingType
          rating: analysis.recommendedMainBreaker as RatingType,
          name: 'Întrerupător General',
          phases: supplyType === 'three-phase' ? ['L1', 'L2', 'L3', 'N'] as PhaseType[] : ['L1', 'N'] as PhaseType[],
          width: 2
        });
      }
    }
    
    // Add SPD if there is none
    const hasSPD = components.some(component => component.type === 'spd');
    if (!hasSPD) {
      // For finding available positions, need to add width property
      const componentsForPositioning: PanelComponent[] = [...components];
      // Create temporary components from suggestions for positioning
      const tempComponents: PanelComponent[] = standardSuggestions.map(suggestion => ({
        id: suggestion.id,
        type: suggestion.componentType,
        name: suggestion.name || '',
        description: suggestion.description,
        position: suggestion.position,
        width: suggestion.width || getComponentWidth(suggestion.componentType),
        rating: suggestion.rating || '16' as RatingType,
        diffProtection: suggestion.diffProtection,
        phases: suggestion.phases || ['L1'] as PhaseType[]
      }));
      
      const availablePosition = findAvailablePosition(
        [...componentsForPositioning, ...tempComponents],
        moduleCount,
        3
      );
      
      if (availablePosition !== -1) {
        standardSuggestions.push({
          id: uuidv4(),
          title: 'SPD',
          description: 'Protecție la supratensiune',
          componentType: 'spd',
          position: availablePosition,
          severity: 'medium',
          name: 'SPD Tip 2',
          phases: supplyType === 'three-phase' ? 
            ['L1', 'L2', 'L3', 'N', 'PE'] as PhaseType[] : 
            ['L1', 'N', 'PE'] as PhaseType[],
          width: 3
        });
      }
    }
    
    // Add RCD for lighting if not present
    const hasLightingRCD = components.some(component => 
      component.type === 'rcd' && 
      component.description.toLowerCase().includes('light')
    );
    
    if (!hasLightingRCD) {
      // For finding available positions, need to add width property
      const componentsForPositioning: PanelComponent[] = [...components];
      // Create temporary components from suggestions for positioning
      const tempComponents: PanelComponent[] = standardSuggestions.map(suggestion => ({
        id: suggestion.id,
        type: suggestion.componentType,
        name: suggestion.name || '',
        description: suggestion.description,
        position: suggestion.position,
        width: suggestion.width || getComponentWidth(suggestion.componentType),
        rating: suggestion.rating || '16' as RatingType,
        diffProtection: suggestion.diffProtection,
        phases: suggestion.phases || ['L1'] as PhaseType[]
      }));
      
      const availablePosition = findAvailablePosition(
        [...componentsForPositioning, ...tempComponents],
        moduleCount,
        2
      );
      
      if (availablePosition !== -1) {
        standardSuggestions.push({
          id: uuidv4(),
          title: 'RCD iluminat',
          description: 'Protecție diferențială pentru iluminat',
          componentType: 'rcd',
          position: availablePosition,
          severity: 'medium',
          rating: '25' as RatingType,
          diffProtection: '30mA' as DiffProtectionType,
          name: 'RCD Iluminat',
          phases: supplyType === 'three-phase' ? 
            ['L1', 'L2', 'L3', 'N'] as PhaseType[] : 
            ['L1', 'N'] as PhaseType[],
          width: 2
        });
      }
    }
    
    // Add RCBO for bathroom circuits
    const hasBathroomRCBO = components.some(component => 
      component.type === 'rcbo' && 
      component.description.toLowerCase().includes('baie')
    );
    
    if (!hasBathroomRCBO) {
      // For finding available positions, need to add width property
      const componentsForPositioning: PanelComponent[] = [...components];
      // Create temporary components from suggestions for positioning
      const tempComponents: PanelComponent[] = standardSuggestions.map(suggestion => ({
        id: suggestion.id,
        type: suggestion.componentType,
        name: suggestion.name || '',
        description: suggestion.description,
        position: suggestion.position,
        width: suggestion.width || getComponentWidth(suggestion.componentType),
        rating: suggestion.rating || '16' as RatingType,
        diffProtection: suggestion.diffProtection,
        phases: suggestion.phases || ['L1'] as PhaseType[]
      }));
      
      const availablePosition = findAvailablePosition(
        [...componentsForPositioning, ...tempComponents],
        moduleCount,
        1
      );
      
      if (availablePosition !== -1) {
        standardSuggestions.push({
          id: uuidv4(),
          title: 'RCBO baie',
          description: 'Siguranță diferențială pentru baie',
          componentType: 'rcbo',
          position: availablePosition,
          severity: 'high',
          rating: '16' as RatingType,
          diffProtection: '30mA' as DiffProtectionType,
          name: 'RCBO Baie',
          phases: ['L1', 'N'] as PhaseType[],
          width: 1
        });
      }
    }
    
    // Add kitchen breakers
    const kitchenCircuits = components.filter(component => 
      component.description.toLowerCase().includes('kitchen') || 
      component.description.toLowerCase().includes('bucătărie')
    );
    
    if (kitchenCircuits.length < 2) {
      // For finding available positions, need to add width property
      const componentsForPositioning: PanelComponent[] = [...components];
      // Create temporary components from suggestions for positioning
      const tempComponents: PanelComponent[] = standardSuggestions.map(suggestion => ({
        id: suggestion.id,
        type: suggestion.componentType,
        name: suggestion.name || '',
        description: suggestion.description,
        position: suggestion.position,
        width: suggestion.width || getComponentWidth(suggestion.componentType),
        rating: suggestion.rating || '16' as RatingType,
        diffProtection: suggestion.diffProtection,
        phases: suggestion.phases || ['L1'] as PhaseType[]
      }));
      
      const availablePosition = findAvailablePosition(
        [...componentsForPositioning, ...tempComponents],
        moduleCount,
        1
      );
      
      if (availablePosition !== -1) {
        standardSuggestions.push({
          id: uuidv4(),
          title: 'Circuit bucătărie',
          description: 'Siguranță pentru aparate de bucătărie',
          componentType: 'breaker',
          position: availablePosition,
          severity: 'medium',
          rating: '16' as RatingType,
          name: 'Bucătărie',
          phases: ['L1'] as PhaseType[],
          width: 1
        });
      }
    }
    
    // Add standard lighting circuits
    const lightingCircuits = components.filter(component => 
      component.description.toLowerCase().includes('light') || 
      component.description.toLowerCase().includes('iluminat')
    );
    
    if (lightingCircuits.length < 1) {
      // For finding available positions, need to add width property
      const componentsForPositioning: PanelComponent[] = [...components];
      // Create temporary components from suggestions for positioning
      const tempComponents: PanelComponent[] = standardSuggestions.map(suggestion => ({
        id: suggestion.id,
        type: suggestion.componentType,
        name: suggestion.name || '',
        description: suggestion.description,
        position: suggestion.position,
        width: suggestion.width || getComponentWidth(suggestion.componentType),
        rating: suggestion.rating || '16' as RatingType,
        diffProtection: suggestion.diffProtection,
        phases: suggestion.phases || ['L1'] as PhaseType[]
      }));
      
      const availablePosition = findAvailablePosition(
        [...componentsForPositioning, ...tempComponents],
        moduleCount,
        1
      );
      
      if (availablePosition !== -1) {
        standardSuggestions.push({
          id: uuidv4(),
          title: 'Circuit iluminat',
          description: 'Siguranță pentru iluminat',
          componentType: 'breaker',
          position: availablePosition,
          severity: 'medium',
          rating: '10' as RatingType,
          name: 'Iluminat',
          phases: ['L1'] as PhaseType[],
          width: 1
        });
      }
    }
    
    return standardSuggestions;
  };

  // Helper function to get component width based on type
  const getComponentWidth = (componentType: ComponentType): number => {
    switch (componentType) {
      case 'breaker': return 1;
      case 'rcbo': return 1;
      case 'rcd': return 2;
      case 'spd': return 3;
      case 'isolator': return 1;
      case 'contactor': return 1;
      default: return 1;
    }
  };

  return {
    suggestions,
    isAnalyzing,
    completePanel,
    activeHoverSuggestion,
    setActiveHoverSuggestion
  };
}
