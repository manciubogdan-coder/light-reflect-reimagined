
import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Handshake, FileText, Send } from "lucide-react";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Numele trebuie să aibă cel puțin 2 caractere.",
  }),
  email: z.string().email({
    message: "Introduceți o adresă de email validă.",
  }),
  phone: z.string().min(10, {
    message: "Introduceți un număr de telefon valid.",
  }),
  city: z.string().min(2, {
    message: "Introduceți orașul.",
  }),
  experience: z.string({
    required_error: "Selectați nivelul de experiență.",
  }),
  message: z.string().optional(),
  consent: z.boolean().refine((val) => val === true, {
    message: "Trebuie să fiți de acord cu termenii și condițiile.",
  }),
});

type FormValues = z.infer<typeof formSchema>;

const Parteneriat = () => {
  const location = useLocation();
  const { fromQuiz, profileType } = location.state || { fromQuiz: false, profileType: null };
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      city: "",
      experience: "",
      message: "",
      consent: false,
    },
  });

  const sendEmail = async (data: FormValues) => {
    try {
      // First, save to database
      const { error: dbError } = await supabase.from("partnership_requests").insert({
        name: data.name,
        email: data.email,
        phone: data.phone,
        city: data.city,
        experience: data.experience,
        message: data.message || "",
        profile_type: profileType || null,
      });

      if (dbError) throw dbError;

      // Now send the email using the edge function
      const response = await fetch(`${window.location.origin}/api/send-contact-email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nume: data.name,
          email: data.email,
          mesaj: `Solicitare de parteneriat de la ${data.name} (${data.email})
Telefon: ${data.phone}
Oraș: ${data.city}
Experiență: ${data.experience} ani
${data.message ? `\nMesaj: ${data.message}` : ""}
${profileType ? `\nProfil electrician: ${profileType}` : ""}`,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Eroare la trimiterea emailului");
      }

      return await response.json();
    } catch (error: any) {
      console.error("Eroare la trimiterea solicitării:", error);
      throw error;
    }
  };

  const onSubmit = async (data: FormValues) => {
    console.log("Form submitted:", data);
    setIsSubmitting(true);
    
    try {
      await sendEmail(data);
      toast.success("Solicitarea a fost trimisă cu succes! Te vom contacta în curând.", {
        duration: 5000,
      });
      form.reset();
    } catch (error: any) {
      toast.error(`Eroare: ${error.message || "Nu s-a putut trimite solicitarea. Încercați din nou mai târziu."}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-matter flex flex-col">
      <Nav />
      <main className="flex-1 container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="mb-12 text-center">
            <Handshake className="mx-auto mb-4 text-electric-blue w-12 h-12" />
            <h1 className="font-tech text-3xl md:text-4xl text-electric-blue mb-4">
              Devino Partener Light Reflect
            </h1>
            <p className="text-white/80 max-w-2xl mx-auto">
              Transformă-ți experiența în succes! Completează formularul pentru a afla mai multe
              despre programul nostru de parteneriat și pentru a fi contactat de echipa noastră.
            </p>
          </div>

          <div className="tech-panel p-6 md:p-8 relative overflow-hidden">
            <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-electric-blue/5 blur-3xl"></div>
            <div className="relative z-10">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white">Nume și prenume</FormLabel>
                          <FormControl>
                            <Input placeholder="Ion Popescu" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white">Email</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="email@exemplu.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white">Telefon</FormLabel>
                          <FormControl>
                            <Input placeholder="07XX XXX XXX" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white">Oraș</FormLabel>
                          <FormControl>
                            <Input placeholder="București" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="experience"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel className="text-white">Experiență în domeniul electric</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex flex-col space-y-1"
                          >
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="0-2" id="exp1" />
                              </FormControl>
                              <FormLabel className="font-normal text-white/80" htmlFor="exp1">
                                0-2 ani
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="3-5" id="exp2" />
                              </FormControl>
                              <FormLabel className="font-normal text-white/80" htmlFor="exp2">
                                3-5 ani
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="5-10" id="exp3" />
                              </FormControl>
                              <FormLabel className="font-normal text-white/80" htmlFor="exp3">
                                5-10 ani
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="10+" id="exp4" />
                              </FormControl>
                              <FormLabel className="font-normal text-white/80" htmlFor="exp4">
                                Peste 10 ani
                              </FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">De ce vrei să te alături Light Reflect?</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Spune-ne mai multe despre tine și motivația ta..."
                            className="resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription className="text-white/60">
                          Opțional - Ce te motivează să devii partener Light Reflect?
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="consent"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel className="text-white/80">
                            Sunt de acord cu prelucrarea datelor personale conform{" "}
                            <a href="/politica-de-confidentialitate" className="text-electric-blue hover:underline">
                              Politicii de Confidențialitate
                            </a>
                          </FormLabel>
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    <Send className="mr-2 h-4 w-4" /> 
                    {isSubmitting ? "Se trimite..." : "Trimite solicitarea"}
                  </Button>
                </form>
              </Form>
            </div>
          </div>

          <div className="mt-12 grid md:grid-cols-3 gap-6">
            <div className="bg-dark-matter/70 rounded-lg p-6 border border-electric-blue/30">
              <FileText className="h-10 w-10 text-electric-blue mb-4" />
              <h3 className="font-tech text-xl text-white mb-2">Acces la know-how</h3>
              <p className="text-white/70">
                Beneficiezi de manuale tehnice, proceduri standardizate și instruire continuă.
              </p>
            </div>
            <div className="bg-dark-matter/70 rounded-lg p-6 border border-electric-blue/30">
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-electric-blue mb-4">
                <path d="m2 7 4.41-4.41C7.79 1.21 9.3 1.2 10.7 2.6l1.51 1.5c1.4 1.4 1.4 2.9 0 4.3L8 12.6m4 4 2.3-2.3c1.4-1.4 2.9-1.4 4.3 0l1.5 1.5c1.4 1.4 1.38 2.9 0 4.3L15.7 22M22 12l-4.4 4.4c-1.4 1.4-2.9 1.38-4.3 0l-5.8-5.8c-1.4-1.4-1.4-2.9 0-4.3L12 2" />
              </svg>
              <h3 className="font-tech text-xl text-white mb-2">Brand puternic</h3>
              <p className="text-white/70">
                Folosește identitatea Light Reflect pentru a-ți crește credibilitatea pe piață.
              </p>
            </div>
            <div className="bg-dark-matter/70 rounded-lg p-6 border border-electric-blue/30">
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-electric-blue mb-4">
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
              <h3 className="font-tech text-xl text-white mb-2">Venituri crescute</h3>
              <p className="text-white/70">
                Acces la proiecte mai mari și la o bază de clienți premium.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Parteneriat;
