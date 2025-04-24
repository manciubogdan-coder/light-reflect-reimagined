
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { calculateShortCircuit } from "@/lib/shortCircuitCalculations";
import { ShortCircuitResult } from "@/lib/types";

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
    const calculationResult = calculateShortCircuit(values);
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
                          Cădere de tensiune maximă (%)
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
        {result ? (
          <Card className="bg-dark-matter/50 border-electric-blue/30">
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
                <div className="bg-dark-matter/80 p-4 rounded-md border border-electric-blue/30">
                  <h3 className="text-xl font-tech text-hologram-blue mb-2 flex items-center">
                    <Zap className="w-5 h-5 mr-2" />
                    Curent de Scurtcircuit Estimat
                  </h3>
                  <p className="text-3xl font-bold text-electric-blue">
                    {result.shortCircuitCurrent.toLocaleString()} A
                  </p>
                  <p className="text-sm text-white/70 mt-1">
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
                  </div>
                  
                  <div className="bg-dark-matter/80 p-4 rounded-md border border-electric-blue/30">
                    <h3 className="text-lg font-tech text-hologram-blue">Secțiune Cablu Recomandată</h3>
                    <p className="text-2xl font-bold text-electric-blue">
                      {result.recommendedCableSection} mm²
                    </p>
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
        ) : (
          <Card className="bg-dark-matter/50 border-electric-blue/30 h-full flex flex-col justify-center items-center py-12">
            <CardContent className="text-center">
              <div className="mb-4">
                <Zap className="w-16 h-16 mx-auto text-hologram-blue opacity-50" />
              </div>
              <CardTitle className="text-hologram-blue text-xl mb-2">
                Calculul Curentului de Scurtcircuit
              </CardTitle>
              <CardDescription className="max-w-md mx-auto">
                Completează formularul pentru a afla curentul de scurtcircuit estimat
                și recomandările pentru alegerea corectă a siguranțelor și cablurilor.
              </CardDescription>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ShortCircuitCalculator;
