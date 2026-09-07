import React from "react";
import { useParams, Link } from "react-router-dom";
import { paslaugosData } from "./Paslaugos";

const defaultPaslauga = {
  pavadinimas: "Autoserviso paslaugos",
  aprasymas: "Pasirinkta paslauga šiuo metu nerasta.",
  nuotraukos: [],
  darbai: []
};

export default function PaslaugosDetaliai() {
  const { id } = useParams();
  const paslauga = paslaugosData.find((item) => item.id === id) || defaultPaslauga;

  return (
    <div className="text-white min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Link to="/paslaugos" className="text-amber-500 hover:underline text-sm mb-6 inline-block">
          ← Grįžti į visas paslaugas
        </Link>

        <h1 className="text-3xl sm:text-4xl font-bold mb-8">{paslauga.pavadinimas}</h1>

        <p className="mb-6 text-slate-300 leading-relaxed">
          {paslauga.isrobintasAprasymas || paslauga.aprasymas}
        </p>

        {paslauga.darbai?.length > 0 && (
          <section className="mb-8 rounded-2xl border border-emerald-800/70 bg-emerald-950/90 backdrop-blur-sm p-6">
            <h2 className="text-xl font-bold text-amber-500 mb-4">Atliekame šiuos darbus:</h2>
            <ul className="grid gap-3 sm:grid-cols-2 text-slate-200">
              {paslauga.darbai.map((darbas) => (
                <li key={darbas} className="flex gap-2">
                  <span className="text-amber-500">✓</span>
                  <span>{darbas}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {paslauga.nuotraukos.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {paslauga.nuotraukos.map((imgSrc, index) => (
              <img
                key={imgSrc}
                src={imgSrc}
                alt={`${paslauga.pavadinimas} – darbų pavyzdys ${index + 1}`}
                className="w-full h-64 object-cover rounded-2xl border border-emerald-800/70 shadow-lg"
                loading="lazy"
              />
            ))}
          </div>
        )}

        {paslauga.id === "zibintu-stiklu-poliravimas" && (
          <section className="mt-8 rounded-2xl border border-emerald-800/70 bg-emerald-950/90 backdrop-blur-sm p-6 text-emerald-50">
            <p className="text-lg font-bold text-amber-500">
              Žibintų atnaujinimas garinimu (2 vnt.): 40–50 €
            </p>
            <p className="mt-3 text-sm italic leading-relaxed text-slate-400">
              Pastaba: Kaina nurodyta už komplektą. Labai pažeistiems ar giliai subraižytiems žibintams kaina gali kisti priklausomai nuo reikalingų šlifavimo etapų skaičiaus.
            </p>
          </section>
        )}

        {paslauga.id === "padangu-montavimas" && (
          <section className="mt-8 space-y-8">
            <div>
              <h2 className="mb-4 text-2xl font-bold text-amber-500">
                Padangų montavimo ir balansavimo kainos (4 vnt. komplektas)
              </h2>
              <div className="overflow-x-auto rounded-2xl border border-emerald-800/70 bg-emerald-950/85 backdrop-blur-sm">
                <table className="min-w-[760px] w-full text-left text-sm text-slate-200">
                  <thead className="bg-emerald-900/80 text-white">
                    <tr>
                      <th className="p-4 font-bold">Ratlankio dydis</th>
                      <th className="p-4 font-bold">Skardiniai ratlankiai</th>
                      <th className="p-4 font-bold">Lengvojo lydinio (lieti) ratlankiai</th>
                      <th className="p-4 font-bold">Visureigiai / Mikroautobusai</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800">
                    <tr><th className="p-4 font-semibold">R13 – R15</th><td className="p-4">25 €</td><td className="p-4">30 €</td><td className="p-4">35 €</td></tr>
                    <tr><th className="p-4 font-semibold">R16 – R17</th><td className="p-4">30 €</td><td className="p-4">35 €</td><td className="p-4">40 €</td></tr>
                    <tr><th className="p-4 font-semibold">R18 – R19</th><td className="p-4">—</td><td className="p-4">40 €</td><td className="p-4">45 €</td></tr>
                    <tr><th className="p-4 font-semibold">R20 ir didesni</th><td className="p-4">—</td><td className="p-4">nuo 45 €</td><td className="p-4">nuo 50 €</td></tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div>
              <h2 className="mb-4 text-2xl font-bold text-amber-500">Papildomos paslaugos / Atskiri darbai</h2>
              <div className="overflow-x-auto rounded-2xl border border-emerald-800/70 bg-emerald-950/85 backdrop-blur-sm">
                <table className="min-w-[620px] w-full text-left text-sm text-slate-200">
                  <thead className="bg-emerald-900/80 text-white">
                    <tr><th className="p-4 font-bold">Paslauga</th><th className="p-4 font-bold">Kaina</th></tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800">
                    <tr><th className="p-4 font-semibold">1 rato permontavimas ir balansavimas</th><td className="p-4">nuo 8–10 € / vnt.</td></tr>
                    <tr><th className="p-4 font-semibold">Rato balansavimas (be montavimo)</th><td className="p-4">nuo 4–5 € / vnt.</td></tr>
                    <tr><th className="p-4 font-semibold">Rato nuėmimas / uždėjimas</th><td className="p-4">2.50–3 € / vnt.</td></tr>
                    <tr><th className="p-4 font-semibold">Padangos remontas (dūrio klijavimas / kniedė)</th><td className="p-4">nuo 10 €</td></tr>
                    <tr><th className="p-4 font-semibold">Ventilio keitimas</th><td className="p-4">2–3 € / vnt.</td></tr>
                    <tr><th className="p-4 font-semibold">Ratlankio švaro valymas / sandarinimas (jei leidžia orą)</th><td className="p-4">5 € / vnt.</td></tr>
                  </tbody>
                </table>
              </div>
              <div className="mt-4 space-y-2 text-sm italic leading-relaxed text-slate-400">
                <p>Į komplekto kainą įskaičiuotas rato nuėmimas / uždėjimas, išmontavimas, sumontavimas, balansavimas ir nauji ventiliai.</p>
                <p>RUN-FLAT (C kategorijos) padangoms arba žemo profilio padangoms gali būti taikomas 5 € priedas komplektui.</p>
              </div>
            </div>
          </section>
        )}

      </div>
    </div>
  );
}
