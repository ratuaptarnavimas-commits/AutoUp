import React from "react";
import { Link, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import ServiceSlider from "./components/ServiceSlider";
import TireDisposalCard from "./components/TireDisposalCard";
import Paslaugos from "./components/Paslaugos";
import PaslaugosDetaliai from "./components/PaslaugosDetaliai";
import AkcijosPage from "./pages/AkcijosPage";
import AutoprekesPage from "./pages/AutoprekesPage";
import AutoprekesStore from "./components/autoparts/AutoprekesStore";
import AutopartProductPage from "./components/autoparts/AutopartProductPage";
import AutopartsCartPage from "./components/autoparts/AutopartsCartPage";
import AutopartsCheckoutPage from "./components/autoparts/AutopartsCheckoutPage";
import Kontaktai from "./components/Kontaktai";
import TireDisposalPage from "./pages/TireDisposalPage";
import BoltsBackground from "./components/BoltsBackground";
import PasswordRecoveryModal from "./components/auth/PasswordRecoveryModal";
import SchemaOrg from "./components/seo/SchemaOrg";
import autopartsImage from "./static/image/Automobiliu dalys-1.webp";

function App() {
  return (
    <div
      className="site-surface"
      style={{
        position: 'relative',
        minHeight: '100vh',
        backgroundColor: 'transparent' // Švarus tamsus fonas be jokio paveikslėlio
      }}
    >
      <BoltsBackground />
      <PasswordRecoveryModal />
      <div className="relative z-10">
        <SchemaOrg />
        <Navbar />
        <Routes>
          <Route
            path="/"
            element={
              <>
                <ServiceSlider />
                <div className="mx-auto max-w-[1240px] px-4 pb-6 sm:px-6 lg:px-8">
                  <div className="grid gap-4 lg:grid-cols-2">
                    <TireDisposalCard />
                    <section className="relative min-h-[162px] overflow-hidden rounded-2xl border border-emerald-700/70 bg-emerald-950/90 p-5 shadow-2xl shadow-emerald-950/30 sm:p-6">
                      <img src={autopartsImage} alt="Automobilių dalys" className="absolute inset-y-0 right-0 h-full w-[46%] object-cover object-left opacity-90" />
                      <div className="absolute inset-0 bg-gradient-to-r from-emerald-950 via-emerald-950/90 to-emerald-950/10" />
                      <div className="relative z-10 max-w-[70%]">
                        <h2 className="text-xl font-black text-white sm:text-2xl">Automobilių dalys</h2>
                        <p className="mt-1 text-sm leading-relaxed text-emerald-100">Prekiaujame automobilių dalimis įvairių markių automobiliams. Padedame parinkti tinkamas dalis pagal automobilį.</p>
                        <Link to="/kontaktai#registracija" className="mt-4 inline-flex items-center justify-center rounded-xl bg-amber-500 px-4 py-2.5 text-center text-xs font-black uppercase tracking-wide text-black transition-colors hover:bg-amber-400">
                          Teirautis dėl dalių
                        </Link>
                      </div>
                    </section>
                  </div>
                </div>
              </>
            }
          />
          <Route path="/paslaugos" element={<Paslaugos />} />
          <Route path="/paslaugos/:id" element={<PaslaugosDetaliai />} />
          <Route path="/akcijos" element={<AkcijosPage />} />
          <Route path="/autoprekes" element={<AutoprekesPage />} />
          <Route path="/autoprekes-preview/product/:slug" element={<AutopartProductPage />} />
          <Route path="/autoprekes-preview/cart" element={<AutopartsCartPage />} />
          <Route path="/autoprekes-preview/checkout" element={<AutopartsCheckoutPage />} />
          <Route path="/autoprekes-preview" element={<AutoprekesStore />} />
          <Route path="/kontaktai" element={<Kontaktai />} />
          <Route path="/padangu-priemimas" element={<TireDisposalPage />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
