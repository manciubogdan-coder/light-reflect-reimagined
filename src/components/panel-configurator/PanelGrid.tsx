
import React, { useState, useRef, useEffect } from 'react';
import { PanelComponent, ComponentType } from '@/lib/electricalPanelTypes';
import { createNewComponent } from './ComponentTemplates';
import { Button } from '@/components/ui/button';
import { X, Settings, Info, Thermometer } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { motion } from 'framer-motion';
import { ComponentVisualization } from './ComponentVisualization';

interface PanelGridProps {
  moduleCount: number;
  components: PanelComponent[];
  onComponentAdd: (component: PanelComponent) => void;
  onComponentRemove: (componentId: string) => void; 
  onComponentEdit: (componentId: string) => void;
  onComponentMove?: (componentId: string, newPosition: number) => void;
  onComponentConnect?: (sourceId: string, targetId: string) => void;
  showPhases?: boolean;
  highlightPosition?: number | null;
  temperature?: number;
  usedSpacePercentage?: number;
}

export const PanelGrid: React.FC<PanelGridProps> = ({ 
  moduleCount, 
  components, 
  onComponentAdd, 
  onComponentRemove,
  onComponentEdit,
  onComponentMove,
  onComponentConnect,
  showPhases = true,
  highlightPosition = null,
  temperature = 25,
  usedSpacePercentage = 0
}) => {
  const [draggedComponent, setDraggedComponent] = useState<string | null>(null);
  const [wireStart, setWireStart] = useState<string | null>(null);
  const [tempWireEnd, setTempWireEnd] = useState<{x: number, y: number} | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const [connectionMode, setConnectionMode] = useState<boolean>(false);
  
  // Create an array representing all modules in the panel
  const rows = Math.ceil(moduleCount / 12);
  const modules = Array.from({ length: rows * 12 }, (_, i) => i);
  
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
    
    // Handle component repositioning
    if (draggedComponent) {
      const component = components.find(c => c.id === draggedComponent);
      if (component && onComponentMove) {
        // Check if there's enough space at the new position
        const hasSpace = checkSpaceAvailability(position, component.width);
        if (hasSpace) {
          onComponentMove(draggedComponent, position);
        }
      }
      setDraggedComponent(null);
      return;
    }
    
    // Handle new component drop
    try {
      const componentTypeData = e.dataTransfer.getData('application/reactflow');
      const { type, rating, curve } = JSON.parse(componentTypeData);
      
      const newComponent = createNewComponent(type as ComponentType, position);
      newComponent.rating = rating || newComponent.rating;
      if (curve) newComponent.curve = curve;
      
      const hasSpace = checkSpaceAvailability(position, newComponent.width);
      if (hasSpace) {
        onComponentAdd(newComponent);
      }
    } catch (error) {
      console.error("Error handling drop:", error);
    }
  };

  const checkSpaceAvailability = (position: number, width: number) => {
    for (let i = 0; i < width; i++) {
      const pos = position + i;
      if (pos >= moduleCount || moduleToComponent[pos]) {
        return false;
      }
    }
    return true;
  };
  
  const handleComponentDragStart = (e: React.DragEvent<HTMLDivElement>, componentId: string) => {
    setDraggedComponent(componentId);
    e.dataTransfer.effectAllowed = 'move';
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
      case 'fuse': return 'bg-orange-950/40 border-orange-900/40 text-orange-300';
      case 'terminal': return 'bg-cyan-950/40 border-cyan-900/40 text-cyan-300';
      default: return 'bg-[#0c1320]';
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleWireStart = (componentId: string) => {
    if (!connectionMode) return;
    setWireStart(componentId);
  };

  const handleWireEnd = (componentId: string) => {
    if (!connectionMode || !wireStart || wireStart === componentId) {
      setWireStart(null);
      setTempWireEnd(null);
      return;
    }
    
    // Add connection between components
    if (onComponentConnect) {
      onComponentConnect(wireStart, componentId);
    }
    
    setWireStart(null);
    setTempWireEnd(null);
  };

  const handleGridMouseMove = (e: React.MouseEvent) => {
    if (!connectionMode || !wireStart || !gridRef.current) return;
    
    const rect = gridRef.current.getBoundingClientRect();
    setTempWireEnd({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  const getComponentCenter = (componentId: string): {x: number, y: number} | null => {
    if (!gridRef.current) return null;
    
    const componentElement = document.getElementById(`component-${componentId}`);
    if (!componentElement) return null;
    
    const gridRect = gridRef.current.getBoundingClientRect();
    const componentRect = componentElement.getBoundingClientRect();
    
    return {
      x: (componentRect.left + componentRect.width / 2) - gridRect.left,
      y: (componentRect.top + componentRect.height / 2) - gridRect.top
    };
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

  const renderConnectionLines = () => {
    // Render connections between components
    return components.map(component => {
      if (!component.connections?.length) return null;
      
      return component.connections.map(targetId => {
        const sourceCenter = getComponentCenter(component.id);
        const targetCenter = getComponentCenter(targetId);
        
        if (!sourceCenter || !targetCenter) return null;
        
        return (
          <svg
            key={`${component.id}-${targetId}`}
            className="absolute top-0 left-0 w-full h-full pointer-events-none z-10"
          >
            <line
              x1={sourceCenter.x}
              y1={sourceCenter.y}
              x2={targetCenter.x}
              y2={targetCenter.y}
              stroke="#00FFFF"
              strokeWidth="1"
              strokeDasharray="3,2"
              strokeOpacity="0.7"
            />
          </svg>
        );
      });
    });
  };

  const renderTempConnectionLine = () => {
    if (!wireStart || !tempWireEnd) return null;
    
    const sourceCenter = getComponentCenter(wireStart);
    if (!sourceCenter) return null;
    
    return (
      <svg
        className="absolute top-0 left-0 w-full h-full pointer-events-none z-10"
      >
        <line
          x1={sourceCenter.x}
          y1={sourceCenter.y}
          x2={tempWireEnd.x}
          y2={tempWireEnd.y}
          stroke="#00FFFF"
          strokeWidth="1"
          strokeDasharray="3,2"
          strokeOpacity="0.7"
        />
      </svg>
    );
  };

  const renderComponentContent = (component: PanelComponent, isFirstModule: boolean) => {
    if (!isFirstModule) return null;
    
    return (
      <motion.div 
        className="absolute inset-0 flex flex-col justify-between p-1"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
      >
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
        
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full flex items-center justify-center">
          <ComponentVisualization type={component.type} />
        </div>
        
        <div className="mt-auto z-10">
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
      </motion.div>
    );
  };

  // Calculate grid rows and columns
  const cols = 12; // Always 12 columns per row in electrical panels
  
  return (
    <div className="border border-[#253142] rounded-lg p-4 bg-[#0F1724]">
      <div className="flex items-center justify-between mb-3">
        {renderPhaseLabels()}
        <div className="flex gap-2 items-center">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-1 bg-[#0F1724] p-2 rounded-md border border-[#253142]">
                  <Thermometer className="h-4 w-4 text-[#00FFFF]" />
                  <span className="text-sm font-medium text-white">
                    {temperature.toFixed(1)}°C
                  </span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs">Temperatura estimată în interiorul tabloului</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className={`flex items-center gap-1 p-2 rounded-md border
                              ${usedSpacePercentage > 70 
                                ? 'bg-red-950/30 border-red-900/50 text-red-300'
                                : 'bg-[#0F1724] border-[#253142] text-white'}`}>
                  <span className="text-sm font-medium">
                    {usedSpacePercentage.toFixed(0)}% ocupat
                  </span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs">
                  {usedSpacePercentage > 70 
                    ? 'Avertisment: Spațiu insuficient pentru ventilație (minim 30% trebuie să fie liber)'
                    : 'Spațiu disponibil suficient pentru ventilație adecvată'}
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <Button
            variant={connectionMode ? "secondary" : "outline"}
            size="sm"
            onClick={() => setConnectionMode(!connectionMode)}
            className={connectionMode 
              ? "bg-[#00FFFF]/20 border-[#00FFFF]/50 text-[#00FFFF]" 
              : "border-[#253142] text-gray-400"}
          >
            {connectionMode ? "Mod cablare activ" : "Activează cablare"}
          </Button>
        </div>
      </div>
      
      <div 
        ref={gridRef}
        className="grid border-[#253142] grid-cols-12 gap-1 bg-[#0c1320] p-2 rounded-lg relative"
        style={{
          gridTemplateRows: `repeat(${rows}, 48px)`,
          height: `${rows * 48 + (rows - 1) * 4 + 16}px` // height of modules + gaps + padding
        }}
        onMouseMove={handleGridMouseMove}
      >
        {modules.map(position => {
          const component = moduleToComponent[position];
          const isFirstModule = component ? component.position === position : false;
          const width = component?.width || 1;
          const isHighlighted = position === highlightPosition;
          
          // Calculate row and column
          const row = Math.floor(position / cols);
          const col = position % cols;
          
          return (
            <div
              key={`module-${position}`}
              id={component && isFirstModule ? `component-${component.id}` : `module-${position}`}
              className={`
                border rounded relative transition-all duration-300
                ${component ? `border-[#253142] ${getComponentColor(component)}` : 
                  isHighlighted ? 'border-[#00FFFF] bg-[#162030] shadow-[0_0_10px_rgba(0,255,255,0.3)]' : 
                  'border-[#253142] bg-[#0c1320] hover:bg-[#162030]'}
              `}
              style={{
                gridColumn: isFirstModule ? `span ${width}` : undefined,
                gridRow: `${row + 1} / span 1`,
                display: !isFirstModule && component ? 'none' : 'block',
              }}
              draggable={isFirstModule && !!component}
              onDragStart={isFirstModule && component ? (e) => handleComponentDragStart(e, component.id) : undefined}
              onDragOver={!component ? handleDragOver : undefined}
              onDrop={!component ? (e) => handleDrop(e, position) : undefined}
              onClick={component && isFirstModule && connectionMode 
                ? wireStart 
                  ? () => handleWireEnd(component.id) 
                  : () => handleWireStart(component.id) 
                : undefined}
              onMouseLeave={() => connectionMode && wireStart && setTempWireEnd(null)}
            >
              {component && isFirstModule && renderComponentContent(component, isFirstModule)}
              
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

        {/* Render connection lines */}
        {renderConnectionLines()}
        {renderTempConnectionLine()}
      </div>
    </div>
  );
};
