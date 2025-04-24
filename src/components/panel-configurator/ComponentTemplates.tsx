
import React from 'react';
import { ComponentType, PanelComponent, COMPONENT_TEMPLATES } from '@/lib/electricalPanelTypes';
import { v4 as uuidv4 } from 'uuid';
import { Button } from '@/components/ui/button';
import { 
  CirclePlus, 
  Zap,
  Power,
  CircleX
} from 'lucide-react';

interface ComponentCardProps {
  type: ComponentType;
  label: string;
  onDragStart: (type: ComponentType) => void;
}

const componentIcons: Record<ComponentType, React.ReactNode> = {
  breaker: <Zap className="size-4" />,
  rcd: <Power className="size-4" />,
  rcbo: <Power className="size-4" />,
  spd: <CircleX className="size-4" />,
  isolator: <CirclePlus className="size-4" />,
  contactor: <CirclePlus className="size-4" />
};

export const ComponentCard: React.FC<ComponentCardProps> = ({ type, label, onDragStart }) => {
  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('application/reactflow', JSON.stringify({ type }));
    e.dataTransfer.effectAllowed = 'move';
    onDragStart(type);
  };

  return (
    <div
      className="border border-[#253142] rounded-md p-2 cursor-grab transition-colors hover:bg-[#162030] bg-[#0c1320] text-white flex items-center gap-2"
      draggable
      onDragStart={handleDragStart}
    >
      <div className="flex-shrink-0 text-[#00FFFF]">
        {componentIcons[type] || <CirclePlus className="size-4" />}
      </div>
      <span>{label}</span>
    </div>
  );
};

export const ComponentPalette: React.FC<{ onDragStart: (type: ComponentType) => void }> = ({ 
  onDragStart 
}) => {
  return (
    <div className="p-4 border rounded-lg bg-[#0c1320] border-[#253142] text-white">
      <h3 className="font-medium mb-3">Componente disponibile</h3>
      <div className="space-y-2">
        <ComponentCard type="breaker" label="Siguranță automată" onDragStart={onDragStart} />
        <ComponentCard type="rcd" label="Protecție diferențială (RCD)" onDragStart={onDragStart} />
        <ComponentCard type="rcbo" label="Siguranță diferențială (RCBO)" onDragStart={onDragStart} />
        <ComponentCard type="spd" label="Protecție la supratensiune (SPD)" onDragStart={onDragStart} />
        <ComponentCard type="isolator" label="Întrerupător general" onDragStart={onDragStart} />
        <ComponentCard type="contactor" label="Contactor" onDragStart={onDragStart} />
      </div>
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
  };
};

