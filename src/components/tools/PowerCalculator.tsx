
import React, { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { PowerCalculatorForm, PowerCalculationResult, PowerAppliance } from "@/lib/types";
import { calculatePowerRequirements, APPLIANCE_TEMPLATES, getDefaultSimultaneityFactor } from "@/lib/powerCalculations";
import { v4 as uuidv4 } from "uuid";
import { Trash2, Plus, Calculator, RefreshCw, Lightbulb, Zap, Settings, Info } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Separator } from "@/components/ui/separator";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

// Define schema for form validation
const applianceSchema = z.object({
  id: z.string(),
  type: z.string(),
  name: z.string().min(1, { message: "Numele este obligatoriu" }),
  quantity: z.coerce.number().int().min(1, { message: "Cantitatea trebuie să fie minim 1" }),
  power: z.coerce.number().min(1, { message: "Puterea trebuie să fie minim 1W" }),
  powerFactor: z.coerce.number().min(0.1).max(1).optional(),
  group: z.string().optional(),
});

const formSchema = z.object({
  buildingType: z.string(),
  simultaneityFactor: z.coerce.number().min(0.1).max(1),
  includePowerFactor: z.boolean().default(false),
  appliances: z.array(applianceSchema).min(1, { message: "Adăugați cel puțin un consumator" }),
});

