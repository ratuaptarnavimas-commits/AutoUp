import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { CheckCircle, Clock } from 'lucide-react';
const Hero = ({
  onCtaClick
}) => {
  const newImageUrl = 'https://storage.googleapis.com/hostinger-horizons-assets-prod/f533b165-5105-4cde-bbbe-298474d58916/39aebd5ba0564f9b9457bb754d18e9df.jpg';
  return <>
      {/* Hero Section */}
      <section className="relative py-32 md:py-48 overflow-hidden bg-cover bg-center bg-fixed" style={{
      backgroundImage: `url(${newImageUrl})`
    }}>
        <div className="absolute inset-0 bg-slate-900/70"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div initial={{
            opacity: 0,
            y: -50
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.8
          }} className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-4xl md:text-7xl font-bold text-white leading-tight">
                  Ratų montavimas ir 
                  <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent block mt-2"> balansavimas</span>
                </h1>
                <p className="text-xl md:text-2xl text-gray-200 leading-relaxed max-w-2xl mx-auto">&nbsp;Paslaugos Garliavoje su modernia įranga . Kokybiška ir greita!</p>
              </div>

              <div className="flex flex-wrap gap-4 justify-center">
                <div className="flex items-center space-x-2 bg-green-500/20 px-4 py-2 rounded-full border border-green-500/30">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span className="text-green-300 font-medium">Kokybės garantija</span>
                </div>
                <div className="flex items-center space-x-2 bg-blue-500/20 px-4 py-2 rounded-full border border-blue-500/30">
                  <Clock className="w-5 h-5 text-blue-400" />
                  <span className="text-blue-300 font-medium">Greitas aptarnavimas</span>
                </div>
              </div>

              <Button size="lg" className="bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 hover:from-yellow-600 hover:via-orange-600 hover:to-red-600 text-white px-10 py-8 text-xl font-bold rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105" onClick={onCtaClick}>
                Užsisakyti remontą dabar
              </Button>
            </motion.div>
          </div>
        </div>
      </section>
    </>;
};
export default Hero;