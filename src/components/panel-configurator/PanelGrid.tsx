
import React, { useState } from 'react';
import { PanelComponent, ComponentType } from '@/lib/electricalPanelTypes';
import { createNewComponent } from './ComponentTemplates';
import { Button } from '@/components/ui/button';
import { X, Settings, Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface PanelGridProps {
  moduleCount: number;
  components: PanelComponent[];
  onComponentAdd: (component: PanelComponent) => void;
  onComponentRemove: (componentId: string) => void; 
  onComponentEdit: (componentId: string) => void;
  showPhases?: boolean;
  highlightPosition?: number | null;
}

export const PanelGrid: React.FC<PanelGridProps> = ({ 
  moduleCount, 
  components, 
  onComponentAdd, 
  onComponentRemove,
  onComponentEdit,
  showPhases = true,
  highlightPosition = null
}) => {
  const [activeDragType, setActiveDragType] = useState<ComponentType | null>(null);
  
  // Create an array representing all modules in the panel
  const modules = Array.from({ length: moduleCount }, (_, i) => i);
  
  // Find which component (if any) occupies each module position
  const moduleToComponent = modules.map(modulePosition => {
    return components.find(component => {
      const componentStart = component.position;
      const componentEnd = component.position + component.width - 1;
      return modulePosition >= componentStart && modulePosition <= componentEnd;
    });
  });
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>, position: number) => {
    e.preventDefault();
    
    // Check if the position is already occupied
    if (moduleToComponent[position]) return;
    
    try {
      const componentTypeData = e.dataTransfer.getData('application/reactflow');
      const { type } = JSON.parse(componentTypeData);
      
      // Create a new component of the dragged type
      const newComponent = createNewComponent(type as ComponentType, position);
      
      // Check if there's enough space for the component
      const componentWidth = newComponent.width;
      let hasSpace = true;
      
      for (let i = 0; i < componentWidth; i++) {
        if (position + i >= moduleCount || moduleToComponent[position + i]) {
          hasSpace = false;
          break;
        }
      }
      
      if (hasSpace) {
        onComponentAdd(newComponent);
      }
    } catch (error) {
      console.error("Error handling drop:", error);
    }
    
    setActiveDragType(null);
  };
  
  const getComponentColor = (component: PanelComponent | undefined) => {
    if (!component) return 'bg-[#0c1320]';
    
    switch(component.type) {
      case 'breaker': return 'bg-blue-950/40 border-blue-900/40 text-blue-300';
      case 'rcd': return 'bg-green-950/40 border-green-900/40 text-green-300';
      case 'rcbo': return 'bg-emerald-950/40 border-emerald-900/40 text-emerald-300';
      case 'spd': return 'bg-yellow-950/40 border-yellow-900/40 text-yellow-300';
      case 'isolator': return 'bg-gray-950/40 border-gray-900/40 text-gray-300';
      case 'contactor': return 'bg-purple-950/40 border-purple-900/40 text-purple-300';
      default: return 'bg-[#0c1320]';
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };
  
  const renderPhaseLabels = () => {
    if (!showPhases) return null;
    
    return (
      <div className="grid grid-cols-3 gap-1 mb-2">
        <div className="text-center text-xs font-semibold bg-red-900/30 text-red-300 rounded p-1">L1</div>
        <div className="text-center text-xs font-semibold bg-yellow-900/30 text-yellow-300 rounded p-1">L2</div>
        <div className="text-center text-xs font-semibold bg-blue-900/30 text-blue-300 rounded p-1">L3</div>
      </div>
    );
  };

  const renderComponentContent = (component: PanelComponent, isFirstModule: boolean) => {
    if (!isFirstModule) return null;
    
    return (
      <div className="absolute inset-0 flex flex-col justify-between p-1">
        <div className="flex justify-between items-center">
          <span className="font-bold text-xs">{component.name || `${component.rating}A`}</span>
          <div className="flex gap-1">
            <button 
              onClick={() => onComponentEdit(component.id)}
              className="text-gray-400 hover:text-white"
            >
              <Settings className="h-3 w-3" />
            </button>
            <button 
              onClick={() => onComponentRemove(component.id)}
              className="text-gray-400 hover:text-white"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        </div>
        
        <div className="mt-auto">
          {component.description && (
            <span className="text-xs text-gray-400 truncate block">{component.description}</span>
          )}
          {component.diffProtection && component.diffProtection !== 'none' && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="inline-block bg-green-900/30 text-green-300 text-xs rounded px-1">
                    <Info className="inline h-2 w-2" /> {component.diffProtection}
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs">Protecție diferențială: {component.diffProtection}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
        
        {component.width > 1 && (
          <div className="absolute -bottom-3 left-0 w-full flex justify-center">
            <span className="text-xs text-gray-400">{component.width} module</span>
          </div>
        )}
      </div>
    );
  };
  
  return (
    <div className="border border-[#253142] rounded-lg p-4 bg-[#0F1724]">
      {renderPhaseLabels()}
      
      <div 
        className="grid grid-cols-12 gap-1 bg-[#0c1320] p-2 rounded-lg relative"
        style={{
          minHeight: '16rem',
          gridTemplateRows: 'repeat(auto-fill, 48px)'  
        }}
      >
        {modules.map(position => {
          const component = moduleToComponent[position];
          const isFirstModule = component ? component.position === position : false;
          const width = component?.width || 1;
          const isHighlighted = position === highlightPosition;
          
          return (
            <div
              key={`module-${position}`}
              className={`
                border rounded relative transition-all duration-300
                ${component ? `border-[#253142] ${getComponentColor(component)}` : 
                  isHighlighted ? 'border-[#00FFFF] bg-[#162030] shadow-[0_0_10px_rgba(0,255,255,0.3)]' : 
                  'border-[#253142] bg-[#0c1320] hover:bg-[#162030]'}
              `}
              style={{
                gridColumn: isFirstModule ? `span ${width}` : undefined,
                display: !isFirstModule && component ? 'none' : 'block',
              }}
              onDragOver={!component ? handleDragOver : undefined}
              onDrop={!component ? (e) => handleDrop(e, position) : undefined}
            >
              {component && renderComponentContent(component, isFirstModule)}
              
              {!component && (
                <div className="h-full flex items-center justify-center">
                  <span className={`text-sm ${isHighlighted ? 'text-[#00FFFF]' : 'text-gray-500'}`}>
                    {position + 1}
                  </span>
                </div>
              )}
              
              {isHighlighted && !component && (
                <div className="absolute inset-0 border border-[#00FFFF]/30 rounded pointer-events-none"></div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
