import React from 'react';
import { Link } from 'react-router-dom';

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-900 py-20 border-b border-slate-800/60">
      {/* Šviečiantis fono akcentas (glow efektas) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-amber-500/10 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="max-w-5xl mx-auto px-4 text-center relative z-10">
        
        {/* Maža viršutinė žymė */}
        <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 px-4 py-1.5 rounded-full text-amber-400 text-xs font-semibold mb-6">
          <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
          Patikimas auto servisas Kaune / Garliavoje
        </div>

        {/* Pagrindinė antraštė */}
        <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight mb-6 leading-tight">
          Greitas ir profesionalus <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">
            Automobilių Remontas
          </span>
        </h1>

        {/* Trumpas aprašymas */}
        <p className="text-slate-300 text-base md:text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
          Atliekame ratų montavimą, pakabos diagnostiką, alyvos keitimą bei kitus serviso darbus. Tiksli diagnostika ir sąžiningi sprendimai jūsų automobiliui.
        </p>

        {/* Veiksmo mygtukai */}
        <div className="flex flex-wrap justify-center gap-4">
          <a
            href="tel:+37065118482"
            className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-8 py-4 rounded-xl text-base transition-all shadow-lg shadow-amber-500/20 hover:scale-105"
          >
            📞 Skambinti registracijai
          </a>
          
          <Link
            to="/paslaugos"
            className="bg-slate-800/80 hover:bg-slate-800 text-white font-semibold px-8 py-4 rounded-xl text-base border border-slate-700/80 transition-all hover:border-slate-500"
          >
            Žiūrėti visas paslaugas →
          </Link>
        </div>

        {/* Privalumų juostelė apačioje */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-16 pt-10 border-t border-slate-800/80 text-left">
          <div className="flex items-center gap-3 bg-slate-900/50 p-3.5 rounded-xl border border-slate-800">
            <span className="text-2xl">🛠️</span>
            <div>
              <h4 className="font-bold text-sm text-white">Moderni įranga</h4>
              <p className="text-xs text-slate-400">Tikslus balansavimas ir kompiuterinė patikra</p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-slate-900/50 p-3.5 rounded-xl border border-slate-800">
            <span className="text-2xl">🤝</span>
            <div>
              <h4 className="font-bold text-sm text-white">Lankstus laikas</h4>
              <p className="text-xs text-slate-400">Priėmimas pagal išankstinį susitarimą</p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-slate-900/50 p-3.5 rounded-xl border border-slate-800">
            <span className="text-2xl">💶</span>
            <div>
              <h4 className="font-bold text-sm text-white">Aiški kaina</h4>
              <p className="text-xs text-slate-400">Jokių neaiškių ar paslėptų mokesčių</p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}