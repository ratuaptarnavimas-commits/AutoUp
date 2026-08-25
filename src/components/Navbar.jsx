import React from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="bg-[#0B0F17] border-b border-gray-800 px-4 sm:px-8 py-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        
        {/* LOGO */}
        <Link to="/" className="text-2xl font-black tracking-wider text-white">
          Auto<span className="text-amber-500">Up</span>
        </Link>

        {/* MENIU NUORODOS */}
        <div className="flex items-center gap-6 text-sm font-bold uppercase tracking-wider">
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
        </div>

        {/* REGISTRACIJOS MYGTUKAS */}
        <a
          href="tel:+37065118482"
          className="bg-amber-500 hover:bg-amber-400 text-black font-black px-5 py-2.5 rounded-xl transition-all text-xs uppercase"
        >
          Registruotis Telefonu
        </a>

      </div>
    </nav>
  );
}