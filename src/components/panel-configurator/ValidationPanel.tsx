
import React from 'react';
import { ValidationResult } from '@/lib/electricalPanelTypes';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { ChevronDown, CircleAlert, CircleCheck, CircleInfo } from 'lucide-react';

interface ValidationPanelProps {
  validationResults: ValidationResult[];
  isCollapsed?: boolean;
}

export const ValidationPanel: React.FC<ValidationPanelProps> = ({ 
  validationResults, 
  isCollapsed = false 
}) => {
  const [isOpen, setIsOpen] = React.useState(!isCollapsed);

  const getAlertIcon = (type: ValidationResult['type']) => {
    switch (type) {
      case 'error':
        return <CircleAlert className="h-4 w-4 text-destructive" />;
      case 'warning':
        return <CircleAlert className="h-4 w-4 text-amber-500" />;
      case 'info':
        return <CircleInfo className="h-4 w-4 text-blue-500" />;
      default:
        return <CircleCheck className="h-4 w-4 text-green-500" />;
    }
  };

  const getAlertVariant = (type: ValidationResult['type']) => {
    switch (type) {
      case 'error':
        return 'destructive';
      case 'warning':
        return 'default'; // Default with custom styling
      case 'info':
        return 'default'; // Default with custom styling
      default:
        return 'default';
    }
  };

  return (
    <div className="mt-4">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <div className="flex items-center justify-between p-2 bg-gray-100 rounded-t-lg">
          <h3 className="text-sm font-medium">Validare și recomandări</h3>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm">
              <ChevronDown
                className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
              />
              <span className="sr-only">Toggle</span>
            </Button>
          </CollapsibleTrigger>
        </div>
        
        <CollapsibleContent className="p-2 bg-white border border-gray-200 rounded-b-lg">
          {validationResults.length === 0 ? (
            <Alert>
              <CircleCheck className="h-4 w-4 text-green-500" />
              <AlertTitle>Configurație corectă</AlertTitle>
              <AlertDescription>
                Nu au fost detectate probleme în configurația tabloului electric.
              </AlertDescription>
            </Alert>
          ) : (
            <div className="space-y-2">
              {validationResults.map((result, index) => (
                <Alert key={index} 
                  variant={getAlertVariant(result.type)}
                  className={`
                    ${result.type === 'warning' ? 'border-amber-500 text-amber-800 bg-amber-50' : ''}
                    ${result.type === 'info' ? 'border-blue-500 text-blue-800 bg-blue-50' : ''}
                  `}
                >
                  {getAlertIcon(result.type)}
                  <AlertTitle>
                    {result.message}
                    {result.normative && (
                      <span className="ml-2 text-xs opacity-70">({result.normative})</span>
                    )}
                  </AlertTitle>
                  {result.recommendation && (
                    <AlertDescription>
                      {result.recommendation}
                    </AlertDescription>
                  )}
                </Alert>
              ))}
            </div>
          )}
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};
