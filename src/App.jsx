import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import ServiceSlider from "./components/ServiceSlider";
import Paslaugos from "./components/Paslaugos";
import PaslaugosDetaliai from "./components/PaslaugosDetaliai";
import AkcijosPage from "./pages/AkcijosPage";
import Kontaktai from "./components/Kontaktai";

export default function App() {
  return (
    <div className="min-h-screen bg-[#0B0F17] font-sans text-white">
      <Navbar />
      <Routes>
        <Route path="/" element={<ServiceSlider />} />
        <Route path="/paslaugos" element={<Paslaugos />} />
        <Route path="/paslaugos/:id" element={<PaslaugosDetaliai />} />
        <Route path="/akcijos" element={<AkcijosPage />} />
        <Route path="/kontaktai" element={<Kontaktai />} />
      </Routes>
    </div>
  );
}
