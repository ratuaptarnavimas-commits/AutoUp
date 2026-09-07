import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import ServiceSlider from "./components/ServiceSlider";
import Paslaugos from "./components/Paslaugos";
import PaslaugosDetaliai from "./components/PaslaugosDetaliai";
import AkcijosPage from "./pages/AkcijosPage";
import AutoprekesPage from "./pages/AutoprekesPage";
import Kontaktai from "./components/Kontaktai";
import BoltsBackground from "./components/BoltsBackground";
import PasswordRecoveryModal from "./components/auth/PasswordRecoveryModal";
import SchemaOrg from "./components/seo/SchemaOrg";

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
              </>
            }
          />
          <Route path="/paslaugos" element={<Paslaugos />} />
          <Route path="/paslaugos/:id" element={<PaslaugosDetaliai />} />
          <Route path="/akcijos" element={<AkcijosPage />} />
          <Route path="/autoprekes" element={<AutoprekesPage />} />
          <Route path="/kontaktai" element={<Kontaktai />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
