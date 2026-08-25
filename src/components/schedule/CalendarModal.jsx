import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Lock, LogOut, ShieldCheck, Edit2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import InteractiveCalendar from '@/components/schedule/InteractiveCalendar';
import AdminLoginModal from '@/components/auth/AdminLoginModal';
import BookingForm from '@/components/schedule/BookingForm';
import { useAdmin } from '@/context/AdminContext';
import { useToast } from '@/components/ui/use-toast';
import { useScheduleState } from '@/hooks/useScheduleState';

const CalendarModal = ({ isOpen, onClose }) => {
  const { isAdmin, logoutAdmin } = useAdmin();
  const { toast } = useToast();
  const { isWorkingDay, updateDayStatus, resetSchedule } = useScheduleState();
  
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  
  // Booking state
  const [selectedDate, setSelectedDate] = useState(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  const handleDayClick = (date) => {
    if (isAdmin) {
      // Toggle working status if admin
      updateDayStatus(date);
    } else {
      // Open booking if user and working day
      if (isWorkingDay(date)) {
        setSelectedDate(date);
        setIsBookingModalOpen(true);
      }
    }
  };

  const handleLogout = () => {
    logoutAdmin();
    toast({
      title: "Atsijungta",
      description: "Sėkmingai atsijungėte iš administratoriaus aplinkos."
    });
  };

  const handleReset = () => {
    if (window.confirm("Ar tikrai norite atstatyti grafiką į standartinį (I-V darbo dienos)?")) {
      resetSchedule();
      toast({
        title: "Atstatyta",
        description: "Grafikas atstatytas į standartinį režimą."
      });
    }
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
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
              transition={{ duration: 0.3 }}
              className="relative w-full max-w-5xl bg-white rounded-2xl shadow-2xl overflow-hidden z-50 max-h-[90vh] overflow-y-auto"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 md:p-6 border-b border-gray-100 bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 text-white">
                <div className="flex items-center gap-3">
                  <h2 className="text-xl md:text-2xl font-bold flex items-center gap-2">
                    {isAdmin ? "Darbo Laiko Valdymas" : "Registracija"}
                    <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full bg-blue-500/20 border border-blue-400/30 text-[10px] text-blue-200 uppercase tracking-wider font-semibold">
                      <ShieldCheck className="w-3 h-3 mr-1" />
                      Interaktyvus
                    </span>
                  </h2>
                  {isAdmin && (
                    <span className="px-2 py-0.5 rounded text-xs font-semibold bg-green-500/20 text-green-300 border border-green-500/30">
                      Admin
                    </span>
                  )}
                </div>
                
                <div className="flex items-center gap-2">
                   {/* Admin Controls */}
                   {isAdmin ? (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleLogout}
                        className="text-red-300 hover:text-white hover:bg-red-500/20 w-9 h-9"
                        title="Atsijungti"
                      >
                        <LogOut className="w-5 h-5" />
                      </Button>
                    ) : (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsLoginModalOpen(true)}
                        className="text-blue-200 hover:text-white hover:bg-white/10 w-9 h-9"
                        title="Admin Prisijungimas"
                      >
                        <Lock className="w-5 h-5" />
                      </Button>
                    )}

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={onClose}
                    className="text-gray-300 hover:text-white hover:bg-white/20 rounded-full w-9 h-9"
                  >
                    <X className="w-6 h-6" />
                  </Button>
                </div>
              </div>

              {/* Body */}
              <div className="p-4 md:p-6 bg-slate-50">
                <InteractiveCalendar
                  isWorkingDay={isWorkingDay}
                  onDayClick={handleDayClick}
                  isAdmin={isAdmin}
                  onResetSchedule={handleReset}
                />
                
                {isAdmin && (
                  <div className="mt-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200 text-sm text-yellow-800 flex items-start gap-3">
                     <Edit2 className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                     <div>
                       <p className="font-semibold">Redagavimo rėžimas</p>
                       <p>Spustelėkite bet kurią dieną, kad pakeistumėte statusą tarp "Dirbame" ir "Nedirbame". Pakeitimai išsaugomi automatiškai.</p>
                     </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AdminLoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />

      <AnimatePresence>
        {isBookingModalOpen && (
          <BookingForm 
            date={selectedDate}
            onClose={() => setIsBookingModalOpen(false)}
            onSuccess={() => {
              setIsBookingModalOpen(false);
              onClose(); 
            }}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default CalendarModal;