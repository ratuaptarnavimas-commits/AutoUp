import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Lock, KeyRound, Mail, LogIn, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { useAdmin } from '@/context/AdminContext';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/customSupabaseClient';

const AdminLoginModal = ({ isOpen, onClose }) => {
  const { loginAdmin } = useAdmin();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isResetMode, setIsResetMode] = useState(false);
  const [isSendingReset, setIsSendingReset] = useState(false);
  const [error, setError] = useState(false);
  const [resetMessage, setResetMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await loginAdmin(email, password);
    
    if (success) {
      toast({
        title: "Sėkmingai prisijungta",
        description: "Dabar turite administratoriaus teises.",
        variant: "default",
      });
      setEmail('');
      setPassword('');
      setError(false);
      onClose();
    } else {
      setError(true);
      toast({
        title: "Klaida",
        description: "Neteisingas el. paštas arba slaptažodis.",
        variant: "destructive",
      });
    }
  };

  const handlePasswordReset = async (event) => {
    event.preventDefault();
    if (!email.trim()) {
      setError(true);
      setResetMessage('Įrašykite administratoriaus el. paštą.');
      return;
    }

    setIsSendingReset(true);
    setResetMessage('');
    let resetError;
    try {
      ({ error: resetError } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: 'https://www.autoup.lt/',
      }));
    } catch (error) {
      resetError = error;
    }
    setIsSendingReset(false);

    if (resetError) {
      const message = resetError.message || 'Supabase serveris nepasiekiamas.';
      setResetMessage(`Nepavyko išsiųsti: ${message}`);
      toast({
        title: 'Atkūrimas nepavyko',
        description: message,
        variant: 'destructive',
      });
      return;
    }

    toast({
      title: 'Laiškas išsiųstas',
      description: 'Patikrinkite el. paštą ir sekite slaptažodžio atkūrimo nuorodą.',
    });
    setResetMessage('Atkūrimo laiškas išsiųstas. Patikrinkite Inbox ir Spam aplankus.');
    setIsResetMode(false);
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

                <form onSubmit={isResetMode ? handlePasswordReset : handleSubmit} className="p-6 space-y-4 text-slate-900">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-slate-700">Administratoriaus el. paštas</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          setError(false);
                            setResetMessage('');
                        }}
                        className="pl-9 bg-white text-slate-900 border-slate-300 placeholder:text-slate-400"
                        placeholder="admin@autoup.lt"
                        autoFocus
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    {!isResetMode && <Label htmlFor="password" className="text-slate-700">Slaptažodis</Label>}
                    {!isResetMode && <div className="relative">
                      <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value);
                          setError(false);
                        }}
                        className={`pl-9 pr-10 bg-white text-slate-900 border-slate-300 placeholder:text-slate-400 ${error ? 'border-red-500 ring-red-200' : ''}`}
                        placeholder="Įveskite slaptažodį..."
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((visible) => !visible)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-900"
                        aria-label={showPassword ? 'Slėpti slaptažodį' : 'Rodyti slaptažodį'}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>}
                    {error && !isResetMode && (
                      <p className="text-xs text-red-500 font-medium ml-1">
                        Neteisingas el. paštas arba slaptažodis. Bandykite dar kartą.
                      </p>
                    )}
                    {isResetMode && resetMessage && (
                      <p className={`text-xs font-medium ${resetMessage.startsWith('Nepavyko') ? 'text-red-600' : 'text-green-700'}`}>
                        {resetMessage}
                      </p>
                    )}
                  </div>

                  <Button
                    type="submit" 
                    className="w-full bg-slate-900 hover:bg-slate-800 text-white"
                    disabled={isSendingReset}
                  >
                    {isResetMode ? 'Siųsti atkūrimo laišką' : <><LogIn className="w-4 h-4 mr-2" />Prisijungti</>}
                  </Button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsResetMode((resetMode) => !resetMode);
                      setError(false);
                    }}
                    className="flex items-center justify-center gap-1 w-full text-sm text-slate-600 hover:text-slate-900"
                  >
                    {isResetMode ? <><ArrowLeft className="h-4 w-4" /> Grįžti į prisijungimą</> : 'Pamiršau slaptažodį'}
                  </button>
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