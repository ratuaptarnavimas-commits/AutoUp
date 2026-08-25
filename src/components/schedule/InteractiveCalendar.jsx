import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Clock, XCircle, CalendarCheck, RotateCcw, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useWorkSchedule } from '@/hooks/useWorkSchedule';

const InteractiveCalendar = ({ 
  onDayClick, // For booking
  isAdmin = false,
  readOnly = false
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  // Use the hook
  const { 
    isWorkingDay, 
    toggleDay, 
    fetchWorkSchedule, 
    loading 
  } = useWorkSchedule();

  // Fetch data when month changes
  useEffect(() => {
    fetchWorkSchedule(currentDate);
  }, [currentDate, fetchWorkSchedule]);

  const months = [
    'Sausis', 'Vasaris', 'Kovas', 'Balandis', 'Gegužė', 'Birželis',
    'Liepa', 'Rugpjūtis', 'Rugsėjis', 'Spalis', 'Lapkritis', 'Gruodis'
  ];

  const weekDays = ['Pr', 'An', 'Tr', 'Kt', 'Pn', 'Št', 'Sk'];

  const handleDayInteraction = (date) => {
    if (isAdmin) {
      // Toggle the specific date directly
      toggleDay(date);
    } else if (onDayClick) {
      // User booking mode
      onDayClick(date);
    }
  };

  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  
  const getFirstDayOfMonth = (year, month) => {
    const day = new Date(year, month, 1).getDay();
    return day === 0 ? 6 : day - 1; // Convert Sunday=0 to Monday=0
  };

  const handlePrevMonth = (e) => {
    e.stopPropagation();
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const handleNextMonth = (e) => {
    e.stopPropagation();
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const renderCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    const days = [];

    // Empty cells
    for (let i = 0; i < firstDay; i++) {
      days.push(
        <div key={`empty-${i}`} className="hidden lg:block h-32 bg-slate-50/50 rounded-xl border border-transparent"></div>
      );
    }

    // Days cells
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const isWorking = isWorkingDay(date);
      const isToday = date.toDateString() === new Date().toDateString();
      
      const dayIndex = date.getDay() === 0 ? 6 : date.getDay() - 1;
      const dayName = weekDays[dayIndex];

      const isInteractive = isAdmin || (!readOnly && isWorking);
      const isPast = date < new Date().setHours(0,0,0,0);
      
      // Disable interaction for past dates unless admin
      const isDisabled = (!isAdmin && isPast) || (!isAdmin && !isWorking);

      days.push(
        <motion.div
          key={day}
          whileHover={!isDisabled ? { scale: 1.02, y: -2 } : {}}
          whileTap={!isDisabled ? { scale: 0.98 } : {}}
          onClick={() => !isDisabled && handleDayInteraction(date)}
          className={cn(
            "relative min-h-[110px] md:min-h-[140px] p-4 md:p-6 rounded-xl border transition-all shadow-sm flex flex-col justify-between overflow-hidden",
            isDisabled ? "cursor-default opacity-60 grayscale-[0.5]" : "cursor-pointer hover:shadow-md",
            isWorking 
              ? "bg-emerald-50 border-emerald-200 hover:border-emerald-300" 
              : "bg-red-50 border-red-200 hover:border-red-300",
            isToday && "ring-2 ring-blue-500 ring-offset-2"
          )}
        >
          <div className="flex justify-between items-start">
            <div className="flex flex-col">
              <span className="lg:hidden text-xs font-bold text-slate-400 uppercase mb-1">{dayName}</span>
              <span className={cn(
                "text-2xl md:text-3xl font-bold",
                isWorking ? "text-emerald-800" : "text-red-800/70"
              )}>
                {day}
              </span>
            </div>
            {isToday && (
              <span className="text-[10px] md:text-xs uppercase font-bold text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                Šiandien
              </span>
            )}
          </div>
          
          <div className="mt-3 md:mt-auto">
            {isWorking ? (
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-1.5 text-emerald-700">
                  {isAdmin ? (
                    <Clock className="w-4 h-4 md:w-5 md:h-5" />
                  ) : (
                    <CalendarCheck className="w-4 h-4 md:w-5 md:h-5 text-blue-600" />
                  )}
                  <span className="text-sm md:text-base font-bold">
                    {isAdmin ? "Dirbame" : "Registruotis"}
                  </span>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 text-red-400 md:mb-2 opacity-80">
                <XCircle className="w-4 h-4 md:w-5 md:h-5" />
                <span className="text-sm md:text-base font-bold">Nedirbame</span>
              </div>
            )}
          </div>
        </motion.div>
      );
    }
    return days;
  };

  return (
    <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm border border-gray-100 relative min-h-[400px]">
      {loading && (
        <div className="absolute inset-0 bg-white/80 z-20 flex items-center justify-center rounded-xl backdrop-blur-sm">
           <div className="flex flex-col items-center gap-3">
             <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
             <p className="text-sm text-slate-500 font-medium">Atnaujinamas grafikas...</p>
           </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <h3 className="text-2xl md:text-3xl font-bold text-slate-800 capitalize flex items-center gap-2">
            {months[currentDate.getMonth()]} 
            <span className="text-slate-400 font-normal">{currentDate.getFullYear()}</span>
          </h3>
        </div>
        
        <div className="flex items-center gap-2 self-end md:self-auto">
          {isAdmin && (
            <div className="hidden md:flex items-center text-xs text-slate-500 mr-2 bg-slate-50 px-3 py-1.5 rounded-full border">
              <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2"></span>
              Dirbame
              <span className="w-2 h-2 rounded-full bg-red-400 mx-2"></span>
              Nedirbame
            </div>
          )}
          
          <div className="flex items-center bg-slate-100 rounded-lg p-1">
            <Button variant="ghost" size="icon" onClick={handlePrevMonth} className="h-8 w-8 hover:bg-white rounded-md">
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleNextMonth} className="h-8 w-8 hover:bg-white rounded-md">
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Weekday headers */}
      <div className="hidden lg:grid grid-cols-7 gap-4 mb-3">
        {weekDays.map(day => (
          <div key={day} className="text-center text-sm font-semibold text-slate-400 py-2">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-3 md:gap-4">
        <AnimatePresence mode='popLayout'>
          {renderCalendarDays()}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default InteractiveCalendar;