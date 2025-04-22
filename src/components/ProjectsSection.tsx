
import { useState } from "react";
import { ArrowRight, Star } from "lucide-react";
import { Link } from "react-router-dom";

const ProjectsSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  
  const projects = [
    {
      id: 1,
      title: "Smart Home Residence",
      category: "Rezidențial",
      description: "Sistem complet de automatizare pentru o vilă cu 5 dormitoare, incluzând control iluminat, HVAC, securitate și multimedia.",
      image: "https://images.unsplash.com/photo-1558036117-15d82a90b9b1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
    },
    {
      id: 2,
      title: "Office Tower Bucharest",
      category: "Comercial",
      description: "Instalație electrică avansată pentru o clădire de birouri de 12 etaje, cu monitorizare și control centralizat.",
      image: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1169&q=80"
    },
    {
      id: 3,
      title: "Green Energy Campus",
      category: "Industrial",
      description: "Sistem hibrid fotovoltaic pentru un campus industrial, cu stocarea energiei și integrare în rețeaua existentă.",
      image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1172&q=80"
    },
  ];
  
  const testimonials = [
    {
      id: 1,
      name: "Andrei Popescu",
      position: "Proprietar Smart Home",
      text: "Light Reflect a transformat complet experiența locuinței noastre. Sistemele sunt intuitive și ne permit să controlăm totul cu ușurință.",
      rating: 5
    },
    {
      id: 2,
      name: "Maria Ionescu",
      position: "Manager Facility",
      text: "Colaborarea cu Light Reflect a fost excelentă. Echipa lor a rezolvat prompt toate provocările și a implementat soluții inovatoare.",
      rating: 5
    },
    {
      id: 3,
      name: "Cristian Dumitrescu",
      position: "Director Green Energy",
      text: "Instalația realizată de Light Reflect a redus costurile energetice cu peste 40%. Suntem foarte mulțumiți de profesionalismul și expertiza lor.",
      rating: 5
    },
  ];

  return (
    <section className="py-24 relative">
      <div className="absolute inset-0 overflow-hidden">
        <div className="circuit-line absolute top-0 w-full"></div>
        <div className="circuit-line absolute bottom-0 w-full"></div>
      </div>

      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h4 className="text-electric-blue font-tech text-xl mb-3">
            <span className="inline-block w-10 h-px bg-electric-blue mr-2"></span>
            Proiecte Realizate
            <span className="inline-block w-10 h-px bg-electric-blue ml-2"></span>
          </h4>
          <h2 className="text-3xl md:text-4xl font-tech font-bold mb-4">
            Portofoliu de <span className="text-neon-red">Excelență</span>
          </h2>
          <p className="text-white/60 max-w-2xl mx-auto">
            Descoperă o selecție din proiectele noastre reprezentative, 
            implementate cu succes pentru clienți din diverse sectoare.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            {/* Project Carousel */}
            <div className="relative tech-panel overflow-hidden aspect-[4/3]">
              {projects.map((project, index) => (
                <div 
                  key={project.id}
                  className={`absolute inset-0 transition-opacity duration-500 ${
                    index === activeIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
                  }`}
                >
                  <img 
                    src={project.image} 
                    alt={project.title} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-dark-matter via-transparent to-transparent"></div>
                  <div className="absolute bottom-0 left-0 p-6">
                    <span className="inline-block px-3 py-1 bg-electric-blue/20 text-electric-blue text-sm font-tech rounded mb-2">
                      {project.category}
                    </span>
                    <h3 className="text-2xl font-tech font-bold text-white mb-2">
                      {project.title}
                    </h3>
                    <p className="text-white/70 max-w-md">
                      {project.description}
                    </p>
                  </div>
                </div>
              ))}
              
              {/* Navigation Dots */}
              <div className="absolute bottom-4 right-4 flex gap-2">
                {projects.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveIndex(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index === activeIndex 
                        ? 'bg-electric-blue scale-125' 
                        : 'bg-white/30 hover:bg-white/50'
                    }`}
                    aria-label={`View project ${index + 1}`}
                  />
                ))}
              </div>
            </div>
            
            <div className="mt-6 text-center">
              <Link to="/proiecte" className="electric-button inline-flex items-center gap-2">
                <span>Vezi toate proiectele</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
          
          <div>
            <div className="mb-6">
              <h3 className="text-2xl font-tech font-bold text-white mb-4">
                Ce Spun Clienții Noștri
              </h3>
              <p className="text-white/60">
                Feedback-ul clienților noștri confirmă calitatea serviciilor și 
                profesionalismul echipei Light Reflect Electrical.
              </p>
            </div>
            
            <div className="space-y-4">
              {testimonials.map((testimonial) => (
                <div key={testimonial.id} className="tech-panel hoverable-card">
                  <div className="flex gap-1 mb-3">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-electric-blue text-electric-blue" />
                    ))}
                  </div>
                  <p className="text-white/70 italic mb-4">"{testimonial.text}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-electric-blue/20 flex items-center justify-center">
                      <span className="text-electric-blue font-bold">
                        {testimonial.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-tech text-white">{testimonial.name}</h4>
                      <p className="text-white/50 text-sm">{testimonial.position}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
