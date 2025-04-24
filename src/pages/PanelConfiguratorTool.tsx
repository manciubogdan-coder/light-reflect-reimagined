
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
import { AISuggestions } from '@/components/panel-configurator/AISuggestions';
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
import { Download, Send, Zap, Power, CircleAlert, Lightbulb } from 'lucide-react';
import { toast } from "@/hooks/use-toast";
import { v4 as uuidv4 } from 'uuid';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { useAISuggestions } from '@/hooks/useAISuggestions';

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
  const [highlightPosition, setHighlightPosition] = useState<number | null>(null);
  
  // Get AI suggestions state to extract the activeHoverSuggestion
  const { activeHoverSuggestion } = useAISuggestions(components, moduleCount, supplyType);
  
  const form = useForm<ContactFormValues>({
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      details: ''
    }
  });

  const validationResults = validatePanel(components);
  
  const analysis = analyzePanel(components, supplyType);
  
  const handleAddComponent = (component: PanelComponent) => {
    setComponents([...components, component]);
    toast({
      title: "Componentă adăugată",
      variant: "default"
    });
  };
  
  const handleRemoveComponent = (componentId: string) => {
    setComponents(components.filter(c => c.id !== componentId));
    toast({
      title: "Componentă eliminată",
      variant: "default"
    });
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
    toast({
      title: "Componentă actualizată",
      variant: "default"
    });
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
    toast({
      title: "PDF generat cu succes",
      variant: "default"
    });
  };

  const handleContactSubmit = async (values: ContactFormValues) => {
    try {
      setIsSending(true);
      
      const config: PanelConfiguration = {
        id: uuidv4(),
        name: configName,
        components,
        moduleCount,
        supplyType
      };
      
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
      
      toast({
        title: "Solicitarea a fost trimisă cu succes!",
        variant: "default"
      });
      setContactDialogOpen(false);
      form.reset();
    } catch (error) {
      console.error("Error sending request:", error);
      toast({
        title: `Eroare: ${error instanceof Error ? error.message : "A apărut o eroare"}`,
        variant: "destructive"
      });
    } finally {
      setIsSending(false);
    }
  };

  // Set the highlight position when a suggestion is hovered
  React.useEffect(() => {
    if (activeHoverSuggestion) {
      // Find the suggestion's position from your suggestions state
      // This is a simplified approach - in real implementation you'd need to get the actual position
      setHighlightPosition(4); // Example position
    } else {
      setHighlightPosition(null);
    }
  }, [activeHoverSuggestion]);

  return (
    <>
      <Helmet>
        <title>Configurator Tablouri Electrice | Light Reflect</title>
        <meta name="description" content="Configurați-vă propriul tablou electric cu ajutorul instrumentului nostru de configurare vizuală. Trageți componente, validați conform normativelor și generați scheme." />
      </Helmet>

      <div className="bg-[#0F1724] min-h-screen flex flex-col">
        <Nav />
        
        <main className="flex-grow container mx-auto py-24 px-4">
          <h1 className="text-3xl font-bold mb-2 text-white font-tech">Configurator Tablouri Electrice</h1>
          <p className="text-gray-400 mb-6">
            Creați și validați configurația tabloului electric prin simpla tragere a componentelor în schemă. 
            Toate validările sunt realizate conform normativelor în vigoare.
          </p>

          <div className="grid grid-cols-1 gap-4 mb-6">
            <div className="flex flex-col md:flex-row justify-between gap-4">
              <div className="space-y-2">
                <Label htmlFor="configName" className="text-gray-300">Denumire configurație</Label>
                <Input 
                  id="configName"
                  value={configName} 
                  onChange={(e) => setConfigName(e.target.value)}
                  placeholder="Tablou principal"
                  className="max-w-xs bg-[#162030] border-[#253142] text-white" 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="supplyType" className="text-gray-300">Tip alimentare</Label>
                <Select 
                  value={supplyType}
                  onValueChange={(value: 'single-phase' | 'three-phase') => setSupplyType(value)}
                >
                  <SelectTrigger id="supplyType" className="w-[200px] bg-[#162030] border-[#253142] text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#162030] border-[#253142] text-white">
                    <SelectItem value="single-phase">Monofazic (230V)</SelectItem>
                    <SelectItem value="three-phase">Trifazic (400V)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="moduleCount" className="text-gray-300">Număr module</Label>
                <Select 
                  value={moduleCount.toString()}
                  onValueChange={(value) => setModuleCount(parseInt(value, 10))}
                >
                  <SelectTrigger id="moduleCount" className="w-[200px] bg-[#162030] border-[#253142] text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#162030] border-[#253142] text-white">
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

          <ResizablePanelGroup direction="horizontal" className="min-h-[600px] border border-[#253142] rounded-lg overflow-hidden">
            <ResizablePanel defaultSize={25} minSize={20}>
              <div className="p-4 h-full bg-[#0c1320]">
                <h3 className="text-lg font-medium mb-4 text-white font-tech">Componente disponibile</h3>
                <ComponentPalette onDragStart={setDraggingComponentType} />
                
                <div className="mt-6 space-y-3">
                  <Button 
                    onClick={handleDownloadPDF} 
                    variant="outline" 
                    className="w-full border-[#253142] text-[#00FFFF] hover:bg-[#162030] hover:text-[#00FFFF]"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Descarcă PDF
                  </Button>
                  
                  <Button 
                    onClick={() => setContactDialogOpen(true)} 
                    variant="default" 
                    className="w-full bg-[#00FFFF] text-[#0F1724] hover:bg-[#00FFFF]/80"
                  >
                    <Send className="mr-2 h-4 w-4" />
                    Trimite proiect
                  </Button>
                </div>
                
                <div className="mt-6">
                  <div className="bg-[#0c1320] rounded-lg p-4 border border-[#253142]">
                    <h4 className="font-medium text-white mb-3 font-tech">Analiză tablou</h4>
                    <p className="text-sm text-gray-400 mb-2">
                      Sumar tensiuni și recomandări pentru dimensionare
                    </p>
                    
                    <div className="mb-4">
                      <p className="text-sm text-gray-300 mb-1">Curent total: <span className="text-[#00FFFF]">{analysis.totalCurrent.toFixed(1)}A</span></p>
                      
                      <div className="w-full bg-[#162030] h-2 rounded-full mt-1">
                        <div 
                          className="bg-[#00FFFF] h-2 rounded-full" 
                          style={{ width: `${Math.min(100, (analysis.totalCurrent / 63) * 100)}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <h5 className="text-sm font-medium text-gray-300 mb-2">Distribuție pe faze</h5>
                    {Object.entries(analysis.phaseCurrents).map(([phase, current]) => (
                      <div key={phase} className="flex items-center justify-between mb-1">
                        <span className="text-xs text-gray-400">{phase}</span>
                        <span className="text-xs text-gray-300">{current.toFixed(1)}A</span>
                        <div className="w-2/3 bg-[#162030] h-1.5 rounded-full ml-2">
                          <div 
                            className={`h-1.5 rounded-full ${
                              phase === 'L1' ? 'bg-red-500' : 
                              phase === 'L2' ? 'bg-yellow-500' : 'bg-blue-500'
                            }`}
                            style={{ width: `${Math.min(100, (current / 63) * 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                    
                    {analysis.recommendations.length > 0 && (
                      <div className="mt-4">
                        <h5 className="text-xs font-medium text-gray-300 mb-1">Recomandări:</h5>
                        <ul className="text-xs text-gray-400">
                          {analysis.recommendations.map((rec, i) => (
                            <li key={i} className="mb-1">• {rec}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>

                <AISuggestions 
                  components={components}
                  moduleCount={moduleCount}
                  supplyType={supplyType}
                  onAddComponent={handleAddComponent}
                />
              </div>
            </ResizablePanel>
            
            <ResizableHandle className="bg-[#253142] w-1" />
            
            <ResizablePanel defaultSize={75}>
              <div className="p-4 h-full bg-[#0F1724]">
                <PanelGrid 
                  moduleCount={moduleCount} 
                  components={components} 
                  onComponentAdd={handleAddComponent}
                  onComponentRemove={handleRemoveComponent} 
                  onComponentEdit={handleEditComponent}
                  showPhases={supplyType === 'three-phase'}
                  highlightPosition={highlightPosition}
                />
                
                <div className="mt-4 p-4 bg-[#0c1320] rounded-lg border border-[#253142]">
                  <div className="flex items-center gap-2 mb-2">
                    <CircleAlert className="text-[#00FFFF] w-5 h-5" />
                    <h4 className="font-medium text-white font-tech">Rezultate validare</h4>
                  </div>
                  
                  {validationResults.length === 0 ? (
                    <p className="text-sm text-gray-400">Nu s-au detectat probleme potențiale</p>
                  ) : (
                    <div className="space-y-2">
                      <p className="text-sm text-gray-400">S-au detectat {validationResults.length} probleme potențiale</p>
                      {validationResults.map((result) => (
                        <div 
                          key={result.message} 
                          className={`p-3 rounded-md text-sm ${
                            result.type === 'error' ? 'bg-red-950/30 border border-red-900/50' : 
                            result.type === 'warning' ? 'bg-amber-950/30 border border-amber-900/50' : 
                            'bg-blue-950/30 border border-blue-900/50'
                          }`}
                        >
                          <div className="flex gap-2 items-start">
                            <div className={`rounded-full w-2 h-2 mt-1.5 ${
                              result.type === 'error' ? 'bg-red-500' : 
                              result.type === 'warning' ? 'bg-amber-500' : 
                              'bg-blue-500'
                            }`}></div>
                            <div>
                              <p className={`font-medium ${
                                result.type === 'error' ? 'text-red-400' : 
                                result.type === 'warning' ? 'text-amber-400' : 
                                'text-blue-400'
                              }`}>
                                {result.message}
                              </p>
                              {result.recommendation && (
                                <p className="text-gray-400 text-xs mt-1">{result.recommendation}</p>
                              )}
                              {result.normative && (
                                <p className="text-gray-500 text-xs mt-1">Normativ: {result.normative}</p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                <div className="mt-4 p-4 bg-[#0c1320] rounded-lg border border-[#253142]">
                  <div className="flex items-center gap-2 mb-2">
                    <Lightbulb className="text-[#00FFFF] w-5 h-5" />
                    <h4 className="font-medium text-white font-tech">Sfaturi și recomandări</h4>
                  </div>
                  <p className="text-sm text-gray-400">
                    Informații utile despre instalațiile electrice
                  </p>
                  <EducationalTips components={components} />
                </div>
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </main>
        
        <ComponentEditor
          component={editingComponent}
          onSave={handleSaveComponent}
          onCancel={() => setEditingComponent(null)}
          open={!!editingComponent}
        />
        
        <Dialog open={contactDialogOpen} onOpenChange={setContactDialogOpen}>
          <DialogContent className="sm:max-w-[500px] bg-[#162030] border-[#253142] text-white">
            <DialogHeader>
              <DialogTitle className="text-white">Trimite proiectul către Light Reflect</DialogTitle>
              <DialogDescription className="text-gray-400">
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
                      <FormLabel className="text-gray-300">Nume</FormLabel>
                      <FormControl>
                        <Input placeholder="Numele dvs." {...field} className="bg-[#0C1320] border-[#253142] text-white" />
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
                      <FormLabel className="text-gray-300">Email</FormLabel>
                      <FormControl>
                        <Input placeholder="email@example.com" {...field} className="bg-[#0C1320] border-[#253142] text-white" />
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
                      <FormLabel className="text-gray-300">Telefon</FormLabel>
                      <FormControl>
                        <Input placeholder="Număr telefon" {...field} className="bg-[#0C1320] border-[#253142] text-white" />
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
                      <FormLabel className="text-gray-300">Detalii suplimentare</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Orice alte detalii relevante despre proiect..." 
                          {...field} 
                          rows={4}
                          className="bg-[#0C1320] border-[#253142] text-white"
                        />
                      </FormControl>
                      <FormDescription className="text-gray-500">
                        Menționați orice cerințe speciale sau întrebări aveți
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setContactDialogOpen(false)}
                    className="border-[#253142] text-gray-300 hover:bg-[#253142] hover:text-white">
                    Anulare
                  </Button>
                  <Button type="submit" disabled={isSending} 
                    className="bg-[#00FFFF] text-[#0F1724] hover:bg-[#00FFFF]/80">
                    {isSending ? "Se trimite..." : "Trimite solicitarea"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>

        <Footer />
      </div>
    </>
  );
};

export default PanelConfiguratorTool;
