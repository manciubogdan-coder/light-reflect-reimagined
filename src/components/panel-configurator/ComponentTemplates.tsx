import React, { useState } from 'react';
import { ComponentType, PanelComponent, COMPONENT_TEMPLATES } from '@/lib/electricalPanelTypes';
import { v4 as uuidv4 } from 'uuid';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Zap,
  Power,
  CirclePlus,
  CircleX,
  Plug,
  SeparatorHorizontal,
  Cable,
  Timer,
  Activity
} from 'lucide-react';

interface ComponentCardProps {
  type: ComponentType;
  label: string;
  rating?: string;
  curve?: 'B' | 'C' | 'D';
  onDragStart: (type: ComponentType) => void;
}

const componentIcons: Record<ComponentType, React.ReactNode> = {
  breaker: <Zap className="size-4" />,
  rcd: <Power className="size-4" />,
  rcbo: <Power className="size-4" />,
  spd: <CircleX className="size-4" />,
  isolator: <CirclePlus className="size-4" />,
  contactor: <CirclePlus className="size-4" />,
  fuse: <Plug className="size-4" />,
  separator: <SeparatorHorizontal className="size-4" />,
  terminal: <Cable className="size-4" />,
  timeRelay: <Timer className="size-4" />,
  phaseRelay: <Activity className="size-4" />
};

