import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import vaziuokle from "../static/image/vaziuokle-1.jpg.jpeg";
import padangos from "../static/image/ratas1.jpg";
import alyva from "../static/image/tepalo keitimas1.jpg";

const slaidos = [
  {
    id: "vaziuokles-remontas",
    pavadinimas: "Važiuoklės remontas",
    aprasymas: "Saugumas kelyje prasideda nuo tvarkingos pakabos. Atliekame išsamią diagnostiką ir keičiame nusidėvėjusias detales.",
    nuotrauka: vaziuokle
  },
  {
    id: "padangu-montavimas",
    pavadinimas: "Padangų montavimas",
    aprasymas: "Greitas, kokybiškas padangų montavimas bei tikslus ratų balansavimas modernia kompiuterine įranga.",
    nuotrauka: padangos
  },
  {
    id: "alyvos-keitimas",
    pavadinimas: "Alyvos keitimas",
    aprasymas: "Variklio alyvos ir filtrų keitimas naudojant tik aukščiausios kokybės alyvą jūsų automobilio ilgamžiškumui.",
    nuotrauka: alyva
  }
];

export default function ServiceSlider() {
  const [esamasIndex, setEsamasIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setEsamasIndex((prev) => (prev + 1) % slaidos.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const dabartineSlaida = slaidos[esamasIndex];

  return (
    <section className="max-w-[1600px] mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        
        {/* KAIRĖ DALIS: Karuselė su įstriža kortele */}
        <div className="lg:col-span-2 relative h-[380px] rounded-2xl overflow-hidden border border-emerald-800/70 bg-emerald-950 shadow-2xl group">
          
          <img 
            key={dabartineSlaida.id}
            src={dabartineSlaida.nuotrauka} 
            alt={dabartineSlaida.pavadinimas}
            className="absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-in-out"
          />

          <div className="absolute inset-0 z-[1] bg-gradient-to-r from-emerald-950/90 via-emerald-950/60 to-emerald-950/30"></div>

          <div 
            className="absolute inset-y-0 left-0 w-full md:w-[58%] p-8 flex flex-col justify-between z-10"
          >
            <div>
              <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-4 leading-tight text-white">
                {dabartineSlaida.pavadinimas}
              </h2>
              <p className="text-slate-100 font-medium text-sm md:text-base leading-relaxed max-w-[85%]">
                {dabartineSlaida.aprasymas}
              </p>
            </div>

            <Link
              to="/paslaugos"
              className="inline-flex items-center gap-2 bg-emerald-950/95 text-amber-400 font-bold px-5 py-2.5 rounded-xl text-sm w-fit hover:bg-emerald-900 transition-colors shadow-md"
            >
              Plačiau →
            </Link>
          </div>

          {/* Navigacijos burbuliukai apačioje */}
          <div className="absolute bottom-4 right-6 z-20 flex items-center gap-2 bg-emerald-950/70 backdrop-blur-md px-3 py-1.5 rounded-full border border-emerald-800/70">
            {slaidos.map((_, index) => (
              <button
                key={index}
                type="button"
                aria-label={`Rodyti skaidrę ${index + 1}`}
                onClick={() => setEsamasIndex(index)}
                className={`transition-all rounded-full ${
                  index === esamasIndex 
                    ? "w-6 h-2.5 bg-amber-500" 
                    : "w-2.5 h-2.5 bg-emerald-300/70 hover:bg-emerald-100"
                }`}
              />
            ))}
          </div>
        </div>

        {/* DEŠINĖ DALIS: Greitos registracijos kortelės */}
        <div className="flex flex-col gap-4 justify-between">
          <div className="bg-gradient-to-br from-amber-400 to-amber-600 rounded-2xl p-6 text-emerald-950 flex flex-col justify-between h-[180px] shadow-lg">
            <div>
              <h3 className="text-2xl font-black mb-1">Automobilio remontas</h3>
              <p className="text-xs font-semibold text-slate-900/80">Registruokitės apžiūrai ar meistro konsultacijai iš anksto.</p>
            </div>
            <a
              href="tel:+37065118482"
              aria-label="Skambinti telefonu +370 651 18482"
              className="inline-block border-2 border-emerald-950 text-emerald-950 font-bold text-center py-2 px-4 rounded-xl hover:bg-emerald-950 hover:text-amber-500 transition-all text-sm"
            >
              Registruotis telefonu
            </a>
          </div>

          <div className="bg-emerald-950/90 backdrop-blur-sm border border-emerald-800/70 rounded-2xl p-6 text-white flex flex-col justify-between h-[180px] shadow-lg">
            <div>
              <h3 className="text-xl font-bold mb-1 text-amber-500">Padangų montavimas & Balansavimas</h3>
              <p className="text-xs text-slate-400">Greitas priėmimas sezono metu.</p>
            </div>
            <Link
              to="/kontaktai?paslauga=Padang%C5%B3%20montavimas%20ir%20balansavimas#registracija"
              className="inline-block border border-emerald-700 text-white font-semibold text-center py-2 px-4 rounded-xl hover:border-amber-500 hover:text-amber-500 transition-all text-sm"
            >
              Užsakyti laiką
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
}
