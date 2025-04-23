
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ArrowRight, PiggyBank, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormDescription,
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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";

// Define the validation schema
const formSchema = z.object({
  oldSourceType: z.string().min(1, "Selectați tipul sursei vechi"),
  oldPower: z
    .string()
    .min(1, "Introduceți puterea becurilor vechi")
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "Introduceți o valoare numerică pozitivă",
    }),
  bulbCount: z
    .string()
    .min(1, "Introduceți numărul de becuri")
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0 && Number(val) % 1 === 0, {
      message: "Introduceți un număr întreg pozitiv",
    }),
  dailyHours: z
    .string()
    .min(1, "Introduceți orele de utilizare zilnice")
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0 && Number(val) <= 24, {
      message: "Introduceți o valoare între 0 și 24",
    }),
  pricePerKwh: z
    .string()
    .min(1, "Introduceți prețul per kWh")
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "Introduceți o valoare numerică pozitivă",
    }),
  ledPower: z
    .string()
    .min(1, "Introduceți puterea becului LED echivalent")
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "Introduceți o valoare numerică pozitivă",
    }),
  ledPrice: z
    .string()
    .refine((val) => val === "" || (!isNaN(Number(val)) && Number(val) >= 0), {
      message: "Introduceți o valoare numerică pozitivă sau lăsați gol",
    })
    .optional()
    .default(""),
});

// Define types for results
interface CalculationResults {
  oldMonthlyConsumption: number;
  oldAnnualConsumption: number;
  oldMonthlyCost: number;
  oldAnnualCost: number;
  ledMonthlyConsumption: number;
  ledAnnualConsumption: number;
  ledMonthlyCost: number;
  ledAnnualCost: number;
  annualSavings: number;
  paybackPeriod: number | null;
  co2Reduction: number;
  recommendation: string;
}

