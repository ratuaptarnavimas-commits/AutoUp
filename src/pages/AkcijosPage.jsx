import React, { useState, useEffect } from "react";
import { useAdmin } from "@/context/AdminContext";

const INITIAL_AKCIJOS = [
  {
    id: 1,
    ikona: "🔥",
    pavadinimas: "Padangų Montavimas + Pakabos Patikra",
    aprasymas:
      "Užsisakius pilną 4 ratų montavimo ir balansavimo komplektą – nemokama išsami važiuoklės patikra bei slėgio suderinimas.",
    kaina: "Nuo 30€",
    galioja: "Šią savaitę",
  },
  {
    id: 2,
    ikona: "🛢️",
    pavadinimas: "Variklio Alyvos Keitimo Akcija",
    aprasymas:
      "Keičiant variklio alyvą ir visus filtrus (alyvos, oro, salono) – kompiuterinė diagnostika ir skysčių lygio patikra NEMOKAMAI.",
    kaina: "Nuo 25€",
    galioja: "Iki mėnesio pabaigos",
  },
  {
    id: 3,
    ikona: "🔍",
    pavadinimas: "Kompiuterinė Diagnostika ir Klaidos",
    aprasymas:
      "Pilnas elektroninių sistemų skenavimas, klaidų trynimas ir išsami meistro konsultacija prieš važiuoklės remontą.",
    kaina: "15€",
    galioja: "Nuolatinė akcija",
  },
];