export const ComponentCard: React.FC<ComponentCardProps> = ({ 
  type, 
  label, 
  rating = '16',
  curve = 'C',
  onDragStart 
}) => {
  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('application/reactflow', JSON.stringify({ 
      type,
      rating,
      curve 
    }));
    e.dataTransfer.effectAllowed = 'move';
    onDragStart(type);
  };

  return (
    <div
      className="relative group"
      draggable
      onDragStart={handleDragStart}
    >
      <div className="border border-[#00FFFF]/30 rounded-lg p-2 cursor-grab 
                    transition-all duration-300 bg-gradient-to-r from-[#0c1320]/90 
                    to-[#162030]/90 backdrop-blur overflow-hidden
                    hover:border-[#00FFFF]/50 hover:shadow-[0_0_15px_rgba(0,255,255,0.2)]">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute w-full h-1 bg-gradient-to-r from-transparent via-[#00FFFF]/30 to-transparent 
                        animate-scanVertical"></div>
          <div className="absolute w-1 h-full bg-gradient-to-b from-transparent via-[#00FFFF]/30 to-transparent 
                        animate-scanHorizontal"></div>
        </div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-1 mb-2">
            <div className="w-6 h-6 rounded-full bg-[#00FFFF]/10 flex items-center justify-center
                          border border-[#00FFFF]/30">
              <div className="text-[#00FFFF]">
                {componentIcons[type]}
              </div>
            </div>
            <div>
              <div className="text-xs font-medium text-white">{label}</div>
              {rating && <div className="text-xs text-[#00FFFF]/70">{rating}A {curve && `- ${curve}`}</div>}
            </div>
          </div>
          
          <div className="relative w-full h-16 bg-[#0c1320] rounded-md border border-[#253142] 
                        overflow-hidden group-hover:border-[#00FFFF]/30 transition-colors">
            <ComponentVisualization type={type} />
          </div>
        </div>
      </div>
    </div>
  );
};

const ComponentVisualization: React.FC<{ type: ComponentType }> = ({ type }) => {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <div className="relative">
        {type === 'breaker' && (
          <div className="w-12 h-16 flex flex-col border-2 border-[#00FFFF]/20 rounded-sm 
                       bg-[#0F1724]/70 relative overflow-hidden">
            <div className="h-1/2 border-b border-[#00FFFF]/30 flex items-center justify-center">
              <div className="w-4 h-4 rounded-full bg-[#00FFFF]/20 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-[#00FFFF]/60"></div>
              </div>
            </div>
            <div className="h-1/2 flex items-center justify-center">
              <div className="w-4 h-6 bg-[#00FFFF]/20 rounded-sm"></div>
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#00FFFF]/10 to-transparent opacity-50"></div>
            <div className="absolute inset-0 animate-pulse opacity-30 
                         bg-gradient-to-r from-transparent via-[#00FFFF]/20 to-transparent"></div>
          </div>
        )}
        {type === 'rcd' && (
          <div className="w-16 h-16 flex flex-col border-2 border-[#00FFFF]/20 rounded-sm 
                       bg-[#0F1724]/70 relative overflow-hidden">
            <div className="h-1/2 border-b border-[#00FFFF]/30 flex items-center justify-center">
              <div className="w-12 h-4 rounded-sm bg-[#00FFFF]/20 flex items-center justify-center">
                <div className="text-[#00FFFF]/90 text-xs">TEST</div>
              </div>
            </div>
            <div className="h-1/2 flex items-center justify-center">
              <Power className="w-8 h-8 text-[#00FFFF]/40" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#00FFFF]/10 to-transparent opacity-50"></div>
          </div>
        )}
        {type === 'rcbo' && (
          <div className="w-12 h-16 flex flex-col border-2 border-[#00FFFF]/20 rounded-sm 
                       bg-[#0F1724]/70 relative overflow-hidden">
            <div className="h-1/2 border-b border-[#00FFFF]/30 flex items-center justify-center">
              <div className="w-8 h-4 rounded-sm bg-[#00FFFF]/20 flex items-center justify-center">
                <div className="text-[#00FFFF]/90 text-xs">30mA</div>
              </div>
            </div>
            <div className="h-1/2 flex items-center justify-center">
              <div className="w-4 h-6 bg-[#00FFFF]/20 rounded-sm"></div>
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#00FFFF]/10 to-transparent opacity-50"></div>
          </div>
        )}
        {type === 'spd' && (
          <div className="w-24 h-16 flex flex-col border-2 border-[#00FFFF]/20 rounded-sm 
                       bg-[#0F1724]/70 relative overflow-hidden">
            <div className="flex flex-row h-full">
              <div className="flex-1 border-r border-[#00FFFF]/30 flex items-center justify-center">
                <CircleX className="w-4 h-4 text-[#00FFFF]/40" />
              </div>
              <div className="flex-1 border-r border-[#00FFFF]/30 flex items-center justify-center">
                <CircleX className="w-4 h-4 text-[#00FFFF]/40" />
              </div>
              <div className="flex-1 flex items-center justify-center">
                <CircleX className="w-4 h-4 text-[#00FFFF]/40" />
              </div>
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#00FFFF]/10 to-transparent opacity-50"></div>
          </div>
        )}
        {type === 'fuse' && (
          <div className="w-24 h-16 flex flex-col border-2 border-[#00FFFF]/20 rounded-sm 
                       bg-[#0F1724]/70 relative overflow-hidden">
            <div className="flex flex-row h-full">
              <div className="flex-1 border-r border-[#00FFFF]/30 flex items-center justify-center">
                <div className="w-2 h-8 bg-[#00FFFF]/30 rounded-full"></div>
              </div>
              <div className="flex-1 border-r border-[#00FFFF]/30 flex items-center justify-center">
                <div className="w-2 h-8 bg-[#00FFFF]/30 rounded-full"></div>
              </div>
              <div className="flex-1 flex items-center justify-center">
                <div className="w-2 h-8 bg-[#00FFFF]/30 rounded-full"></div>
              </div>
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#00FFFF]/10 to-transparent opacity-50"></div>
          </div>
        )}
        {type === 'separator' && (
          <div className="w-24 h-16 flex flex-col border-2 border-[#00FFFF]/20 rounded-sm 
                       bg-[#0F1724]/70 relative overflow-hidden">
            <div className="flex items-center justify-center h-full">
              <div className="w-20 h-1 bg-[#00FFFF]/40"></div>
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#00FFFF]/10 to-transparent opacity-50"></div>
          </div>
        )}
        {type === 'terminal' && (
          <div className="w-16 h-16 flex flex-col border-2 border-[#00FFFF]/20 rounded-sm 
                       bg-[#0F1724]/70 relative overflow-hidden">
            <div className="flex flex-row h-full items-center justify-center">
              <div className="flex flex-col gap-1">
                <div className="w-10 h-2 bg-[#00FFFF]/30 rounded-sm"></div>
                <div className="w-10 h-2 bg-[#00FFFF]/30 rounded-sm"></div>
                <div className="w-10 h-2 bg-[#00FFFF]/30 rounded-sm"></div>
                <div className="w-10 h-2 bg-[#00FFFF]/30 rounded-sm"></div>
              </div>
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#00FFFF]/10 to-transparent opacity-50"></div>
          </div>
        )}
        {(type === 'isolator' || type === 'contactor') && (
          <div className="w-12 h-16 flex flex-col border-2 border-[#00FFFF]/20 rounded-sm 
                       bg-[#0F1724]/70 relative overflow-hidden">
            <div className="h-full flex items-center justify-center">
              {type === 'isolator' ? 
                <CirclePlus className="w-8 h-8 text-[#00FFFF]/40" /> : 
                <div className="w-8 h-8 border-2 border-[#00FFFF]/40 rounded-sm flex items-center justify-center">
                  <div className="w-4 h-4 bg-[#00FFFF]/20"></div>
                </div>
              }
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#00FFFF]/10 to-transparent opacity-50"></div>
          </div>
        )}
      </div>
      
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-70 pointer-events-none">
        <div className="w-full h-1 bg-gradient-to-r from-transparent via-[#00FFFF]/60 to-transparent 
                     absolute animate-scanHorizontal"></div>
      </div>
    </div>
  );
};

export const ComponentPalette: React.FC<{ onDragStart: (type: ComponentType) => void }> = ({ 
  onDragStart 
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  
  const allComponents = [
    { type: 'breaker', label: 'Monofazic 10A', rating: '10', curve: 'B', phases: ['L1'] },
    { type: 'breaker', label: 'Monofazic 16A', rating: '16', curve: 'B', phases: ['L1'] },
    { type: 'breaker', label: 'Monofazic 20A', rating: '20', curve: 'C', phases: ['L1'] },
    { type: 'breaker', label: 'Trifazic 16A', rating: '16', curve: 'C', phases: ['L1', 'L2', 'L3'] },
    { type: 'breaker', label: 'Trifazic 25A', rating: '25', curve: 'C', phases: ['L1', 'L2', 'L3'] },
    { type: 'breaker', label: 'Trifazic 32A', rating: '32', curve: 'D', phases: ['L1', 'L2', 'L3'] },
    { type: 'rcd', label: 'RCD 2P 25A', rating: '25', phases: ['L1', 'N'] },
    { type: 'rcd', label: 'RCD 4P 40A', rating: '40', phases: ['L1', 'L2', 'L3', 'N'] },
    { type: 'rcbo', label: 'RCBO 16A', rating: '16', phases: ['L1', 'N'] },
    { type: 'rcbo', label: 'RCBO 20A', rating: '20', phases: ['L1', 'N'] },
    { type: 'timeRelay', label: 'Releu de timp', rating: '16' },
    { type: 'phaseRelay', label: 'Releu de fază', rating: '16' },
  ];

  const filteredComponents = allComponents.filter(component => 
    component.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
    component.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="relative">
        <input
          type="text"
          placeholder="Caută componente..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-3 py-2 bg-[#162030] border border-[#253142] rounded-lg text-white 
                   placeholder-gray-400 focus:border-[#00FFFF] outline-none transition-colors"
        />
      </div>

      <ScrollArea className="h-[400px] pr-4">
        <div className="space-y-4">
          {filteredComponents.length > 0 ? (
            <div className="grid grid-cols-2 gap-2">
              {filteredComponents.map((component, index) => (
                <ComponentCard 
                  key={index}
                  type={component.type as ComponentType}
                  label={component.label}
                  rating={component.rating}
                  curve={component.curve as 'B' | 'C' | 'D'}
                  onDragStart={onDragStart}
                />
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-center py-4">Nu s-au găsit componente</p>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export const createNewComponent = (type: ComponentType, position: number = 0): PanelComponent => {
  const template = COMPONENT_TEMPLATES[type];
  
  return {
    id: uuidv4(),
    type,
    name: `${type}-${position}`,
    description: '',
    position,
    width: template.width || 1,
    curve: template.curve as any || 'C',
    rating: template.rating as any || '16',
    diffProtection: template.diffProtection as any,
    phases: template.phases as any || ['L1'],
    connections: [],
    heat: calculateComponentHeat(type, template.rating as any || '16')
  };
};

const calculateComponentHeat = (type: ComponentType, rating: string): number => {
  const currentValue = parseInt(rating, 10);
  const heatFactor = COMPONENT_HEAT_FACTORS[type] || 0.5;
  return currentValue * heatFactor;
};

import { COMPONENT_HEAT_FACTORS } from '@/lib/electricalPanelTypes';
