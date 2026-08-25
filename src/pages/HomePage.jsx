import React from "react";
import { Link } from "react-router-dom";
import Paslaugos from "../components/Paslaugos";

export default function Home() {
  return (
    <div className="bg-[#0B0F17] text-white font-sans min-h-screen">
      {/* HERO SKILTIS */}
      <section className="relative py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <span className="text-amber-500 font-bold uppercase tracking-widest text-xs sm:text-sm bg-amber-500/10 px-4 py-1.5 rounded-full border border-amber-500/20 inline-block mb-4">
          Patikimas Autoservisas Kaune & Garliavoje
        </span>
        <h1 className="text-4xl sm:text-6xl font-black tracking-tight mb-6">
          Kokybiškas Automobilių Remontas <br />
          <span className="text-amber-500">Be Siurprizų IR Permokų</span>
        </h1>
        <p className="text-gray-400 max-w-2xl mx-auto text-base sm:text-lg mb-8">
          Atliekame važiuoklės remontą, padangų montavimą, stabdžių sistemos tvarkymą ir kompiuterinę diagnostiką.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <a
            href="tel:+37065118482"
            className="bg-amber-500 hover:bg-amber-400 text-black font-bold px-8 py-4 rounded-xl transition-all shadow-lg shadow-amber-500/20 text-center"
          >
            Registruotis Vizitui: +370 651 18482
          </a>
          <Link
            to="/paslaugos"
            className="bg-[#121824] hover:bg-gray-800 text-white font-semibold px-8 py-4 rounded-xl border border-gray-800 transition-all text-center"
          >
            Visos Paslaugos →
          </Link>
        </div>
      </section>

      {/* AKCIJOS SKILTIS */}
      <section className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-500 via-amber-600 to-amber-700 p-8 sm:p-12 text-black shadow-2xl">
          <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 bg-black text-amber-500 text-xs font-black uppercase px-3 py-1 rounded-md mb-4 tracking-wider">
                🔥 Riboto laiko akcija
              </div>
              <h2 className="text-3xl sm:text-5xl font-black text-black leading-tight mb-4">
                Pasiruošk Sezonui: Padangų Montavimas + Pakabos Patikra
              </h2>
              <p className="text-gray-900 font-medium text-base sm:text-lg mb-4">
                Užsisakius pilną padangų montavimo ir balansavimo komplektą – 
                <span className="font-bold underline ml-1">Nemokama išsami važiuoklės patikra</span>!
              </p>
              <ul className="space-y-2 text-sm sm:text-base font-semibold text-gray-900 mb-6">
                <li className="flex items-center gap-2">
                  <span>✓</span> Tikslus 4 ratų balansavimas elektroninėmis staklėmis
                </li>
                <li className="flex items-center gap-2">
                  <span>✓</span> Ventilių patikra ir slėgio suderinimas
                </li>
                <li className="flex items-center gap-2">
                  <span>✓</span> Vizualinė ir mechaninė pakabos diagnostika nemokamai
                </li>
              </ul>
            </div>

            <div className="bg-black/90 text-white p-6 sm:p-8 rounded-2xl flex flex-col items-center text-center border border-black/20 shadow-xl min-w-[260px] w-full lg:w-auto">
              <span className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">
                Akcijos Pasiūlymas
              </span>
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-4xl sm:text-5xl font-black text-amber-500">Nuo 30€</span>
              </div>
              <p className="text-xs text-gray-400 mb-6">
                Pasiūlymas galioja užsiregistravus šią savaitę
              </p>
              <a
                href="tel:+37065118482"
                className="w-full bg-amber-500 hover:bg-amber-400 text-black font-black py-3.5 px-6 rounded-xl transition-all shadow-md text-sm uppercase tracking-wider text-center"
              >
                Gauti Akciją Nuobuodu
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* PASLAUGOS */}
      <section className="py-8">
        <Paslaugos />
      </section>
    </div>
  );
}