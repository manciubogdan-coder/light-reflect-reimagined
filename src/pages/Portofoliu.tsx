import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { Clock, Award, Map, X, ChevronRight, TrendingUp, CheckCircle2, Shield, Zap } from "lucide-react";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

import project1 from "@/assets/projects/project-1.jpg";
import project2 from "@/assets/projects/project-2.jpg";
import project3 from "@/assets/projects/project-3.jpg";
import project4 from "@/assets/projects/project-4.jpg";
import project5 from "@/assets/projects/project-5.jpg";
import project6 from "@/assets/projects/project-6.jpg";
import project7 from "@/assets/projects/project-7.jpg";
import panel1 from "@/assets/projects/panel-1.jpg";
import panel2 from "@/assets/projects/panel-2.jpg";
import panel3 from "@/assets/projects/panel-3.jpg";
import panel4 from "@/assets/projects/panel-4.jpg";
import panel5 from "@/assets/projects/panel-5.jpg";
import panel6 from "@/assets/projects/panel-6.jpg";
import panel7 from "@/assets/projects/panel-7.jpg";
import industrial1 from "@/assets/projects/industrial-1.jpg";
import industrial2 from "@/assets/projects/industrial-2.jpg";
import industrial3 from "@/assets/projects/industrial-3.jpg";

type ProjectCategory = "all" | "rezidential" | "industrial" | "smart-home";

interface Project {
  id: number;
  title: string;
  category: ProjectCategory[];
  image: string;
  badges: string[];
  description: string;
  technicalDetails: {
    duration: string;
    area: string;
    circuits: number;
    features: string[];
  };
}

