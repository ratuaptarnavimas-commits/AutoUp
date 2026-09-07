import React from 'react';

export default function AutoprekesPage() {
  return (
    <main className="min-h-screen px-4 py-16 text-white sm:px-6 lg:px-8">
      <section className="mx-auto max-w-3xl rounded-2xl border border-emerald-800/70 bg-emerald-950/90 p-8 text-center shadow-2xl backdrop-blur-sm sm:p-12">
        <span className="inline-flex rounded-full border border-amber-500/40 bg-amber-500/10 px-4 py-1.5 text-sm font-bold uppercase tracking-wider text-amber-400">
          Ruošiama
        </span>
        <h1 className="mt-5 text-3xl font-black sm:text-4xl">
          Auto<span className="text-red-600">prekės</span>
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-emerald-100/75">
          Netrukus čia rasite automobiliams skirtas prekes ir aksesuarus.
        </p>
      </section>
    </main>
  );
}
