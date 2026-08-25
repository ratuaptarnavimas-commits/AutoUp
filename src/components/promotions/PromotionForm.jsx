import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, Tag, Calendar, FileText, Plus, Percent, Check, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { useAdmin } from '@/context/AdminContext';
import { useToast } from '@/components/ui/use-toast';
import { Switch } from '@/components/ui/switch';

const PromotionForm = ({ isOpen, onClose, promotion, onSave }) => {
  const { isAdmin } = useAdmin();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    discount: '',
    validUntil: '',
    features: [],
    isActive: true,
    iconType: 'Sparkles',
    gradient: 'from-blue-500 to-cyan-500'
  });

  const [featureInput, setFeatureInput] = useState('');

  useEffect(() => {
    if (promotion) {
      setFormData({
        title: promotion.title || '',
        description: promotion.description || '',
        discount: promotion.discount ? promotion.discount.replace(/%/g, '') : '',
        validUntil: promotion.validUntil || '',
        features: promotion.features || [],
        isActive: promotion.isActive !== undefined ? promotion.isActive : true,
        iconType: promotion.iconType || 'Sparkles',
        gradient: promotion.gradient || 'from-blue-500 to-cyan-500'
      });
    } else {
      setFormData({
        title: '',
        description: '',
        discount: '',
        validUntil: '',
        features: [],
        isActive: true,
        iconType: 'Sparkles',
        gradient: 'from-blue-500 to-cyan-500'
      });
    }
    setFeatureInput('');
  }, [promotion, isOpen]);

  // Security check
  useEffect(() => {
    if (isOpen && !isAdmin) {
      onClose();
      toast({
        title: "Prieiga negalima",
        description: "Redaguoti akcijas gali tik administratoriai.",
        variant: "destructive"
      });
    }
  }, [isOpen, isAdmin, onClose, toast]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAddFeature = () => {
    if (featureInput.trim()) {
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, featureInput.trim()]
      }));
      setFeatureInput('');
    }
  };

  const handleRemoveFeature = (index) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = () => {
    if (!formData.title || !formData.description) {
      toast({
        title: "Trūksta duomenų",
        description: "Antraštė ir aprašymas yra privalomi.",
        variant: "destructive"
      });
      return;
    }

    const formattedData = {
      ...formData,
      discount: formData.discount ? `${formData.discount}%` : ''
    };
    onSave(formattedData);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          <div className="fixed inset-0 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="w-full max-w-2xl my-8"
            >
              <Card className="bg-gradient-to-br from-slate-900 to-slate-800 border-white/20 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-700 to-indigo-700 p-6 flex-shrink-0 border-b border-white/10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white/20 rounded-lg backdrop-blur-md">
                        <Tag className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-white">
                          {promotion ? 'Redaguoti akciją' : 'Nauja akcija'}
                        </h2>
                        <p className="text-blue-100 text-sm mt-0.5">
                          Užpildykite akcijos informaciją
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={onClose}
                      className="text-white hover:bg-white/20 rounded-full"
                    >
                      <X className="w-5 h-5" />
                    </Button>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6 overflow-y-auto custom-scrollbar bg-slate-900/50">
                  
                  {/* Status Toggle */}
                  <div className="flex items-center justify-between bg-slate-800/80 p-4 rounded-xl border border-white/10">
                    <div className="flex flex-col">
                      <span className="text-white font-medium">Akcijos būsena</span>
                      <span className="text-sm text-slate-400">Ar ši akcija matoma lankytojams?</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-sm font-bold ${formData.isActive ? 'text-green-400' : 'text-slate-500'}`}>
                        {formData.isActive ? 'AKTYVI' : 'NEAKTYVI'}
                      </span>
                      <Switch 
                        checked={formData.isActive}
                        onCheckedChange={(checked) => handleChange('isActive', checked)}
                        className="data-[state=checked]:bg-green-500"
                      />
                    </div>
                  </div>

                  {/* Basic Info */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-blue-300 mb-2">
                      <FileText className="w-5 h-5" />
                      <h3 className="text-lg font-semibold text-white">Pagrindinė informacija</h3>
                    </div>
                    
                    <div className="grid gap-5">
                      <div className="space-y-2">
                        <Label htmlFor="title" className="text-slate-300">Antraštė <span className="text-red-400">*</span></Label>
                        <Input
                          id="title"
                          value={formData.title}
                          onChange={(e) => handleChange('title', e.target.value)}
                          className="bg-slate-950 border-slate-700 text-white placeholder:text-slate-600 focus:border-blue-500 focus:ring-blue-500/20"
                          placeholder="pvz., Pavasarinis padangų keitimas"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="description" className="text-slate-300">Aprašymas <span className="text-red-400">*</span></Label>
                        <Textarea
                          id="description"
                          value={formData.description}
                          onChange={(e) => handleChange('description', e.target.value)}
                          className="bg-slate-950 border-slate-700 text-white placeholder:text-slate-600 focus:border-blue-500 focus:ring-blue-500/20 min-h-[100px]"
                          placeholder="Trumpas akcijos aprašymas, sąlygos..."
                        />
                      </div>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-blue-300 mb-2">
                      <Percent className="w-5 h-5" />
                      <h3 className="text-lg font-semibold text-white">Sąlygos ir galiojimas</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="space-y-2">
                        <Label htmlFor="discount" className="text-slate-300">Nuolaida (%)</Label>
                        <div className="relative">
                          <Input
                            id="discount"
                            type="number"
                            value={formData.discount}
                            onChange={(e) => handleChange('discount', e.target.value)}
                            className="bg-slate-950 border-slate-700 text-white placeholder:text-slate-600 focus:border-blue-500 focus:ring-blue-500/20 pl-10"
                            placeholder="15"
                          />
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-bold">%</span>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="validUntil" className="text-slate-300">Galioja iki</Label>
                        <div className="relative">
                          <Input
                            id="validUntil"
                            type="date"
                            value={formData.validUntil}
                            onChange={(e) => handleChange('validUntil', e.target.value)}
                            className="bg-slate-950 border-slate-700 text-white focus:border-blue-500 focus:ring-blue-500/20 pl-10"
                          />
                          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-blue-300 mb-2">
                      <Check className="w-5 h-5" />
                      <h3 className="text-lg font-semibold text-white">Savybės / Privalumai</h3>
                    </div>

                    <div className="space-y-3">
                      <div className="flex gap-2">
                        <Input
                          value={featureInput}
                          onChange={(e) => setFeatureInput(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleAddFeature()}
                          className="bg-slate-950 border-slate-700 text-white placeholder:text-slate-600 focus:border-blue-500 focus:ring-blue-500/20"
                          placeholder="Įrašykite privalumą ir spauskite Enter"
                        />
                        <Button 
                          onClick={handleAddFeature} 
                          type="button" 
                          className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-900/20"
                        >
                          <Plus className="h-5 w-5" />
                        </Button>
                      </div>

                      <div className="space-y-2 bg-slate-950/50 p-4 rounded-xl border border-slate-800 min-h-[120px]">
                        {formData.features.length === 0 ? (
                          <div className="flex flex-col items-center justify-center h-full py-4 text-slate-600">
                            <AlertTriangle className="w-8 h-8 mb-2 opacity-20" />
                            <p className="text-sm italic">Nėra pridėtų privalumų</p>
                          </div>
                        ) : (
                          <AnimatePresence>
                            {formData.features.map((feature, idx) => (
                              <motion.div
                                key={`${feature}-${idx}`}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, height: 0 }}
                                className="flex items-center justify-between bg-slate-800 p-3 rounded-lg border border-slate-700 group hover:border-slate-600 transition-colors"
                              >
                                <div className="flex items-center gap-3">
                                  <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                                  <span className="text-sm text-slate-200">{feature}</span>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleRemoveFeature(idx)}
                                  className="h-7 w-7 p-0 text-slate-500 hover:text-red-400 hover:bg-red-950/30 rounded-full"
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </motion.div>
                            ))}
                          </AnimatePresence>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="p-6 bg-slate-900 border-t border-slate-800 flex flex-col sm:flex-row gap-4 flex-shrink-0">
                  <Button
                    onClick={onClose}
                    variant="outline"
                    className="flex-1 border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 h-12"
                  >
                    Atšaukti
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-blue-900/40 h-12 font-medium tracking-wide"
                  >
                    <Save className="w-5 h-5 mr-2" />
                    Išsaugoti
                  </Button>
                </div>
              </Card>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default PromotionForm;