const projects: Project[] = [
  {
    id: 1,
    title: "Tablou Electric Industrial - Proiect Major",
    category: ["industrial"],
    image: panel1,
    badges: ["Execuție în 3 zile", "Standard Industrial", "Conformitate CE"],
    description: "Tablou electric industrial complet cu protecții diferențiale, întrerupătoare automate și sistem de distribuție profesional.",
    technicalDetails: {
      duration: "4 zile",
      area: "Industrial",
      circuits: 48,
      features: ["Întrerupătoare Schrack", "Protecții diferențiale 30mA", "Bare de distribuție cupru", "Cablare structurată cu canal PVC"]
    }
  },
  {
    id: 2,
    title: "Panou Control Automatizare - Industrie",
    category: ["industrial"],
    image: panel2,
    badges: ["Conformitate CE", "IP65"],
    description: "Panou de control pentru linii de producție cu contactoare și relee de interfață.",
    technicalDetails: {
      duration: "2 zile",
      area: "Panou control",
      circuits: 16,
      features: ["Contactoare industriale", "Relee de interfață", "Carcasă inox IP65", "Etichetare profesională"]
    }
  },
  {
    id: 3,
    title: "Tablou Distribuție - În Execuție",
    category: ["rezidential", "industrial"],
    image: panel3,
    badges: ["Execuție în 3 zile", "Milwaukee Tools"],
    description: "Tablou de distribuție în proces de asamblare cu echipamente profesionale Milwaukee.",
    technicalDetails: {
      duration: "3 zile",
      area: "Multi-zonă",
      circuits: 32,
      features: ["Echipamente Schrack", "Cablare profesională", "Protecții diferențiale multiple", "Șine DIN multiple"]
    }
  },
  {
    id: 4,
    title: "Tablou Rezidențial Încastrat - Finisaj Premium",
    category: ["rezidential"],
    image: panel4,
    badges: ["Finisaj Premium", "Design Integrat"],
    description: "Tablou electric rezidențial încastrat cu finisaj alb și organizare impecabilă pe 3 rânduri.",
    technicalDetails: {
      duration: "1 zi",
      area: "120 mp",
      circuits: 30,
      features: ["Carcasă încastrată", "Întrerupătoare modulare", "Protecție diferențială", "Etichetare circuite"]
    }
  },
  {
    id: 5,
    title: "Linie Ambalare Automată - Instalație Completă",
    category: ["industrial"],
    image: industrial1,
    badges: ["Execuție în 14 zile", "Automatizare Completă"],
    description: "Instalație electrică pentru linie de ambalare automată cu sistem de cântărire și control PLC.",
    technicalDetails: {
      duration: "2 zile",
      area: "800 mp",
      circuits: 64,
      features: ["Alimentare trifazată", "Control PLC", "Senzori industriali", "HMI touchscreen"]
    }
  },
  {
    id: 6,
    title: "Mașină Ambalare - Conexiuni Electrice",
    category: ["industrial"],
    image: industrial2,
    badges: ["Instalație Specializată", "Siguranță Maximă"],
    description: "Instalație electrică pentru mașină de ambalare cu sistem de siguranță și control temperatura.",
    technicalDetails: {
      duration: "1 zi",
      area: "Echipament",
      circuits: 12,
      features: ["Control temperatură", "Senzori siguranță", "Afișaje digitale", "Sistem stop urgență"]
    }
  },
  {
    id: 7,
    title: "Tablou Automatizare PowerFlex",
    category: ["industrial"],
    image: industrial3,
    badges: ["Allen-Bradley", "VFD Control"],
    description: "Tablou de automatizare cu variatore de frecvență PowerFlex și sistem de control avansat.",
    technicalDetails: {
      duration: "2 zile",
      area: "Control motoare",
      circuits: 24,
      features: ["Variatore Allen-Bradley", "PLC integrat", "Contactoare industriale", "Protecții termice"]
    }
  },
  {
    id: 8,
    title: "Tablou Rezidențial - Asamblare Profesională",
    category: ["rezidential"],
    image: panel5,
    badges: ["Execuție în 1 zi", "Cablare Color-Coded"],
    description: "Tablou electric rezidențial cu cablare color-coded și organizare profesională pe bare de distribuție.",
    technicalDetails: {
      duration: "3 zile",
      area: "200 mp",
      circuits: 36,
      features: ["Cablare color-coded", "Bare cupru", "Protecții Schrack", "Cleme Wago"]
    }
  },
  {
    id: 9,
    title: "Tablou Modular ETI - În Asamblare",
    category: ["rezidential"],
    image: panel6,
    badges: ["Componente ETI", "Standard European"],
    description: "Tablou modular cu componente ETI în curs de asamblare pentru casă unifamilială.",
    technicalDetails: {
      duration: "3 zile",
      area: "150 mp",
      circuits: 28,
      features: ["Întrerupătoare ETI", "Protecții diferențiale", "Spațiu extensie", "Montaj șină DIN"]
    }
  },
  {
    id: 10,
    title: "Tablou Complet ETI - Finalizat",
    category: ["rezidential", "smart-home"],
    image: panel7,
    badges: ["Execuție în 5 zile", "Smart Ready"],
    description: "Tablou electric complet cu întrerupătoare ETI, relee de impuls și programator orar pentru automatizări.",
    technicalDetails: {
      duration: "5 zile",
      area: "180 mp",
      circuits: 42,
      features: ["Întrerupătoare ETI", "Relee de impuls", "Programator orar", "Cleme de distribuție"]
    }
  },
  {
    id: 11,
    title: "Casă Unifamilială Premium - Oradea",
    category: ["rezidential", "smart-home"],
    image: project1,
    badges: ["Execuție în 7 zile", "Standard Premium", "Planner5D Mapping"],
    description: "Instalație electrică completă pentru casă cu 5 camere, automatizări smart home și sistem de iluminat LED integrat.",
    technicalDetails: {
      duration: "7 zile",
      area: "180 mp",
      circuits: 24,
      features: ["Tablou electric modular ABB", "Prize și întrerupătoare Legrand Mosaic", "Iluminat LED dimabil", "Sistem KNX pentru automatizări"]
    }
  },
  {
    id: 12,
    title: "Apartament Studio Modern - Bihor",
    category: ["rezidential"],
    image: project2,
    badges: ["Execuție în 3 zile", "Eficiență Maximă"],
    description: "Reconversie completă instalație electrică pentru apartament tip studio cu bucătărie open-space.",
    technicalDetails: {
      duration: "3 zile",
      area: "45 mp",
      circuits: 8,
      features: ["Tablou electric Schneider", "Cablare structurată Cat6", "Prize USB integrate", "Iluminat de ambient"]
    }
  },
  {
    id: 13,
    title: "Garsonieră Minimalistă - Oradea",
    category: ["rezidential", "smart-home"],
    image: project3,
    badges: ["Execuție în 2 zile", "Smart Ready"],
    description: "Instalație modernă pentru garsonieră cu pregătire completă pentru automatizări smart home.",
    technicalDetails: {
      duration: "2 zile",
      area: "35 mp",
      circuits: 6,
      features: ["Tablou cu protecție diferențială", "Prize smart compatibile", "Iluminat zonificat", "Sistem de încărcare EV ready"]
    }
  },
  {
    id: 14,
    title: "Vilă Modernă cu Domotică - Sânmartin",
    category: ["rezidential", "smart-home"],
    image: project4,
    badges: ["Execuție în 14 zile", "Premium Plus", "Planner5D Mapping"],
    description: "Proiect complex cu sistem complet de domotică, iluminat inteligent și panouri solare integrate.",
    technicalDetails: {
      duration: "14 zile",
      area: "320 mp",
      circuits: 42,
      features: ["Sistem Loxone complet", "Invertor solar Fronius", "Stație încărcare EV", "Control vocal Alexa/Google"]
    }
  },
  {
    id: 15,
    title: "Living Room Smart - Renovare Completă",
    category: ["rezidential", "smart-home"],
    image: project5,
    badges: ["Execuție în 5 zile", "Smart Home"],
    description: "Transformare living în spațiu smart cu iluminat adaptiv și control prin aplicație mobilă.",
    technicalDetails: {
      duration: "5 zile",
      area: "50 mp",
      circuits: 10,
      features: ["Iluminat Philips Hue", "Scene predefinite", "Senzori prezență", "Sistem audio multi-room"]
    }
  },
  {
    id: 16,
    title: "Spațiu Industrial - Depozit Oradea",
    category: ["industrial"],
    image: project6,
    badges: ["Execuție în 21 zile", "Conformitate CE"],
    description: "Instalație electrică industrială cu tablouri de distribuție, iluminat industrial și sistem de siguranță.",
    technicalDetails: {
      duration: "21 zile",
      area: "1200 mp",
      circuits: 86,
      features: ["Tablouri industriale IP65", "Iluminat LED industrial", "Sistem de alarmă", "UPS pentru echipamente critice"]
    }
  },
  {
    id: 17,
    title: "Open Space Rezidențial - Bihor",
    category: ["rezidential"],
    image: project7,
    badges: ["Execuție în 4 zile", "Design Minimalist"],
    description: "Instalație pentru spațiu open-space cu accent pe estetică și funcționalitate maximă.",
    technicalDetails: {
      duration: "4 zile",
      area: "85 mp",
      circuits: 14,
      features: ["Prize încastrate în mobilier", "Iluminat pe șine", "Zone de lucru dedicate", "Sistem ventilație integrată"]
    }
  }
];

