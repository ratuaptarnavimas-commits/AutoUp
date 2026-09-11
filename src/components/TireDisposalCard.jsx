import React from "react";
import { Link } from "react-router-dom";

export default function TireDisposalCard() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8" aria-labelledby="tire-disposal-title">
      <div className="overflow-hidden rounded-3xl border border-emerald-700/70 bg-emerald-950/90 p-6 shadow-2xl shadow-emerald-950/30 sm:p-8">
        <div className="flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <p className="mb-2 text-xs font-black uppercase tracking-[0.2em] text-amber-400">Nauja paslauga</p>
            <h2 id="tire-disposal-title" className="text-2xl font-black text-white sm:text-3xl">
              Naudotų padangų priėmimas
            </h2>
            <p className="mt-3 text-base leading-relaxed text-emerald-100">
              Priimame utilizavimui naudotas lengvųjų automobilių padangas.
            </p>
          </div>

          <div className="grid gap-2 text-sm text-white sm:grid-cols-3 lg:min-w-[540px]">
            <div className="rounded-xl border border-emerald-700/70 bg-emerald-900/60 p-4">
              <p className="text-emerald-200">Inter Cars įsigytos</p>
              <p className="mt-1 font-black text-amber-400">✓ NEMOKAMAI</p>
            </div>
            <div className="rounded-xl border border-emerald-700/70 bg-emerald-900/60 p-4">
              <p className="text-emerald-200">AD Baltic įsigytos</p>
              <p className="mt-1 font-black text-amber-400">✓ NEMOKAMAI</p>
            </div>
            <div className="rounded-xl border border-emerald-700/70 bg-emerald-900/60 p-4">
              <p className="text-emerald-200">Kitur įsigytos</p>
              <p className="mt-1 font-black text-amber-400">✓ 3 € / vnt.</p>
            </div>
          </div>

          <Link
            to="/padangu-priemimas"
            className="inline-flex shrink-0 items-center justify-center rounded-xl bg-amber-500 px-5 py-3 text-center text-sm font-black uppercase tracking-wide text-black transition-colors hover:bg-amber-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 focus-visible:ring-offset-2 focus-visible:ring-offset-emerald-950"
          >
            Registruoti padangų pridavimą
          </Link>
        </div>
      </div>
    </section>
  );
}
