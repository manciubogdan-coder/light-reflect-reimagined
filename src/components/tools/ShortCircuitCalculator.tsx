import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { calculateShortCircuit } from "@/lib/shortCircuitCalculations";
import { ShortCircuitCalculatorForm, ShortCircuitResult } from "@/lib/types";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { AlertCircle, CheckCircle2, Zap } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

const formSchema = z.object({
  transformerPower: z
    .string()
    .min(1, { message: "Puterea transformatorului este necesară" })
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "Introduceți o valoare numerică pozitivă",
    }),
  transformerImpedance: z
    .string()
    .min(1, { message: "Impedanța transformatorului este necesară" })
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0 && Number(val) <= 10, {
      message: "Impedanța trebuie să fie între 0 și 10%",
    }),
  cableLength: z
    .string()
    .min(1, { message: "Lungimea cablului este necesară" })
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "Introduceți o valoare numerică pozitivă",
    }),
  cableMaterial: z.string({
    required_error: "Selectați materialul cablului",
  }),
  cableSection: z
    .string()
    .min(1, { message: "Secțiunea cablului este necesară" })
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "Introduceți o valoare numerică pozitivă",
    }),
  voltageDrop: z
    .string()
    .min(1, { message: "Căderea de tensiune este necesară" })
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0 && Number(val) <= 10, {
      message: "Căderea de tensiune trebuie să fie între 0 și 10%",
    }),
});

