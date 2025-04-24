
import React, { useState, useEffect } from 'react';
import { EDUCATION_TIPS } from '@/lib/electricalPanelTypes';
import { PanelComponent } from '@/lib/electricalPanelTypes';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Info } from 'lucide-react';

interface EducationalTipsProps {
  components: PanelComponent[];
}

export const EducationalTips: React.FC<EducationalTipsProps> = ({ components }) => {
  const [relevantTips, setRelevantTips] = useState<typeof EDUCATION_TIPS>([]);
  
  useEffect(() => {
    // Filter tips based on components in the panel
    const allDescriptions = components.map(c => c.description.toLowerCase()).join(' ');
    
    const filteredTips = EDUCATION_TIPS.filter(tip => 
      tip.trigger.some(keyword => allDescriptions.includes(keyword))
    );
    
    // Always show at least 2 tips
    let tipsToShow = [...filteredTips];
    
    if (tipsToShow.length < 2) {
      // Add general tips until we have at least 2
      const generalTips = EDUCATION_TIPS.filter(tip => 
        !filteredTips.some(ft => ft.id === tip.id)
      ).slice(0, 2 - tipsToShow.length);
      
      tipsToShow = [...tipsToShow, ...generalTips];
    }
    
    setRelevantTips(tipsToShow);
  }, [components]);
  
  if (relevantTips.length === 0) return null;
  
  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Info className="h-5 w-5" />
          Sfaturi și recomandări
        </CardTitle>
        <CardDescription>
          Informații utile despre instalațiile electrice
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {relevantTips.map(tip => (
            <div key={tip.id} className="bg-blue-50 p-3 rounded-md">
              <h4 className="font-medium text-sm">{tip.title}</h4>
              <p className="text-sm mt-1">{tip.content}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
