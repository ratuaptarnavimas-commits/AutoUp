import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, MapPin, Menu, Tag, Calendar, CheckCircle2, XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useScheduleState } from '@/hooks/useScheduleState';
import CalendarModal from '@/components/schedule/CalendarModal';
import { cn } from '@/lib/utils';

const Header = () => {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const { schedule, isWorkingDay } = useScheduleState();
  
  // Use specific date for scenario consistency (Jan 18, 2026 as per prompt context)
  // In a real app, this would be new Date()
  const TODAY = new Date('2026-01-18');
  const isTodayWorking = isWorkingDay(TODAY);

  const linkStyles = {
    fontWeight: '600',
    color: 'white',
    transition: 'all 0.3s ease',
    padding: '8px 16px',
    borderRadius: '0.5rem',
  };

  return (
    <>
      <motion.header
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative overflow-hidden bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-sm border-b border-white/10"
      >
        <div className={`absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30`}></div>
        
        <div className="container mx-auto px-4 py-6 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-center space-x-3"
            >
              <Link to="/" className="flex items-center space-x-3 group">
                 <img 
                   src="https://horizons-cdn.hostinger.com/f533b165-5105-4cde-bbbe-298474d58916/5b852305d247944fec4fdbb3c6ba6334.png" 
                   alt="AutoUp Logo - Drive Forward" 
                   className="h-16 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
                 />
              </Link>
            </motion.div>

            <motion.nav
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-4 text-white"
            >
              {/* Compact Schedule Button with Warm Gradient */}
              <button
                onClick={() => setIsCalendarOpen(true)}
                className={cn(
                  "flex items-center gap-2 px-5 py-2 rounded-lg font-bold text-white shadow-md transition-all duration-300 transform hover:scale-105 hover:shadow-lg active:scale-95",
                  // Apply vibrant warm gradient based on working status or generally warm theme
                  isTodayWorking 
                    ? "bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500" 
                    : "bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-400 hover:to-red-500"
                )}
              >
                <Calendar className="w-5 h-5 drop-shadow-sm" />
                <span className="hidden sm:inline drop-shadow-sm">Darbo Laikas</span>
              </button>

              <a href="#akcijos" style={linkStyles} className="flex items-center gap-2 hover:bg-purple-500/10 hover:text-cyan-300">
                <Tag className="w-5 h-5" />
                Akcijos
              </a>
              <a href="#servizas" style={linkStyles} className="flex items-center gap-2 hover:bg-purple-500/10 hover:text-cyan-300">
                <Menu className="w-5 h-5" />
                Serviso darbai
              </a>
              <div className="flex items-center space-x-2 pl-2 border-l border-white/20 ml-2">
                <Phone className="w-5 h-5 text-green-400" />
                <span className="font-semibold">+370 651 18482</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="w-5 h-5 text-red-400" />
                <span className="hidden lg:inline">Liepų g. 40-51 Garliava</span>
              </div>
            </motion.nav>
          </div>
        </div>
      </motion.header>

      <CalendarModal 
        isOpen={isCalendarOpen} 
        onClose={() => setIsCalendarOpen(false)} 
        schedule={schedule}
        isWorkingDay={isWorkingDay}
      />
    </>
  );
};

export default Header;