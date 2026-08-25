import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tag, PlusCircle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useAdmin } from '@/context/AdminContext';

const Services = ({ onSelectService }) => {
  const { toast } = useToast();
  const { isPromotionDeleted } = useAdmin();

  const handleOrderClick = () => {
    toast({
      title: "Ši funkcija neįdiegta",
      description: "🚧 Ši funkcija dar neįdiegta, bet galite jos paprašyti kitame pranešime! 🚀",
    });
  };

  const pricingData = [
    { id: 'svc-price-1', size: '13"–15"', price: '20–30 €', value: 'Montavimas + balansavimas (13"–15")' },
    { id: 'svc-price-2', size: '16"–17"', price: '25–35 €', value: 'Montavimas + balansavimas (16"–17")' },
    { id: 'svc-price-3', size: '18"–19"', price: '30–40 €', value: 'Montavimas + balansavimas (18"–19")' },
    { id: 'svc-price-4', size: '20"–22"', price: '35–50 €', value: 'Montavimas + balansavimas (20"–22")' },
  ];

  const additionalPricing = [
    { id: 'svc-add-1', service: 'Run-flat padangos', price: '+10–15 € papildomai', value: 'Run-flat padangos' },
    { id: 'svc-add-2', service: 'SUV / mikroautobusai', price: '+5–10 €', value: 'SUV / mikroautobusai' },
  ];

  // Filter out services that are marked as deleted in AdminContext
  const visiblePricingData = pricingData.filter(item => !isPromotionDeleted(item.id));
  const visibleAdditionalPricing = additionalPricing.filter(item => !isPromotionDeleted(item.id));

  return (
    <section className="py-20 bg-black/20" id="services">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h3 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Mūsų paslaugos ir kainos
          </h3>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Siūlome pilną ratų aptarnavimo spektrą su skaidriomis kainomis ir kokybės garantija.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700/50 backdrop-blur-sm w-full max-w-4xl mx-auto">
            <CardHeader>
              <CardTitle className="text-2xl text-white text-center">Montavimas + balansavimas (už 4 ratus)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-gray-300">
                  <thead className="border-b border-slate-700">
                    <tr>
                      <th className="p-4 text-lg font-semibold text-white">Ratlankių dydis</th>
                      <th className="p-4 text-lg font-semibold text-white text-right">Kaina</th>
                    </tr>
                  </thead>
                  <tbody>
                    {visiblePricingData.length > 0 ? (
                      visiblePricingData.map((item, index) => (
                        <tr 
                          key={item.id} 
                          className="border-b border-slate-800 last:border-b-0"
                        >
                          <td className="p-4 flex items-center">
                            <Tag className="w-5 h-5 mr-3 text-blue-400" />
                            {item.size}
                          </td>
                          <td className="p-4 text-right font-bold text-green-400 text-lg">{item.price}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="2" className="p-4 text-center italic text-slate-500">Paslaugos šiuo metu nepasiekiamos</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              <div className="mt-8 border-t border-slate-700 pt-6">
                <h4 className="text-xl font-semibold text-white text-center mb-4">Papildomos paslaugos</h4>
                <ul className="space-y-3">
                  {visibleAdditionalPricing.length > 0 ? (
                    visibleAdditionalPricing.map((item, index) => (
                      <li 
                        key={item.id} 
                        className="flex justify-between items-center p-3 bg-slate-800/50 rounded-lg"
                      >
                        <span className="flex items-center">
                          <PlusCircle className="w-5 h-5 mr-3 text-purple-400" />
                          {item.service}
                        </span>
                        <span className="font-semibold text-purple-300">{item.price}</span>
                      </li>
                    ))
                  ) : (
                    <li className="text-center italic text-slate-500">Papildomų paslaugų sąrašas tuščias</li>
                  )}
                </ul>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};

export default Services;