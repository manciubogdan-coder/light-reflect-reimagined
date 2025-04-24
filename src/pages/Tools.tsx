
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import CyberScanner from '@/components/CyberScanner';

const Tools: React.FC = () => {
  const tools = [
    {
      id: 'cable-calculator',
      title: 'Calculator Cabluri',
      description: 'Calculează secțiunea optimă a cablurilor pentru instalațiile electrice în funcție de putere, curent, lungime și tip.',
      link: '/tools/cable-calculator',
      color: 'bg-blue-500'
    },
    {
      id: 'power-calculator',
      title: 'Calculator Putere',
      description: 'Estimează necesarul de putere electrică pentru locuința sau business-ul tău în funcție de consumatori.',
      link: '/tools/power-calculator',
      color: 'bg-green-500'
    },
    {
      id: 'lighting-calculator',
      title: 'Calculator Iluminat',
      description: 'Calculează numărul de corpuri de iluminat necesare pentru orice încăpere conform standardelor de iluminare.',
      link: '/tools/lighting-calculator',
      color: 'bg-amber-500'
    },
    {
      id: 'energy-efficiency',
      title: 'Calculator Eficiență Energetică',
      description: 'Compară soluțiile de iluminat și calculează economiile realizate prin trecerea la tehnologii eficiente.',
      link: '/tools/energy-efficiency',
      color: 'bg-emerald-500'
    },
    {
      id: 'short-circuit-calculator',
      title: 'Calculator Curent Scurtcircuit',
      description: 'Estimează curentul de scurtcircuit în instalații și dimensionarea corectă a protecțiilor.',
      link: '/tools/short-circuit-calculator',
      color: 'bg-red-500'
    },
    {
      id: 'electrician-quiz',
      title: 'Test tip electrician',
      description: 'Descoperă ce tip de electrician ți se potrivește în funcție de personalitate și preferințe.',
      link: '/tools/electrician-quiz',
      color: 'bg-purple-500'
    },
    {
      id: 'panel-configurator',
      title: 'Configurator Tablouri',
      description: 'Creează și validează configurația tabloului electric prin drag & drop în conformitate cu normele în vigoare.',
      link: '/tools/panel-configurator',
      color: 'bg-indigo-500',
      new: true
    }
  ];

  return (
    <>
      <Helmet>
        <title>Instrumente pentru electro-proiectare | Light Reflect</title>
        <meta name="description" content="Instrumente și calculatoare online gratuite pentru profesioniști și pasionați din domeniul electric: calculatoare pentru cabluri, iluminat, putere și multe altele." />
      </Helmet>

      <div>
        <Nav />
        
        <div className="container mx-auto py-12">
          <div className="space-y-4 mb-12">
            <h1 className="text-4xl font-bold text-center">Instrumente pentru electro-proiectare</h1>
            <p className="text-xl text-center text-gray-600 max-w-3xl mx-auto">
              Colecție de calculatoare și instrumente online gratuite pentru profesioniști și pasionați din domeniul electric.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {tools.map((tool) => (
              <Card key={tool.id} className="overflow-hidden border-b-4 transition-all hover:shadow-lg" style={{ borderBottomColor: tool.color.replace('bg-', 'rgb(var(--') }}>
                <CardHeader className={`${tool.color} text-white`}>
                  <div className="flex justify-between items-center">
                    <CardTitle>{tool.title}</CardTitle>
                    {tool.new && (
                      <span className="bg-white text-blue-600 text-xs font-bold px-2 py-1 rounded-full">NOU</span>
                    )}
                  </div>
                  <CardDescription className="text-white/90">{tool.description}</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <CyberScanner className="w-full h-32 object-cover mb-4" />
                </CardContent>
                <CardFooter className="bg-gray-50">
                  <Link to={tool.link} className="w-full">
                    <Button className="w-full">Deschide instrumentul</Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
        
        <Footer />
      </div>
    </>
  );
};

export default Tools;
