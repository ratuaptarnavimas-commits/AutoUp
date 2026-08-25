import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Lock, KeyRound, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { useAdmin } from '@/context/AdminContext';
import { useToast } from '@/components/ui/use-toast';

const AdminLoginModal = ({ isOpen, onClose }) => {
  const { loginAdmin } = useAdmin();
  const { toast } = useToast();
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const success = loginAdmin(password);
    
    if (success) {
      toast({
        title: "Sėkmingai prisijungta",
        description: "Dabar turite administratoriaus teises.",
        variant: "default",
      });
      setPassword('');
      setError(false);
      onClose();
    } else {
      setError(true);
      toast({
        title: "Klaida",
        description: "Neteisingas slaptažodis.",
        variant: "destructive",
      });
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop - handles click outside */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={onClose}
          >
            {/* Modal Content - stop propagation to prevent closing when clicking inside */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="w-full max-w-md relative"
              onClick={(e) => e.stopPropagation()}
            >
              <Card className="bg-white/95 backdrop-blur shadow-2xl overflow-hidden border-slate-200">
                <div className="bg-slate-900 p-6 text-center relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-500"></div>
                  <div className="relative z-10 flex flex-col items-center gap-3">
                    <div className="p-3 bg-white/10 rounded-full">
                      <Lock className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-xl font-bold text-white">Administratoriaus Prisijungimas</h2>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={onClose}
                    className="absolute top-4 right-4 text-white/50 hover:text-white hover:bg-white/10"
                    aria-label="Uždaryti"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="password">Slaptažodis</Label>
                    <div className="relative">
                      <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value);
                          setError(false);
                        }}
                        className={`pl-9 ${error ? 'border-red-500 ring-red-200' : ''}`}
                        placeholder="Įveskite slaptažodį..."
                        autoFocus
                      />
                    </div>
                    {error && (
                      <p className="text-xs text-red-500 font-medium ml-1">
                        Neteisingas slaptažodis. Bandykite dar kartą.
                      </p>
                    )}
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-slate-900 hover:bg-slate-800 text-white"
                  >
                    <LogIn className="w-4 h-4 mr-2" />
                    Prisijungti
                  </Button>
                </form>
              </Card>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AdminLoginModal;