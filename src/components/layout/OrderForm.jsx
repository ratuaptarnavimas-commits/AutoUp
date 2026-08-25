import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const OrderForm = ({ formData, handleInputChange, handleSubmit, services, onServiceChange }) => {
  return (
    <section className="py-20" id="order-form">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h3 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Registracija vizitui
          </h3>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Užpildykite užklausos formą ir mes su jumis susisieksime artimiausiu metu.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700/50 backdrop-blur-sm w-full max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="text-2xl text-white text-center">Užsakymo forma</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6 text-white">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="name">Vardas*</Label>
                    <Input id="name" name="name" value={formData.name} onChange={handleInputChange} placeholder="Jūsų vardas" required className="bg-slate-900/50 border-slate-700" />
                  </div>
                  <div>
                    <Label htmlFor="phone">Telefonas*</Label>
                    <Input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleInputChange} placeholder="+370..." required className="bg-slate-900/50 border-slate-700" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="email">El. paštas</Label>
                  <Input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} placeholder="jusu.pastas@email.com" className="bg-slate-900/50 border-slate-700" />
                </div>
                <div>
                  <Label htmlFor="carModel">Automobilio modelis</Label>
                  <Input id="carModel" name="carModel" value={formData.carModel} onChange={handleInputChange} placeholder="pvz., Audi A4" className="bg-slate-900/50 border-slate-700" />
                </div>
                <div>
                  <Label htmlFor="service">Paslauga*</Label>
                  <Select onValueChange={onServiceChange} value={formData.service}>
                    <SelectTrigger id="service" className="w-full bg-slate-900/50 border-slate-700">
                      <SelectValue placeholder="Pasirinkite paslaugą" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-slate-700 text-white">
                      {services.map((service) => (
                        <SelectItem key={service.value} value={service.value}>
                          {service.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="message">Papildoma informacija</Label>
                  <Textarea id="message" name="message" value={formData.message} onChange={handleInputChange} placeholder="Jūsų žinutė..." className="bg-slate-900/50 border-slate-700" />
                </div>
                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 text-lg">
                  Užpildyti užklausos formą
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};

export default OrderForm;