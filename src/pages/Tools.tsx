import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calculator, Grid, Settings, Cable, Zap, Lightbulb, UserCheck } from 'lucide-react';

const Tools: React.FC = () => {
  const tools = [
    {
      id: 'power-calculator',
      title: 'Calculator Putere Electrică',
      description: 'Estimează necesarul de putere pentru instalațiile electrice',
      link: '/tools/power-calculator',
      icon: Calculator,
      status: 'Accesează Calculator'
    },
    {
      id: 'lighting-calculator',
      title: 'Calculator Iluminat',
      description: 'Determină necesarul de corpuri de iluminat pentru spațiul tău',
      link: '/tools/lighting-calculator',
      icon: Lightbulb,
      status: 'Calculează Iluminat'
    },
    {
      id: 'panel-configurator',
      title: 'Configurator Tablou Electric',
      description: 'Proiectează și validează tabloul electric',
      link: '/tools/panel-configurator',
      icon: Settings,
      status: 'În curând',
      disabled: true
    },
    {
      id: 'cable-calculator',
      title: 'Calculator Secțiune Cablu',
      description: 'Calculează secțiunea optimă a cablurilor electrice',
      link: '/tools/cable-calculator',
      icon: Cable,
      status: 'Calculează Cablu'
    },
    {
      id: 'short-circuit-calculator',
      title: 'Calculator Curent Scurtcircuit',
      description: 'Calculează curentul de scurtcircuit în instalații',
      link: '/tools/short-circuit-calculator',
      icon: Zap,
      status: 'Analizează Scurtcircuit'
    },
    {
      id: 'energy-efficiency',
      title: 'Calculator Eficiență Energetică',
      description: 'Analizează și optimizează consumul energetic',
      link: '/tools/energy-efficiency',
      icon: Grid,
      status: 'Optimizează Energie'
    },
    {
      id: 'electrician-quiz',
      title: 'Quiz: Ce Tip de Electrician Ești?',
      description: 'Descoperă stilul tău profesional prin acest test interactiv',
      link: '/tools/electrician-quiz',
      icon: UserCheck,
      status: 'Începe Quiz-ul'
    }
  ];

  return (
    <>
      <Helmet>
        <title>Instrumente | Light Reflect</title>
        <meta name="description" content="Instrumente pentru proiectare electrică" />
      </Helmet>

      <div className="bg-[#0F1724] min-h-screen">
        <Nav />
        
        <div className="container mx-auto py-24 px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-white mb-4">
              <span className="text-[#00FFFF]">LIGHT</span>
              <span className="text-white">REFLECT</span>
            </h1>
            <p className="text-gray-400 max-w-xl mx-auto">
              Instrumente profesionale pentru instalații electrice
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {tools.map((tool) => (
              <div 
                key={tool.id} 
                className={`block ${tool.disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <Card 
                  className={`
                    bg-[#162030] 
                    border-none 
                    shadow-lg 
                    rounded-lg 
                    overflow-hidden 
                    transition-all 
                    ${!tool.disabled ? 'hover:scale-[1.02] hover:shadow-xl' : ''}
                  `}
                >
                  <CardHeader className="p-6 pb-0 bg-transparent">
                    <div className="flex items-center space-x-4">
                      <tool.icon className="w-8 h-8 text-[#00FFFF]" />
                      <CardTitle className="text-white text-xl">{tool.title}</CardTitle>
                    </div>
                    <CardDescription className="text-gray-400 mt-2">
                      {tool.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6 pt-0">
                    <div 
                      className={`
                        ${tool.disabled 
                          ? 'bg-gray-800 text-gray-500' 
                          : 'bg-[#0C1320] text-[#00FFFF]'
                        } 
                        rounded-lg p-3 mt-4 text-center
                      `}
                    >
                      <span className="font-medium">{tool.status}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
        
        <Footer />
      </div>
    </>
  );
};

export default Tools;
