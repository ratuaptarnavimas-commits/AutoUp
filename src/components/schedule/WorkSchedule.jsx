import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, ChevronDown, ChevronUp, Edit2, CheckCircle2, XCircle, Lock, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useScheduleState } from '@/hooks/useScheduleState';
import { useAdmin } from '@/context/AdminContext';
import EditScheduleModal from '@/components/schedule/EditScheduleModal';
import AdminLoginModal from '@/components/auth/AdminLoginModal';
import CalendarView from '@/components/schedule/CalendarView';
import { useToast } from '@/components/ui/use-toast';

const WorkSchedule = () => {
  const { schedule, isWorkingDay } = useScheduleState();
  const { isAdmin, logoutAdmin } = useAdmin();
  const { toast } = useToast();
  
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // Hardcoded 'Today' to match the scenario context (2026-01-17)
  const TODAY = new Date('2026-01-17');
  const isTodayWorking = isWorkingDay(TODAY);

  const handleEditClick = (e) => {
    e.stopPropagation();
    if (isAdmin) {
      setIsEditModalOpen(true);
    } else {
      setIsLoginModalOpen(true);
    }
  };

  const handleLogout = (e) => {
    e.stopPropagation();
    logoutAdmin();
    toast({
      title: "Atsijungta",
      description: "Sėkmingai atsijungėte iš administratoriaus aplinkos."
    });
  };

  return (
    <>
      <section className="relative z-20 -mb-6 px-4 pt-4">
        <div className="container mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="overflow-hidden bg-white/95 backdrop-blur-md border-white/20 shadow-xl ring-1 ring-black/5">
              {/* Header / Collapsed View */}
              <div 
                onClick={() => setIsExpanded(!isExpanded)}
                className="bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 p-4 cursor-pointer hover:bg-slate-800 transition-colors group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-white/10 rounded-lg group-hover:bg-white/20 transition-colors">
                      <Calendar className="w-6 h-6 text-white" />
                    </div>
                    
                    <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-4">
                      <h2 className="text-lg font-bold text-white">
                        Darbo Laikas
                      </h2>
                      {!isExpanded && (
                        <div className="flex items-center gap-2 text-sm">
                          <span className="hidden md:inline text-white/40">|</span>
                          <span className="text-blue-100">Šiandien:</span>
                          {isTodayWorking ? (
                            <span className="text-green-400 font-medium flex items-center gap-1">
                              <CheckCircle2 className="w-4 h-4" /> Atidaryta ({schedule.startTime}-{schedule.endTime})
                            </span>
                          ) : (
                            <span className="text-red-400 font-medium flex items-center gap-1">
                              <XCircle className="w-4 h-4" /> Uždaryta
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {/* Admin Controls in Header */}
                    {isAdmin ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleLogout}
                        className="text-red-300 hover:text-red-100 hover:bg-red-500/20 mr-2"
                        title="Atsijungti"
                      >
                        <LogOut className="w-4 h-4" />
                      </Button>
                    ) : (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsLoginModalOpen(true);
                        }}
                        className="text-slate-400 hover:text-white hover:bg-white/10 mr-2"
                        title="Admin Prisijungimas"
                      >
                        <Lock className="w-4 h-4" />
                      </Button>
                    )}

                    <span className="text-sm text-blue-200 hidden sm:block">
                      {isExpanded ? 'Suskleisti' : 'Išskleisti'}
                    </span>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="text-white hover:bg-white/20 rounded-full w-8 h-8"
                    >
                      {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </Button>
                  </div>
                </div>
              </div>

              {/* Expanded Content */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    <div className="p-4 md:p-6 bg-slate-50">
                      <CalendarView 
                        schedule={schedule}
                        isWorkingDay={isWorkingDay}
                        onCellClick={() => isAdmin && setIsEditModalOpen(true)}
                        readOnly={!isAdmin}
                      />
                      
                      {isAdmin && (
                        <div className="flex justify-end px-2 pb-2 pt-6">
                          <Button
                            onClick={handleEditClick}
                            className="bg-slate-800 text-white hover:bg-slate-700"
                          >
                            <Edit2 className="w-4 h-4 mr-2" />
                            Redaguoti grafiką
                          </Button>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          </motion.div>
        </div>
      </section>

      <EditScheduleModal 
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
      />

      <AdminLoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
    </>
  );
};

export default WorkSchedule;