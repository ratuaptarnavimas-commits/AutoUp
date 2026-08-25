import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, Tag, Calendar, FileText, Plus, Percent, Check, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { useAdmin } from '@/context/AdminContext';
import { useToast } from '@/components/ui/use-toast';
import { Switch } from '@/components/ui/switch';

const EditPromotionModal = ({ isOpen, onClose, promotion, onSave, onDelete }) => {
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

  // Reset or load data when modal opens
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
        description: "Pavadinimas ir aprašymas yra privalomi.",
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

  const handleDelete = () => {
    if (onDelete && promotion) {
      onDelete(promotion);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="w-full max-w-2xl my-8"
            >
              <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-white/20 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 flex-shrink-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white/20 rounded-lg">
                        <Tag className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-white">
                          {promotion ? 'Redaguoti Akciją' : 'Nauja Akcija'}
                        </h2>
                        <p className="text-blue-100 text-sm mt-1">
                          Valdykite specialius pasiūlymus
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={onClose}
                      className="text-white hover:bg-white/20"
                    >
                      <X className="w-5 h-5" />
                    </Button>
                  </div>
                </div>

                {/* Content - Scrollable */}
                <div className="p-6 space-y-6 overflow-y-auto custom-scrollbar">
                  
                  {/* Status Toggle */}
                  <div className="flex items-center justify-between bg-slate-800/80 p-4 rounded-xl border border-slate-700">
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
                    <div className="flex items-center gap-2 text-white">
                      <FileText className="w-5 h-5 text-blue-400" />
                      <h3 className="text-lg font-semibold">Pagrindinė Informacija</h3>
                    </div>
                    
                    <div className="grid gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="title" className="text-blue-200">Pavadinimas</Label>
                        <Input
                          id="title"
                          value={formData.title}
                          onChange={(e) => handleChange('title', e.target.value)}
                          className="bg-slate-800/50 border-slate-600 text-white placeholder:text-slate-500 focus:border-blue-400"
                          placeholder="pvz., Žieminė akcija"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="description" className="text-blue-200">Aprašymas</Label>
                        <Textarea
                          id="description"
                          value={formData.description}
                          onChange={(e) => handleChange('description', e.target.value)}
                          className="bg-slate-800/50 border-slate-600 text-white placeholder:text-slate-500 focus:border-blue-400 min-h-[80px]"
                          placeholder="Trumpas akcijos aprašymas..."
                        />
                      </div>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-white">
                      <Percent className="w-5 h-5 text-blue-400" />
                      <h3 className="text-lg font-semibold">Sąlygos</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="discount" className="text-blue-200">Nuolaida (%)</Label>
                        <div className="relative">
                          <Input
                            id="discount"
                            type="number"
                            value={formData.discount}
                            onChange={(e) => handleChange('discount', e.target.value)}
                            className="bg-slate-800/50 border-slate-600 text-white placeholder:text-slate-500 focus:border-blue-400 pl-10"
                            placeholder="15"
                          />
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">%</span>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="validUntil" className="text-blue-200">Galioja iki</Label>
                        <div className="relative">
                          <Input
                            id="validUntil"
                            type="date"
                            value={formData.validUntil}
                            onChange={(e) => handleChange('validUntil', e.target.value)}
                            className="bg-slate-800/50 border-slate-600 text-white focus:border-blue-400 pl-10"
                          />
                          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-white">
                      <Check className="w-5 h-5 text-blue-400" />
                      <h3 className="text-lg font-semibold">Privalumai</h3>
                    </div>

                    <div className="space-y-3">
                      <div className="flex gap-2">
                        <Input
                          value={featureInput}
                          onChange={(e) => setFeatureInput(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleAddFeature()}
                          className="bg-slate-800/50 border-slate-600 text-white placeholder:text-slate-500 focus:border-blue-400"
                          placeholder="Įrašykite privalumą ir spauskite Enter"
                        />
                        <Button 
                          onClick={handleAddFeature} 
                          type="button" 
                          className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="space-y-2 bg-slate-900/50 p-3 rounded-lg border border-slate-700/50 min-h-[100px]">
                        {formData.features.length === 0 && (
                          <p className="text-slate-500 text-sm text-center py-4 italic">Nėra pridėtų privalumų</p>
                        )}
                        <AnimatePresence>
                          {formData.features.map((feature, idx) => (
                            <motion.div
                              key={`${feature}-${idx}`}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, height: 0 }}
                              className="flex items-center justify-between bg-slate-800 p-2 rounded border border-slate-700 group"
                            >
                              <div className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
                                <span className="text-sm text-slate-200">{feature}</span>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleRemoveFeature(idx)}
                                className="h-6 w-6 p-0 text-slate-500 hover:text-red-400 hover:bg-red-900/20"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </motion.div>
                          ))}
                        </AnimatePresence>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="p-6 bg-slate-900/80 border-t border-slate-700 flex flex-col sm:flex-row gap-3 flex-shrink-0">
                  {promotion && (
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={handleDelete}
                      className="flex-1 sm:flex-none sm:w-auto bg-red-900/30 hover:bg-red-900/50 text-red-400 border border-red-900/50"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Ištrinti
                    </Button>
                  )}
                  <div className="flex flex-1 gap-3">
                    <Button
                      onClick={onClose}
                      variant="outline"
                      className="flex-1 border-slate-600 text-slate-300 hover:text-white hover:bg-slate-800"
                    >
                      Atšaukti
                    </Button>
                    <Button
                      onClick={handleSubmit}
                      className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white shadow-lg shadow-blue-500/20"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Išsaugoti
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default EditPromotionModal;