
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
}

export const PanelGrid: React.FC<PanelGridProps> = ({ 
  moduleCount, 
  components, 
  onComponentAdd, 
  onComponentRemove,
  onComponentEdit,
  showPhases = true
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
    if (!component) return 'bg-white';
    
    switch(component.type) {
      case 'breaker': return 'bg-blue-100';
      case 'rcd': return 'bg-green-100';
      case 'rcbo': return 'bg-emerald-100';
      case 'spd': return 'bg-yellow-100';
      case 'isolator': return 'bg-gray-100';
      case 'contactor': return 'bg-purple-100';
      default: return 'bg-white';
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
        <div className="text-center text-xs font-semibold bg-red-100 rounded p-1">L1</div>
        <div className="text-center text-xs font-semibold bg-yellow-100 rounded p-1">L2</div>
        <div className="text-center text-xs font-semibold bg-blue-100 rounded p-1">L3</div>
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
              className="text-gray-500 hover:text-gray-700"
            >
              <Settings className="h-3 w-3" />
            </button>
            <button 
              onClick={() => onComponentRemove(component.id)}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        </div>
        
        <div className="mt-auto">
          {component.description && (
            <span className="text-xs text-gray-600 truncate block">{component.description}</span>
          )}
          {component.diffProtection && component.diffProtection !== 'none' && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="inline-block bg-green-200 text-xs rounded px-1">
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
            <span className="text-xs text-gray-500">{component.width} module</span>
          </div>
        )}
      </div>
    );
  };
  
  return (
    <div className="border rounded-lg p-4 bg-white">
      {renderPhaseLabels()}
      
      <div 
        className="grid grid-cols-12 gap-1 bg-gray-100 p-2 rounded-lg relative"
        style={{
          minHeight: '16rem',
          gridTemplateRows: 'repeat(auto-fill, 48px)'  
        }}
      >
        {modules.map(position => {
          const component = moduleToComponent[position];
          const isFirstModule = component ? component.position === position : false;
          const width = component?.width || 1;
          
          return (
            <div
              key={`module-${position}`}
              className={`
                border rounded relative 
                ${getComponentColor(component)}
                ${!component ? 'hover:bg-gray-200' : ''}
                transition-colors
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
                  <span className="text-gray-400 text-sm">{position + 1}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