export default function AkcijosPage() {
  const { isAdmin } = useAdmin();
  // Įkrauname iš localStorage arba naudojame pradinius duomenis
  const [akcijos, setAkcijos] = useState(() => {
    const saved = localStorage.getItem("autoup_akcijos");
    return saved ? JSON.parse(saved) : INITIAL_AKCIJOS;
  });

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null); // Sekame, kurią akciją redaguojame

  const [formState, setFormState] = useState({
    ikona: "🔥",
    pavadinimas: "",
    aprasymas: "",
    kaina: "",
    galioja: "Ribotą laiką",
  });

  // Išsaugome pakeitimus į localStorage
  useEffect(() => {
    localStorage.setItem("autoup_akcijos", JSON.stringify(akcijos));
  }, [akcijos]);

  // Forma: Pridėti arba Išsaugoti redagavimą
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formState.pavadinimas || !formState.aprasymas) return;

    if (editingId) {
      // Redagavimo režimas
      setAkcijos(
        akcijos.map((item) =>
          item.id === editingId ? { ...formState, id: editingId } : item
        )
      );
    } else {
      // Naujos akcijos pridėjimas
      setAkcijos([...akcijos, { ...formState, id: Date.now() }]);
    }

    resetForm();
  };

  // Atsidaryti redagavimo formą su uzpildytais duomenimis
  const handleEdit = (item) => {
    setEditingId(item.id);
    setFormState(item);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleIstrinti = (id) => {
    if (confirm("Ar tikrai norite ištrinti šią akciją?")) {
      setAkcijos(akcijos.filter((a) => a.id !== id));
      if (editingId === id) resetForm();
    }
  };

  const resetForm = () => {
    setFormState({
      ikona: "🔥",
      pavadinimas: "",
      aprasymas: "",
      kaina: "",
      galioja: "Ribotą laiką",
    });
    setEditingId(null);
    setShowForm(false);
  };

  return (
    <div className="text-white font-sans min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight mb-4">
            Mūsų Galiojančios <span className="text-amber-500">Akcijos</span>
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto text-base sm:text-lg mb-6">
            Sutaupykite pasirinkdami geriausius pasiūlymus automobilių remontui Kaune ir Garliavoje.
          </p>

          {isAdmin && (
            <button
              onClick={() => {
                if (showForm) resetForm();
                else setShowForm(true);
              }}
              className="bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 border border-amber-500/30 font-bold px-5 py-2.5 rounded-xl transition-all text-sm"
            >
              {showForm ? "✕ Uždaryti Formą" : "+ Pridėti Naują Akciją"}
            </button>
          )}
        </div>

        {/* FORMA (NAUDOJAMA IR PRIDĖJIMUI, IR REDAGAVIMUI) */}
        {showForm && (
          <form
            onSubmit={handleSubmit}
            className="bg-emerald-950/90 backdrop-blur-sm border border-amber-500/30 p-6 rounded-2xl max-w-2xl mx-auto mb-12 shadow-xl space-y-4"
          >
            <h3 className="text-lg font-bold text-amber-500 mb-2">
              {editingId ? "✏️ Redaguoti Akciją" : "+ Pridėti Naują Pasiūlymą"}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <input
                type="text"
                placeholder="Ikona (pvz. 🔥, 🛢️)"
                value={formState.ikona}
                onChange={(e) => setFormState({ ...formState, ikona: e.target.value })}
                className="bg-emerald-950 border border-emerald-800 text-white p-3 rounded-xl focus:border-amber-500 focus:outline-none"
              />
              <input
                type="text"
                placeholder="Pavadinimas"
                value={formState.pavadinimas}
                onChange={(e) => setFormState({ ...formState, pavadinimas: e.target.value })}
                className="sm:col-span-2 bg-emerald-950 border border-emerald-800 text-white p-3 rounded-xl focus:border-amber-500 focus:outline-none"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Kaina (pvz. Nuo 30€)"
                value={formState.kaina}
                onChange={(e) => setFormState({ ...formState, kaina: e.target.value })}
                className="bg-[#0B0F17] border border-gray-700 text-white p-3 rounded-xl focus:border-amber-500 focus:outline-none"
                required
              />
              <input
                type="text"
                placeholder="Galiojimas (pvz. Šią savaitę)"
                value={formState.galioja}
                onChange={(e) => setFormState({ ...formState, galioja: e.target.value })}
                className="bg-[#0B0F17] border border-gray-700 text-white p-3 rounded-xl focus:border-amber-500 focus:outline-none"
              />
            </div>

            <textarea
              placeholder="Akcijos aprašymas..."
              value={formState.aprasymas}
              onChange={(e) => setFormState({ ...formState, aprasymas: e.target.value })}
              className="w-full bg-emerald-950 border border-emerald-800 text-white p-3 rounded-xl focus:border-amber-500 focus:outline-none"
              rows={3}
              required
            />

            <div className="flex gap-3">
              <button
                type="submit"
                className="flex-1 bg-amber-500 hover:bg-amber-400 text-black font-black py-3 rounded-xl transition-all"
              >
                {editingId ? "Išsaugoti Pakeitimus" : "Paskelbti Akciją"}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="bg-emerald-900 hover:bg-emerald-800 text-emerald-50 font-bold px-5 py-3 rounded-xl transition-all"
              >
                Atšaukti
              </button>
            </div>
          </form>
        )}

        {/* KORTELĖS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {akcijos.map((item) => (
            <div
              key={item.id}
              className="bg-emerald-950/90 backdrop-blur-sm border border-emerald-800/70 hover:border-amber-500/50 p-6 rounded-2xl flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 shadow-lg relative group"
            >
              <div>
                <div className="flex justify-between items-start mb-4">
                  <span className="text-3xl bg-emerald-950 p-3 rounded-xl border border-emerald-800">
                    {item.ikona}
                  </span>
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-500 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
                    {item.galioja}
                  </span>
                </div>

                <h3 className="text-xl font-bold mb-2 group-hover:text-amber-500 transition-colors">
                  {item.pavadinimas}
                </h3>

                <p className="text-gray-400 text-sm leading-relaxed mb-6">
                  {item.aprasymas}
                </p>
              </div>

              <div>
                <div className="flex justify-between items-center pt-4 border-t border-gray-800/80 mb-4">
                  <span className="text-xs text-gray-500 uppercase font-bold">Kaina:</span>
                  <span className="text-2xl font-black text-amber-500">{item.kaina}</span>
                </div>

                <div className="flex gap-2">
                  <a
                    href="tel:+37065118482"
                    className="flex-1 bg-amber-500 hover:bg-amber-400 text-black font-bold py-2.5 px-3 rounded-xl text-center text-sm transition-all"
                  >
                    Registruotis →
                  </a>

                  {isAdmin && (
                    <>
                      <button
                        onClick={() => handleEdit(item)}
                        className="text-gray-400 hover:text-amber-500 p-2.5 rounded-xl border border-gray-800 hover:border-amber-500/30 transition-all"
                        title="Redaguoti akciją"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => handleIstrinti(item.id)}
                        className="text-gray-400 hover:text-red-500 p-2.5 rounded-xl border border-gray-800 hover:border-red-500/30 transition-all"
                        title="Ištrinti akciją"
                      >
                        🗑️
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
