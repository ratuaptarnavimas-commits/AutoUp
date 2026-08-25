import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Phone, Mail, MapPin } from 'lucide-react';

const Contact = ({ onCtaClick }) => {
  const address = "Liepų g. 40-51, Garliava";
  // The googleMapsLink is no longer needed as the button using it is removed.

  return (
    <section className="py-20 bg-black/20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h3 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Kontaktai
          </h3>
          <p className="text-xl text-gray-300">
            Susisiekite su mumis bet kuriuo jums patogiu būdu
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700/50 backdrop-blur-sm text-center h-full flex flex-col justify-between">
              <CardContent className="p-8">
                <div className="mx-auto mb-4 p-4 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-xl w-fit">
                  <Phone className="w-8 h-8 text-green-400" />
                </div>
                <h4 className="text-xl font-semibold text-white mb-2">Telefonas</h4>
                <p className="text-green-400 font-semibold text-lg">+370 651 18482</p>
              </CardContent>
              <div className="p-6 pt-0">
                <Button asChild variant="outline" className="border-green-400 text-green-400 hover:bg-green-400/10 hover:text-green-300 w-full">
                  <a href="tel:+37065118482">Skambinti dabar</a>
                </Button>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700/50 backdrop-blur-sm text-center h-full flex flex-col justify-between">
              <CardContent className="p-8">
                <div className="mx-auto mb-4 p-4 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-xl w-fit">
                  <Mail className="w-8 h-8 text-blue-400" />
                </div>
                <h4 className="text-xl font-semibold text-white mb-2">El. paštas</h4>
                <p className="text-blue-400 font-semibold">ratuaptarnavimas@gmail.com</p>
                <p className="text-gray-400 text-sm mt-2">Atsakysime per 24h</p>
              </CardContent>
              <div className="p-6 pt-0">
                <Button asChild variant="outline" className="border-blue-400 text-blue-400 hover:bg-blue-400/10 hover:text-blue-300 w-full">
                  <a href="mailto:ratuaptarnavimas@gmail.com">Rašyti laišką</a>
                </Button>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="md:col-span-1"
          >
            <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700/50 backdrop-blur-sm text-center h-full flex flex-col overflow-hidden">
              <CardContent className="p-6 flex-grow flex flex-col items-center justify-center">
                <div className="mx-auto mb-4 p-4 bg-gradient-to-br from-red-500/20 to-pink-500/20 rounded-xl w-fit">
                  <MapPin className="w-8 h-8 text-red-400" />
                </div>
                <h4 className="text-xl font-semibold text-white mb-4">Adresas</h4>
                
                <p className="text-gray-300 text-lg font-medium">
                  {address}
                </p>
                {/* The "Atidaryti žemėlapyje" button has been removed as requested. */}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;