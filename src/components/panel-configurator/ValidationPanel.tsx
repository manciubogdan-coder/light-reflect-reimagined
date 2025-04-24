
import React from 'react';
import { ValidationResult } from '@/lib/electricalPanelTypes';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  AlertCircle, 
  Info, 
  AlertTriangle 
} from 'lucide-react';

interface ValidationPanelProps {
  validationResults: ValidationResult[];
}

export const ValidationPanel: React.FC<ValidationPanelProps> = ({ validationResults }) => {
  if (validationResults.length === 0) {
    return (
      <Card className="mt-4 bg-green-50 border-green-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-green-700 flex items-center gap-2 text-base">
            <Info className="h-4 w-4" />
            Validare reușită
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-green-700 text-sm">Nu s-au detectat probleme în configurația tabloului electric.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mt-4">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base">
          <AlertCircle className="h-4 w-4" />
          Rezultate validare
        </CardTitle>
        <CardDescription>
          S-au detectat {validationResults.length} probleme potențiale
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {validationResults.map((result, index) => (
            <div key={index} className={`
              p-3 rounded-md 
              ${result.type === 'warning' ? 'bg-amber-50 border border-amber-200' : 
                result.type === 'error' ? 'bg-red-50 border border-red-200' : 
                'bg-blue-50 border border-blue-200'}
            `}>
              <div className="flex gap-2 items-start">
                {result.type === 'warning' ? (
                  <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5" />
                ) : result.type === 'error' ? (
                  <AlertCircle className="h-4 w-4 text-red-600 mt-0.5" />
                ) : (
                  <Info className="h-4 w-4 text-blue-600 mt-0.5" />
                )}
                <div>
                  <p className={`font-medium text-sm 
                    ${result.type === 'warning' ? 'text-amber-800' : 
                      result.type === 'error' ? 'text-red-800' : 'text-blue-800'}
                  `}>
                    {result.message}
                  </p>
                  {result.recommendation && (
                    <p className="text-sm mt-1">{result.recommendation}</p>
                  )}
                  {result.normative && (
                    <p className="text-xs mt-1 opacity-70">Conform normativ {result.normative}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
