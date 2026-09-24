import React, { useEffect, useMemo, useState } from "react";
import {
  CarFront, Cog, Disc3, Droplet, Filter, Lightbulb,
  Minus, Plus, RotateCw, Search, Settings, ShoppingBag, Thermometer,
  Trash2, Wind, X, Zap
} from "lucide-react";
import { Link } from "react-router-dom";
import { autopartsCategories } from "./autopartsData";
import VehicleSelector from "./VehicleSelector";
import { getCustomerCatalog } from "../../services/suppliers/supplierService";
import { addCartItem, loadCart, saveCart, updateCartQuantity } from "../../services/cartStorage";

const categoryIcons = { disc: Disc3, car: CarFront, settings: Settings, filter: Filter, droplet: Droplet, rotate: RotateCw, cog: Cog, thermometer: Thermometer, zap: Zap, lightbulb: Lightbulb, wind: Wind, "car-front": CarFront };
const formatPrice = (price) => `${price.toFixed(2).replace(".", ",")} €`;

export default function AutoprekesStore() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [query, setQuery] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState("");
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [cart, setCart] = useState(() => loadCart());
  const [isCartOpen, setIsCartOpen] = useState(false);
  const customerCatalog = useMemo(() => getCustomerCatalog(), []);
  useEffect(() => saveCart(cart), [cart]);

  const visibleProducts = useMemo(() => {
    const normalizedQuery = submittedQuery.trim().toLowerCase();
    const hasSearch = Boolean(normalizedQuery);
    const hasCategory = selectedCategory !== "all";
    const hasVehicle = Boolean(selectedVehicle?.engine?.engineId);
    if (!hasSearch && !hasCategory && !hasVehicle) return [];
    return customerCatalog.filter((product) => {
      const matchesCategory = !hasCategory || product.category === selectedCategory;
      const matchesVehicle = !hasVehicle || product.compatibleVehicleIds?.includes(selectedVehicle.engine.engineId);
      const searchable = `${product.brand} ${product.name} ${product.sku} ${product.code} ${product.ean || ""} ${(product.oemNumbers || []).join(" ")} ${product.fitment}`.toLowerCase();
      const matchesSearch = !hasSearch || searchable.includes(normalizedQuery);
      return matchesCategory && matchesVehicle && matchesSearch;
    });
  }, [customerCatalog, selectedCategory, selectedVehicle, submittedQuery]);

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
  const addToCart = (product) => setCart((current) => addCartItem(current, product));
  const changeQuantity = (id, change) => setCart((current) => updateCartQuantity(current, id, change));

  return (
    <main className="min-h-screen px-4 py-9 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-7 flex flex-col gap-5 border-b border-emerald-900/80 pb-7 md:flex-row md:items-end md:justify-between">
          <div><p className="mb-2 text-xs font-black uppercase tracking-[0.22em] text-emerald-400">AutoUp katalogas</p><h1 className="text-3xl font-black uppercase tracking-tight sm:text-4xl">Autodalys ir autoprekės</h1><p className="mt-2 text-emerald-100/70">Raskite tinkamas dalis savo automobiliui</p></div>
          <Link to="/autoprekes-preview/cart" className="inline-flex items-center justify-center gap-2 rounded-lg border border-emerald-600 px-4 py-2.5 text-xs font-black uppercase text-emerald-100 transition hover:border-amber-500 hover:text-amber-300" aria-label={`Atidaryti krepšelį, prekių: ${cartCount}`}><ShoppingBag className="h-4 w-4" /> Krepšelis ({cartCount})</Link>
        </header>

        <VehicleSelector onVehicleSelected={setSelectedVehicle} />

        <section className="mb-7 rounded-xl border border-emerald-900 bg-[#06150d] p-4 sm:p-5"><h2 className="mb-3 text-sm font-black uppercase tracking-wider">Ar žinote detalės kodą?</h2><form className="flex flex-col gap-3 sm:flex-row" onSubmit={(event) => { event.preventDefault(); setSubmittedQuery(query); }}><label className="relative block flex-1"><span className="sr-only">OEM, prekės kodas arba pavadinimas</span><Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-emerald-400" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Įveskite OEM, prekės kodą arba pavadinimą" className="w-full rounded-lg border border-emerald-800 bg-[#04100a] py-3 pl-10 pr-4 text-sm text-white outline-none placeholder:text-emerald-100/35 focus:border-amber-500" /></label><button type="submit" className="rounded-lg border border-amber-500 bg-amber-500 px-6 py-3 text-xs font-black uppercase text-black transition hover:bg-amber-400">Ieškoti</button></form></section>

        <section className="mb-8"><div className="mb-3 flex items-center justify-between"><h2 className="text-sm font-black uppercase tracking-wider">Autodalių kategorijos</h2><span className="text-xs text-emerald-100/45">{visibleProducts.length} prekės</span></div><div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">{autopartsCategories.map((category) => { const Icon = categoryIcons[category.icon]; return <button key={category.id} type="button" onClick={() => setSelectedCategory(category.id)} className={`flex min-h-[70px] items-center gap-2 rounded-lg border px-3 py-3 text-left text-xs font-black uppercase transition ${selectedCategory === category.id ? "border-amber-500 bg-emerald-900/70 text-amber-300" : "border-emerald-900 bg-[#07150e] text-emerald-100/75 hover:border-emerald-600 hover:text-white"}`}><Icon className="h-5 w-5 shrink-0 text-emerald-400" />{category.label}</button>; })}</div></section>

        <section><div className="mb-3 flex items-center justify-between border-b border-emerald-900 pb-3"><h2 className="text-sm font-black uppercase tracking-wider">Dalys pagal pasirinktus kriterijus</h2><span className="text-xs text-emerald-100/45">{visibleProducts.length} prekės</span></div>{visibleProducts.length > 0 ? <div className="space-y-3">{visibleProducts.map((product) => <article key={product.id} className="rounded-lg border border-emerald-900 bg-[#07150e] p-4 transition hover:border-emerald-600"><div className="grid gap-4 lg:grid-cols-[1fr_1.5fr_auto] lg:items-center"><div><p className="text-xs font-black tracking-wider text-amber-400">{product.brand}</p><h3 className="mt-1 font-bold text-white">{product.name}</h3><p className="mt-2 text-xs text-emerald-100/55">Kodas: <span className="text-emerald-100/80">{product.code}</span></p></div><div className="grid gap-2 text-xs sm:grid-cols-3"><p className="text-emerald-100/70"><span className="mb-1 block text-[10px] uppercase text-emerald-100/40">Tinka automobiliui</span><span className="font-bold text-emerald-200">✓ {product.fitment}</span></p><p className="text-emerald-100/70"><span className="mb-1 block text-[10px] uppercase text-emerald-100/40">Likutis</span><span className={product.stock === "Sandėlyje" ? "font-bold text-emerald-400" : "font-bold text-amber-300"}>{product.stock}</span></p><p className="text-emerald-100/70"><span className="mb-1 block text-[10px] uppercase text-emerald-100/40">Pristatymas</span><span className="font-bold text-white">{product.delivery}</span></p></div><div className="flex items-center justify-between gap-4 border-t border-emerald-900 pt-3 lg:block lg:border-0 lg:pt-0"><strong className="text-xl text-white">{formatPrice(product.price)}</strong><div className="mt-2 flex gap-2"><Link to={`/autoprekes-preview/product/${product.slug}`} className="rounded border border-emerald-700 px-3 py-2 text-[10px] font-black uppercase text-emerald-100 hover:border-amber-500 hover:text-amber-300">Peržiūrėti</Link><button type="button" onClick={() => addToCart(product)} className="rounded bg-amber-500 px-3 py-2 text-[10px] font-black uppercase text-black hover:bg-amber-400">Į krepšelį</button></div></div></div><Link to={`/autoprekes-preview/product/${product.slug}`} className="mt-3 block border-t border-emerald-900 pt-3 text-[10px] font-black uppercase tracking-wide text-emerald-400 hover:text-amber-300">Detalė + montavimas AutoUp →</Link></article>)}</div> : <p className="rounded-lg border border-emerald-900 p-8 text-center text-sm text-emerald-100/60">{submittedQuery.trim() ? "Pagal jūsų paiešką prekių nerasta." : selectedVehicle ? "Šiam automobiliui kol kas nėra katalogo duomenų." : "Pasirinkite automobilį, kategoriją arba ieškokite detalės pagal kodą."}</p>}</section>
      </div>

      {isCartOpen && <div className="fixed inset-0 z-50 bg-black/70" role="presentation" onClick={() => setIsCartOpen(false)}><aside className="ml-auto flex h-full w-full max-w-md flex-col border-l border-emerald-800 bg-[#06150d] p-5 shadow-2xl" role="dialog" aria-modal="true" aria-label="Pirkinių krepšelis" onClick={(event) => event.stopPropagation()}><header className="flex items-center justify-between border-b border-emerald-800 pb-4"><h2 className="text-xl font-black">Krepšelis</h2><button type="button" onClick={() => setIsCartOpen(false)} aria-label="Uždaryti krepšelį" className="rounded-lg p-2 text-emerald-100 hover:bg-emerald-900"><X className="h-5 w-5" /></button></header><div className="flex-1 space-y-4 overflow-y-auto py-5">{cart.length === 0 && <p className="py-10 text-center text-emerald-100/60">Krepšelis tuščias.</p>}{cart.map((item) => <div key={item.id} className="flex gap-3 border-b border-emerald-900 pb-4"><div className="flex-1"><p className="font-bold">{item.brand} {item.name}</p><p className="mt-1 text-sm text-amber-300">{formatPrice(item.price)}</p></div><div className="flex items-center gap-2"><button type="button" onClick={() => changeQuantity(item.id, -1)} className="rounded bg-emerald-900 p-1" aria-label="Sumažinti kiekį"><Minus className="h-4 w-4" /></button><span className="w-5 text-center">{item.quantity}</span><button type="button" onClick={() => changeQuantity(item.id, 1)} className="rounded bg-emerald-900 p-1" aria-label="Padidinti kiekį"><Plus className="h-4 w-4" /></button><button type="button" onClick={() => changeQuantity(item.id, -item.quantity)} className="ml-1 text-red-300" aria-label="Pašalinti prekę"><Trash2 className="h-4 w-4" /></button></div></div>)}</div><footer className="border-t border-emerald-800 pt-4"><div className="mb-4 flex justify-between text-lg font-black"><span>Viso</span><span className="text-amber-300">{formatPrice(cartTotal)}</span></div><button type="button" disabled={!cart.length} className="w-full rounded-xl bg-amber-500 px-4 py-3 font-black text-black transition hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-40">Tęsti užsakymą</button></footer></aside></div>}
    </main>
  );
}
