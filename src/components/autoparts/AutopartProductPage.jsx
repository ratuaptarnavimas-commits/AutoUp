import React, { useMemo, useState } from "react";
import { ArrowLeft, ImageOff, Wrench } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { getCustomerProductBySlug } from "../../services/suppliers/supplierService";
import { addCartItem, loadCart, saveCart } from "../../services/cartStorage";

const formatPrice = (price) => `${price.toFixed(2).replace(".", ",")} €`;
const readSelectedVehicle = () => {
  try {
    const value = JSON.parse(localStorage.getItem("autoup_selected_vehicle") || "null");
    return value?.engine?.engineId ? value : null;
  } catch {
    localStorage.removeItem("autoup_selected_vehicle");
    return null;
  }
};

export default function AutopartProductPage() {
  const { slug } = useParams();
  const product = getCustomerProductBySlug(slug);
  const [isMountingOpen, setIsMountingOpen] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const selectedVehicle = useMemo(readSelectedVehicle, []);

  if (!product) {
    return <main className="min-h-screen px-4 py-16 text-white sm:px-6 lg:px-8"><div className="mx-auto max-w-3xl rounded-xl border border-emerald-900 bg-[#07150e] p-8 text-center"><h1 className="text-2xl font-black">Prekė nerasta</h1><Link to="/autoprekes-preview" className="mt-5 inline-flex text-sm font-bold text-amber-300 hover:text-amber-200">← Grįžti į katalogą</Link></div></main>;
  }

  const vehicleMatches = selectedVehicle ? product.compatibleVehicleIds?.includes(selectedVehicle.engine.engineId) : null;
  const selectedVehicleLabel = selectedVehicle ? `${selectedVehicle.make.makeName} ${selectedVehicle.model.modelName} ${selectedVehicle.generation.generationName} · ${selectedVehicle.engine.engineName}` : null;
  const addToCart = () => {
    saveCart(addCartItem(loadCart(), product));
    setIsAdded(true);
  };

  return <main className="min-h-screen px-4 py-9 text-white sm:px-6 lg:px-8"><div className="mx-auto max-w-5xl"><Link to="/autoprekes-preview" className="mb-6 inline-flex items-center gap-2 text-xs font-black uppercase text-emerald-300 hover:text-amber-300"><ArrowLeft className="h-4 w-4" /> Grįžti į katalogą</Link><article className="rounded-xl border border-emerald-900 bg-[#07150e] p-5 sm:p-7"><div className="grid gap-7 lg:grid-cols-[220px_1fr]"><div className="flex aspect-square items-center justify-center rounded-lg border border-emerald-900 bg-[#04100a] text-emerald-400"><ImageOff className="h-10 w-10" aria-label="Nuotrauka neįkelta" /></div><div><p className="text-xs font-black tracking-wider text-amber-400">{product.brand}</p><h1 className="mt-2 text-2xl font-black">{product.name}</h1><p className="mt-3 text-sm text-emerald-100/65">Kodas / SKU: <span className="text-emerald-100/90">{product.code || product.sku}</span></p><p className="mt-1 text-sm text-emerald-100/65">EAN: <span className="text-emerald-100/90">{product.ean || "Nenurodytas"}</span></p>{product.tecdocArticleId && <p className="mt-1 text-sm text-emerald-100/65">TecDoc Article ID: <span className="text-emerald-100/90">{product.tecdocArticleId}</span></p>}<p className="mt-5 text-sm leading-relaxed text-emerald-100/75">{product.description}</p><div className="mt-6 flex flex-wrap items-end justify-between gap-5"><div><p className="text-xs uppercase text-emerald-100/45">AutoUp kaina</p><strong className="text-3xl text-white">{formatPrice(product.price)}</strong></div><div className="text-right text-sm"><p className="font-bold text-emerald-400">{product.stock}</p><p className="text-emerald-100/65">Pristatymas: {product.delivery}</p></div></div><div className="mt-5 flex flex-wrap gap-2"><button type="button" onClick={addToCart} className="rounded-lg bg-amber-500 px-4 py-3 text-xs font-black uppercase text-black hover:bg-amber-400">{isAdded ? "Įdėta į krepšelį" : "Į krepšelį"}</button><button type="button" onClick={() => setIsMountingOpen(true)} className="inline-flex items-center gap-2 rounded-lg border border-emerald-600 px-4 py-3 text-xs font-black uppercase text-emerald-100 hover:border-amber-500 hover:text-amber-300"><Wrench className="h-4 w-4" /> Detalė + montavimas AutoUp</button></div></div></div><div className="mt-8 grid gap-5 border-t border-emerald-900 pt-6 md:grid-cols-2"><section><h2 className="text-sm font-black uppercase tracking-wider">Techniniai duomenys</h2><dl className="mt-3 space-y-2 text-sm text-emerald-100/70"><div className="flex justify-between gap-3 border-b border-emerald-900 pb-2"><dt>Kategorija</dt><dd className="font-bold text-white">{product.category}</dd></div><div className="flex justify-between gap-3 border-b border-emerald-900 pb-2"><dt>OEM numeriai</dt><dd className="text-right font-bold text-white">{product.oemNumbers?.length ? product.oemNumbers.join(", ") : "Nenurodyta"}</dd></div>{product.specifications?.map((specification) => <div key={specification.label} className="flex justify-between gap-3 border-b border-emerald-900 pb-2"><dt>{specification.label}</dt><dd className="text-right font-bold text-white">{specification.value}</dd></div>)}</dl></section><section><h2 className="text-sm font-black uppercase tracking-wider">Tinka šiems automobiliams</h2><p className="mt-3 text-sm text-emerald-100/75">{product.fitment}</p>{selectedVehicle && <p className={`mt-4 rounded-lg border p-3 text-sm font-bold ${vehicleMatches ? "border-emerald-600 bg-emerald-950/60 text-emerald-300" : "border-amber-700 bg-amber-950/30 text-amber-300"}`}>{vehicleMatches ? "✓ Tinka jūsų pasirinktam automobiliui" : "Ši detalė nepatvirtinta jūsų pasirinktam automobiliui."}</p>}</section></div></article></div>{isMountingOpen && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4" role="presentation" onClick={() => setIsMountingOpen(false)}><div role="dialog" aria-modal="true" aria-label="Montavimo rezervacija" onClick={(event) => event.stopPropagation()} className="w-full max-w-md rounded-xl border border-emerald-700 bg-[#06150d] p-6 shadow-2xl"><h2 className="text-xl font-black">Norite šią detalę sumontuoti AutoUp autoservise?</h2><p className="mt-3 text-sm text-emerald-100/70">{product.name}</p>{selectedVehicleLabel && <p className="mt-1 text-sm text-emerald-100/60">Automobilis: {selectedVehicleLabel}</p>}<div className="mt-5 flex gap-3"><Link to="/kontaktai#registracija" className="rounded-lg bg-amber-500 px-4 py-3 text-xs font-black uppercase text-black hover:bg-amber-400">Rezervuoti montavimą</Link><button type="button" onClick={() => setIsMountingOpen(false)} className="rounded-lg border border-emerald-700 px-4 py-3 text-xs font-black uppercase text-emerald-100">Uždaryti</button></div></div></div>}</main>;
}
