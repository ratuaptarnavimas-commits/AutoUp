import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Calendar, User, Phone, Mail, FileText, CheckCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { sendBookingEmail } from '@/services/web3formsService';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';

const BookingForm = ({ date, onClose, onSuccess }) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    notes: '',
    time: '09:00'
  });
  const [errors, setErrors] = useState({});

  const formattedDate = date ? new Date(date).toLocaleDateString('lt-LT', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }) : '';

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Vardas yra privalomas';
    if (!formData.email.trim()) {
      newErrors.email = 'El. paštas yra privalomas';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Neteisingas el. pašto formatas';
    }
    if (!formData.phone.trim()) newErrors.phone = 'Telefono numeris yra privalomas';
    if (!formData.time) newErrors.time = 'Pasirinkite pageidaujamą laiką';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) return;

    setIsLoading(true);
    
    try {
      const dateValue = new Date(date).toISOString().split('T')[0];
      const { error: bookingError } = await supabase.from('bookings').insert({
        customer_name: formData.name.trim(),
        customer_email: formData.email.trim(),
        customer_phone: formData.phone.trim(),
        booking_date: dateValue,
        preferred_time: formData.time,
        notes: formData.notes.trim() || null,
        status: 'pending'
      });

      if (bookingError) throw bookingError;

      const payload = {
        Vardas: formData.name,
        Email: formData.email,
        Telefonas: formData.phone,
        Data: formattedDate,
        Laikas: formData.time,
        Papildoma: formData.notes || "Nėra pastabų"
      };

      const result = await sendBookingEmail(payload);

      if (result.success) {
        toast({
          title: "Sėkmė!",
          description: "Rezervacijos užklausa išsaugota. Netrukus su jumis susisieksime.",
          className: "bg-green-500 text-white border-none",
        });
        
        // Clear form fields
        setFormData({
          name: '',
          email: '',
          phone: '',
          notes: '',
          time: '09:00'
        });

        if (onSuccess) onSuccess();
        onClose();
      } else {
        toast({
          title: "Rezervacija gauta",
          description: "Užklausa išsaugota, tačiau el. pašto pranešimo išsiųsti nepavyko.",
        });
        if (onSuccess) onSuccess();
        onClose();
      }
    } catch (error) {
      toast({
        title: "Klaida",
        description: "Rezervacijos išsaugoti nepavyko. Pabandykite dar kartą arba paskambinkite.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />

      {/* Modal Content */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-md bg-white rounded-xl shadow-2xl overflow-hidden z-10"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-900 to-slate-900 p-6 text-white flex justify-between items-start">
          <div>
            <h3 className="text-xl font-bold flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-300" />
              Registracija vizitui
            </h3>
            <p className="text-blue-200 text-sm mt-1 opacity-90 capitalize">
              {formattedDate}
            </p>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onClose}
            className="text-blue-200 hover:text-white hover:bg-white/10 -mt-1 -mr-2"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-slate-700">Jūsų vardas</Label>
            <div className="relative">
              <User className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
              <Input
                id="name"
                name="name"
                placeholder="Vardenis Pavardenis"
                className={`pl-10 ${errors.name ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                value={formData.name}
                onChange={handleChange}
                disabled={isLoading}
              />
            </div>
            {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="text-slate-700">Telefono numeris</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
              <Input
                id="phone"
                name="phone"
                placeholder="+370 600 00000"
                className={`pl-10 ${errors.phone ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                value={formData.phone}
                onChange={handleChange}
                disabled={isLoading}
              />
            </div>
            {errors.phone && <p className="text-xs text-red-500">{errors.phone}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-slate-700">El. paštas</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="pastas@pavyzdys.lt"
                className={`pl-10 ${errors.email ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                value={formData.email}
                onChange={handleChange}
                disabled={isLoading}
              />
            </div>
            {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="time" className="text-slate-700">Pageidaujamas laikas</Label>
            <div className="relative">
              <Calendar className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
              <Input
                id="time"
                name="time"
                type="time"
                min="08:00"
                max="18:00"
                className={`pl-10 ${errors.time ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                value={formData.time}
                onChange={handleChange}
                disabled={isLoading}
                required
              />
            </div>
            {errors.time && <p className="text-xs text-red-500">{errors.time}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes" className="text-slate-700">Papildoma informacija (nebūtina)</Label>
            <div className="relative">
              <FileText className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
              <Textarea
                id="notes"
                name="notes"
                placeholder="Automobilio modelis, pageidaujami darbai..."
                className="pl-10 min-h-[80px]"
                value={formData.notes}
                onChange={handleChange}
                disabled={isLoading}
              />
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white mt-4"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Siunčiama...
              </>
            ) : (
              <>
                <CheckCircle className="mr-2 h-4 w-4" />
                Patvirtinti rezervaciją
              </>
            )}
          </Button>
          
          <p className="text-xs text-center text-slate-400 mt-2">
            * Rezervacija bus patvirtinta tik gavus atsakymą el. paštu arba telefonu.
          </p>
        </form>
      </motion.div>
    </div>
  );
};

export default BookingForm;