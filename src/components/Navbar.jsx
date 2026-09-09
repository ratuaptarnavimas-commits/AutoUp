import React, { useState } from "react";
import { Link } from "react-router-dom";
import { CalendarDays, Wrench } from "lucide-react";
import CalendarModal from "./schedule/CalendarModal";

export default function Navbar() {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  return (
    <>
      <nav className="bg-[#06150d]/95 backdrop-blur-md border-b border-emerald-800/70 px-4 sm:px-8 py-4">
      <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-4">
        
        {/* LOGO */}
        <Link to="/" className="group flex items-center gap-2.5" aria-label="AutoUp pagrindinis puslapis">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-amber-400/60 bg-[#0b2418] text-amber-400 shadow-lg shadow-black/20 transition-transform group-hover:rotate-[-8deg]">
            <Wrench className="h-5 w-5" strokeWidth={2.5} />
          </span>
          <span className="text-2xl font-black italic tracking-tight text-white drop-shadow-md">
            Auto<span className="text-red-500">Up</span>
          </span>
        </Link>

        {/* MENIU NUORODOS */}
        <div className="order-3 w-full sm:order-none sm:w-auto flex flex-wrap items-center gap-x-4 gap-y-2 text-xs sm:text-sm font-bold uppercase tracking-wider">
          <Link to="/" className="hover:text-amber-500 transition-colors">
            PAGRINDINIS
          </Link>
          
          <Link to="/paslaugos" className="hover:text-amber-500 transition-colors">
            AUTOSERVISO PASLAUGOS
          </Link>

          {/* NAUJA AKCIJOS NUORODA */}
          <Link 
            to="/akcijos" 
            className="text-amber-500 hover:text-amber-400 transition-colors font-black flex items-center gap-1 bg-amber-500/10 px-3 py-1 rounded-lg border border-amber-500/20"
          >
            🔥 AKCIJOS
          </Link>

          <Link to="/kontaktai" className="hover:text-amber-500 transition-colors">
            KONTAKTAI
          </Link>

          <Link to="/autoprekes" className="text-emerald-100 hover:text-amber-500 transition-colors">
            AUTOPREKĖS <span className="text-amber-400">• RUOŠIAMA</span>
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsCalendarOpen(true)}
            className="inline-flex items-center gap-2 border border-amber-500/60 text-amber-400 hover:bg-amber-500 hover:text-black font-black px-4 py-2.5 rounded-xl transition-all text-xs uppercase"
          >
            <CalendarDays className="h-4 w-4" />
            Rezervuoti laiką
          </button>
          <a
            href="tel:+37065118482"
            className="bg-amber-500 hover:bg-amber-400 text-black font-black px-5 py-2.5 rounded-xl transition-all text-xs uppercase"
          >
            Skambinti
          </a>
        </div>

      </div>
      </nav>
      <CalendarModal isOpen={isCalendarOpen} onClose={() => setIsCalendarOpen(false)} />
    </>
  );
}
