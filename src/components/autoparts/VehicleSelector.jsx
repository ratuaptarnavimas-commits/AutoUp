import React, { useEffect, useMemo, useState } from "react";
import { CarFront, Check, ChevronDown, Loader2, Search } from "lucide-react";
import { vehicleCatalogProvider } from "../../services/vehicleCatalog";

const STORAGE_KEY = "autoup_selected_vehicle";

const isSavedSelectionValid = (saved) => Boolean(
  saved?.make?.makeId
  && saved?.model?.modelId
  && saved?.generation?.generationId
  && saved?.year?.yearFrom
  && Object.prototype.hasOwnProperty.call(saved.year, "yearTo")
  && saved?.engine?.engineId
);

function SearchSelect({ label, value, options, optionLabel, onChange, disabled, placeholder }) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const filteredOptions = useMemo(() => options.filter((option) => optionLabel(option).toLowerCase().includes(query.trim().toLowerCase())), [optionLabel, options, query]);

  useEffect(() => {
    if (disabled) setIsOpen(false);
  }, [disabled]);

  return (
    <div className="relative">
      <span className="mb-1.5 block text-[11px] font-bold uppercase text-emerald-100/55">{label}</span>
      <button type="button" disabled={disabled} onClick={() => setIsOpen((open) => !open)} className="flex w-full items-center justify-between rounded-lg border border-emerald-800 bg-[#04100a] px-3 py-3 text-left text-sm font-bold text-white outline-none transition hover:border-emerald-600 disabled:cursor-not-allowed disabled:opacity-40 focus:border-amber-500"><span className={value ? "text-white" : "text-emerald-100/35"}>{value ? optionLabel(value) : placeholder}</span><ChevronDown className="h-4 w-4 text-emerald-400" /></button>
      {isOpen && <div className="absolute inset-x-0 top-full z-30 mt-1 overflow-hidden rounded-lg border border-emerald-700 bg-[#06150d] shadow-2xl"><label className="relative block border-b border-emerald-900 p-2"><span className="sr-only">Ieškoti {label.toLowerCase()}</span><Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-emerald-400" /><input autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder={`Ieškoti: ${label.toLowerCase()}`} className="w-full rounded border border-emerald-900 bg-[#04100a] py-2 pl-9 pr-2 text-xs text-white outline-none focus:border-amber-500" /></label><div className="max-h-52 overflow-y-auto p-1">{filteredOptions.length === 0 && <p className="p-3 text-xs text-emerald-100/50">Nerasta.</p>}{filteredOptions.map((option) => <button key={option.id || option.generationId || option.engineId || option.label} type="button" onClick={() => { onChange(option); setIsOpen(false); setQuery(""); }} className="flex w-full items-center justify-between rounded px-3 py-2 text-left text-xs text-emerald-100 hover:bg-emerald-900/70 hover:text-white"><span>{optionLabel(option)}</span>{value === option && <Check className="h-4 w-4 text-amber-400" />}</button>)}</div></div>}
    </div>
  );
}

export default function VehicleSelector({ onVehicleSelected }) {
  const [makes, setMakes] = useState([]);
  const [models, setModels] = useState([]);
  const [generations, setGenerations] = useState([]);
  const [years, setYears] = useState([]);
  const [engines, setEngines] = useState([]);
  const [selection, setSelection] = useState({ make: null, model: null, generation: null, year: null, engine: null });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const loadCatalog = async () => {
      const makeItems = await vehicleCatalogProvider.getMakes();
      if (isMounted) setMakes(makeItems);
      try {
        const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
        if (!isSavedSelectionValid(saved)) {
          if (saved) localStorage.removeItem(STORAGE_KEY);
          return;
        }
        const modelItems = await vehicleCatalogProvider.getModels(saved.make.makeId);
        const generationItems = await vehicleCatalogProvider.getGenerations(saved.model.modelId);
        const yearItems = await vehicleCatalogProvider.getYears(saved.generation.generationId);
        const engineItems = await vehicleCatalogProvider.getEngines(saved.generation.generationId, saved.year);
        if (isMounted) {
          setModels(modelItems);
          setGenerations(generationItems);
          setYears(yearItems);
          setEngines(engineItems);
          setSelection(saved);
        }
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    };
    loadCatalog().finally(() => { if (isMounted) setIsLoading(false); });
    return () => { isMounted = false; };
  }, []);

  const selectMake = async (make) => { setSelection({ make, model: null, generation: null, year: null, engine: null }); setModels(await vehicleCatalogProvider.getModels(make.makeId)); setGenerations([]); setYears([]); setEngines([]); };
  const selectModel = async (model) => { setSelection((current) => ({ ...current, model, generation: null, year: null, engine: null })); setGenerations(await vehicleCatalogProvider.getGenerations(model.modelId)); setYears([]); setEngines([]); };
  const selectGeneration = async (generation) => { setSelection((current) => ({ ...current, generation, year: null, engine: null })); setYears(await vehicleCatalogProvider.getYears(generation.generationId)); setEngines([]); };
  const selectYear = async (year) => { setSelection((current) => ({ ...current, year, engine: null })); setEngines(await vehicleCatalogProvider.getEngines(selection.generation.generationId, year)); };
  const selectEngine = (engine) => setSelection((current) => ({ ...current, engine }));
  const isComplete = Boolean(selection.make && selection.model && selection.generation && selection.year && selection.engine);
  const showParts = () => { if (!isComplete) return; localStorage.setItem(STORAGE_KEY, JSON.stringify(selection)); onVehicleSelected(selection); };

  return <section className="mb-5 rounded-xl border border-emerald-700/80 bg-[#071a11] p-4 shadow-xl sm:p-5"><div className="mb-4 flex items-center gap-3"><CarFront className="h-5 w-5 text-emerald-400" /><h2 className="text-sm font-black uppercase tracking-wider">Pasirinkite automobilį</h2>{isLoading && <Loader2 className="h-4 w-4 animate-spin text-emerald-400" />}</div><div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-6"><SearchSelect label="Markė" value={selection.make} options={makes} optionLabel={(item) => item.makeName} onChange={selectMake} disabled={isLoading} placeholder="Pasirinkite markę" /><SearchSelect label="Modelis" value={selection.model} options={models} optionLabel={(item) => item.modelName} onChange={selectModel} disabled={!selection.make} placeholder="Pasirinkite modelį" /><SearchSelect label="Karta / kėbulas" value={selection.generation} options={generations} optionLabel={(item) => item.generationName} onChange={selectGeneration} disabled={!selection.model} placeholder="Pasirinkite kartą" /><SearchSelect label="Gamybos metai" value={selection.year} options={years} optionLabel={(item) => item.label} onChange={selectYear} disabled={!selection.generation} placeholder="Pasirinkite metus" /><SearchSelect label="Variklis" value={selection.engine} options={engines} optionLabel={(item) => item.engineName} onChange={selectEngine} disabled={!selection.year} placeholder="Pasirinkite variklį" /><button type="button" onClick={showParts} disabled={!isComplete} className="self-end rounded-lg bg-amber-500 px-4 py-3 text-xs font-black uppercase text-black transition hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-40">Rodyti dalis</button></div>{isComplete && <div className="mt-4 flex flex-col justify-between gap-3 border-t border-emerald-900 pt-4 sm:flex-row sm:items-center"><div><p className="text-xs font-black uppercase tracking-wider text-emerald-400">Dalys jūsų automobiliui</p><p className="mt-1 font-bold">{selection.make.makeName} {selection.model.modelName} {selection.generation.generationName}</p><p className="text-sm text-emerald-100/65">{selection.engine.engineName} · {selection.year.label}</p></div><button type="button" onClick={() => setSelection({ make: null, model: null, generation: null, year: null, engine: null })} className="text-left text-xs font-black uppercase text-amber-300 hover:text-amber-200 sm:text-right">Keisti automobilį</button></div>}</section>;
}
