import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarDays, Hash, GitBranch, Gauge } from 'lucide-react';

const infoItems = [
  {
    icon: <CalendarDays className="w-8 h-8 text-blue-400" />,
    title: 'Kada keisti padangas?',
    description: 'Lietuvoje vasarines padangas privaloma pasikeisti į žiemines iki lapkričio 10 d., o žiemines į vasarines – iki balandžio 10 d. Laiku atliktas keitimas užtikrina saugumą kelyje.',
  },
  {
    icon: <Hash className="w-8 h-8 text-purple-400" />,
    title: 'Padangų žymėjimas',
    description: 'Skaičiai kaip 205/55 R16 nurodo padangos duomenis: plotį, aukščio santykį, konstrukciją ir ratlankio skersmenį.',
  },
  {
    icon: <GitBranch className="w-8 h-8 text-green-400" />,
    title: 'Ratų balansavimo svarba',
    description: 'Neatlikus balansavimo, jaučiamas vairo ir kėbulo vibravimas, greičiau dyla pakabos dalys ir pačios padangos. Balansavimas užtikrina komfortišką ir saugų vairavimą.',
  },
  {
    icon: <Gauge className="w-8 h-8 text-yellow-400" />,
    title: 'Tinkamas slėgis',
    description: 'Per žemas arba per aukštas slėgis padangose didina degalų sąnaudas, prastina sukibimą ir pagreitina padangų dilimą. Reguliariai tikrinkite slėgį!',
  },
];

const TireInfo = () => {
  const cardVariants = {
    offscreen: {
      y: 50,
      opacity: 0,
    },
    onscreen: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        bounce: 0.4,
        duration: 0.8,
      },
    },
  };

  return (
    <section className="py-20 bg-slate-900/50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Svarbi informacija vairuotojams
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Keli patarimai, kurie padės užtikrinti jūsų automobilio ratų ilgaamžiškumą ir jūsų saugumą.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {infoItems.map((item, index) => (
            <motion.div
              key={index}
              initial="offscreen"
              whileInView="onscreen"
              viewport={{ once: true, amount: 0.5 }}
              variants={cardVariants}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="h-full bg-gradient-to-b from-slate-800/60 to-slate-900/60 border-slate-700/50 hover:border-blue-500/50 transition-all duration-300 transform hover:-translate-y-2">
                <CardHeader className="flex flex-col items-center text-center">
                  <div className="p-4 bg-slate-700/50 rounded-full mb-4">
                    {item.icon}
                  </div>
                  <CardTitle className="text-xl text-white">{item.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-center text-gray-300">
                  <p>{item.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TireInfo;