const PowerCalculator = () => {
  const [result, setResult] = useState<PowerCalculationResult | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('Toate');
  const [filteredTemplates, setFilteredTemplates] = useState(APPLIANCE_TEMPLATES);

  // Setup form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      buildingType: "residential",
      simultaneityFactor: 0.8,
      includePowerFactor: false,
      appliances: [
        {
          id: uuidv4(),
          type: "custom",
          name: "Consumator 1",
          quantity: 1,
          power: 100,
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "appliances",
  });

  // Extract unique categories from appliance templates
  useEffect(() => {
    const uniqueCategories = [...new Set(APPLIANCE_TEMPLATES.map(item => item.category))];
    setCategories(uniqueCategories);
  }, []);

  // Filter templates by category
  useEffect(() => {
    if (selectedCategory === 'Toate') {
      setFilteredTemplates(APPLIANCE_TEMPLATES);
    } else {
      setFilteredTemplates(APPLIANCE_TEMPLATES.filter(item => item.category === selectedCategory));
    }
  }, [selectedCategory]);

  // Handle building type change to update simultaneity factor
  const handleBuildingTypeChange = (value: string) => {
    form.setValue("buildingType", value);
    form.setValue("simultaneityFactor", getDefaultSimultaneityFactor(value));
  };

  // Add predefined appliance
  const addPredefinedAppliance = (template: any) => {
    append({
      id: uuidv4(),
      type: template.id,
      name: template.name,
      quantity: 1,
      power: template.defaultPower,
      powerFactor: template.defaultPowerFactor || 0.95,
    });
    toast.success(`${template.name} adăugat în listă`);
  };

  // Add custom appliance
  const addCustomAppliance = () => {
    append({
      id: uuidv4(),
      type: "custom",
      name: "Consumator nou",
      quantity: 1,
      power: 100,
    });
  };

  // Calculate power requirements
  const onSubmit = (data: z.infer<typeof formSchema>) => {
    try {
      const result = calculatePowerRequirements(data as PowerCalculatorForm);
      setResult(result);
      console.log("Rezultat calcul putere:", result);
    } catch (error) {
      console.error("Eroare calcul:", error);
      toast.error("A apărut o eroare la calcularea puterii");
    }
  };

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left column - Form inputs */}
            <div className="space-y-6 relative z-20">
              <Card className="bg-dark-matter border-electric-blue/30 tech-border overflow-hidden relative">
                <CardHeader className="pb-2 relative">
                  <CardTitle className="text-hologram-blue text-xl font-tech flex items-center gap-2">
                    <Settings className="w-5 h-5" />
                    Setări generale
                  </CardTitle>
                  <CardDescription>Configurați parametrii generali de calcul</CardDescription>
                </CardHeader>
                <CardContent className="pb-0 space-y-4 relative z-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="buildingType"
                      render={({ field }) => (
                        <FormItem className="relative z-10">
                          <FormLabel className="text-white/90">Tip spațiu</FormLabel>
                          <Select onValueChange={(value) => handleBuildingTypeChange(value)} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="bg-dark-matter z-10">
                                <SelectValue placeholder="Selectați tipul spațiului" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-dark-matter border-electric-blue/30 z-50">
                              <SelectItem value="residential">Locuință</SelectItem>
                              <SelectItem value="office">Birou</SelectItem>
                              <SelectItem value="workshop">Atelier</SelectItem>
                              <SelectItem value="commercial">Comercial</SelectItem>
                              <SelectItem value="industrial">Industrial</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription className="text-white/60">
                            Tipul spațiului pentru care se face calculul
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="simultaneityFactor"
                      render={({ field }) => (
                        <FormItem className="relative z-10">
                          <FormLabel className="text-white/90 flex items-center gap-2">
                            Factor de simultaneitate
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-6 w-6 p-0 rounded-full">
                                  <Info className="h-4 w-4" />
                                  <span className="sr-only">Info</span>
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-80 text-xs z-50 bg-dark-matter border-electric-blue/30">
                                <p>Factorul de simultaneitate reprezintă raportul dintre puterea maximă absorbită simultan de un grup de consumatori și suma puterilor individuale ale acestor consumatori.</p>
                                <p className="mt-1">Valori tipice:</p>
                                <ul className="list-disc pl-5 mt-1">
                                  <li>Locuință: 0.8</li>
                                  <li>Birou: 0.7</li>
                                  <li>Atelier: 1.0</li>
                                  <li>Comercial: 0.65</li>
                                  <li>Industrial: 0.9</li>
                                </ul>
                              </PopoverContent>
                            </Popover>
                          </FormLabel>
                          <FormControl>
                            <Input type="number" step="0.01" min="0.1" max="1" {...field} className="bg-dark-matter z-10" />
                          </FormControl>
                          <FormDescription className="text-white/60">
                            Valoare între 0.1 și 1.0
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="includePowerFactor"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between p-3 border border-electric-blue/20 rounded-md bg-dark-matter/50 relative z-10">
                        <div className="space-y-0.5">
                          <FormLabel className="text-white/90">Mod avansat</FormLabel>
                          <FormDescription className="text-white/60">
                            Activează factorul de putere și alte opțiuni avansate
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            className="relative z-20"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </CardContent>
                <div className="absolute bottom-0 left-0 w-full h-1 overflow-hidden">
                  <div className="h-full w-full bg-gradient-to-r from-transparent via-hologram-blue to-transparent animate-circuit-flow"></div>
                </div>
              </Card>

              <Card className="bg-dark-matter border-electric-blue/30 tech-border overflow-hidden relative">
                <CardHeader className="pb-2 relative">
                  <CardTitle className="text-hologram-blue text-xl font-tech flex items-center gap-2">
                    <Lightbulb className="w-5 h-5" />
                    Consumatori predefiniti
                  </CardTitle>
                  <CardDescription>Selectați din lista de aparate predefinite</CardDescription>
                </CardHeader>
                <CardContent className="relative z-10">
                  <div className="space-y-4">
                    <div className="overflow-x-auto pb-2 relative z-10">
                      <ToggleGroup type="single" value={selectedCategory} onValueChange={(value) => value && setSelectedCategory(value)} className="flex flex-nowrap space-x-2">
                        <ToggleGroupItem value="Toate" className="whitespace-nowrap relative z-20">Toate</ToggleGroupItem>
                        {categories.map((category) => (
                          <ToggleGroupItem key={category} value={category} className="whitespace-nowrap relative z-20">
                            {category}
                          </ToggleGroupItem>
                        ))}
                      </ToggleGroup>
                    </div>
                    
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-3 gap-2 relative z-10">
                      {filteredTemplates.map((template) => (
                        <Button
                          key={template.id}
                          variant="outline"
                          className="h-auto py-2 flex flex-col items-center justify-center text-xs whitespace-normal bg-dark-matter relative z-10"
                          onClick={() => addPredefinedAppliance(template)}
                        >
                          {template.name}
                          <span className="text-hologram-blue font-semibold mt-1">{template.defaultPower}W</span>
                        </Button>
                      ))}
                    </div>
                  </div>
                </CardContent>
                <div className="absolute bottom-0 left-0 w-full h-1 overflow-hidden">
                  <div className="h-full w-full bg-gradient-to-r from-transparent via-hologram-blue to-transparent animate-circuit-flow"></div>
                </div>
              </Card>

              <Card className="bg-dark-matter border-electric-blue/30 tech-border overflow-hidden relative">
                <CardHeader className="pb-2 relative">
                  <CardTitle className="text-hologram-blue text-xl font-tech flex items-center gap-2">
                    <Zap className="w-5 h-5" />
                    Lista consumatori
                  </CardTitle>
                  <CardDescription>Gestionați lista de consumatori pentru calcul</CardDescription>
                </CardHeader>
                <CardContent className="relative z-10">
                  <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                    {fields.map((field, index) => (
                      <div key={field.id} className="p-3 border border-electric-blue/20 rounded-md grid grid-cols-12 gap-2 bg-dark-matter/50 relative z-10">
                        <div className="col-span-12 sm:col-span-6 flex items-center">
                          <FormField
                            control={form.control}
                            name={`appliances.${index}.name`}
                            render={({ field }) => (
                              <FormItem className="w-full relative z-10">
                                <FormControl>
                                  <Input placeholder="Nume aparat" {...field} className="bg-dark-matter" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <div className="col-span-6 sm:col-span-3">
                          <FormField
                            control={form.control}
                            name={`appliances.${index}.quantity`}
                            render={({ field }) => (
                              <FormItem className="relative z-10">
                                <FormControl>
                                  <Input 
                                    type="number" 
                                    placeholder="Cantitate" 
                                    {...field} 
                                    min={1}
                                    className="bg-dark-matter"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <div className="col-span-6 sm:col-span-3 flex items-center gap-2">
                          <div className="flex-1">
                            <FormField
                              control={form.control}
                              name={`appliances.${index}.power`}
                              render={({ field }) => (
                                <FormItem className="relative z-10">
                                  <FormControl>
                                    <div className="flex items-center">
                                      <Input
                                        type="number"
                                        placeholder="Putere"
                                        {...field}
                                        min={1}
                                        className="bg-dark-matter"
                                      />
                                      <span className="text-white/70 ml-2">W</span>
                                    </div>
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          <Button 
                            type="button" 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => remove(index)}
                            className="h-10 w-10 p-0 text-red-500 hover:text-red-300 hover:bg-red-900/20 relative z-10"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        {form.watch("includePowerFactor") && (
                          <div className="col-span-12 sm:col-span-6">
                            <FormField
                              control={form.control}
                              name={`appliances.${index}.powerFactor`}
                              render={({ field }) => (
                                <FormItem className="relative z-10">
                                  <FormLabel className="text-white/90 text-xs">Factor de putere</FormLabel>
                                  <FormControl>
                                    <Input
                                      type="number"
                                      placeholder="Factor de putere"
                                      {...field}
                                      step="0.01"
                                      min="0.1"
                                      max="1"
                                      defaultValue={0.95}
                                      className="bg-dark-matter"
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        )}

                        {form.watch("includePowerFactor") && (
                          <div className="col-span-12 sm:col-span-6">
                            <FormField
                              control={form.control}
                              name={`appliances.${index}.group`}
                              render={({ field }) => (
                                <FormItem className="relative z-10">
                                  <FormLabel className="text-white/90 text-xs">Grup/Circuit</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Nume circuit (opțional)" {...field} className="bg-dark-matter" />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-between mt-4 relative z-10">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addCustomAppliance}
                      className="flex items-center gap-2 bg-dark-matter"
                    >
                      <Plus className="w-4 h-4" />
                      Adaugă consumator
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => form.reset()}
                      className="flex items-center gap-2 bg-dark-matter"
                    >
                      <RefreshCw className="w-4 h-4" />
                      Reset
                    </Button>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-center pt-4 relative z-10">
                  <Button 
                    type="submit" 
                    className="w-full md:w-auto flex items-center gap-2 relative z-10"
                  >
                    <Calculator className="w-4 h-4" />
                    Calculează necesar de putere
                  </Button>
                </CardFooter>
                <div className="absolute bottom-0 left-0 w-full h-1 overflow-hidden">
                  <div className="h-full w-full bg-gradient-to-r from-transparent via-hologram-blue to-transparent animate-circuit-flow"></div>
                </div>
              </Card>
            </div>

            {/* Right column - Results */}
            <div className="space-y-6">
              {result ? (
                <Card className="bg-dark-matter border-electric-blue/30 tech-border overflow-hidden relative">
                  <CardHeader className="pb-2 relative">
                    <CardTitle className="text-hologram-blue text-xl font-tech">Rezultate calcul</CardTitle>
                    <CardDescription>Rezultatele estimării necesarului de putere</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="p-4 border border-electric-blue/30 rounded-md bg-dark-matter/50">
                        <div className="text-white/60 text-sm">Putere totală estimată</div>
                        <div className="flex items-end">
                          <div className="text-3xl font-tech text-hologram-blue">{result.totalPowerKW.toFixed(2)}</div>
                          <div className="ml-1 text-white/90">kW</div>
                        </div>
                        <div className="text-white/60 text-xs mt-1">
                          ({Math.round(result.totalPower)} W cu factor de simultaneitate aplicat)
                        </div>
                      </div>
                      <div className="p-4 border border-electric-blue/30 rounded-md bg-dark-matter/50">
                        <div className="text-white/60 text-sm">Recomandarea noastră</div>
                        <div className="text-xl font-tech text-hologram-blue">
                          Rețea {result.recommendedSupplyType}
                        </div>
                        <div className="text-white/60 text-xs mt-1">
                          {result.recommendedSupplyType === 'monofazic' ? '230V, L+N+PE' : '400V, 3L+N+PE'}
                        </div>
                      </div>
                    </div>

                    <Tabs defaultValue="recommendations" className="w-full">
                      <TabsList className="grid grid-cols-2 mb-4">
                        <TabsTrigger value="recommendations">Recomandări</TabsTrigger>
                        <TabsTrigger value="details">Detalii avansate</TabsTrigger>
                      </TabsList>
                      <TabsContent value="recommendations" className="space-y-4">
                        <div className="space-y-3">
                          <div className="bg-dark-matter/50 border border-electric-blue/20 p-3 rounded-md">
                            <div className="font-tech text-white/90">Contract putere furnizor</div>
                            <div className="text-xl text-hologram-blue font-semibold">
                              {result.recommendedContractPower} kVA
                            </div>
                            <div className="text-white/60 text-xs mt-1">
                              Putere minimă recomandată pentru contractul cu furnizorul
                            </div>
                          </div>
                          
                          <div className="bg-dark-matter/50 border border-electric-blue/20 p-3 rounded-md">
                            <div className="font-tech text-white/90">Siguranță principală tablou general</div>
                            <div className="text-xl text-hologram-blue font-semibold">
                              {result.recommendedMainBreaker}
                            </div>
                            <div className="text-white/60 text-xs mt-1">
                              Capacitatea recomandată pentru întrerupătorul general
                            </div>
                          </div>
                          
                          {result.warnings.length > 0 && (
                            <div className="bg-red-950/30 border border-red-500/30 p-3 rounded-md">
                              <div className="font-tech text-red-400">Atenționări</div>
                              <ul className="list-disc list-inside space-y-1 mt-1">
                                {result.warnings.map((warning, idx) => (
                                  <li key={idx} className="text-white/80 text-sm">
                                    {warning}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </TabsContent>
                      <TabsContent value="details">
                        <div className="space-y-4">
                          {result.applianceGroups && (
                            <div className="bg-dark-matter/50 border border-electric-blue/20 p-3 rounded-md">
                              <div className="font-tech text-white/90 mb-2">Detaliere pe circuite</div>
                              <div className="space-y-3">
                                {Object.values(result.applianceGroups).map((group, idx) => (
                                  <div key={idx} className="border-t border-electric-blue/10 pt-2">
                                    <div className="font-semibold text-hologram-blue">
                                      {group.groupName} - {(group.totalPower / 1000).toFixed(2)} kW
                                    </div>
                                    <ul className="list-disc list-inside text-sm text-white/70 ml-2">
                                      {group.appliances.map((app) => (
                                        <li key={app.id}>
                                          {app.name} ({app.quantity} buc.) - {app.power * app.quantity}W
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          <div className="bg-dark-matter/50 border border-electric-blue/20 p-3 rounded-md">
                            <div className="font-tech text-white/90 mb-2">Informații tehnice</div>
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <div className="text-xs text-white/60">Factor de simultaneitate</div>
                                <div className="text-sm text-white/90">{form.watch("simultaneityFactor")}</div>
                              </div>
                              <div>
                                <div className="text-xs text-white/60">Număr total consumatori</div>
                                <div className="text-sm text-white/90">{fields.length}</div>
                              </div>
                              <div>
                                <div className="text-xs text-white/60">Tip spațiu</div>
                                <div className="text-sm text-white/90">
                                  {form.watch("buildingType") === "residential" && "Locuință"}
                                  {form.watch("buildingType") === "office" && "Birou"}
                                  {form.watch("buildingType") === "workshop" && "Atelier"}
                                  {form.watch("buildingType") === "commercial" && "Comercial"}
                                  {form.watch("buildingType") === "industrial" && "Industrial"}
                                </div>
                              </div>
                              <div>
                                <div className="text-xs text-white/60">Mod de calcul</div>
                                <div className="text-sm text-white/90">
                                  {form.watch("includePowerFactor") ? "Avansat" : "Standard"}
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="bg-dark-matter/50 border border-electric-blue/20 p-3 rounded-md">
                            <div className="font-tech text-white/90 mb-2">Notă profesională</div>
                            <p className="text-sm text-white/80">
                              Calculul a fost realizat conform normativelor în vigoare și include marja de siguranță recomandată pentru dimensionarea corespunzătoare a instalațiilor electrice.
                            </p>
                            <p className="text-sm text-white/80 mt-2">
                              Pentru proiecte complexe, vă recomandăm să consultați un electrician autorizat ANRE care poate evalua situația specifică și poate adapta soluțiile conform cerințelor particulare ale proiectului.
                            </p>
                          </div>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                  <div className="absolute bottom-0 left-0 w-full h-1 overflow-hidden">
                    <div className="h-full w-full bg-gradient-to-r from-transparent via-hologram-blue to-transparent animate-circuit-flow"></div>
                  </div>
                </Card>
              ) : (
                <Card className="bg-dark-matter border-electric-blue/30 tech-border overflow-hidden relative min-h-[300px] flex flex-col items-center justify-center">
                  <CardHeader className="text-center">
                    <CardTitle className="text-hologram-blue text-xl font-tech">Rezultate calcul</CardTitle>
                    <CardDescription>Completați datele și apăsați butonul de calcul</CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-col items-center justify-center flex-1 opacity-60">
                    <Calculator className="w-12 h-12 text-hologram-blue mb-4" />
                    <p className="text-center text-white/70">
                      Adăugați consumatorii electrici pentru a estima necesarul de putere
                    </p>
                  </CardContent>
                  <div className="absolute bottom-0 left-0 w-full h-1 overflow-hidden">
                    <div className="h-full w-full bg-gradient-to-r from-transparent via-hologram-blue to-transparent animate-circuit-flow"></div>
                  </div>
                </Card>
              )}

              <Card className="bg-dark-matter border-electric-blue/30 tech-border overflow-hidden relative">
                <CardHeader className="pb-2">
                  <CardTitle className="text-hologram-blue text-xl font-tech">Notiță de la expert</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-white/80">
                    <p>
                      Estimarea necesarului de putere este un pas esențial în proiectarea oricărei instalații electrice. Aceasta asigură dimensionarea corectă a cablurilor, tablourilor și a contractului de energie.
                    </p>
                    <p>
                      Factorul de simultaneitate reflectă realitatea că nu toate aparatele funcționează la putere maximă în același timp. Pentru locuințe, valoarea uzuală este între 0.7-0.8, iar pentru ateliere unde se folosesc simultan mai multe echipamente, poate ajunge la 1.0.
                    </p>
                    <p>
                      Pentru instalațiile cu putere totală peste 8-10kW, trecerea pe sistem trifazic oferă multiple beneficii: echilibrarea sarcinilor, stabilitate sporită și posibilitatea de a alimenta echipamente industriale.
                    </p>
                  </div>
                </CardContent>
                <div className="absolute bottom-0 left-0 w-full h-1 overflow-hidden">
                  <div className="h-full w-full bg-gradient-to-r from-transparent via-hologram-blue to-transparent animate-circuit-flow"></div>
                </div>
              </Card>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default PowerCalculator;