export default function EnergyEfficiencyCalculator() {
  const [results, setResults] = useState<CalculationResults | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      oldSourceType: "",
      oldPower: "",
      bulbCount: "",
      dailyHours: "",
      pricePerKwh: "1.0",
      ledPower: "",
      ledPrice: "",
    },
  });

  const oldSourceTypes = [
    { value: "incandescent", label: "Incandescent" },
    { value: "halogen", label: "Halogen" },
    { value: "fluorescent", label: "Fluorescent" },
    { value: "other", label: "Alt tip" },
  ];

  function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      // Parse values to numbers
      const oldPower = parseFloat(values.oldPower);
      const bulbCount = parseInt(values.bulbCount);
      const dailyHours = parseFloat(values.dailyHours);
      const pricePerKwh = parseFloat(values.pricePerKwh);
      const ledPower = parseFloat(values.ledPower);
      const ledPrice = values.ledPrice ? parseFloat(values.ledPrice) : 0;

      // Calculate consumption in kWh
      const oldMonthlyConsumption = (oldPower * bulbCount * dailyHours * 30) / 1000;
      const oldAnnualConsumption = oldMonthlyConsumption * 12;
      const ledMonthlyConsumption = (ledPower * bulbCount * dailyHours * 30) / 1000;
      const ledAnnualConsumption = ledMonthlyConsumption * 12;

      // Calculate costs
      const oldMonthlyCost = oldMonthlyConsumption * pricePerKwh;
      const oldAnnualCost = oldAnnualConsumption * pricePerKwh;
      const ledMonthlyCost = ledMonthlyConsumption * pricePerKwh;
      const ledAnnualCost = ledAnnualConsumption * pricePerKwh;

      // Calculate savings and payback period
      const annualSavings = oldAnnualCost - ledAnnualCost;
      const totalLedInvestment = ledPrice * bulbCount;
      const paybackPeriod = totalLedInvestment > 0 ? totalLedInvestment / annualSavings : null;

      // Calculate CO2 reduction (0.5kg per kWh saved)
      const co2Reduction = (oldAnnualConsumption - ledAnnualConsumption) * 0.5;

      // Generate recommendation
      let recommendation = "";
      if (paybackPeriod !== null) {
        if (paybackPeriod < 2) {
          recommendation = "Recomandare fermă: investiția se recuperează rapid (sub 2 ani)";
        } else if (paybackPeriod > 3) {
          recommendation = "Investiție viabilă, dar benefică mai ales pe termen lung (peste 3 ani)";
        } else {
          recommendation = "Investiție recomandată, cu perioadă de amortizare medie (2-3 ani)";
        }
      } else {
        recommendation = "Nu s-a putut calcula perioada de amortizare (cost LED necunoscut)";
      }

      // Set results
      setResults({
        oldMonthlyConsumption,
        oldAnnualConsumption,
        oldMonthlyCost,
        oldAnnualCost,
        ledMonthlyConsumption,
        ledAnnualConsumption,
        ledMonthlyCost,
        ledAnnualCost,
        annualSavings,
        paybackPeriod,
        co2Reduction,
        recommendation,
      });

      toast.success("Calculul a fost efectuat cu succes!");
    } catch (error) {
      console.error("Eroare la calculare:", error);
      toast.error("A apărut o eroare la efectuarea calculului");
    }
  }

  return (
    <div className="relative z-10 mb-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 relative z-10">
        <Card className="bg-dark-matter border-electric-blue/30 rounded-lg overflow-hidden tech-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-hologram-blue font-tech flex items-center gap-2">
              <Zap className="w-5 h-5" />
              Date de intrare
            </CardTitle>
            <CardDescription className="text-white/70">
              Completați detaliile pentru a calcula economia energetică
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="oldSourceType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-hologram-blue">Tip sursă veche</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-dark-matter border-electric-blue/30">
                              <SelectValue placeholder="Selectați tipul sursei" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-dark-matter border-electric-blue/30">
                            {oldSourceTypes.map((type) => (
                              <SelectItem key={type.value} value={type.value}>
                                {type.label}
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
                    name="oldPower"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-hologram-blue">Puterea becului vechi (W)</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="ex: 60"
                            {...field}
                            className="bg-dark-matter border-electric-blue/30"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="bulbCount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-hologram-blue">Număr total de becuri</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="ex: 10"
                            {...field}
                            className="bg-dark-matter border-electric-blue/30"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="dailyHours"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-hologram-blue">Ore utilizare zilnică</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="ex: 5"
                            {...field}
                            className="bg-dark-matter border-electric-blue/30"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="pricePerKwh"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-hologram-blue">Preț per kWh (lei)</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="ex: 1.0"
                            {...field}
                            className="bg-dark-matter border-electric-blue/30"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="ledPower"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-hologram-blue">Puterea becului LED echivalent (W)</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="ex: 9"
                            {...field}
                            className="bg-dark-matter border-electric-blue/30"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="ledPrice"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-hologram-blue">Cost per bec LED (opțional)</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="ex: 15"
                            {...field}
                            className="bg-dark-matter border-electric-blue/30"
                          />
                        </FormControl>
                        <FormDescription className="text-xs text-white/50">
                          Necesar pentru calculul perioadei de amortizare
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex justify-center mt-6">
                  <Button
                    type="submit"
                    className="bg-electric-blue hover:bg-electric-blue-light text-white font-tech flex items-center gap-2 px-8 py-6 relative z-50"
                  >
                    Calculează economia <ArrowRight className="w-5 h-5" />
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>

        {results && (
          <Card className="bg-dark-matter border-electric-blue/30 rounded-lg overflow-hidden tech-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-hologram-blue font-tech flex items-center gap-2">
                <PiggyBank className="w-5 h-5" />
                Rezultat analiză eficiență energetică
              </CardTitle>
              <CardDescription className="text-white/70">
                Analiza comparativă a consumului și costurilor
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-hologram-blue font-tech text-lg">Soluția existentă</h3>
                  <div className="space-y-2 text-white/80">
                    <p><span className="text-white/60">Consum lunar:</span> {results.oldMonthlyConsumption.toFixed(2)} kWh</p>
                    <p><span className="text-white/60">Consum anual:</span> {results.oldAnnualConsumption.toFixed(2)} kWh</p>
                    <p><span className="text-white/60">Cost lunar:</span> {results.oldMonthlyCost.toFixed(2)} lei</p>
                    <p><span className="text-white/60">Cost anual:</span> {results.oldAnnualCost.toFixed(2)} lei</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-hologram-blue font-tech text-lg">Soluția LED</h3>
                  <div className="space-y-2 text-white/80">
                    <p><span className="text-white/60">Consum lunar:</span> {results.ledMonthlyConsumption.toFixed(2)} kWh</p>
                    <p><span className="text-white/60">Consum anual:</span> {results.ledAnnualConsumption.toFixed(2)} kWh</p>
                    <p><span className="text-white/60">Cost lunar:</span> {results.ledMonthlyCost.toFixed(2)} lei</p>
                    <p><span className="text-white/60">Cost anual:</span> {results.ledAnnualCost.toFixed(2)} lei</p>
                  </div>
                </div>
              </div>
              
              <div className="border-t border-electric-blue/20 pt-4">
                <h3 className="text-hologram-blue font-tech text-lg mb-3">Economie și impact</h3>
                <div className="space-y-2 text-white/80">
                  <p className="text-xl font-tech text-electric-blue">
                    Economie anuală: {results.annualSavings.toFixed(2)} lei
                  </p>
                  
                  {results.paybackPeriod !== null ? (
                    <p>
                      <span className="text-white/60">Perioada de amortizare:</span>{" "}
                      {results.paybackPeriod.toFixed(2)} ani
                    </p>
                  ) : (
                    <p className="text-white/60">
                      Perioada de amortizare: Necunoscută (cost LED nespecificat)
                    </p>
                  )}
                  
                  <p>
                    <span className="text-white/60">Reducere emisii CO₂:</span>{" "}
                    {results.co2Reduction.toFixed(2)} kg/an
                  </p>
                </div>
              </div>

              <div className="bg-electric-blue/10 p-4 rounded-lg border border-electric-blue/20 mt-4">
                <h4 className="text-hologram-blue font-tech mb-2">Recomandare finală</h4>
                <p className="text-white">{results.recommendation}</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
