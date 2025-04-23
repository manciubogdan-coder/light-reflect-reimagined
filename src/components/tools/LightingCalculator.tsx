import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/sonner";
import { Lightbulb, Info, ArrowRight } from "lucide-react";
import { calculateLighting, ROOM_TYPES } from "@/lib/lightingCalculations";
import { LightingCalculationResult, LightingCalculatorForm } from "@/lib/types";

const formSchema = z.object({
  roomType: z.string().min(1, "Selectați tipul de încăpere"),
  area: z.string().refine((val) => {
    const num = parseFloat(val);
    return !isNaN(num) && num > 0;
  }, {
    message: "Introduceți o suprafață validă (m²)",
  }),
  roomHeight: z.string().optional(),
  lightingLevel: z.string().min(1, "Selectați nivelul de iluminare"),
  lightSourceType: z.string().min(1, "Selectați tipul de sursă de lumină"),
  fixtureType: z.string().min(1, "Selectați tipul de corp de iluminat"),
});

type FormValues = z.infer<typeof formSchema>;

const LightingCalculator = () => {
  const [result, setResult] = useState<LightingCalculationResult | null>(null);
  const [activeTab, setActiveTab] = useState("input");

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      roomType: "",
      area: "",
      roomHeight: "",
      lightingLevel: "",
      lightSourceType: "led",
      fixtureType: "led-medium",
    },
  });

  const handleRoomTypeChange = (value: string) => {
    const selectedRoom = ROOM_TYPES[value as keyof typeof ROOM_TYPES];
    if (selectedRoom) {
      form.setValue("lightingLevel", selectedRoom.defaultLux.toString());
    }
  };

  const onSubmit = (data: FormValues) => {
    try {
      console.log("Submit button clicked with data:", data);
      
      const calculationData: LightingCalculatorForm = {
        roomType: data.roomType,
        area: data.area,
        roomHeight: data.roomHeight || "",
        lightingLevel: data.lightingLevel,
        lightSourceType: data.lightSourceType,
        fixtureType: data.fixtureType,
      };
      
      console.log("Prepared calculation data:", calculationData);
      
      const calculationResult = calculateLighting(calculationData);
      console.log("Calculation result:", calculationResult);
      
      setResult(calculationResult);
      setActiveTab("result");
      
      toast("Calcul finalizat cu succes!", {
        description: "Rezultatele calculului de iluminat sunt gata.",
        type: "success"
      });
    } catch (error) {
      console.error("Eroare la calcularea iluminatului:", error);
      toast("Eroare la calculare", {
        description: "A apărut o eroare la procesarea datelor. Verificați valorile introduse.",
        type: "error"
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-dark-matter border-electric-blue/30 tech-border overflow-hidden relative">
        <CardContent className="p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6 bg-dark-matter border border-electric-blue/30">
              <TabsTrigger value="input" className="data-[state=active]:bg-electric-blue data-[state=active]:text-white">
                Date de intrare
              </TabsTrigger>
              <TabsTrigger value="result" className="data-[state=active]:bg-electric-blue data-[state=active]:text-white" disabled={!result}>
                Rezultate
              </TabsTrigger>
            </TabsList>

            <TabsContent value="input" className="mt-0">
              <div className="bg-dark-matter/80 p-4 rounded-md tech-border mb-6">
                <div className="flex items-center gap-3 text-hologram-blue mb-2">
                  <Info className="h-5 w-5" />
                  <h3 className="font-tech text-lg">Ghid de utilizare</h3>
                </div>
                <p className="text-white/80 text-sm">
                  Introduceți datele spațiului pentru care doriți să calculați necesarul de iluminat.
                  Valorile de iluminare recomandate (lux) sunt presetate în funcție de tipul încăperii, conform normelor în vigoare.
                </p>
              </div>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="roomType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white">Tipul încăperii</FormLabel>
                          <Select
                            onValueChange={(value) => {
                              field.onChange(value);
                              handleRoomTypeChange(value);
                            }}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="bg-dark-matter text-white border-electric-blue/50 z-20">
                                <SelectValue placeholder="Selectați tipul încăperii" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-dark-matter border-electric-blue/50 text-white z-30">
                              {Object.entries(ROOM_TYPES).map(([key, { name, description }]) => (
                                <SelectItem key={key} value={key} className="focus:bg-electric-blue/20 focus:text-white">
                                  <div>
                                    <span>{name}</span>
                                    {description && (
                                      <span className="text-xs block text-white/70">{description}</span>
                                    )}
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="area"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white">Suprafața în m²</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input 
                                type="number" 
                                placeholder="Introduceți suprafața" 
                                className="bg-dark-matter text-white border-electric-blue/50 pr-12 z-20"
                                {...field}
                                min="0"
                                step="0.1"
                              />
                              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-white/70">
                                m²
                              </div>
                            </div>
                          </FormControl>
                          <FormDescription className="text-white/60">
                            Suprafața totală a încăperii
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="roomHeight"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white">Înălțimea încăperii (opțional)</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input 
                                type="number" 
                                placeholder="Introduceți înălțimea" 
                                className="bg-dark-matter text-white border-electric-blue/50 pr-12 z-20"
                                {...field}
                                min="0"
                                step="0.1"
                              />
                              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-white/70">
                                m
                              </div>
                            </div>
                          </FormControl>
                          <FormDescription className="text-white/60">
                            Înălțimea de la podea la tavan
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="lightingLevel"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white">Nivelul de iluminare</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="bg-dark-matter text-white border-electric-blue/50 z-20">
                                <SelectValue placeholder="Selectați nivelul de iluminare" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-dark-matter border-electric-blue/50 text-white z-30">
                              <SelectItem value="100" className="focus:bg-electric-blue/20 focus:text-white">100 lux (minim)</SelectItem>
                              <SelectItem value="150" className="focus:bg-electric-blue/20 focus:text-white">150 lux (dormitor)</SelectItem>
                              <SelectItem value="250" className="focus:bg-electric-blue/20 focus:text-white">250 lux (bucătărie/baie)</SelectItem>
                              <SelectItem value="300" className="focus:bg-electric-blue/20 focus:text-white">300 lux (birou standard)</SelectItem>
                              <SelectItem value="500" className="focus:bg-electric-blue/20 focus:text-white">500 lux (birou profesional)</SelectItem>
                              <SelectItem value="700" className="focus:bg-electric-blue/20 focus:text-white">700 lux (magazin/atelier)</SelectItem>
                              <SelectItem value="1000" className="focus:bg-electric-blue/20 focus:text-white">1000 lux (hale industriale)</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription className="text-white/60">
                            Valoare recomandată conform destinației spațiului
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="lightSourceType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white">Tipul de sursă de lumină</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="bg-dark-matter text-white border-electric-blue/50 z-20">
                                <SelectValue placeholder="Selectați sursa de lumină" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-dark-matter border-electric-blue/50 text-white z-30">
                              <SelectItem value="led" className="focus:bg-electric-blue/20 focus:text-white">
                                LED (100 lm/W)
                              </SelectItem>
                              <SelectItem value="fluorescent" className="focus:bg-electric-blue/20 focus:text-white">
                                Fluorescent (60 lm/W)
                              </SelectItem>
                              <SelectItem value="incandescent" className="focus:bg-electric-blue/20 focus:text-white">
                                Incandescent (15 lm/W)
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription className="text-white/60">
                            Eficiența energetică diferă în funcție de tehnologie
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="fixtureType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white">Tipul de corp de iluminat</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="bg-dark-matter text-white border-electric-blue/50 z-20">
                                <SelectValue placeholder="Selectați corpul de iluminat" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-dark-matter border-electric-blue/50 text-white z-30">
                              <SelectItem value="led-small" className="focus:bg-electric-blue/20 focus:text-white">
                                Spot LED (~1500 lm)
                              </SelectItem>
                              <SelectItem value="led-medium" className="focus:bg-electric-blue/20 focus:text-white">
                                Corp LED mediu (~3000 lm)
                              </SelectItem>
                              <SelectItem value="led-large" className="focus:bg-electric-blue/20 focus:text-white">
                                Panou LED mare (~6000 lm)
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription className="text-white/60">
                            Fluxul luminos total diferă în funcție de tipul corpului
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex justify-center mt-6">
                    <Button 
                      type="submit" 
                      className="bg-electric-blue hover:bg-electric-blue-light text-white font-tech flex items-center gap-2 px-8 py-6"
                    >
                      Calculează necesarul <ArrowRight className="w-5 h-5" />
                    </Button>
                  </div>
                </form>
              </Form>
            </TabsContent>

            <TabsContent value="result" className="mt-0">
              {result && (
                <div className="space-y-6">
                  <div className="bg-dark-matter/80 p-4 rounded-md tech-border mb-6">
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center gap-3 text-hologram-blue">
                        <Lightbulb className="h-5 w-5" />
                        <h3 className="font-tech text-lg">Rezultate calcul iluminat</h3>
                      </div>
                      <Badge className="bg-electric-blue text-white">{form.getValues().area} m²</Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div className="bg-dark-matter/50 p-4 rounded-md border border-electric-blue/30">
                        <h4 className="text-white/90 font-semibold mb-2">Putere totală necesară</h4>
                        <p className="text-2xl font-tech text-electric-blue">{result.totalPower} W</p>
                        <p className="text-white/60 text-sm mt-1">
                          Pentru {form.getValues().area} m² la {form.getValues().lightingLevel} lux
                        </p>
                      </div>
                      
                      <div className="bg-dark-matter/50 p-4 rounded-md border border-electric-blue/30">
                        <h4 className="text-white/90 font-semibold mb-2">Recomandare profesională</h4>
                        <p className="text-hologram-blue font-tech">{result.professionalRecommendation}</p>
                      </div>
                    </div>
                    
                    <Separator className="my-6 bg-electric-blue/30" />
                    
                    <div>
                      <h4 className="text-white/90 font-semibold mb-2">Opțiuni de corpuri de iluminat</h4>
                      <div className="overflow-x-auto">
                        <table className="w-full text-white/80 text-sm">
                          <thead className="bg-electric-blue/20 font-tech">
                            <tr>
                              <th className="p-2 text-left">Tip corp</th>
                              <th className="p-2 text-center">Flux/corp (lm)</th>
                              <th className="p-2 text-center">Nr. corpuri</th>
                              <th className="p-2 text-center">Flux total (lm)</th>
                              <th className="p-2 text-center">Putere (W)</th>
                            </tr>
                          </thead>
                          <tbody>
                            {result.recommendedFixtures.map((fixture, index) => (
                              <tr key={index} className={index === 0 ? "bg-electric-blue/10" : ""}>
                                <td className="p-2 text-left font-semibold">{fixture.fixtureType}</td>
                                <td className="p-2 text-center">{fixture.fixtureFlux}</td>
                                <td className="p-2 text-center font-tech text-hologram-blue">{fixture.fixtureCount}</td>
                                <td className="p-2 text-center">{fixture.totalFlux}</td>
                                <td className="p-2 text-center">{fixture.power}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                    
                    {result.warnings.length > 0 && (
                      <div className="mt-6 bg-neon-red/20 p-4 rounded-md border border-neon-red/50">
                        <h4 className="text-neon-red-light font-semibold mb-2">Atenție</h4>
                        <ul className="list-disc pl-5 text-white/80 text-sm space-y-1">
                          {result.warnings.map((warning, index) => (
                            <li key={index}>{warning}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                  
                  <div className="bg-dark-matter/80 p-4 rounded-md tech-border">
                    <h4 className="text-white/90 font-semibold mb-2">Notă profesională</h4>
                    <p className="text-white/80 text-sm">
                      Valorile prezentate sunt estimative și se bazează pe calcule standard pentru iluminat general.
                      Pentru o analiză detaliată a distribuției luminii și efectelor de umbre, este recomandată o simulare DIALux realizată de un specialist.
                    </p>
                  </div>
                  
                  <div className="flex justify-between mt-6">
                    <Button 
                      onClick={() => setActiveTab("input")} 
                      variant="outline"
                      className="text-white border-electric-blue/50 hover:bg-electric-blue/20"
                    >
                      Modifică datele
                    </Button>
                    
                    <Button 
                      onClick={() => form.handleSubmit(onSubmit)()} 
                      className="bg-electric-blue hover:bg-electric-blue-light text-white font-tech"
                    >
                      Recalculează
                    </Button>
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default LightingCalculator;
