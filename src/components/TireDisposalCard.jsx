import React from "react";
import { Link } from "react-router-dom";
import tireImage from "../static/image/Nauotu padangu pridavimas-1.jpg";

export default function TireDisposalCard() {
  return (
    <section className="mx-auto w-full" aria-labelledby="tire-disposal-title">
      <div className="relative min-h-[162px] overflow-hidden rounded-2xl border border-emerald-700/70 bg-emerald-950/90 p-5 shadow-2xl shadow-emerald-950/30 sm:p-6">
        <img src={tireImage} alt="Naudotos padangos" className="absolute inset-y-0 right-0 h-full w-[42%] object-cover object-left opacity-80" />
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-950 via-emerald-950/90 to-emerald-950/10" />
        <div className="relative z-10 max-w-[72%]">
          <h2 id="tire-disposal-title" className="text-xl font-black text-white sm:text-2xl">Naudotų padangų priėmimas</h2>
          <p className="mt-1 text-sm leading-relaxed text-emerald-100">Priimame utilizavimui naudotas lengvųjų automobilių padangas.</p>
          <div className="mt-3 grid gap-1 text-[11px] font-bold text-amber-400 sm:grid-cols-3">
            <div className="rounded-xl border border-emerald-700/70 bg-emerald-900/60 p-3">
              <p className="text-emerald-200">Inter Cars</p>
              <p className="mt-1">✓ NEMOKAMAI</p>
            </div>
            <div className="rounded-xl border border-emerald-700/70 bg-emerald-900/60 p-3">
              <p className="text-emerald-200">AD Baltic</p>
              <p className="mt-1">✓ NEMOKAMAI</p>
            </div>
            <div className="rounded-xl border border-emerald-700/70 bg-emerald-900/60 p-3">
              <p className="text-emerald-200">Kitur</p>
              <p className="mt-1">✓ 3 € / vnt.</p>
            </div>
          </div>

          <Link to="/padangu-priemimas" className="mt-3 inline-flex items-center justify-center rounded-xl bg-amber-500 px-4 py-2.5 text-center text-xs font-black uppercase tracking-wide text-black transition-colors hover:bg-amber-400">
            Registruoti padangų pridavimą
          </Link>
        </div>
      </div>
    </section>
  );
}
