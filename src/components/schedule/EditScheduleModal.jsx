import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Lock, Calendar, Clock, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { useScheduleState } from '@/hooks/useScheduleState';

const EditScheduleModal = ({ isOpen, onClose }) => {
  const { schedule } = useScheduleState();
  
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
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="w-full max-w-2xl"
            >
              <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-white/20 shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-red-900/80 to-slate-900 p-6 border-b border-red-500/30">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-red-500/20 rounded-lg border border-red-500/30">
                        <Lock className="w-6 h-6 text-red-200" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-white">
                          Grafikas Užrakintas
                        </h2>
                        <p className="text-red-200 text-sm mt-1 flex items-center gap-1">
                           <AlertTriangle className="w-3 h-3" />
                           Nuolatinis metinis tvarkaraštis
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

                {/* Content */}
                <div className="p-8 space-y-8 relative">
                   {/* Overlay to prevent interaction (though inputs are readOnly anyway) */}
                   <div className="absolute inset-0 z-10 bg-slate-900/10 pointer-events-none"></div>

                  {/* Schedule Pattern */}
                  <div className="space-y-4 opacity-75 grayscale-[0.3]">
                    <div className="flex items-center gap-2 text-white">
                      <Calendar className="w-5 h-5 text-slate-400" />
                      <h3 className="text-lg font-semibold">Grafiko Modelis (2026)</h3>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-slate-300">
                          Darbo dienų ciklas
                        </Label>
                        <Input
                          value="3 dienos"
                          readOnly
                          className="bg-black/30 border-white/10 text-slate-400 cursor-not-allowed"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-slate-300">
                          Laisvų dienų ciklas
                        </Label>
                        <Input
                          value="3 dienos"
                          readOnly
                          className="bg-black/30 border-white/10 text-slate-400 cursor-not-allowed"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Working Hours */}
                  <div className="space-y-4 opacity-75 grayscale-[0.3]">
                    <div className="flex items-center gap-2 text-white">
                      <Clock className="w-5 h-5 text-slate-400" />
                      <h3 className="text-lg font-semibold">Nustatytas Darbo Laikas</h3>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-slate-300">Pradžia</Label>
                        <Input
                          value={schedule.startTime}
                          readOnly
                          className="bg-black/30 border-white/10 text-slate-400 cursor-not-allowed"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-slate-300">Pabaiga</Label>
                        <Input
                          value={schedule.endTime}
                          readOnly
                          className="bg-black/30 border-white/10 text-slate-400 cursor-not-allowed"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Info Box */}
                  <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 flex items-start gap-3">
                    <Lock className="w-5 h-5 text-slate-400 mt-0.5 shrink-0" />
                    <p className="text-sm text-slate-400 leading-relaxed">
                      Šis grafikas yra sugeneruotas visiems 2026 metams ir negali būti redaguojamas. 
                      Sistema automatiškai taiko 3 darbo / 3 laisvų dienų ciklą nuo Sausio 17 d.
                    </p>
                  </div>
                </div>

                {/* Footer */}
                <div className="p-6 bg-slate-950/30 border-t border-white/5 flex justify-end">
                  <Button
                    onClick={onClose}
                    className="bg-slate-700 hover:bg-slate-600 text-white min-w-[120px]"
                  >
                    Uždaryti
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

export default EditScheduleModal;