
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PanelComponent, CurveType, DiffProtectionType, RatingType, PhaseType } from '@/lib/electricalPanelTypes';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';

interface ComponentEditorProps {
  component: PanelComponent | null;
  onSave: (updatedComponent: PanelComponent) => void;
  onCancel: () => void;
  open: boolean;
}

export const ComponentEditor: React.FC<ComponentEditorProps> = ({
  component,
  onSave,
  onCancel,
  open
}) => {
  const [editedComponent, setEditedComponent] = React.useState<PanelComponent | null>(component);

  React.useEffect(() => {
    setEditedComponent(component);
  }, [component]);

  if (!editedComponent) return null;

  const handleChange = (field: keyof PanelComponent, value: any) => {
    setEditedComponent(prev => {
      if (!prev) return prev;
      return { ...prev, [field]: value };
    });
  };

  const handlePhaseToggle = (phase: PhaseType) => {
    setEditedComponent(prev => {
      if (!prev) return prev;
      
      const currentPhases = prev.phases || [];
      
      if (currentPhases.includes(phase)) {
        return {
          ...prev,
          phases: currentPhases.filter(p => p !== phase)
        };
      } else {
        return {
          ...prev,
          phases: [...currentPhases, phase]
        };
      }
    });
  };

  const handleSave = () => {
    if (editedComponent) {
      onSave(editedComponent);
    }
  };

  const availableRatings: RatingType[] = ['6', '10', '16', '20', '25', '32', '40', '50', '63'];
  const availableCurves: CurveType[] = ['B', 'C', 'D'];
  const availableDiffProtections: DiffProtectionType[] = ['none', '10mA', '30mA', '100mA', '300mA'];
  const availablePhases: PhaseType[] = ['L1', 'L2', 'L3', 'N', 'PE'];

  const canEditCurve = ['breaker', 'rcbo'].includes(editedComponent.type);
  const canEditDiff = ['rcd', 'rcbo'].includes(editedComponent.type);

  return (
    <Dialog open={open} onOpenChange={() => onCancel()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Editare componentă</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Nume</Label>
            <Input 
              id="name" 
              value={editedComponent.name} 
              onChange={(e) => handleChange('name', e.target.value)} 
            />
          </div>
          
          <div>
            <Label htmlFor="description">Descriere / Destinație</Label>
            <Textarea 
              id="description" 
              value={editedComponent.description} 
              onChange={(e) => handleChange('description', e.target.value)} 
              placeholder="ex: Prize bucătărie"
            />
          </div>
          
          <div>
            <Label htmlFor="rating">Curent nominal</Label>
            <Select 
              value={editedComponent.rating} 
              onValueChange={(value) => handleChange('rating', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selectați curentul" />
              </SelectTrigger>
              <SelectContent>
                {availableRatings.map(rating => (
                  <SelectItem key={rating} value={rating}>{rating}A</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {canEditCurve && (
            <div>
              <Label htmlFor="curve">Tip curbă</Label>
              <Select 
                value={editedComponent.curve} 
                onValueChange={(value) => handleChange('curve', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selectați curba" />
                </SelectTrigger>
                <SelectContent>
                  {availableCurves.map(curve => (
                    <SelectItem key={curve} value={curve}>Curbă {curve}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          
          {canEditDiff && (
            <div>
              <Label htmlFor="diffProtection">Protecție diferențială</Label>
              <Select 
                value={editedComponent.diffProtection} 
                onValueChange={(value) => handleChange('diffProtection', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selectați protecția" />
                </SelectTrigger>
                <SelectContent>
                  {availableDiffProtections.map(diff => (
                    <SelectItem key={diff} value={diff}>
                      {diff === 'none' ? 'Fără protecție' : diff}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          
          <div>
            <Label htmlFor="phases">Faze conectate</Label>
            <div className="flex flex-wrap gap-3 mt-2">
              {availablePhases.map(phase => (
                <div key={phase} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`phase-${phase}`} 
                    checked={editedComponent.phases.includes(phase)}
                    onCheckedChange={() => handlePhaseToggle(phase)}
                  />
                  <label 
                    htmlFor={`phase-${phase}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {phase}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-4">
          <Button variant="outline" onClick={onCancel}>Anulare</Button>
          <Button onClick={handleSave}>Salvare</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
