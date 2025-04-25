import React, { useState, useEffect } from 'react';
import { PanelComponent, ComponentType, RatingType, DiffProtectionType, PhaseType } from '@/lib/electricalPanelTypes';
import { createNewComponent } from './ComponentTemplates';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  CircleCheck, 
  CircleX,
  Lightbulb,
  CircleAlert,
  Power 
} from 'lucide-react';
import { toast } from "@/hooks/use-toast";
import { useAISuggestions } from '@/hooks/useAISuggestions';
import { motion } from 'framer-motion';

interface AISuggestionsProps {
  components: PanelComponent[];
  moduleCount: number;
  supplyType: 'single-phase' | 'three-phase';
  onAddComponent: (component: PanelComponent) => void;
}

export const AISuggestions: React.FC<AISuggestionsProps> = ({ 
  components, 
  moduleCount,
  supplyType,
  onAddComponent 
}) => {
  const { 
    suggestions,
    isAnalyzing,
    completePanel,
    activeHoverSuggestion,
    setActiveHoverSuggestion
  } = useAISuggestions(components, moduleCount, supplyType);

  const handleAcceptSuggestion = (suggestion: any) => {
    const componentToAdd = createNewComponent(
      suggestion.componentType as ComponentType, 
      suggestion.position
    );
    
    componentToAdd.name = suggestion.name || componentToAdd.name;
    componentToAdd.description = suggestion.description || componentToAdd.description;
    componentToAdd.rating = suggestion.rating as RatingType || componentToAdd.rating;
    componentToAdd.diffProtection = suggestion.diffProtection as DiffProtectionType || componentToAdd.diffProtection;
    componentToAdd.phases = suggestion.phases as PhaseType[] || componentToAdd.phases;
    
    onAddComponent(componentToAdd);
    
    toast({
      title: "Sugestie implementată",
      description: `Am adăugat ${suggestion.title}`,
      variant: "default"
    });
  };

  const handleRejectSuggestion = (suggestionId: string) => {
    toast({
      title: "Sugestie ignorată",
      variant: "default"
    });
  };

  const handleCompletePanel = () => {
    completePanel().forEach(suggestion => {
      const componentToAdd = createNewComponent(
        suggestion.componentType as ComponentType, 
        suggestion.position
      );
      
      componentToAdd.name = suggestion.name || componentToAdd.name;
      componentToAdd.description = suggestion.description || componentToAdd.description;
      componentToAdd.rating = suggestion.rating as RatingType || componentToAdd.rating;
      componentToAdd.diffProtection = suggestion.diffProtection as DiffProtectionType || componentToAdd.diffProtection;
      componentToAdd.phases = suggestion.phases as PhaseType[] || componentToAdd.phases;
      
      onAddComponent(componentToAdd);
    });
    
    toast({
      title: "Tablou completat automat",
      description: "Am adăugat cele mai frecvente protecții",
      variant: "default"
    });
  };

  if (suggestions.length === 0 && !isAnalyzing) {
    return (
      <div className="flex flex-col items-center justify-center p-4 bg-[#162030] border border-[#253142] rounded-lg mt-4">
        <Lightbulb className="w-10 h-10 text-[#00FFFF] mb-2" />
        <h3 className="text-lg font-medium text-white mb-1">Asistentul AI</h3>
        <p className="text-gray-400 text-sm text-center mb-3">
          Tabloul tău electric este acum configurat corect conform standardelor.
        </p>
        <Button 
          onClick={handleCompletePanel}
          className="bg-[#162030] border border-[#00FFFF]/50 text-[#00FFFF] hover:bg-[#00FFFF]/20"
        >
          <Lightbulb className="w-4 h-4 mr-2" />
          Completează tabloul automat
        </Button>
      </div>
    );
  }

  return (
    <div className="mt-6">
      <div className="flex items-center gap-2 mb-3">
        <CircleAlert className="text-[#00FFFF] w-5 h-5" />
        <h4 className="font-medium text-white font-tech">Sugestii Inteligente AI</h4>
      </div>

      <div className="space-y-4">
        {isAnalyzing ? (
          <div className="flex items-center justify-center p-8 bg-[#162030] border border-[#253142] rounded-lg animate-pulse">
            <div className="flex flex-col items-center gap-2">
              <div className="relative">
                <div className="w-10 h-10 rounded-full border-2 border-[#00FFFF]/80 border-t-transparent animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-5 h-5 rounded-full bg-[#00FFFF]/40 animate-ping"></div>
                </div>
              </div>
              <p className="text-[#00FFFF] text-sm font-medium">Analizez configurația...</p>
            </div>
          </div>
        ) : (
          <>
            {suggestions.map((suggestion, index) => (
              <motion.div 
                key={suggestion.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative"
                onMouseEnter={() => setActiveHoverSuggestion(suggestion.id)}
                onMouseLeave={() => setActiveHoverSuggestion(null)}
              >
                <Card className={cn(
                  "border border-[#253142] bg-gradient-to-r from-[#0F1724]/90 to-[#162030]/90 backdrop-blur overflow-hidden",
                  activeHoverSuggestion === suggestion.id ? "border-[#00FFFF]/50" : ""
                )}>
                  <CardContent className="p-0">
                    <div className="flex flex-col md:flex-row gap-4 p-6 items-stretch">
                      <div className="relative w-full md:w-[200px] h-[160px] bg-[#0c1320] rounded-md flex items-center justify-center border border-[#253142]">
                        <div className={cn(
                          "absolute inset-0 rounded-md overflow-hidden",
                          activeHoverSuggestion === suggestion.id ? "shadow-[0_0_15px_rgba(0,255,255,0.3)]" : ""
                        )}>
                          <div className="absolute inset-0 bg-gradient-to-tr from-[#00FFFF]/10 to-transparent"></div>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className={cn(
                              "w-full h-full flex items-center justify-center transform transition-transform duration-300",
                              activeHoverSuggestion === suggestion.id ? "scale-110" : "scale-100"
                            )}>
                              <HolographicComponent type={suggestion.componentType} />
                            </div>
                          </div>
                        </div>
                        
                        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-[#162030] border border-[#253142] px-2 py-1 rounded-full text-xs text-[#00FFFF]">
                          Poziție: {suggestion.position + 1}
                        </div>
                      </div>

                      <div className="flex-1 flex flex-col justify-between space-y-3">
                        <div>
                          <h4 className="text-white font-medium text-lg">{suggestion.title}</h4>
                          <p className="text-sm text-gray-300 mt-1">{suggestion.description}</p>
                        </div>

                        <div className="space-y-3">
                          {suggestion.educationalTip && (
                            <div className="bg-[#0c1320] border border-[#253142] p-3 rounded-md relative">
                              <div className="absolute -top-2 -left-2 bg-[#00FFFF] text-[#0F1724] rounded-full p-1">
                                <Lightbulb className="w-3 h-3" />
                              </div>
                              <p className="text-xs text-gray-300 ml-2">{suggestion.educationalTip}</p>
                            </div>
                          )}

                          {suggestion.normative && (
                            <div className="mb-3 text-xs text-gray-400">
                              Conform normativului: {suggestion.normative}
                            </div>
                          )}

                          <div className="flex gap-2">
                            <Button 
                              onClick={() => handleAcceptSuggestion(suggestion)}
                              size="default"
                              className="bg-[#162030] border border-[#00FFFF]/50 text-[#00FFFF] hover:bg-[#00FFFF]/20 flex-1"
                            >
                              <CircleCheck className="w-5 h-5 mr-2" /> Adaugă
                            </Button>
                            <Button 
                              onClick={() => handleRejectSuggestion(suggestion.id)}
                              variant="ghost" 
                              size="default"
                              className="text-gray-400 hover:bg-white/5 flex-1"
                            >
                              <CircleX className="w-5 h-5 mr-2" /> Refuză
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  
                  {activeHoverSuggestion === suggestion.id && (
                    <>
                      <div className="absolute inset-0 border border-[#00FFFF]/30 rounded-lg pointer-events-none"></div>
                      <div className="absolute inset-0 bg-gradient-to-r from-[#00FFFF]/5 to-transparent pointer-events-none"></div>
                    </>
                  )}
                </Card>
              </motion.div>
            ))}

            <div className="mt-3 flex justify-center">
              <Button 
                onClick={handleCompletePanel}
                className="bg-[#162030] border border-[#00FFFF]/50 text-[#00FFFF] hover:bg-[#00FFFF]/20"
              >
                <Lightbulb className="w-4 h-4 mr-2" />
                Completează tabloul automat
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const HolographicComponent: React.FC<{ type: ComponentType }> = ({ type }) => {
  const getComponentIcon = () => {
    switch(type) {
      case 'breaker': 
        return (
          <div className="relative">
            <div className="w-16 h-24 flex flex-col border-2 border-[#00FFFF]/50 rounded-sm bg-[#0F1724]/70 relative overflow-hidden">
              <div className="h-1/2 border-b border-[#00FFFF]/30 flex items-center justify-center">
                <div className="w-4 h-4 rounded-full bg-[#00FFFF]/20 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-[#00FFFF]/60"></div>
                </div>
              </div>
              <div className="h-1/2 flex items-center justify-center">
                <div className="w-4 h-8 bg-[#00FFFF]/20 rounded-sm"></div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-[#00FFFF]/10 to-transparent opacity-50"></div>
              <div className="absolute inset-0 animate-pulse opacity-30 bg-gradient-to-r from-transparent via-[#00FFFF]/20 to-transparent"></div>
            </div>
            <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-[#00FFFF] animate-ping opacity-30"></div>
          </div>
        );
      case 'rcd': 
        return (
          <div className="relative">
            <div className="w-24 h-24 flex flex-col border-2 border-[#00FFFF]/50 rounded-sm bg-[#0F1724]/70 relative overflow-hidden">
              <div className="h-1/2 border-b border-[#00FFFF]/30 flex items-center justify-center">
                <div className="w-16 h-6 rounded-sm bg-[#00FFFF]/20 flex items-center justify-center">
                  <div className="text-[#00FFFF]/90 text-xs">TEST</div>
                </div>
              </div>
              <div className="h-1/2 flex items-center justify-center">
                <Power className="w-10 h-10 text-[#00FFFF]/40" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-[#00FFFF]/10 to-transparent opacity-50"></div>
              <div className="absolute inset-0 animate-pulse opacity-30 bg-gradient-to-r from-transparent via-[#00FFFF]/20 to-transparent"></div>
            </div>
            <div className="absolute -top-1 -left-1 w-3 h-3 rounded-full bg-[#00FFFF] animate-ping opacity-30"></div>
            <div className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full bg-[#00FFFF] animate-ping opacity-30"></div>
          </div>
        );
      case 'rcbo':
        return (
          <div className="relative">
            <div className="w-16 h-24 flex flex-col border-2 border-[#00FFFF]/50 rounded-sm bg-[#0F1724]/70 relative overflow-hidden">
              <div className="h-1/3 border-b border-[#00FFFF]/30 flex items-center justify-center">
                <div className="w-4 h-4 rounded-full bg-[#00FFFF]/20 flex items-center justify-center">
                  <div className="text-[#00FFFF]/80 text-[8px]">T</div>
                </div>
              </div>
              <div className="h-1/3 border-b border-[#00FFFF]/30 flex items-center justify-center">
                <div className="w-6 h-4 bg-[#00FFFF]/20 rounded-sm"></div>
              </div>
              <div className="h-1/3 flex items-center justify-center">
                <div className="w-4 h-6 bg-[#00FFFF]/20 rounded-sm"></div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-[#00FFFF]/10 to-transparent opacity-50"></div>
              <div className="absolute inset-0 animate-pulse opacity-30 bg-gradient-to-r from-transparent via-[#00FFFF]/20 to-transparent"></div>
            </div>
            <div className="absolute top-1/2 -right-1 w-3 h-3 rounded-full bg-[#00FFFF] animate-ping opacity-30"></div>
          </div>
        );
      case 'spd':
        return (
          <div className="relative">
            <div className="w-32 h-24 flex border-2 border-[#00FFFF]/50 rounded-sm bg-[#0F1724]/70 relative overflow-hidden">
              <div className="flex-1 flex flex-col items-center justify-center border-r border-[#00FFFF]/30">
                <div className="mb-1 text-[#00FFFF]/80 text-[8px]">L1</div>
                <div className="w-4 h-8 bg-[#00FFFF]/20 rounded-sm"></div>
              </div>
              <div className="flex-1 flex flex-col items-center justify-center border-r border-[#00FFFF]/30">
                <div className="mb-1 text-[#00FFFF]/80 text-[8px]">L2</div>
                <div className="w-4 h-8 bg-[#00FFFF]/20 rounded-sm"></div>
              </div>
              <div className="flex-1 flex flex-col items-center justify-center">
                <div className="mb-1 text-[#00FFFF]/80 text-[8px]">L3</div>
                <div className="w-4 h-8 bg-[#00FFFF]/20 rounded-sm"></div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-[#00FFFF]/10 to-transparent opacity-50"></div>
              <div className="absolute inset-0 animate-pulse opacity-30 bg-gradient-to-r from-transparent via-[#00FFFF]/20 to-transparent"></div>
            </div>
            <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-3 h-3 rounded-full bg-[#00FFFF] animate-ping opacity-30"></div>
          </div>
        );
      case 'isolator':
        return (
          <div className="relative">
            <div className="w-16 h-24 flex flex-col border-2 border-[#00FFFF]/50 rounded-sm bg-[#0F1724]/70 relative overflow-hidden">
              <div className="h-1/2 border-b border-[#00FFFF]/30 flex items-center justify-center">
                <div className="w-8 h-4 rounded-sm bg-[#00FFFF]/20 flex items-center justify-center">
                  <div className="text-[#00FFFF]/80 text-[8px]">ON</div>
                </div>
              </div>
              <div className="h-1/2 flex items-center justify-center">
                <div className="w-8 h-4 bg-red-500/20 rounded-sm flex items-center justify-center">
                  <div className="text-red-500/80 text-[8px]">OFF</div>
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-[#00FFFF]/10 to-transparent opacity-50"></div>
              <div className="absolute inset-0 animate-pulse opacity-30 bg-gradient-to-r from-transparent via-[#00FFFF]/20 to-transparent"></div>
            </div>
          </div>
        );
      case 'contactor':
        return (
          <div className="relative">
            <div className="w-16 h-24 flex flex-col border-2 border-[#00FFFF]/50 rounded-sm bg-[#0F1724]/70 relative overflow-hidden">
              <div className="h-1/4 border-b border-[#00FFFF]/30 flex items-center justify-center">
                <div className="w-6 h-3 rounded-sm bg-[#00FFFF]/20"></div>
              </div>
              <div className="h-2/4 border-b border-[#00FFFF]/30 flex items-center justify-center">
                <div className="w-12 h-8 bg-[#00FFFF]/20 rounded-sm flex items-center justify-center">
                  <div className="text-[#00FFFF]/80 text-[8px]">A1-A2</div>
                </div>
              </div>
              <div className="h-1/4 flex items-center justify-center">
                <div className="w-6 h-3 bg-[#00FFFF]/20 rounded-sm"></div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-[#00FFFF]/10 to-transparent opacity-50"></div>
              <div className="absolute inset-0 animate-pulse opacity-30 bg-gradient-to-r from-transparent via-[#00FFFF]/20 to-transparent"></div>
            </div>
            <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
              <div className="w-6 h-6 rounded-full border-2 border-[#00FFFF]/30 absolute"></div>
            </div>
          </div>
        );
      default:
        return (
          <div className="w-16 h-24 border-2 border-[#00FFFF]/50 rounded-sm bg-[#0F1724]/70 flex items-center justify-center">
            <div className="text-[#00FFFF] text-opacity-70">
              <CircleAlert className="w-8 h-8" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#00FFFF]/10 to-transparent opacity-50"></div>
          </div>
        );
    }
  };

  return (
    <div className="relative">
      {getComponentIcon()}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-70 pointer-events-none">
        <div className="w-full h-1 bg-gradient-to-r from-transparent via-[#00FFFF]/60 to-transparent absolute animate-scanHorizontal"></div>
      </div>
    </div>
  );
};
