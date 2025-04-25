
import React from 'react';
import { ComponentType } from '@/lib/electricalPanelTypes';
import { 
  Zap,
  Power,
  CirclePlus,
  CircleX,
  Plug,
  SeparatorHorizontal,
  Cable
} from 'lucide-react';

interface ComponentVisualizationProps {
  type: ComponentType;
}

export const ComponentVisualization: React.FC<ComponentVisualizationProps> = ({ type }) => {
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
          <div className="w-20 h-16 flex flex-col border-2 border-[#00FFFF]/20 rounded-sm 
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
          <div className="w-20 h-16 flex flex-col border-2 border-[#00FFFF]/20 rounded-sm 
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
          <div className="w-20 h-16 flex flex-col border-2 border-[#00FFFF]/20 rounded-sm 
                       bg-[#0F1724]/70 relative overflow-hidden">
            <div className="flex items-center justify-center h-full">
              <div className="w-16 h-1 bg-[#00FFFF]/40"></div>
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
