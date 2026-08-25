import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Sparkles, Zap, Star, Edit2, Trash2, Plus, Calendar, Settings, Lock } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useAdmin } from '@/context/AdminContext';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import EditPromotionModal from '@/components/promotions/EditPromotionModal';
import AdminLoginModal from '@/components/auth/AdminLoginModal';

// Default promotions data - Empty by default as requested
const defaultPromotions = [];

const iconMap = {
  Sparkles: Sparkles,
  Zap: Zap,
  Star: Star
};

const PromotionsSection = () => {
  const { toast } = useToast();
  const { isAdmin, markPromotionAsDeleted, isPromotionDeleted } = useAdmin();
  const [promotions, setPromotions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Modal states
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [currentPromotion, setCurrentPromotion] = useState(null);
  
  // Load from localStorage on mount
  useEffect(() => {
    const savedPromotions = localStorage.getItem('autoup_promotions');
    if (savedPromotions) {
      try {
        const parsed = JSON.parse(savedPromotions);
        // Ensure isActive property exists on older data
        const normalized = parsed.map(p => ({ ...p, isActive: p.isActive !== undefined ? p.isActive : true }));
        setPromotions(normalized);
      } catch (e) {
        console.error("Failed to parse promotions from localStorage");
        setPromotions(defaultPromotions);
      }
    } else {
      setPromotions(defaultPromotions);
    }
    setIsLoading(false);
  }, []);

  const saveToLocalStorage = (newPromotions) => {
    localStorage.setItem('autoup_promotions', JSON.stringify(newPromotions));
    setPromotions(newPromotions);
  };

  const handleContactClick = () => {
    const contactElement = document.getElementById('kontaktai');
    if (contactElement) {
      contactElement.scrollIntoView({ behavior: 'smooth' });
    } else {
      toast({
        title: "Navigacija",
        description: "Grįžkite į pagrindinį puslapį, kad susisiekite su mumis",
      });
    }
  };

  // ADD/EDIT HANDLERS
  const openAddModal = () => {
    setCurrentPromotion(null);
    setIsEditModalOpen(true);
  };

  const openEditModal = (promotion) => {
    setCurrentPromotion(promotion);
    setIsEditModalOpen(true);
  };

  const handleSavePromotion = (formData) => {
    let newPromotions;
    if (currentPromotion) {
      // Edit existing
      newPromotions = promotions.map(p => 
        p.id === currentPromotion.id ? { ...formData, id: currentPromotion.id } : p
      );
      toast({
        title: "Atnaujinta!",
        description: "Akcija sėkmingai atnaujinta.",
      });
    } else {
      // Add new
      const newPromotion = {
        ...formData,
        id: Date.now(),
        // Assign a random gradient/icon if not set
        iconType: formData.iconType || 'Sparkles',
        gradient: formData.gradient || 'from-blue-500 to-cyan-500' 
      };
      newPromotions = [...promotions, newPromotion];
      toast({
        title: "Sėkmė!",
        description: "Nauja akcija sėkmingai pridėta.",
      });
    }

    saveToLocalStorage(newPromotions);
    setIsEditModalOpen(false);
  };

  const togglePromotionStatus = (id, currentStatus) => {
    const newPromotions = promotions.map(p => 
      p.id === id ? { ...p, isActive: !currentStatus } : p
    );
    saveToLocalStorage(newPromotions);
    toast({
      title: !currentStatus ? "Aktyvuota" : "Deaktyvuota",
      description: `Akcija ${!currentStatus ? 'jau matoma' : 'paslėpta nuo'} lankytojų.`,
      variant: !currentStatus ? "default" : "secondary"
    });
  };

  // DELETE PROMOTION HANDLERS
  const openDeleteModal = (promotion) => {
    setCurrentPromotion(promotion);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteSubmit = () => {
    if (currentPromotion) {
      // Use AdminContext to mark as deleted instead of removing from local state
      markPromotionAsDeleted(currentPromotion.id);
      setIsDeleteModalOpen(false);
      toast({
        title: "Ištrinta!",
        description: "Akcija sėkmingai pašalinta.",
      });
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  // Filter out deleted promotions for both Admin and User views
  const visiblePromotions = promotions.filter(p => !isPromotionDeleted(p.id));
  
  // Further filter for active promotions (User view only)
  const activePromotions = visiblePromotions.filter(p => p.isActive);

  return (
    <section id="akcijos" className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 pb-20 pt-20">
        
        {/* Admin Dashboard Header if Admin */}
        {isAdmin && (
          <div className="bg-slate-900/80 backdrop-blur-md border-b border-white/10 sticky top-[72px] z-30 shadow-2xl mb-8">
            <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-600/20 rounded-lg">
                  <Settings className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Akcijų valdymas</h2>
                  <p className="text-sm text-slate-400">Valdykite matomus pasiūlymus</p>
                </div>
              </div>
              <Button 
                onClick={openAddModal}
                className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-900/20"
              >
                <Plus className="w-5 h-5 mr-2" />
                Pridėti naują akciją
              </Button>
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <div className="max-w-7xl mx-auto px-4 py-8">
          
          {isAdmin ? (
            /* ADMIN VIEW - List/Table Mode */
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
                <div className="p-6 border-b border-white/10">
                  <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-yellow-400" />
                    Visos akcijos ({visiblePromotions.length})
                  </h3>
                </div>
                
                {visiblePromotions.length === 0 ? (
                  <div className="p-12 text-center text-slate-400">
                    <p className="text-lg mb-4">Sąrašas tuščias</p>
                    <Button onClick={openAddModal} variant="outline" className="border-slate-700">Pradėti</Button>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-white/5 bg-white/5 text-slate-300 text-sm uppercase tracking-wider">
                          <th className="p-4 font-medium">Pavadinimas</th>
                          <th className="p-4 font-medium hidden md:table-cell">Aprašymas</th>
                          <th className="p-4 font-medium">Galiojimas</th>
                          <th className="p-4 font-medium text-center">Būsena</th>
                          <th className="p-4 font-medium text-right">Veiksmai</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {visiblePromotions.map((promo) => (
                          <tr key={promo.id} className="hover:bg-white/5 transition-colors group">
                            <td className="p-4">
                              <div className="flex flex-col">
                                <span className="font-bold text-white text-base">{promo.title}</span>
                                {promo.discount && (
                                  <span className="text-xs font-bold text-green-400 bg-green-900/20 px-2 py-0.5 rounded-full w-fit mt-1">
                                    -{promo.discount}
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="p-4 hidden md:table-cell">
                              <p className="text-slate-400 text-sm line-clamp-2 max-w-xs">{promo.description}</p>
                            </td>
                            <td className="p-4">
                              <div className="flex items-center gap-2 text-slate-300 text-sm">
                                <Calendar className="w-4 h-4 text-slate-500" />
                                {promo.validUntil || <span className="text-slate-600 italic">Neterminuota</span>}
                              </div>
                            </td>
                            <td className="p-4 text-center">
                              <div className="flex justify-center">
                                <Switch
                                  checked={promo.isActive}
                                  onCheckedChange={() => togglePromotionStatus(promo.id, promo.isActive)}
                                  className="data-[state=checked]:bg-green-500"
                                />
                              </div>
                            </td>
                            <td className="p-4 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-8 w-8 p-0 text-blue-400 hover:text-blue-300 hover:bg-blue-900/30"
                                  onClick={() => openEditModal(promo)}
                                >
                                  <Edit2 className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-8 w-8 p-0 text-red-400 hover:text-red-300 hover:bg-red-900/30"
                                  onClick={() => openDeleteModal(promo)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </motion.div>
          ) : (
            /* USER VIEW - Cards Grid */
            <>
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center mb-16 pt-8"
              >
                <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight">
                  Mūsų <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">Akcijos</span>
                </h2>
                <p className="text-xl text-blue-100 max-w-2xl mx-auto font-light">
                  Pasinaudokite mūsų specialiais pasiūlymais ratų montavimui, balansavimui ir remontui.
                </p>
                
                {/* Admin login shortcut for convenience */}
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setIsLoginModalOpen(true)}
                  className="mt-8 text-slate-600 hover:text-slate-400 hover:bg-transparent"
                >
                  <Lock className="w-3 h-3 mr-1" />
                  Administratoriaus prisijungimas
                </Button>
              </motion.div>

              {isLoading ? (
                <div className="flex justify-center py-20">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
                </div>
              ) : activePromotions.length === 0 ? (
                <div className="text-center py-24 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm max-w-2xl mx-auto">
                  <Sparkles className="w-16 h-16 text-blue-300 mx-auto mb-4 opacity-50" />
                  <p className="text-xl text-blue-200 mb-2 font-semibold">Nėra aktyvių akcijų</p>
                  <p className="text-slate-400">Užsukite pas mus vėliau arba susisiekite telefonu!</p>
                </div>
              ) : (
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
                >
                  <AnimatePresence>
                    {activePromotions.map((promo) => {
                      const Icon = iconMap[promo.iconType] || Sparkles;
                      return (
                        <motion.div key={promo.id} variants={itemVariants} layout className="h-full">
                          <Card className="h-full bg-slate-900/60 backdrop-blur-xl border-white/10 hover:bg-slate-800/80 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-900/20 relative group flex flex-col justify-between overflow-hidden rounded-2xl">
                            
                            {/* Gradient Glow Effect */}
                            <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${promo.gradient || 'from-blue-500 to-cyan-500'}`} />

                            <CardHeader className="relative z-10 pt-8 pb-4">
                              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${promo.gradient || 'from-blue-500 to-cyan-500'} flex items-center justify-center mb-5 shadow-lg shadow-blue-900/20 group-hover:scale-110 transition-transform duration-300`}>
                                <Icon className="w-7 h-7 text-white" />
                              </div>
                              <CardTitle className="text-white text-2xl font-bold tracking-tight group-hover:text-blue-200 transition-colors">
                                {promo.title}
                              </CardTitle>
                              <CardDescription className="text-slate-400 text-base mt-3 leading-relaxed">
                                {promo.description}
                              </CardDescription>
                            </CardHeader>
                            
                            <CardContent className="relative z-10 flex-grow pb-4">
                              <div className="mb-6 flex items-center gap-4">
                                {promo.discount && (
                                  <span className={`text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r ${promo.gradient || 'from-blue-500 to-cyan-500'}`}>
                                    -{promo.discount}
                                  </span>
                                )}
                                {promo.validUntil && (
                                  <div className="flex items-center gap-1.5 bg-slate-950/50 px-3 py-1.5 rounded-full border border-white/10 mt-2">
                                    <Calendar className="w-3.5 h-3.5 text-blue-400" />
                                    <span className="text-blue-200 text-xs font-medium">
                                      Iki {promo.validUntil}
                                    </span>
                                  </div>
                                )}
                              </div>
                              
                              <div className="bg-slate-950/40 rounded-xl p-5 border border-white/5">
                                {promo.features && promo.features.length > 0 ? (
                                  <ul className="space-y-3">
                                    {promo.features.map((feature, idx) => (
                                      <li key={idx} className="flex items-start gap-3 text-slate-300">
                                        <div className="mt-1 bg-green-500/20 p-1 rounded-full flex-shrink-0">
                                          <Check className="w-3 h-3 text-green-400" />
                                        </div>
                                        <span className="text-sm font-medium leading-tight">{feature}</span>
                                      </li>
                                    ))}
                                  </ul>
                                ) : (
                                  <p className="text-slate-500 text-sm italic">Daugiau informacijos telefonu.</p>
                                )}
                              </div>
                            </CardContent>
                            
                            <CardFooter className="pt-4 pb-8">
                              <Button 
                                onClick={handleContactClick}
                                className="w-full h-12 text-base font-semibold bg-white/10 hover:bg-white/20 text-white border border-white/10 transition-all hover:scale-[1.02] active:scale-95 rounded-xl"
                              >
                                Pasinaudoti akcija
                              </Button>
                            </CardFooter>
                          </Card>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </motion.div>
              )}
            </>
          )}

        </div>

      {/* --- MODALS --- */}

      {/* ADD/EDIT MODAL */}
      <EditPromotionModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        promotion={currentPromotion}
        onSave={handleSavePromotion}
        onDelete={() => {
          setIsEditModalOpen(false);
          openDeleteModal(currentPromotion);
        }}
      />

      {/* DELETE MODAL */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent className="sm:max-w-[400px] bg-slate-900 border-slate-700 text-white shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-red-400 flex items-center gap-2 text-xl">
              <Trash2 className="w-6 h-6" />
              Ištrinti akciją?
            </DialogTitle>
          </DialogHeader>
          <div className="py-6">
            <p className="text-slate-300 text-base leading-relaxed">
              Ar tikrai norite ištrinti akciją <span className="text-white font-bold mx-1">"{currentPromotion?.title}"</span>? 
              <br/>
              <span className="text-red-400/80 text-sm mt-2 block font-medium flex items-center gap-1">
                <Settings className="w-3 h-3" /> Akcija bus paslėpta, bet ne visiškai pašalinta.
              </span>
            </p>
          </div>
          <DialogFooter className="gap-3 sm:gap-0">
            <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)} className="border-slate-600 text-slate-300 hover:text-white hover:bg-slate-800">
              Atšaukti
            </Button>
            <Button onClick={handleDeleteSubmit} variant="destructive" className="bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-900/20">
              Ištrinti
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ADMIN LOGIN MODAL */}
      <AdminLoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
    </section>
  );
};

export default PromotionsSection;