import React, { useMemo, useState } from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { sendTireDisposalEmail } from "../services/web3formsService";

const PRICE_PER_TIRE = 3;
const initialForm = {
  name: "",
  phone: "",
  email: "",
  quantity: "",
  source: "",
  tireInfo: "",
  date: "",
  time: "",
  notes: "",
  confirmed: false,
};

function getToday() {
  const today = new Date();
  const offset = today.getTimezoneOffset();
  return new Date(today.getTime() - offset * 60 * 1000).toISOString().split("T")[0];
}

export default function TireDisposalPage() {
  const [form, setForm] = useState(initialForm);
  const [submitted, setSubmitted] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [submissionError, setSubmissionError] = useState("");
  const [errors, setErrors] = useState({});
  const today = useMemo(getToday, []);
  const price = form.source === "Kitur" ? (Number(form.quantity) || 0) * PRICE_PER_TIRE : 0;

  const updateField = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((current) => ({ ...current, [name]: type === "checkbox" ? checked : value }));
    setErrors((current) => ({ ...current, [name]: "" }));
    setSubmitted(false);
    setSubmissionError("");
  };

  const validate = () => {
    const nextErrors = {};
    if (!form.name.trim()) nextErrors.name = "Įrašykite vardą.";
    if (!form.phone.trim()) nextErrors.phone = "Įrašykite telefono numerį.";
    if (!form.quantity || Number(form.quantity) < 1) nextErrors.quantity = "Nurodykite bent 1 padangą.";
    if (!form.source) nextErrors.source = "Pasirinkite, kur įsigytos padangos.";
    if (!form.date) nextErrors.date = "Pasirinkite datą.";
    if (form.date && form.date < today) nextErrors.date = "Negalima pasirinkti praėjusios datos.";
    if (!form.time) nextErrors.time = "Pasirinkite laiką.";
    if (!form.confirmed) nextErrors.confirmed = "Patvirtinkite pateiktą informaciją.";
    return nextErrors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const nextErrors = validate();
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      setSubmitted(false);
      return;
    }
    setErrors({});
    setSubmissionError("");
    setIsSending(true);

    const result = await sendTireDisposalEmail({ ...form, price });
    setIsSending(false);

    if (result.success) {
      setForm(initialForm);
      setSubmitted(true);
    } else {
      setSubmissionError(result.message);
    }
  };

  const fieldClass = "mt-2 w-full rounded-xl border border-emerald-700/80 bg-emerald-950/80 px-4 py-3 text-white placeholder:text-emerald-300/50 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400/30";
  const labelClass = "text-sm font-bold text-emerald-100";

  return (
    <>
      <Helmet>
        <html lang="lt" />
        <title>Naudotų padangų priėmimas | AutoUP</title>
        <meta name="description" content="Naudotų padangų priėmimas AutoUP. Inter Cars ir AD Baltic įsigytas padangas priimame nemokamai, kitur įsigytas – 3 € už vienetą." />
        <link rel="canonical" href="https://autoup.lt/padangu-priemimas" />
      </Helmet>

      <main className="min-h-screen px-4 py-10 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <Link to="/" className="mb-6 inline-block text-sm font-bold text-amber-400 hover:text-amber-300 hover:underline">
            ← Grįžti į pagrindinį puslapį
          </Link>

          <section className="rounded-3xl border border-emerald-700/70 bg-emerald-950/90 p-6 shadow-2xl shadow-emerald-950/30 sm:p-10">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-amber-400">AutoUP paslauga</p>
            <h1 className="mt-3 text-3xl font-black sm:text-5xl">Naudotų padangų priėmimas utilizavimui</h1>
            <p className="mt-4 max-w-3xl text-base leading-relaxed text-emerald-100 sm:text-lg">
              AutoUP priima naudotas lengvųjų automobilių padangas utilizavimui.
            </p>

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl border border-emerald-700/70 bg-emerald-900/60 p-5">
                <h2 className="font-bold text-white">Inter Cars įsigytos padangos</h2>
                <p className="mt-2 text-2xl font-black text-amber-400">0 € / vnt.</p>
              </div>
              <div className="rounded-2xl border border-emerald-700/70 bg-emerald-900/60 p-5">
                <h2 className="font-bold text-white">AD Baltic įsigytos padangos</h2>
                <p className="mt-2 text-2xl font-black text-amber-400">0 € / vnt.</p>
              </div>
              <div className="rounded-2xl border border-emerald-700/70 bg-emerald-900/60 p-5">
                <h2 className="font-bold text-white">Kitur įsigytos padangos</h2>
                <p className="mt-2 text-2xl font-black text-amber-400">3 € / vnt.</p>
              </div>
            </div>

            <p className="mt-6 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm leading-relaxed text-amber-100">
              Nemokamai priimant Inter Cars arba AD Baltic įsigytas padangas gali būti prašoma pateikti pirkimą patvirtinančią informaciją.
            </p>
          </section>

          <section className="mt-8 rounded-3xl border border-emerald-700/70 bg-emerald-950/90 p-6 shadow-2xl shadow-emerald-950/30 sm:p-10" aria-labelledby="registration-title">
            <h2 id="registration-title" className="text-2xl font-black text-white sm:text-3xl">Registruoti padangų pridavimą</h2>
            <p className="mt-2 text-sm text-emerald-200">Žvaigždute pažymėti laukai yra privalomi.</p>

            <form className="mt-8 space-y-6" onSubmit={handleSubmit} noValidate>
              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label className={labelClass} htmlFor="name">Vardas *</label>
                  <input id="name" name="name" value={form.name} onChange={updateField} className={fieldClass} autoComplete="name" />
                  {errors.name && <p className="mt-1 text-sm text-red-300">{errors.name}</p>}
                </div>
                <div>
                  <label className={labelClass} htmlFor="phone">Telefono numeris *</label>
                  <input id="phone" name="phone" type="tel" value={form.phone} onChange={updateField} className={fieldClass} autoComplete="tel" />
                  {errors.phone && <p className="mt-1 text-sm text-red-300">{errors.phone}</p>}
                </div>
                <div>
                  <label className={labelClass} htmlFor="email">El. paštas</label>
                  <input id="email" name="email" type="email" value={form.email} onChange={updateField} className={fieldClass} autoComplete="email" />
                </div>
                <div>
                  <label className={labelClass} htmlFor="quantity">Padangų kiekis *</label>
                  <input id="quantity" name="quantity" type="number" min="1" step="1" value={form.quantity} onChange={updateField} className={fieldClass} />
                  {errors.quantity && <p className="mt-1 text-sm text-red-300">{errors.quantity}</p>}
                </div>
                <div>
                  <label className={labelClass} htmlFor="source">Kur įsigytos padangos? *</label>
                  <select id="source" name="source" value={form.source} onChange={updateField} className={fieldClass}>
                    <option value="">Pasirinkite</option>
                    <option value="Inter Cars">Inter Cars</option>
                    <option value="AD Baltic">AD Baltic</option>
                    <option value="Kitur">Kitur</option>
                  </select>
                  {errors.source && <p className="mt-1 text-sm text-red-300">{errors.source}</p>}
                </div>
                <div>
                  <label className={labelClass} htmlFor="date">Pageidaujama pridavimo data *</label>
                  <input id="date" name="date" type="date" min={today} value={form.date} onChange={updateField} className={fieldClass} />
                  {errors.date && <p className="mt-1 text-sm text-red-300">{errors.date}</p>}
                </div>
                <div>
                  <label className={labelClass} htmlFor="time">Pageidaujamas laikas *</label>
                  <input id="time" name="time" type="time" value={form.time} onChange={updateField} className={fieldClass} />
                  {errors.time && <p className="mt-1 text-sm text-red-300">{errors.time}</p>}
                </div>
              </div>

              <div>
                <label className={labelClass} htmlFor="tireInfo">Automobilio / padangų informacija</label>
                <input id="tireInfo" name="tireInfo" value={form.tireInfo} onChange={updateField} placeholder="Pvz. 205/55 R16, 4 vnt." className={fieldClass} />
              </div>

              <div>
                <label className={labelClass} htmlFor="notes">Papildoma informacija</label>
                <textarea id="notes" name="notes" value={form.notes} onChange={updateField} className={`${fieldClass} min-h-28`} />
              </div>

              <div className="rounded-2xl border border-emerald-700/70 bg-emerald-900/50 p-5">
                <p className="text-sm text-emerald-100">Numatoma priėmimo kaina: <strong className="text-xl text-amber-400">{price} €</strong></p>
              </div>

              <label className="flex items-start gap-3 text-sm text-emerald-100">
                <input name="confirmed" type="checkbox" checked={form.confirmed} onChange={updateField} className="mt-1 h-4 w-4 accent-amber-500" />
                <span>Patvirtinu, kad pateikta informacija yra teisinga.</span>
              </label>
              {errors.confirmed && <p className="-mt-4 text-sm text-red-300">{errors.confirmed}</p>}

              <button type="submit" disabled={isSending} className="w-full rounded-xl bg-amber-500 px-6 py-3.5 text-sm font-black uppercase tracking-wide text-black transition-colors hover:bg-amber-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto">
                {isSending ? "Siunčiama..." : "Registruoti pridavimą"}
              </button>

              {submissionError && <p role="alert" className="rounded-xl border border-red-500/50 bg-red-500/10 p-4 text-sm font-bold text-red-100">{submissionError}</p>}

              {submitted && (
                <p role="status" className="rounded-xl border border-emerald-500/50 bg-emerald-500/10 p-4 text-sm font-bold text-emerald-100">
                  Ačiū! Jūsų padangų pridavimo registracija gauta. Susisieksime su jumis patvirtinimui.
                </p>
              )}
            </form>
          </section>
        </div>
      </main>
    </>
  );
}