const ShortCircuitCalculator = () => {
  const [result, setResult] = useState<ShortCircuitResult | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      transformerPower: "400",
      transformerImpedance: "4",
      cableLength: "50",
      cableMaterial: "cupru",
      cableSection: "16",
      voltageDrop: "3",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const formData: ShortCircuitCalculatorForm = {
      transformerPower: values.transformerPower,
      transformerImpedance: values.transformerImpedance,
      cableLength: values.cableLength,
      cableMaterial: values.cableMaterial,
      cableSection: values.cableSection,
      voltageDrop: values.voltageDrop,
    };
    const calculationResult = calculateShortCircuit(formData);
    setResult(calculationResult);
  }

  const standardCableSections = [1.5, 2.5, 4, 6, 10, 16, 25, 35, 50, 70, 95, 120, 150, 185, 240];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div>
        <Card className="bg-dark-matter/50 border-electric-blue/30">
          <CardHeader>
            <CardTitle className="text-hologram-blue text-xl">
              Parametri Calcul Scurtcircuit
            </CardTitle>
            <CardDescription>
              Completează valorile pentru a estima curentul de scurtcircuit
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="transformerPower"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">
                          Puterea transformatorului (kVA)
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="400"
                            className="bg-dark-matter border-hologram-blue/50 text-white"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="transformerImpedance"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">
                          Impedanța transformatorului (%)
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="4"
                            className="bg-dark-matter border-hologram-blue/50 text-white"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="cableLength"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">
                          Lungimea cablului (m)
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="50"
                            className="bg-dark-matter border-hologram-blue/50 text-white"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="cableMaterial"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">
                          Material cablu
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="bg-dark-matter border-hologram-blue/50 text-white">
                              <SelectValue placeholder="Selectează materialul" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-dark-matter/90 border-hologram-blue/50 text-white">
                            <SelectItem value="cupru">Cupru (Cu)</SelectItem>
                            <SelectItem value="aluminiu">Aluminiu (Al)</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="cableSection"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">
                          Secțiunea cablului (mm²)
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="bg-dark-matter border-hologram-blue/50 text-white">
                              <SelectValue placeholder="Selectează secțiunea" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-dark-matter/90 border-hologram-blue/50 text-white max-h-[300px]">
                            {standardCableSections.map((section) => (
                              <SelectItem key={section} value={section.toString()}>
                                {section} mm²
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
                    name="voltageDrop"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">
                          Căderea de tensiune maximă (%)
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="3"
                            className="bg-dark-matter border-hologram-blue/50 text-white"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full electric-button font-tech text-lg tracking-wider py-2 mt-4"
                >
                  <Zap className="mr-2 h-4 w-4" />
                  Calculează
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="text-xs text-white/60 pt-2 pb-4">
            <p>
              Valori implicite pentru un circuit standard. Rezultatele sunt
              estimative și trebuie verificate de un specialist.
            </p>
          </CardFooter>
        </Card>
      </div>

      <div>
        {result && (
          <Card className="bg-dark-matter/50 border-electric-blue/30 overflow-auto max-h-[90vh]">
            <CardHeader>
              <CardTitle className="text-hologram-blue text-xl">
                Rezultate Calcul Scurtcircuit
              </CardTitle>
              <CardDescription>
                Valorile calculate pentru configurația introdusă
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <Alert className="bg-dark-matter/80 border border-electric-blue/30">
                  <AlertTitle className="text-xl font-tech text-hologram-blue">Rezultat detaliat</AlertTitle>
                  <AlertDescription className="text-white/80">
                    Aceste calcule sunt estimative pentru curent de scurtcircuit RMS pe fază la capătul cablului.
                    Valorile reale pot varia în funcție de mai mulți factori.
                  </AlertDescription>
                </Alert>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-dark-matter/80 p-4 rounded-md border border-electric-blue/30">
                    <h3 className="text-lg font-tech text-hologram-blue">Curent nominal transformator</h3>
                    <p className="text-2xl font-bold text-electric-blue">
                      {result.transformerNominalCurrent.toLocaleString()} A
                    </p>
                  </div>
                  
                  <div className="bg-dark-matter/80 p-4 rounded-md border border-electric-blue/30">
                    <h3 className="text-lg font-tech text-hologram-blue">Curent scurtcircuit la transformator</h3>
                    <p className="text-2xl font-bold text-electric-blue">
                      {result.transformerShortCircuitCurrent.toLocaleString()} A
                    </p>
                  </div>
                </div>

                <div className="bg-dark-matter/80 p-4 rounded-md border border-electric-blue/30">
                  <h3 className="text-xl font-tech text-hologram-blue mb-2 flex items-center">
                    <Zap className="w-5 h-5 mr-2" />
                    Curent de Scurtcircuit Total (cu cablu)
                  </h3>
                  <p className="text-3xl font-bold text-electric-blue">
                    {result.shortCircuitCurrent.toLocaleString()} A
                  </p>
                  <p className="text-sm text-white/70 mt-2">
                    Factor limitativ principal: {result.limitingFactor === "transformator" 
                      ? "Impedanța transformatorului" 
                      : "Rezistența cablului"}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-dark-matter/80 p-4 rounded-md border border-electric-blue/30">
                    <h3 className="text-lg font-tech text-hologram-blue">Întrerupător Recomandat</h3>
                    <p className="text-2xl font-bold text-electric-blue">
                      {result.recommendedBreakerRating} A
                    </p>
                    <p className="text-sm text-white/70">
                      Minim: {result.minBreakerRating} A
                    </p>
                    <p className="text-sm text-white/70 mt-1">
                      Capacitate de rupere necesară: ≥ {Math.ceil(result.shortCircuitCurrent/1000) + 2}kA
                    </p>
                  </div>
                  
                  <div className="bg-dark-matter/80 p-4 rounded-md border border-electric-blue/30">
                    <h3 className="text-lg font-tech text-hologram-blue">Secțiune Cablu Recomandată</h3>
                    <p className="text-2xl font-bold text-electric-blue">
                      {result.recommendedCableSection} mm²
                    </p>
                  </div>
                </div>

                <div className="bg-dark-matter/80 p-4 rounded-md border border-electric-blue/30">
                  <h3 className="text-lg font-tech text-hologram-blue mb-2">Descompunere Impedanțe</h3>
                  <div className="grid grid-cols-2 gap-2 text-white/80">
                    <div className="flex justify-between">
                      <span>Z transformator:</span>
                      <span className="text-electric-blue">{result.transformerImpedance} Ω</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Z cablu:</span>
                      <span className="text-electric-blue">{result.cableImpedance} Ω</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Z total:</span>
                      <span className="text-electric-blue">{result.totalImpedance} Ω</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Cădere de tensiune:</span>
                      <span className="text-electric-blue">{result.voltageDropPercentageShortCircuit.toFixed(2)}%</span>
                    </div>
                  </div>
                </div>

                <div className="bg-dark-matter/80 p-4 rounded-md border border-electric-blue/30">
                  <h3 className="text-xl font-tech text-hologram-blue mb-2">Căderi de Tensiune</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-white/80">
                      <span>La funcționare nominală:</span>
                      <span className="text-electric-blue font-bold">
                        {result.voltageDropNominal.toFixed(1)}V ({result.voltageDropPercentageNominal.toFixed(1)}%)
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-white/80">
                      <span>La scurtcircuit:</span>
                      <span className="text-electric-blue font-bold">
                        {result.voltageDropShortCircuit.toFixed(1)}V ({result.voltageDropPercentageShortCircuit.toFixed(1)}%)
                      </span>
                    </div>
                  </div>
                </div>

                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="recommendations" className="border-electric-blue/30">
                    <AccordionTrigger className="text-hologram-blue hover:text-hologram-blue/80">
                      Recomandări
                    </AccordionTrigger>
                    <AccordionContent>
                      <ul className="space-y-2">
                        {result.recommendations.map((recommendation, index) => (
                          <li key={index} className="flex items-start gap-2 text-white/80">
                            <CheckCircle2 className="w-5 h-5 text-electric-blue shrink-0 mt-0.5" />
                            <span>{recommendation}</span>
                          </li>
                        ))}
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                  
                  {result.warnings.length > 0 && (
                    <AccordionItem value="warnings" className="border-electric-blue/30">
                      <AccordionTrigger className="text-hologram-blue hover:text-hologram-blue/80">
                        Atenționări
                      </AccordionTrigger>
                      <AccordionContent>
                        <ul className="space-y-2">
                          {result.warnings.map((warning, index) => (
                            <li key={index} className="flex items-start gap-2 text-amber-400">
                              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                              <span>{warning}</span>
                            </li>
                          ))}
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                  )}
                  
                  <AccordionItem value="formula" className="border-electric-blue/30">
                    <AccordionTrigger className="text-hologram-blue hover:text-hologram-blue/80">
                      Formula Utilizată
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="text-white/80 space-y-2">
                        <p>Formula generală pentru calculul curentului de scurtcircuit:</p>
                        <div className="bg-dark-matter p-3 rounded border border-electric-blue/20 font-mono text-center">
                          Ik = U·1000 / (√3·(Ztrafo + Zcablu))
                        </div>
                        <p className="mt-2">Unde:</p>
                        <ul className="space-y-1 list-disc pl-5">
                          <li>Ik = Curent de scurtcircuit (A)</li>
                          <li>U = Tensiune linie-linie (V)</li>
                          <li>Ztrafo = Impedanța transformatorului (Ω)</li>
                          <li>Zcablu = Impedanța cablului (Ω)</li>
                        </ul>
                        <p className="mt-2">Curentul nominal al transformatorului:</p>
                        <div className="bg-dark-matter p-3 rounded border border-electric-blue/20 font-mono text-center">
                          Inom = S·1000 / (√3·U)
                        </div>
                        <p className="mt-2">Curentul de scurtcircuit la bornele transformatorului:</p>
                        <div className="bg-dark-matter p-3 rounded border border-electric-blue/20 font-mono text-center">
                          Ik1 = Inom·100 / Z%
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </CardContent>
            <CardFooter className="text-xs text-white/60 pt-2 pb-4">
              <p>
                Rezultatele sunt orientative și necesită verificarea unui electrician autorizat
                pentru implementarea în instalațiile reale.
              </p>
            </CardFooter>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ShortCircuitCalculator;
