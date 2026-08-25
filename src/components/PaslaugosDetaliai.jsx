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
    <div className="bg-[#0B0F17] text-white min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Link to="/paslaugos" className="text-amber-500 hover:underline text-sm mb-6 inline-block">
          ← Grįžti į visas paslaugas
        </Link>

        <h1 className="text-3xl sm:text-4xl font-bold mb-8">{paslauga.pavadinimas}</h1>

        <p className="mb-6 text-slate-300 leading-relaxed">
          {paslauga.isrobintasAprasymas || paslauga.aprasymas}
        </p>

        {paslauga.darbai?.length > 0 && (
          <section className="mb-8 rounded-2xl border border-gray-800 bg-[#121824] p-6">
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
                className="w-full h-64 object-cover rounded-2xl border border-gray-800 shadow-lg"
                loading="lazy"
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
