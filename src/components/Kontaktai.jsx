import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';

export default function Kontaktai() {
  const [searchParams] = useSearchParams();
  const pasirinktaPaslauga = searchParams.get('paslauga');
  const [registracija, setRegistracija] = useState({
    vardas: '',
    telefonas: '',
    elPastas: '',
    automobilis: '',
    data: '',
    laikas: '',
    pastabos: pasirinktaPaslauga ? `Paslauga: ${pasirinktaPaslauga}` : ''
  });
  const [registracijosBusena, setRegistracijosBusena] = useState('');

  const handleRegistracijosChange = (event) => {
    setRegistracija((previous) => ({ ...previous, [event.target.name]: event.target.value }));
  };

  const handleRegistracijaSubmit = async (event) => {
    event.preventDefault();
    setRegistracijosBusena('Siunčiama...');

    try {
      const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          service_id: import.meta.env.VITE_EMAILJS_SERVICE_ID,
          template_id: import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
          user_id: import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
          template_params: {
            to_email: import.meta.env.VITE_EMAILJS_TO_EMAIL,
            from_name: registracija.vardas,
            reply_to: registracija.elPastas,
            vardas: registracija.vardas,
            telefonas: registracija.telefonas,
            el_pastas: registracija.elPastas,
            automobilis: registracija.automobilis,
            data: registracija.data,
            laikas: registracija.laikas,
            problema: registracija.pastabos,
            formos_tipas: 'Registracija vizitui'
          }
        })
      });

      if (!response.ok) throw new Error('Nepavyko išsiųsti registracijos');

      setRegistracijosBusena('Registracija išsiųsta. Patvirtinsime vizito laiką telefonu arba el. paštu.');
      setRegistracija({ vardas: '', telefonas: '', elPastas: '', automobilis: '', data: '', laikas: '', pastabos: '' });
    } catch {
      setRegistracijosBusena('Registracijos išsiųsti nepavyko. Pabandykite dar kartą arba susisiekite telefonu.');
    }
  };

  return (
    <section id="kontaktai" className="py-16 bg-slate-950 text-white border-t border-slate-800">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold text-amber-500 mb-3">
            Susisiekite su mumis
          </h2>
          <p className="text-slate-400">Laukiame jūsų atvykstant arba skambučio!</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-center">
            <div className="text-3xl mb-3">📍</div>
            <h3 className="font-bold text-lg mb-1">Lokacija</h3>
            <a
              href="https://www.google.com/maps/dir/?api=1&destination=Liepu%20g.%2040-51%2C%20Garliava"
              target="_blank"
              rel="noreferrer"
              className="text-slate-400 text-sm hover:text-amber-400 hover:underline"
            >
              Liepų g. 40-51, Garliava
            </a>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-center">
            <div className="text-3xl mb-3">✉️</div>
            <h3 className="font-bold text-lg mb-1">El. paštas</h3>
            <a href="mailto:ratuaptarnavimas@gmail.com" className="text-amber-400 text-sm font-semibold hover:underline">
              ratuaptarnavimas@gmail.com
            </a>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-center">
            <div className="text-3xl mb-3">📞</div>
            <h3 className="font-bold text-lg mb-1">Telefonas</h3>
            <a href="tel:+37065118482" className="text-amber-400 text-sm font-semibold hover:underline">
              Tel: +370 651 18482
            </a>
          </div>
        </div>

        <div id="registracija" className="mt-8 max-w-3xl mx-auto bg-slate-900 border border-amber-500/40 rounded-2xl p-6 sm:p-8">
          <h3 className="text-2xl font-bold text-center text-amber-500">Registracija vizitui</h3>
          <p className="mt-2 text-center text-sm text-slate-400">
            Pasirinkite pageidaujamą datą ir laiką – vizitą patvirtinsime susisiekę su jumis.
          </p>

          <form onSubmit={handleRegistracijaSubmit} className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="text-sm font-semibold text-slate-200">
              Vardas
              <input
                name="vardas"
                value={registracija.vardas}
                onChange={handleRegistracijosChange}
                required
                className="mt-1.5 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-white outline-none focus:border-amber-500"
              />
            </label>

            <label className="text-sm font-semibold text-slate-200">
              Telefono numeris
              <input
                type="tel"
                name="telefonas"
                value={registracija.telefonas}
                onChange={handleRegistracijosChange}
                required
                className="mt-1.5 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-white outline-none focus:border-amber-500"
              />
            </label>

            <label className="text-sm font-semibold text-slate-200 sm:col-span-2">
              El. paštas
              <input
                type="email"
                name="elPastas"
                value={registracija.elPastas}
                onChange={handleRegistracijosChange}
                required
                className="mt-1.5 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-white outline-none focus:border-amber-500"
              />
            </label>

            <label className="text-sm font-semibold text-slate-200 sm:col-span-2">
              Automobilis
              <input
                name="automobilis"
                value={registracija.automobilis}
                onChange={handleRegistracijosChange}
                required
                placeholder="Markė, modelis, valstybinis numeris"
                className="mt-1.5 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-white outline-none placeholder:text-slate-500 focus:border-amber-500"
              />
            </label>

            <label className="text-sm font-semibold text-slate-200">
              Pageidaujama data
              <input
                type="date"
                name="data"
                value={registracija.data}
                onChange={handleRegistracijosChange}
                min={new Date().toISOString().split('T')[0]}
                required
                className="mt-1.5 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-white outline-none focus:border-amber-500"
              />
            </label>

            <label className="text-sm font-semibold text-slate-200">
              Pageidaujamas laikas
              <input
                type="time"
                name="laikas"
                value={registracija.laikas}
                onChange={handleRegistracijosChange}
                required
                className="mt-1.5 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-white outline-none focus:border-amber-500"
              />
            </label>

            <label className="text-sm font-semibold text-slate-200 sm:col-span-2">
              Papildoma informacija
              <textarea
                name="pastabos"
                value={registracija.pastabos}
                onChange={handleRegistracijosChange}
                rows="4"
                placeholder="Trumpai aprašykite, kokių darbų reikia"
                className="mt-1.5 w-full resize-y rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-white outline-none placeholder:text-slate-500 focus:border-amber-500"
              />
            </label>

            <div className="sm:col-span-2">
              <button
                type="submit"
                className="w-full rounded-lg bg-amber-500 px-4 py-3 font-bold text-slate-950 transition-colors hover:bg-amber-400"
              >
                Registruotis vizitui
              </button>
              {registracijosBusena && <p className="mt-3 text-center text-sm text-slate-300">{registracijosBusena}</p>}
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
