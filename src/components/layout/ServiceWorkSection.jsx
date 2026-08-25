import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Wrench, Sprout } from 'lucide-react';

const ServiceWorkSection = () => {
  const services = [
    {
      icon: <Sprout className="w-10 h-10 text-green-400" />,
      title: "Tepalų keitimas",
      description: "Keičiame variklio ir kitus skysčius bei filtrus.",
      image: "https://storage.googleapis.com/hostinger-horizons-assets-prod/f533b165-5105-4cde-bbbe-298474d58916/f65bea93f2211237b9cb2207cabac746.webp"
    },
    {
      icon: <Wrench className="w-10 h-10 text-yellow-400" />,
      title: "Važiuoklės remontas",
      description: "Atliekame važiuoklės diagnostiką ir remontą.",
      image: "https://storage.googleapis.com/hostinger-horizons-assets-prod/f533b165-5105-4cde-bbbe-298474d58916/be6adc4818f0c568ca0fb3b925f3f909.jpg"
    }
  ];

  return (
    <section id="servizas" className="py-20 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Mūsų autoserviso darbai
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            AutoUP siūlo profesionalias automobilių remonto ir priežiūros paslaugas.
          </p>
        </motion.div>

        <div className="flex flex-wrap justify-center gap-8">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="w-full md:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.5rem)]"
            >
              <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700/50 backdrop-blur-sm h-full flex flex-col">
                <div className="relative overflow-hidden h-48 rounded-t-lg">
                  <img  
                    alt={service.title} 
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    src={service.image} />
                </div>
                <CardHeader>
                  <CardTitle className="text-2xl text-white text-center">{service.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow flex flex-col justify-between p-6">
                  <p className="text-gray-300 text-center mb-6">{service.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServiceWorkSection;