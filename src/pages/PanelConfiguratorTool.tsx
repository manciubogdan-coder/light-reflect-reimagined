
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import { ComponentPalette } from '@/components/panel-configurator/ComponentTemplates';
import { PanelGrid } from '@/components/panel-configurator/PanelGrid';
import { ComponentEditor } from '@/components/panel-configurator/ComponentEditor';
import { ValidationPanel } from '@/components/panel-configurator/ValidationPanel';
import { AnalysisPanel } from '@/components/panel-configurator/AnalysisPanel';
import { EducationalTips } from '@/components/panel-configurator/EducationalTips';
import { 
  ComponentType, 
  PanelComponent, 
  PanelConfiguration
} from '@/lib/electricalPanelTypes';
import { validatePanel, analyzePanel } from '@/lib/electricalPanelValidations';
import { downloadPanelPDF } from '@/lib/pdfGenerator';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogFooter, DialogHeader } from '@/components/ui/dialog';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download, Send, Zap, Power, CircleAlert } from 'lucide-react';
import { toast } from "sonner";
import { v4 as uuidv4 } from 'uuid';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';

interface ContactFormValues {
  name: string;
  email: string;
  phone: string;
  details: string;
}

const PanelConfiguratorTool = () => {
  const [components, setComponents] = useState<PanelComponent[]>([]);
  const [moduleCount, setModuleCount] = useState<number>(12);
  const [supplyType, setSupplyType] = useState<'single-phase' | 'three-phase'>('single-phase');
  const [draggingComponentType, setDraggingComponentType] = useState<ComponentType | null>(null);
  const [editingComponent, setEditingComponent] = useState<PanelComponent | null>(null);
  const [configName, setConfigName] = useState<string>("Tablou principal");
  const [contactDialogOpen, setContactDialogOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);
  
  const form = useForm<ContactFormValues>({
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      details: ''
    }
  });

  // Compute validation results
  const validationResults = validatePanel(components);
  
  // Compute panel analysis
  const analysis = analyzePanel(components, supplyType);
  
  const handleAddComponent = (component: PanelComponent) => {
    setComponents([...components, component]);
    toast.success("Componentă adăugată");
  };
  
  const handleRemoveComponent = (componentId: string) => {
    setComponents(components.filter(c => c.id !== componentId));
    toast.info("Componentă eliminată");
  };
  
  const handleEditComponent = (componentId: string) => {
    const component = components.find(c => c.id === componentId);
    if (component) {
      setEditingComponent(component);
    }
  };
  
  const handleSaveComponent = (updatedComponent: PanelComponent) => {
    setComponents(components.map(c => 
      c.id === updatedComponent.id ? updatedComponent : c
    ));
    setEditingComponent(null);
    toast.success("Componentă actualizată");
  };
  
  const handleDownloadPDF = () => {
    const config: PanelConfiguration = {
      id: uuidv4(),
      name: configName,
      components,
      moduleCount,
      supplyType
    };
    
    downloadPanelPDF(config, analysis.phaseCurrents, analysis.recommendations);
    toast.success("PDF generat cu succes");
  };

  const handleContactSubmit = async (values: ContactFormValues) => {
    try {
      setIsSending(true);
      
      // Generate a configuration summary
      const config: PanelConfiguration = {
        id: uuidv4(),
        name: configName,
        components,
        moduleCount,
        supplyType
      };
      
      // Save the panel configuration to the database
      const { error: dbError } = await supabase
        .from('panel_configurations')
        .insert({
          name: configName,
          configuration: config,
          total_current: analysis.totalCurrent,
          main_breaker: analysis.recommendedMainBreaker,
          supply_type: supplyType,
          module_count: moduleCount,
          component_count: components.length
        });
        
      if (dbError) throw new Error(dbError.message);
      
      // Send email with the request
      const response = await fetch(
        `https://acmknwxnyibvbbltfdxh.supabase.co/functions/v1/send-contact-email`, 
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            nume: values.name,
            email: values.email,
            mesaj: `Solicitare proiect tablou electric din configurator
Telefon: ${values.phone}
Configurație: ${configName}
Tip alimentare: ${supplyType === 'single-phase' ? 'Monofazic' : 'Trifazic'}
Module: ${moduleCount}
Componente: ${components.length}
Curent total: ${analysis.totalCurrent.toFixed(1)}A
Siguranță principală recomandată: ${analysis.recommendedMainBreaker}A

Detalii suplimentare: 
${values.details}
`
          })
        }
      );
      
      if (!response.ok) {
        throw new Error("A apărut o eroare la trimiterea solicitării");
      }
      
      toast.success("Solicitarea a fost trimisă cu succes!");
      setContactDialogOpen(false);
      form.reset();
    } catch (error) {
      console.error("Error sending request:", error);
      toast.error(`Eroare: ${error instanceof Error ? error.message : "A apărut o eroare"}`);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Configurator Tablouri Electrice | Light Reflect</title>
        <meta name="description" content="Configurați-vă propriul tablou electric cu ajutorul instrumentului nostru de configurare vizuală. Trageți componente, validați conform normativelor și generați scheme." />
      </Helmet>

      <Nav />

      <div className="container py-8 mx-auto">
        <h1 className="text-3xl font-bold mb-2">Configurator Tablouri Electrice</h1>
        <p className="text-gray-600 mb-6">
          Creați și validați configurația tabloului electric prin simpla tragere a componentelor în schemă. 
          Toate validările sunt realizate conform normativelor în vigoare.
        </p>

        <div className="grid grid-cols-1 gap-4 mb-6">
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <div className="space-y-2">
              <Label htmlFor="configName">Denumire configurație</Label>
              <Input 
                id="configName"
                value={configName} 
                onChange={(e) => setConfigName(e.target.value)}
                placeholder="Tablou principal"
                className="max-w-xs" 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="supplyType">Tip alimentare</Label>
              <Select 
                value={supplyType}
                onValueChange={(value: 'single-phase' | 'three-phase') => setSupplyType(value)}
              >
                <SelectTrigger id="supplyType" className="w-[200px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="single-phase">Monofazic (230V)</SelectItem>
                  <SelectItem value="three-phase">Trifazic (400V)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="moduleCount">Număr module</Label>
              <Select 
                value={moduleCount.toString()}
                onValueChange={(value) => setModuleCount(parseInt(value, 10))}
              >
                <SelectTrigger id="moduleCount" className="w-[200px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="4">4 module</SelectItem>
                  <SelectItem value="8">8 module</SelectItem>
                  <SelectItem value="12">12 module</SelectItem>
                  <SelectItem value="18">18 module</SelectItem>
                  <SelectItem value="24">24 module</SelectItem>
                  <SelectItem value="36">36 module</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <ResizablePanelGroup direction="horizontal" className="min-h-[600px]">
          <ResizablePanel defaultSize={25} minSize={20}>
            <div className="p-4 h-full">
              <h3 className="text-lg font-medium mb-4">Componente disponibile</h3>
              <ComponentPalette onDragStart={setDraggingComponentType} />
              
              <div className="mt-6 space-y-3">
                <Button 
                  onClick={handleDownloadPDF} 
                  variant="outline" 
                  className="w-full"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Descarcă PDF
                </Button>
                
                <Button 
                  onClick={() => setContactDialogOpen(true)} 
                  variant="default" 
                  className="w-full"
                >
                  <Send className="mr-2 h-4 w-4" />
                  Trimite proiect
                </Button>
              </div>
              
              <div className="mt-6">
                <AnalysisPanel 
                  totalCurrent={analysis.totalCurrent}
                  phaseCurrents={analysis.phaseCurrents}
                  recommendedMainBreaker={analysis.recommendedMainBreaker}
                  recommendations={analysis.recommendations}
                />
              </div>
            </div>
          </ResizablePanel>
          
          <ResizableHandle />
          
          <ResizablePanel defaultSize={75}>
            <div className="p-4 h-full">
              <PanelGrid 
                moduleCount={moduleCount} 
                components={components} 
                onComponentAdd={handleAddComponent}
                onComponentRemove={handleRemoveComponent} 
                onComponentEdit={handleEditComponent}
                showPhases={supplyType === 'three-phase'}
              />
              
              <ValidationPanel validationResults={validationResults} />
              
              <EducationalTips components={components} />
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
      
      <ComponentEditor
        component={editingComponent}
        onSave={handleSaveComponent}
        onCancel={() => setEditingComponent(null)}
        open={!!editingComponent}
      />
      
      <Dialog open={contactDialogOpen} onOpenChange={setContactDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Trimite proiectul către Light Reflect</DialogTitle>
            <DialogDescription>
              Completați formularul pentru a primi o ofertă completă pentru proiectarea și montajul tabloului electric
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleContactSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                rules={{ required: "Numele este obligatoriu" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nume</FormLabel>
                    <FormControl>
                      <Input placeholder="Numele dvs." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="email"
                rules={{ 
                  required: "Email-ul este obligatoriu",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Adresă de email invalidă"
                  }
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="email@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="phone"
                rules={{ required: "Numărul de telefon este obligatoriu" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Telefon</FormLabel>
                    <FormControl>
                      <Input placeholder="Număr telefon" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="details"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Detalii suplimentare</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Orice alte detalii relevante despre proiect..." 
                        {...field} 
                        rows={4}
                      />
                    </FormControl>
                    <FormDescription>
                      Menționați orice cerințe speciale sau întrebări aveți
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setContactDialogOpen(false)}>
                  Anulare
                </Button>
                <Button type="submit" disabled={isSending}>
                  {isSending ? "Se trimite..." : "Trimite solicitarea"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <Footer />
    </>
  );
};

export default PanelConfiguratorTool;
