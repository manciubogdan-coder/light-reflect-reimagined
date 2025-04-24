
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface AnalysisPanelProps {
  totalCurrent: number;
  phaseCurrents: Record<string, number>;
  recommendedMainBreaker: string;
  recommendations: string[];
}

export const AnalysisPanel: React.FC<AnalysisPanelProps> = ({
  totalCurrent,
  phaseCurrents,
  recommendedMainBreaker,
  recommendations
}) => {
  // Find the maximum phase current for scaling the progress bars
  const maxPhaseCurrent = Math.max(...Object.values(phaseCurrents), 1);
  
  // Calculate the balance percentage between phases
  const calculateImbalance = () => {
    if (Object.keys(phaseCurrents).length <= 1) return 0;
    
    const values = Object.values(phaseCurrents);
    const max = Math.max(...values);
    const min = Math.min(...values);
    
    if (max === 0) return 0;
    return ((max - min) / max) * 100;
  };
  
  const imbalance = calculateImbalance();
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Analiză tablou</CardTitle>
        <CardDescription>
          Sumar consum și recomandări pentru dimensionare
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="text-sm font-medium mb-2">Curent total: {totalCurrent.toFixed(1)}A</h4>
          <Progress value={100} className="h-2" />
        </div>
        
        <div className="space-y-2">
          <h4 className="text-sm font-medium mb-1">Distribuție pe faze</h4>
          
          {Object.entries(phaseCurrents).map(([phase, current]) => (
            <div key={phase} className="space-y-1">
              <div className="flex justify-between text-xs">
                <span>{phase}</span>
                <span>{current.toFixed(1)}A</span>
              </div>
              <Progress 
                value={(current / maxPhaseCurrent) * 100} 
                className={`h-2 ${
                  phase === 'L1' ? 'bg-red-100' : 
                  phase === 'L2' ? 'bg-yellow-100' : 
                  'bg-blue-100'
                }`} 
              />
            </div>
          ))}
        </div>
        
        {imbalance > 5 && (
          <div className="mt-2">
            <div className="flex justify-between text-xs">
              <span>Dezechilibru între faze</span>
              <span>{imbalance.toFixed(1)}%</span>
            </div>
            <Progress 
              value={imbalance} 
              className={`h-2 ${
                imbalance < 10 ? 'bg-green-100' : 
                imbalance < 20 ? 'bg-yellow-100' : 
                'bg-red-100'
              }`} 
            />
          </div>
        )}
        
        <div className="bg-blue-50 p-3 rounded-md">
          <h4 className="text-sm font-medium">Recomandări:</h4>
          <ul className="text-sm list-disc pl-5 mt-1 space-y-1">
            <li>Întrerupător general recomandat: <strong>{recommendedMainBreaker}A</strong></li>
            {recommendations.map((rec, idx) => (
              <li key={idx}>{rec}</li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};