const stats = [
  { value: "40%", label: "Viteză de Execuție Crescută", icon: TrendingUp },
  { value: "0", label: "Întârzieri la Predare", icon: CheckCircle2 },
  { value: "5 ani", label: "Garanție Extinsă", icon: Shield }
];

const filterOptions = [
  { value: "all", label: "Toate" },
  { value: "rezidential", label: "Rezidențial" },
  { value: "industrial", label: "Industrial" },
  { value: "smart-home", label: "Smart Home" }
];

const Portofoliu = () => {
  const [activeFilter, setActiveFilter] = useState<ProjectCategory>("all");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const filteredProjects = activeFilter === "all" 
    ? projects 
    : projects.filter(p => p.category.includes(activeFilter));

  return (
    <>
      <Helmet>
        <title>Portofoliu | Light Reflect Electrical - Proiecte Rezidențiale și Industriale</title>
        <meta name="description" content="Descoperă proiectele noastre de instalații electrice rezidențiale, industriale și smart home din Bihor. Execuție în timp record cu garanție extinsă." />
      </Helmet>
      
      <Nav />
      
      <main className="min-h-screen pt-20">
        {/* Hero Section */}
        <section className="relative py-20 md:py-32 overflow-hidden">
          {/* Background Grid */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `linear-gradient(hsl(var(--primary) / 0.3) 1px, transparent 1px),
                               linear-gradient(90deg, hsl(var(--primary) / 0.3) 1px, transparent 1px)`,
              backgroundSize: '50px 50px'
            }} />
          </div>
          
          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-4xl mx-auto"
            >
              <h1 className="text-4xl md:text-6xl font-tech font-bold mb-6">
                <span className="text-foreground">Performanță Dovedită</span>
                <br />
                <span className="text-hologram-blue">în Timp Record</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
                Vezi cum am optimizat execuția electrică pentru proiecte rezidențiale și industriale din Bihor.
              </p>
            </motion.div>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute top-20 left-10 w-32 h-32 bg-electric-blue/10 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-40 h-40 bg-hologram-blue/10 rounded-full blur-3xl" />
        </section>

        {/* Filter Section */}
        <section className="py-8">
          <div className="container mx-auto px-4">
            <motion.div 
              className="flex flex-wrap justify-center gap-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {filterOptions.map((filter) => (
                <Button
                  key={filter.value}
                  variant={activeFilter === filter.value ? "default" : "outline"}
                  onClick={() => setActiveFilter(filter.value as ProjectCategory)}
                  className={`font-tech transition-all duration-300 ${
                    activeFilter === filter.value 
                      ? "bg-electric-blue hover:bg-electric-blue/90 shadow-[0_0_15px_rgba(0,119,255,0.5)]" 
                      : "border-electric-blue/30 hover:border-electric-blue hover:bg-electric-blue/10"
                  }`}
                >
                  {filter.label}
                </Button>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Projects Grid */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              layout
            >
              <AnimatePresence mode="popLayout">
                {filteredProjects.map((project, index) => (
                  <motion.div
                    key={project.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="group"
                  >
                    <div className="glass-panel overflow-hidden hover:border-electric-blue/50 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_0_30px_rgba(0,119,255,0.2)]">
                      {/* Image */}
                      <div className="relative h-56 overflow-hidden">
                        <img 
                          src={project.image} 
                          alt={project.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent opacity-80" />
                        
                        {/* Badges overlay */}
                        <div className="absolute bottom-3 left-3 right-3 flex flex-wrap gap-2">
                          {project.badges.map((badge, i) => (
                            <Badge 
                              key={i} 
                              variant="secondary" 
                              className="bg-electric-blue/90 text-white text-xs backdrop-blur-sm"
                            >
                              {badge}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      {/* Content */}
                      <div className="p-5">
                        <h3 className="font-tech text-lg font-semibold text-foreground mb-2 group-hover:text-hologram-blue transition-colors">
                          {project.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                          {project.description}
                        </p>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedProject(project)}
                          className="w-full border-electric-blue/30 hover:border-electric-blue hover:bg-electric-blue/10 font-tech group/btn"
                        >
                          <span>Vezi Detalii Tehnice</span>
                          <ChevronRight className="w-4 h-4 ml-1 transition-transform group-hover/btn:translate-x-1" />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-electric-blue/5 via-transparent to-hologram-blue/5" />
          
          <div className="container mx-auto px-4 relative z-10">
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.15 }}
                  className="glass-panel p-8 text-center hover:border-electric-blue/50 transition-all duration-300"
                >
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-electric-blue/10 mb-4">
                    <stat.icon className="w-8 h-8 text-electric-blue" />
                  </div>
                  <div className="text-4xl font-tech font-bold text-hologram-blue mb-2">
                    {stat.value}
                  </div>
                  <div className="text-muted-foreground font-medium">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative overflow-hidden rounded-2xl"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-electric-blue/20 via-hologram-blue/10 to-electric-blue/20" />
              <div className="absolute inset-0 bg-card/80 backdrop-blur-sm" />
              
              {/* Animated border */}
              <div className="absolute inset-0 rounded-2xl border border-electric-blue/30" />
              
              <div className="relative z-10 p-8 md:p-12 text-center">
                <Zap className="w-12 h-12 text-electric-blue mx-auto mb-6" />
                <h2 className="text-2xl md:text-4xl font-tech font-bold mb-4">
                  Vrei același nivel de eficiență pentru proiectul tău?
                </h2>
                <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                  Solicită un Audit de Eficiență în 24h și descoperă cum putem optimiza instalația ta electrică.
                </p>
                <Link to="/contact">
                  <Button 
                    size="lg" 
                    className="electric-button font-tech text-lg px-8 py-6"
                  >
                    Solicită Audit Gratuit
                    <ChevronRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      {/* Project Details Modal */}
      <Dialog open={!!selectedProject} onOpenChange={() => setSelectedProject(null)}>
        <DialogContent className="max-w-2xl bg-card border-electric-blue/30">
          {selectedProject && (
            <>
              <DialogHeader>
                <DialogTitle className="font-tech text-xl text-foreground">
                  {selectedProject.title}
                </DialogTitle>
                <DialogDescription className="text-muted-foreground">
                  {selectedProject.description}
                </DialogDescription>
              </DialogHeader>
              
              <div className="mt-4">
                <img 
                  src={selectedProject.image}
                  alt={selectedProject.title}
                  className="w-full h-48 object-cover rounded-lg mb-6"
                />
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="glass-panel p-4">
                    <div className="flex items-center gap-2 text-electric-blue mb-1">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm font-medium">Durată</span>
                    </div>
                    <span className="text-foreground font-tech">{selectedProject.technicalDetails.duration}</span>
                  </div>
                  <div className="glass-panel p-4">
                    <div className="flex items-center gap-2 text-electric-blue mb-1">
                      <Map className="w-4 h-4" />
                      <span className="text-sm font-medium">Suprafață</span>
                    </div>
                    <span className="text-foreground font-tech">{selectedProject.technicalDetails.area}</span>
                  </div>
                </div>
                
                <div className="glass-panel p-4 mb-6">
                  <div className="flex items-center gap-2 text-electric-blue mb-3">
                    <Award className="w-4 h-4" />
                    <span className="text-sm font-medium">Circuite instalate: {selectedProject.technicalDetails.circuits}</span>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-tech text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wider">
                    Caracteristici tehnice
                  </h4>
                  <ul className="space-y-2">
                    {selectedProject.technicalDetails.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2 text-foreground">
                        <CheckCircle2 className="w-4 h-4 text-hologram-blue flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="flex flex-wrap gap-2 mt-6 pt-6 border-t border-border">
                  {selectedProject.badges.map((badge, i) => (
                    <Badge 
                      key={i} 
                      className="bg-electric-blue/20 text-electric-blue border-electric-blue/30"
                    >
                      {badge}
                    </Badge>
                  ))}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
      
      <Footer />
    </>
  );
};

export default Portofoliu;
