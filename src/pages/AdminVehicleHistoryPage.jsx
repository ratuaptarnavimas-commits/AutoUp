import React, { useMemo, useState } from "react";
import {
  createServiceRecord,
  createVehicle,
  findAdminVehicleByRegistrationNumber,
  findAdminVehicleByVin,
  getVehicleServiceRecords,
  normalizeVehicleIdentifier,
  deleteServiceRecord,
  updateServiceRecord,
  updateVehicle,
} from "@/services/vehicleHistoryService";
import { useAdmin } from "@/context/AdminContext";
import AdminLoginModal from "@/components/auth/AdminLoginModal";

const SAMPLE_VEHICLES = [
  {
    id: 1,
    make: "Volkswagen",
    model: "Passat",
    year: 2016,
    engine: "2.0 TDI",
    registrationNumber: "ABC123",
    vin: "WVWZZZ1KZ6W000001",
    records: [
      {
        id: 1,
        date: "2026-09-18",
        mileage: 184250,
        category: "Periodinis aptarnavimas",
        customerComplaint: "",
        workPerformed: [
          "Pakeista variklio alyva",
          "Pakeistas alyvos filtras",
          "Pakeistas oro filtras",
          "Pakeistas salono filtras",
        ],
        partsUsed: [
          { name: "Variklio alyva 5W-30 – 5 l", location: "" },
          { name: "Alyvos filtras", location: "" },
          { name: "Oro filtras", location: "" },
          { name: "Salono filtras", location: "" },
        ],
        materialsUsed: [],
        publicNotes: "",
        internalNotes: "",
        performedBy: "AutoUP",
        verifiedByAutoup: true,
      },
      {
        id: 2,
        date: "2026-07-03",
        mileage: 177800,
        category: "Stabdžių sistemos remontas",
        customerComplaint: "Stabdant jaučiama vibracija.",
        workPerformed: [
          "Patikrinta stabdžių sistema",
          "Pakeisti priekiniai stabdžių diskai",
          "Pakeistos priekinės stabdžių kaladėlės",
        ],
        partsUsed: [
          { name: "Priekiniai stabdžių diskai", location: "Priekis" },
          { name: "Priekinės stabdžių kaladėlės", location: "Priekis" },
        ],
        materialsUsed: [],
        publicNotes: "",
        internalNotes: "",
        performedBy: "AutoUP",
        verifiedByAutoup: true,
      },
      {
        id: 3,
        date: "2026-04-14",
        mileage: 169400,
        category: "Važiuoklės remontas",
        customerComplaint: "Pašaliniai garsai priekinėje važiuoklėje.",
        workPerformed: [
          "Atlikta priekinės važiuoklės patikra",
          "Pakeistas dešinės pusės šarnyras",
          "Pakeistas vairo traukės antgalis",
          "Pakeista stabilizatoriaus traukė",
        ],
        partsUsed: [
          { name: "Šarnyras", location: "Priekis – dešinė" },
          { name: "Vairo traukės antgalis", location: "Priekis – dešinė" },
          { name: "Stabilizatoriaus traukė", location: "Priekis" },
        ],
        materialsUsed: [],
        publicNotes: "",
        internalNotes: "",
        performedBy: "AutoUP",
        verifiedByAutoup: true,
      },
    ],
  },
];

const STORAGE_KEY = "autoup_admin_vehicle_history";
const STORAGE_KEY_PUBLIC = "autoup_vehicle_history_records";

const LEGACY_HISTORY_PATTERNS = [
  "KABINA",
  "VIBRACIJA",
  "VIBRACIJOS",
  "ŠALINIMO KLIJAI",
  "VIBRACIJOS ŠALINIMO KLIJAI",
  "PRIEKINĖ DEŠINĖS PUSĖS ATRAMA",
  "DEŠINĖS PUSĖS ATRAMA",
  "ATRAMA",
];

const isLegacyHistoryRecord = (record = {}) => {
  const haystacks = [
    record.category || "",
    record.customerComplaint || "",
    record.publicNotes || "",
    record.internalNotes || "",
    ...(record.workPerformed || []),
    ...(record.partsUsed || []).flatMap((item) => [item.name, item.location]),
    ...(record.materialsUsed || []),
  ].join(" ").toUpperCase();

  return LEGACY_HISTORY_PATTERNS.some((pattern) => haystacks.includes(pattern));
};

const sanitizeVehicles = (items = []) =>
  items.map((vehicle) => ({
    ...vehicle,
    records: (vehicle.records || []).filter((record) => !isLegacyHistoryRecord(record)),
  }));

const normalizeValue = (value = "") =>
  String(value)
    .trim()
    .toUpperCase()
    .replace(/\s+/g, "")
    .replace(/[^A-Z0-9]/g, "");

const parseDateValue = (dateString) => {
  if (!dateString) return 0;
  const value = String(dateString).trim();
  if (value.includes("-")) {
    const [year, month, day] = value.split("-");
    if (year && month && day) return new Date(`${year}-${month}-${day}`).getTime();
  }
  if (value.includes(".")) {
    const [day, month, year] = value.split(".");
    if (day && month && year) return new Date(`${year}-${month}-${day}`).getTime();
  }
  return 0;
};

const getInitialVehicles = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : SAMPLE_VEHICLES;
    const sanitized = sanitizeVehicles(Array.isArray(parsed) ? parsed : SAMPLE_VEHICLES);

    if (JSON.stringify(sanitized) !== JSON.stringify(parsed)) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sanitized));
    }

    return sanitized.length ? sanitized : SAMPLE_VEHICLES;
  } catch {
    return sanitizeVehicles(SAMPLE_VEHICLES);
  }
};

const getPublicHistoryMap = (vehicles) => {
  const map = {};
  vehicles.forEach((vehicle) => {
    const keys = [normalizeValue(vehicle.registrationNumber), normalizeValue(vehicle.vin)];
    keys.forEach((key) => {
      if (key) map[key] = vehicle.records || [];
    });
  });
  return map;
};

const formatMileage = (value) => {
  if (!value && value !== 0) return "—";
  return `${Number(value).toLocaleString("lt-LT")} km`;
};

const createEmptyEntry = () => ({
  id: Date.now() + Math.random(),
  date: new Date().toISOString().slice(0, 10),
  mileage: "",
  category: "Periodinis aptarnavimas",
  customerComplaint: "",
  workPerformed: [""],
  partsUsed: [],
  materialsUsed: [],
  publicNotes: "",
  internalNotes: "",
  performedBy: "AutoUP",
  verifiedByAutoup: true,
});

const createEmptyVehicle = () => ({
  make: "",
  model: "",
  year: "",
  engine: "",
  registrationNumber: "",
  vin: "",
});

const addItemToList = (list, value = "") => [...list, value];
const updateItemInList = (list, index, value) =>
  list.map((item, itemIndex) => (itemIndex === index ? value : item));
const removeItemFromList = (list, index) => list.filter((_, itemIndex) => itemIndex !== index);

export default function AdminVehicleHistoryPage() {
  const { isAdmin, isLoading, session, user } = useAdmin();
  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicleId, setSelectedVehicleId] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState("registration");
  const [draft, setDraft] = useState(createEmptyEntry);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [isAddingVehicle, setIsAddingVehicle] = useState(false);
  const [newVehicleDraft, setNewVehicleDraft] = useState(createEmptyVehicle);
  const [newVehicleStatus, setNewVehicleStatus] = useState({ type: "", message: "" });
  const [remoteVehicle, setRemoteVehicle] = useState(null);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [editingRecordId, setEditingRecordId] = useState(null);
  const [searchStatus, setSearchStatus] = useState("idle");
  const [isEditingVehicle, setIsEditingVehicle] = useState(false);
  const [vehicleEditDraft, setVehicleEditDraft] = useState(null);
  const [vehicleStatus, setVehicleStatus] = useState({ type: "", message: "" });
  const [recordStatus, setRecordStatus] = useState({ type: "", message: "" });

  const selectedVehicle = useMemo(
    () => remoteVehicle || vehicles.find((vehicle) => vehicle.id === selectedVehicleId) || vehicles[0] || null,
    [remoteVehicle, vehicles, selectedVehicleId]
  );

  const reloadSelectedVehicle = async (vehicleId = selectedVehicle?.id) => {
    if (!vehicleId) return;
    const records = await getVehicleServiceRecords(vehicleId);
    setRemoteVehicle((current) => current ? { ...current, records } : current);
  };

  if (isLoading) {
    return <main className="min-h-screen bg-transparent px-4 py-12 text-white sm:px-6 lg:px-8" />;
  }

  if (!session || !user || !isAdmin) {
    return (
      <main className="min-h-screen bg-transparent px-4 py-12 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl rounded-[28px] border border-red-800/70 bg-[#24100e]/90 p-8 text-center shadow-lg">
          <h1 className="text-3xl font-black uppercase tracking-tight text-amber-400">ADMINISTRATORIAUS PRISIJUNGIMAS REIKALINGAS</h1>
          <p className="mt-4 text-base text-red-100/80">Prisijunkite per Supabase Auth vartotoją su administratoriaus role.</p>
          <button
            type="button"
            onClick={() => setIsLoginOpen(true)}
            className="mt-6 inline-flex items-center justify-center rounded-xl bg-amber-500 px-6 py-3 text-xs font-black uppercase tracking-[0.12em] text-black transition-colors hover:bg-amber-400"
          >
            ADMINISTRATORIAUS PRISIJUNGIMAS
          </button>
        </div>
        <AdminLoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
      </main>
    );
  }

  const handleNewVehicleFieldChange = (field, value) => {
    const nextValue = field === "registrationNumber" || field === "vin"
      ? normalizeVehicleIdentifier(value)
      : value;
    setNewVehicleDraft((current) => ({ ...current, [field]: nextValue }));
  };

  const handleCreateVehicle = async () => {
    const vehicle = {
      ...newVehicleDraft,
      registrationNumber: normalizeVehicleIdentifier(newVehicleDraft.registrationNumber),
      vin: normalizeVehicleIdentifier(newVehicleDraft.vin),
    };

    if (!vehicle.make.trim() || !vehicle.model.trim() || !vehicle.registrationNumber || !vehicle.vin) {
      setNewVehicleStatus({ type: "error", message: "Užpildykite visus privalomus laukus: markę, modelį, valstybinį numerį ir VIN." });
      return;
    }

    if (vehicle.vin.length !== 17) {
      setNewVehicleStatus({ type: "error", message: "VIN turi būti tiksliai 17 simbolių." });
      return;
    }

    try {
      const createdVehicle = await createVehicle({
        ...vehicle,
        make: vehicle.make.trim(),
        model: vehicle.model.trim(),
        engine: vehicle.engine.trim(),
        year: vehicle.year ? Number(vehicle.year) : null,
      });
      const selectedCreatedVehicle = { ...createdVehicle, records: [] };
      setRemoteVehicle(selectedCreatedVehicle);
      setSelectedVehicleId(createdVehicle.id);
      setNewVehicleStatus({ type: "success", message: "Automobilis sėkmingai pridėtas." });
      setNewVehicleDraft(createEmptyVehicle());
      setIsAddingVehicle(false);
      setDraft(createEmptyEntry());
      setEditingRecordId(null);
    } catch (error) {
      console.error("Nepavyko pridėti automobilio į Supabase.", {
        message: error?.message,
        code: error?.code,
        details: error?.details,
        hint: error?.hint,
      });
      const message = error?.code === "VEHICLE_DUPLICATE"
        ? "Automobilis su tokiu valstybiniu numeriu arba VIN jau egzistuoja."
        : "Automobilio išsaugoti nepavyko dėl Supabase ryšio arba teisių klaidos.";
      setNewVehicleStatus({ type: "error", message });
    }
  };

  const handleVehicleSearch = async () => {
    const normalized = normalizeValue(searchQuery);
    if (!normalized) {
      setSearchStatus("not-found");
      setRemoteVehicle(null);
      return;
    }

    setRemoteVehicle(null);
    setIsAddingVehicle(false);
    setNewVehicleStatus({ type: "", message: "" });

    try {
      const vehicle = searchType === "registration"
        ? await findAdminVehicleByRegistrationNumber(normalized)
        : await findAdminVehicleByVin(normalized);

      if (!vehicle) {
        setSearchStatus("not-found");
        return;
      }

      const records = await getVehicleServiceRecords(vehicle.id);
      setRemoteVehicle({ ...vehicle, records });
      setSelectedVehicleId(vehicle.id);
      setSearchStatus("found");
      setVehicleStatus({ type: "", message: "" });
      setRecordStatus({ type: "", message: "" });
      setIsEditingVehicle(false);
      setVehicleEditDraft(null);
      setDraft((current) => ({ ...createEmptyEntry(), date: current.date || new Date().toISOString().slice(0, 10) }));
      setEditingRecordId(null);
    } catch (error) {
      console.error("Nepavyko atlikti ADMIN automobilio paieškos Supabase.", {
        message: error?.message,
        code: error?.code,
        details: error?.details,
        hint: error?.hint,
        error,
      });
      setSearchStatus("error");
    }
  };

  const handleSaveRecord = () => {
    if (!selectedVehicle) return;

    const nextRecord = {
      ...draft,
      mileage: draft.mileage === "" ? null : Number(draft.mileage),
      workPerformed: draft.workPerformed.filter((item) => String(item).trim()).map((item) => String(item).trim()),
      partsUsed: draft.partsUsed
        .filter((item) => item.name.trim() || item.location.trim())
        .map((item) => ({ name: item.name.trim(), location: item.location.trim() })),
      materialsUsed: draft.materialsUsed.filter((item) => String(item).trim()).map((item) => String(item).trim()),
      publicNotes: draft.publicNotes.trim(),
      internalNotes: draft.internalNotes.trim(),
      performedBy: "AutoUP",
      verifiedByAutoup: true,
    };

    if (remoteVehicle?.id === selectedVehicle.id) {
      const saveRequest = editingRecordId
        ? updateServiceRecord(editingRecordId, nextRecord)
        : createServiceRecord(selectedVehicle.id, nextRecord);

      saveRequest
        .then(async (createdRecord) => {
          setRemoteVehicle((current) => ({
            ...current,
            records: editingRecordId
              ? current.records.map((record) => record.id === editingRecordId ? createdRecord : record)
              : [createdRecord, ...(current.records || [])],
          }));
          setDraft(createEmptyEntry());
          setEditingRecordId(null);
          setRecordStatus({ type: "success", message: editingRecordId ? "Įrašas sėkmingai atnaujintas." : "Įrašas sėkmingai išsaugotas." });
          await reloadSelectedVehicle(selectedVehicle.id);
        })
        .catch((error) => {
          console.error("Nepavyko išsaugoti service record Supabase.", {
            message: error?.message,
            code: error?.code,
            details: error?.details,
            hint: error?.hint,
          });
          setRecordStatus({ type: "error", message: "Įrašo išsaugoti nepavyko." });
        });
      return;
    }

    setVehicles((current) =>
      current.map((vehicle) => {
        if (vehicle.id !== selectedVehicle.id) return vehicle;
        const nextRecords = editingRecordId
          ? (vehicle.records || []).map((record) => record.id === editingRecordId ? { ...record, ...nextRecord } : record)
          : [nextRecord, ...(vehicle.records || [])];
        const sortedRecords = nextRecords.sort(
          (a, b) => parseDateValue(b.date) - parseDateValue(a.date)
        );
        return { ...vehicle, records: sortedRecords };
      })
    );

    setDraft(createEmptyEntry());
    setEditingRecordId(null);
  };

  const handleDeleteRecord = (recordId) => {
    if (!selectedVehicle) return;

    if (remoteVehicle?.id === selectedVehicle.id) {
      deleteServiceRecord(recordId)
        .then(async () => {
          setConfirmDeleteId(null);
          setRecordStatus({ type: "success", message: "Įrašas sėkmingai ištrintas." });
          await reloadSelectedVehicle(selectedVehicle.id);
        })
        .catch((error) => {
          console.error("Nepavyko ištrinti service record Supabase.", {
            message: error?.message,
            code: error?.code,
            details: error?.details,
            hint: error?.hint,
            error,
          });
          setRecordStatus({ type: "error", message: "Įrašo ištrinti nepavyko." });
        });
      return;
    }

    setVehicles((current) =>
      current.map((vehicle) => {
        if (vehicle.id !== selectedVehicle.id) return vehicle;
        return {
          ...vehicle,
          records: (vehicle.records || []).filter((record) => record.id !== recordId),
        };
      })
    );
    setConfirmDeleteId(null);
  };

  const handleEditVehicle = () => {
    setVehicleEditDraft({
      make: selectedVehicle.make || "",
      model: selectedVehicle.model || "",
      year: selectedVehicle.year || "",
      engine: selectedVehicle.engine || "",
      registrationNumber: selectedVehicle.registrationNumber || "",
      vin: selectedVehicle.vin || "",
    });
    setVehicleStatus({ type: "", message: "" });
    setIsEditingVehicle(true);
  };

  const handleSaveVehicle = async () => {
    const draftVehicle = {
      ...vehicleEditDraft,
      registrationNumber: normalizeVehicleIdentifier(vehicleEditDraft?.registrationNumber),
      vin: normalizeVehicleIdentifier(vehicleEditDraft?.vin),
    };

    if (!draftVehicle.registrationNumber || !draftVehicle.vin || !draftVehicle.make?.trim() || !draftVehicle.model?.trim()) {
      setVehicleStatus({ type: "error", message: "Markė, modelis, valstybinis numeris ir VIN yra privalomi." });
      return;
    }
    if (draftVehicle.vin.length !== 17) {
      setVehicleStatus({ type: "error", message: "VIN turi būti tiksliai 17 simbolių." });
      return;
    }

    try {
      const updated = await updateVehicle(selectedVehicle.id, draftVehicle);
      setRemoteVehicle((current) => ({ ...updated, records: current?.records || [] }));
      setIsEditingVehicle(false);
      setVehicleEditDraft(null);
      setVehicleStatus({ type: "success", message: "Automobilis sėkmingai atnaujintas." });
    } catch (error) {
      console.error("Nepavyko atnaujinti automobilio Supabase.", {
        message: error?.message,
        code: error?.code,
        details: error?.details,
        hint: error?.hint,
        error,
      });
      setVehicleStatus({
        type: "error",
        message: error?.code === "VEHICLE_DUPLICATE"
          ? "Kitas automobilis jau turi tokį valstybinį numerį arba VIN."
          : "Automobilio atnaujinti nepavyko.",
      });
    }
  };

  const handleUpdateRecord = (recordId, changes) => {
    if (!selectedVehicle) return;

    setVehicles((current) =>
      current.map((vehicle) => {
        if (vehicle.id !== selectedVehicle.id) return vehicle;
        return {
          ...vehicle,
          records: (vehicle.records || []).map((record) =>
            record.id === recordId ? { ...record, ...changes } : record
          ),
        };
      })
    );
  };

  return (
    <main className="min-h-screen bg-transparent px-4 py-12 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-black uppercase tracking-tight text-amber-400 sm:text-4xl">
            AUTOUP – AUTOMOBILIO ISTORIJOS VALDYMAS
          </h1>
        </div>

        <section className="rounded-[28px] border border-emerald-800/70 bg-emerald-950/90 p-6 shadow-xl">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end">
            <div className="flex flex-wrap gap-3">
              <label className="inline-flex items-center gap-2 rounded-xl border border-emerald-700 bg-[#072416] px-4 py-3 text-xs font-black uppercase tracking-[0.12em] text-emerald-100">
                <input
                  type="radio"
                  name="adminSearchType"
                  checked={searchType === "registration"}
                  onChange={() => setSearchType("registration")}
                  className="h-4 w-4 accent-amber-500"
                />
                Valstybinis numeris
              </label>
              <label className="inline-flex items-center gap-2 rounded-xl border border-emerald-700 bg-[#072416] px-4 py-3 text-xs font-black uppercase tracking-[0.12em] text-emerald-100">
                <input
                  type="radio"
                  name="adminSearchType"
                  checked={searchType === "vin"}
                  onChange={() => setSearchType("vin")}
                  className="h-4 w-4 accent-amber-500"
                />
                VIN
              </label>
            </div>

            <div className="flex-1">
              <input
                type="text"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder={searchType === "registration" ? "ABC123" : "WVWZZZ1KZ6W000001"}
                className="w-full rounded-xl border border-emerald-700 bg-[#021b12] px-4 py-3.5 text-base text-white placeholder:text-emerald-200/40 focus:border-amber-500 focus:outline-none"
              />
            </div>

            <button
              type="button"
              onClick={handleVehicleSearch}
              className="inline-flex items-center justify-center rounded-xl bg-amber-500 px-6 py-3.5 text-xs font-black uppercase tracking-[0.12em] text-black transition-colors hover:bg-amber-400"
            >
              IEŠKOTI
            </button>

            {(searchStatus === "not-found" || isAddingVehicle) && (
              <button
                type="button"
                onClick={() => {
                  setIsAddingVehicle((current) => !current);
                  setNewVehicleStatus({ type: "", message: "" });
                }}
                className="inline-flex items-center justify-center rounded-xl border border-amber-500/70 bg-amber-500/10 px-6 py-3.5 text-xs font-black uppercase tracking-[0.12em] text-amber-300 transition-colors hover:bg-amber-500/20"
              >
                + PRIDĖTI NAUJĄ AUTOMOBILĮ
              </button>
            )}
          </div>
        </section>

        {searchStatus === "not-found" && (
          <section className="mt-4 rounded-xl border border-amber-500/60 bg-amber-950/50 px-4 py-3 text-sm font-semibold text-amber-200">
            Automobilis nerastas.
          </section>
        )}

        {searchStatus === "error" && (
          <section className="mt-4 rounded-xl border border-red-500/60 bg-red-950/70 px-4 py-3 text-sm font-semibold text-red-200">
            Automobilio paieška nepavyko dėl Supabase ryšio arba teisių klaidos.
          </section>
        )}

        {newVehicleStatus.message && (
          <div className={`mt-4 rounded-xl border px-4 py-3 text-sm font-semibold ${newVehicleStatus.type === "success"
            ? "border-emerald-500/60 bg-emerald-950/80 text-emerald-200"
            : "border-red-500/60 bg-red-950/70 text-red-200"}`}>
            {newVehicleStatus.message}
          </div>
        )}

        {isAddingVehicle && (
          <section className="mt-8 rounded-[28px] border border-emerald-800/70 bg-[#061b12]/90 p-6 shadow-lg">
            <h2 className="text-2xl font-black text-white">Pridėti naują automobilį</h2>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <label className="text-sm font-semibold text-slate-200">
                MARKĖ *
                <input
                  type="text"
                  value={newVehicleDraft.make}
                  onChange={(event) => handleNewVehicleFieldChange("make", event.target.value)}
                  className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-white outline-none focus:border-amber-500"
                />
              </label>
              <label className="text-sm font-semibold text-slate-200">
                MODELIS *
                <input
                  type="text"
                  value={newVehicleDraft.model}
                  onChange={(event) => handleNewVehicleFieldChange("model", event.target.value)}
                  className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-white outline-none focus:border-amber-500"
                />
              </label>
              <label className="text-sm font-semibold text-slate-200">
                METAI
                <input
                  type="number"
                  value={newVehicleDraft.year}
                  onChange={(event) => handleNewVehicleFieldChange("year", event.target.value)}
                  min="1900"
                  max="2100"
                  className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-white outline-none focus:border-amber-500"
                />
              </label>
              <label className="text-sm font-semibold text-slate-200">
                VARIKLIS
                <input
                  type="text"
                  value={newVehicleDraft.engine}
                  onChange={(event) => handleNewVehicleFieldChange("engine", event.target.value)}
                  className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-white outline-none focus:border-amber-500"
                />
              </label>
              <label className="text-sm font-semibold text-slate-200">
                VALSTYBINIS NUMERIS *
                <input
                  type="text"
                  value={newVehicleDraft.registrationNumber}
                  onChange={(event) => handleNewVehicleFieldChange("registrationNumber", event.target.value)}
                  className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-white outline-none focus:border-amber-500"
                />
              </label>
              <label className="text-sm font-semibold text-slate-200">
                VIN *
                <input
                  type="text"
                  value={newVehicleDraft.vin}
                  onChange={(event) => handleNewVehicleFieldChange("vin", event.target.value)}
                  maxLength="17"
                  className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-white outline-none focus:border-amber-500"
                />
              </label>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={handleCreateVehicle}
                className="rounded-xl bg-amber-500 px-6 py-3 text-xs font-black uppercase tracking-[0.12em] text-black transition-colors hover:bg-amber-400"
              >
                IŠSAUGOTI AUTOMOBILĮ
              </button>
            </div>
          </section>
        )}

        {selectedVehicle && (
          <div className="mt-8 space-y-8">
            <section className="rounded-[28px] border border-emerald-800/70 bg-[#071d15]/90 p-6 shadow-lg">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="text-2xl font-black text-white">Automobilio duomenys</h2>
                <button
                  type="button"
                  onClick={handleEditVehicle}
                  className="rounded-xl border border-amber-500/60 px-4 py-2 text-xs font-black uppercase tracking-[0.12em] text-amber-300"
                >
                  REDAGUOTI AUTOMOBILĮ
                </button>
              </div>
              {vehicleStatus.message && (
                <p className={`mt-4 rounded-xl border px-4 py-3 text-sm ${vehicleStatus.type === "success"
                  ? "border-emerald-500/60 bg-emerald-950/70 text-emerald-200"
                  : "border-red-500/60 bg-red-950/70 text-red-200"}`}>
                  {vehicleStatus.message}
                </p>
              )}
              {isEditingVehicle && (
                <div className="mt-6 grid gap-4 rounded-2xl border border-amber-500/40 bg-amber-500/5 p-4 md:grid-cols-2">
                  {["make", "model", "year", "engine", "registrationNumber", "vin"].map((field) => (
                    <label key={field} className="text-sm font-semibold text-slate-200">
                      {field === "make" ? "MARKĖ" : field === "model" ? "MODELIS" : field === "year" ? "METAI" : field === "engine" ? "VARIKLIS" : field === "registrationNumber" ? "VALSTYBINIS NUMERIS" : "VIN"}
                      <input
                        type={field === "year" ? "number" : "text"}
                        value={vehicleEditDraft?.[field] || ""}
                        maxLength={field === "vin" ? 17 : undefined}
                        onChange={(event) => setVehicleEditDraft((current) => ({
                          ...current,
                          [field]: field === "registrationNumber" || field === "vin"
                            ? normalizeVehicleIdentifier(event.target.value)
                            : event.target.value,
                        }))}
                        className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-white outline-none focus:border-amber-500"
                      />
                    </label>
                  ))}
                  <div className="flex gap-3 md:col-span-2 md:justify-end">
                    <button type="button" onClick={() => { setIsEditingVehicle(false); setVehicleEditDraft(null); }} className="rounded-xl border border-emerald-700 px-5 py-3 text-xs font-black uppercase tracking-[0.12em] text-emerald-200">ATŠAUKTI</button>
                    <button type="button" onClick={handleSaveVehicle} className="rounded-xl bg-amber-500 px-5 py-3 text-xs font-black uppercase tracking-[0.12em] text-black">IŠSAUGOTI PAKEITIMUS</button>
                  </div>
                </div>
              )}
              <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                <div className="rounded-2xl border border-emerald-800/70 bg-[#092119] p-4">
                  <p className="text-[11px] font-black uppercase tracking-[0.14em] text-emerald-300">Markė</p>
                  <p className="mt-3 text-lg font-bold text-white">{selectedVehicle.make}</p>
                </div>
                <div className="rounded-2xl border border-emerald-800/70 bg-[#092119] p-4">
                  <p className="text-[11px] font-black uppercase tracking-[0.14em] text-emerald-300">Modelis</p>
                  <p className="mt-3 text-lg font-bold text-white">{selectedVehicle.model}</p>
                </div>
                <div className="rounded-2xl border border-emerald-800/70 bg-[#092119] p-4">
                  <p className="text-[11px] font-black uppercase tracking-[0.14em] text-emerald-300">Metai</p>
                  <p className="mt-3 text-lg font-bold text-white">{selectedVehicle.year}</p>
                </div>
                <div className="rounded-2xl border border-emerald-800/70 bg-[#092119] p-4">
                  <p className="text-[11px] font-black uppercase tracking-[0.14em] text-emerald-300">Variklis</p>
                  <p className="mt-3 text-lg font-bold text-white">{selectedVehicle.engine}</p>
                </div>
                <div className="rounded-2xl border border-emerald-800/70 bg-[#092119] p-4">
                  <p className="text-[11px] font-black uppercase tracking-[0.14em] text-emerald-300">Valstybinis numeris</p>
                  <p className="mt-3 text-lg font-bold text-white">{selectedVehicle.registrationNumber}</p>
                </div>
                <div className="rounded-2xl border border-emerald-800/70 bg-[#092119] p-4">
                  <p className="text-[11px] font-black uppercase tracking-[0.14em] text-emerald-300">VIN</p>
                  <p className="mt-3 break-all text-lg font-bold text-white">{selectedVehicle.vin}</p>
                </div>
              </div>
            </section>

            <section className="rounded-[28px] border border-emerald-800/70 bg-[#061b12]/90 p-6 shadow-lg">
              <div className="flex items-center justify-between gap-4">
                <h2 className="text-2xl font-black text-white">{editingRecordId ? "Redaguoti atliktą darbą" : "Pridėti atliktą darbą"}</h2>
                <button
                  type="button"
                  onClick={() => {
                    setDraft(createEmptyEntry());
                    setEditingRecordId(null);
                  }}
                  className="rounded-xl border border-emerald-700 bg-emerald-900/70 px-4 py-2 text-xs font-black uppercase tracking-[0.12em] text-emerald-200"
                >
                  Naujas įrašas
                </button>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <label className="text-sm font-semibold text-slate-200">
                  DATA
                  <input
                    type="date"
                    value={draft.date}
                    onChange={(event) => setDraft((current) => ({ ...current, date: event.target.value }))}
                    className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-white outline-none focus:border-amber-500"
                  />
                </label>

                <label className="text-sm font-semibold text-slate-200">
                  RIDA
                  <input
                    type="number"
                    value={draft.mileage}
                    onChange={(event) => setDraft((current) => ({ ...current, mileage: event.target.value }))}
                    className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-white outline-none focus:border-amber-500"
                    min="0"
                    step="1"
                  />
                </label>
              </div>

              <div className="mt-5">
                <label className="text-sm font-semibold text-slate-200">
                  KATEGORIJA
                  <select
                    value={draft.category}
                    onChange={(event) => setDraft((current) => ({ ...current, category: event.target.value }))}
                    className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-white outline-none focus:border-amber-500"
                  >
                    <option>Periodinis aptarnavimas</option>
                    <option>Variklis</option>
                    <option>Važiuoklė</option>
                    <option>Stabdžių sistema</option>
                    <option>Vairo sistema</option>
                    <option>Transmisija</option>
                    <option>Sankaba</option>
                    <option>Elektros sistema</option>
                    <option>Aušinimo sistema</option>
                    <option>Išmetimo sistema</option>
                    <option>Oro kondicionavimo sistema</option>
                    <option>Padangos / ratai</option>
                    <option>Kėbulas</option>
                    <option>Kita</option>
                  </select>
                </label>
              </div>

              <label className="mt-5 block text-sm font-semibold text-slate-200">
                KLIENTO NUSISKUNDIMAS
                <input
                  type="text"
                  value={draft.customerComplaint}
                  onChange={(event) => setDraft((current) => ({ ...current, customerComplaint: event.target.value }))}
                  placeholder="„Bildesys priekinėje važiuoklėje.“"
                  className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-white outline-none placeholder:text-slate-500 focus:border-amber-500"
                />
              </label>

              <div className="mt-6 space-y-4">
                <div>
                  <p className="text-sm font-black uppercase tracking-[0.12em] text-emerald-200">ATLIKTI DARBAI</p>
                  {(draft.workPerformed || []).map((item, index) => (
                    <div key={`work-${index}`} className="mt-2 flex gap-3">
                      <input
                        type="text"
                        value={item}
                        onChange={(event) =>
                          setDraft((current) => ({
                            ...current,
                            workPerformed: updateItemInList(current.workPerformed, index, event.target.value),
                          }))
                        }
                        className="flex-1 rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-white outline-none focus:border-amber-500"
                        placeholder="Pakeistas dešinės pusės šarnyras"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setDraft((current) => ({
                            ...current,
                            workPerformed: removeItemFromList(current.workPerformed, index),
                          }))
                        }
                        className="rounded-lg border border-red-500/50 px-3 text-red-300 hover:bg-red-500/10"
                        aria-label="Pašalinti atliktą darbą"
                      >
                        X
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() =>
                      setDraft((current) => ({
                        ...current,
                        workPerformed: addItemToList(current.workPerformed, ""),
                      }))
                    }
                    className="mt-3 inline-flex items-center rounded-xl border border-amber-500/60 bg-amber-500/10 px-4 py-2 text-xs font-black uppercase tracking-[0.12em] text-amber-300 hover:bg-amber-500/20"
                  >
                    + PRIDĖTI DARBĄ
                  </button>
                </div>

                <div>
                  <p className="text-sm font-black uppercase tracking-[0.12em] text-emerald-200">PAKEISTOS DETALĖS / MEDŽIAGOS</p>
                  {(draft.partsUsed || []).map((item, index) => (
                    <div key={`part-${index}`} className="mt-2 flex gap-3">
                      <div className="flex flex-1 flex-col gap-2 sm:flex-row">
                      <input
                        type="text"
                        value={item.name}
                        onChange={(event) =>
                          setDraft((current) => ({
                            ...current,
                            partsUsed: updateItemInList(current.partsUsed, index, { ...item, name: event.target.value }),
                          }))
                        }
                        className="flex-1 rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-white outline-none focus:border-amber-500"
                        placeholder="Šarnyras"
                      />
                      <input
                        type="text"
                        value={item.location}
                        onChange={(event) =>
                          setDraft((current) => ({
                            ...current,
                            partsUsed: updateItemInList(current.partsUsed, index, { ...item, location: event.target.value }),
                          }))
                        }
                        className="flex-1 rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-white outline-none focus:border-amber-500"
                        placeholder="Vieta, pvz. Priekis – dešinė"
                      />
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          setDraft((current) => ({
                            ...current,
                            partsUsed: removeItemFromList(current.partsUsed, index),
                          }))
                        }
                        className="rounded-lg border border-red-500/50 px-3 text-red-300 hover:bg-red-500/10"
                        aria-label="Pašalinti detalę"
                      >
                        X
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() =>
                      setDraft((current) => ({
                        ...current,
                        partsUsed: addItemToList(current.partsUsed, { name: "", location: "" }),
                      }))
                    }
                    className="mt-3 inline-flex items-center rounded-xl border border-amber-500/60 bg-amber-500/10 px-4 py-2 text-xs font-black uppercase tracking-[0.12em] text-amber-300 hover:bg-amber-500/20"
                  >
                    + PRIDĖTI DETALĘ
                  </button>
                </div>

                <div>
                  <p className="text-sm font-black uppercase tracking-[0.12em] text-emerald-200">PANAUDOTOS MEDŽIAGOS</p>
                  {(draft.materialsUsed || []).map((item, index) => (
                    <div key={`material-${index}`} className="mt-2 flex gap-3">
                      <input
                        type="text"
                        value={item}
                        onChange={(event) => setDraft((current) => ({
                          ...current,
                          materialsUsed: updateItemInList(current.materialsUsed, index, event.target.value),
                        }))}
                        className="flex-1 rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-white outline-none focus:border-amber-500"
                        placeholder="Stabdžių valiklis"
                      />
                      <button
                        type="button"
                        onClick={() => setDraft((current) => ({
                          ...current,
                          materialsUsed: removeItemFromList(current.materialsUsed, index),
                        }))}
                        className="rounded-lg border border-red-500/50 px-3 text-red-300 hover:bg-red-500/10"
                        aria-label="Pašalinti medžiagą"
                      >
                        X
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => setDraft((current) => ({
                      ...current,
                      materialsUsed: addItemToList(current.materialsUsed, ""),
                    }))}
                    className="mt-3 inline-flex items-center rounded-xl border border-amber-500/60 bg-amber-500/10 px-4 py-2 text-xs font-black uppercase tracking-[0.12em] text-amber-300 hover:bg-amber-500/20"
                  >
                    + PRIDĖTI MEDŽIAGĄ
                  </button>
                </div>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <label className="text-sm font-semibold text-slate-200">
                  VIEŠOS PASTABOS
                  <textarea
                    value={draft.publicNotes}
                    onChange={(event) => setDraft((current) => ({ ...current, publicNotes: event.target.value }))}
                    rows="4"
                    className="mt-2 w-full resize-y rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-white outline-none focus:border-amber-500"
                  />
                </label>

                <label className="text-sm font-semibold text-slate-200">
                  VIDINĖS AUTOUP PASTABOS
                  <textarea
                    value={draft.internalNotes}
                    onChange={(event) => setDraft((current) => ({ ...current, internalNotes: event.target.value }))}
                    rows="4"
                    className="mt-2 w-full resize-y rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-white outline-none focus:border-amber-500"
                  />
                </label>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <label className="text-sm font-semibold text-slate-200">
                  ATLIKO
                  <input
                    type="text"
                    value={draft.performedBy}
                    onChange={(event) => setDraft((current) => ({ ...current, performedBy: event.target.value }))}
                    className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-white outline-none focus:border-amber-500"
                  />
                </label>
                <label className="flex items-center gap-3 self-end pb-3 text-sm font-semibold text-slate-200">
                  <input
                    type="checkbox"
                    checked={draft.verifiedByAutoup}
                    onChange={(event) => setDraft((current) => ({ ...current, verifiedByAutoup: event.target.checked }))}
                    className="h-4 w-4 accent-amber-500"
                  />
                  PATVIRTINTA AUTOUP
                </label>
              </div>

              <div className="mt-8 flex justify-end">
                <div className="flex gap-3">
                  {editingRecordId && (
                    <button type="button" onClick={() => { setDraft(createEmptyEntry()); setEditingRecordId(null); }} className="rounded-xl border border-emerald-700 px-6 py-3 text-xs font-black uppercase tracking-[0.12em] text-emerald-200">ATŠAUKTI</button>
                  )}
                  <button
                    type="button"
                    onClick={handleSaveRecord}
                    className="rounded-xl bg-amber-500 px-6 py-3 text-xs font-black uppercase tracking-[0.12em] text-black transition-colors hover:bg-amber-400"
                  >
                    {editingRecordId ? "IŠSAUGOTI PAKEITIMUS" : "IŠSAUGOTI AUTOMOBILIO ISTORIJOJE"}
                  </button>
                </div>
              </div>
              {recordStatus.message && (
                <p className={`mt-4 rounded-xl border px-4 py-3 text-sm ${recordStatus.type === "success" ? "border-emerald-500/60 bg-emerald-950/70 text-emerald-200" : "border-red-500/60 bg-red-950/70 text-red-200"}`}>
                  {recordStatus.message}
                </p>
              )}
            </section>

            <section className="rounded-[28px] border border-emerald-800/70 bg-[#061b12]/90 p-6 shadow-lg">
              <h2 className="text-2xl font-black text-white">Esami automobilio įrašai</h2>
              <div className="mt-6 space-y-6">
                {(selectedVehicle.records || []).map((record) => (
                  <article key={record.id} className="rounded-2xl border border-emerald-800/70 bg-[#081e17] p-5">
                    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                      <div>
                        <p className="text-xl font-black text-white">{record.date}</p>
                        <p className="mt-2 text-sm font-bold uppercase tracking-[0.12em] text-emerald-200">{record.category}</p>
                        <p className="mt-2 text-sm text-emerald-100/75">Rida: {formatMileage(record.mileage)}</p>
                        {record.customerComplaint && (
                          <p className="mt-2 text-sm text-white">Kliento nusiskundimas: {record.customerComplaint}</p>
                        )}
                      </div>

                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            const current = selectedVehicle.records.find((item) => item.id === record.id);
                            if (!current) return;
                            const next = { ...current, date: current.date || new Date().toISOString().slice(0, 10) };
                            setDraft(next);
                            setEditingRecordId(record.id);
                          }}
                          className="rounded-lg border border-amber-500/60 px-4 py-2 text-xs font-black uppercase tracking-[0.12em] text-amber-300"
                        >
                          REDAGUOTI
                        </button>
                        <button
                          type="button"
                          onClick={() => setConfirmDeleteId(record.id)}
                          className="rounded-lg border border-red-500/60 px-4 py-2 text-xs font-black uppercase tracking-[0.12em] text-red-300"
                        >
                          IŠTRINTI ĮRAŠĄ
                        </button>
                      </div>
                    </div>

                    {record.workPerformed?.length > 0 && (
                      <div className="mt-5">
                        <p className="text-sm font-black uppercase tracking-[0.12em] text-emerald-200">Atlikti darbai:</p>
                        <ul className="mt-2 space-y-2 text-white">
                          {record.workPerformed.map((item) => (
                            <li key={`${record.id}-${item}`} className="flex items-start gap-2">
                              <span className="text-amber-400">✓</span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {record.partsUsed?.length > 0 && (
                      <div className="mt-5">
                        <p className="text-sm font-black uppercase tracking-[0.12em] text-emerald-200">Pakeistos detalės:</p>
                        <ul className="mt-2 space-y-2 text-white">
                            {record.partsUsed.map((item, index) => (
                              <li key={`${record.id}-part-${index}`} className="flex items-start gap-2">
                              <span className="text-emerald-300">•</span>
                                <span>{typeof item === "string" ? item : `${item.name}${item.location ? ` (${item.location})` : ""}`}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {record.materialsUsed?.length > 0 && (
                      <div className="mt-5">
                        <p className="text-sm font-black uppercase tracking-[0.12em] text-emerald-200">Panaudotos medžiagos:</p>
                        <ul className="mt-2 space-y-2 text-white">
                          {record.materialsUsed.map((item, index) => (
                            <li key={`${record.id}-material-${index}`} className="flex items-start gap-2">
                              <span className="text-emerald-300">•</span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {record.publicNotes && (
                      <div className="mt-5 text-sm text-white">
                        <span className="font-black uppercase tracking-[0.12em] text-emerald-200">Viešos pastabos:</span> {record.publicNotes}
                      </div>
                    )}

                    {record.internalNotes && (
                      <div className="mt-2 text-sm text-amber-300">
                        <span className="font-black uppercase tracking-[0.12em] text-amber-400">Vidinės pastabos:</span> {record.internalNotes}
                      </div>
                    )}

                    {record.verifiedByAutoup && (
                      <div className="mt-5 text-sm font-black uppercase tracking-[0.14em] text-amber-400">
                        PATVIRTINTA AUTOUP
                      </div>
                    )}
                  </article>
                ))}
              </div>
            </section>
          </div>
        )}
      </div>

      {confirmDeleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
          <div className="w-full max-w-md rounded-2xl border border-emerald-800 bg-[#071d15] p-6 shadow-2xl">
            {(() => {
              const recordToDelete = selectedVehicle?.records?.find((record) => record.id === confirmDeleteId);
              return (
                <>
                  <h3 className="text-xl font-black text-white">Ar tikrai norite ištrinti šį automobilio istorijos įrašą?</h3>
                  {recordToDelete && (
                    <div className="mt-4 rounded-xl border border-red-500/30 bg-red-950/30 p-4 text-sm text-red-100">
                      <p>Data: {recordToDelete.date || "—"}</p>
                      <p>Kategorija: {recordToDelete.category || "—"}</p>
                      {recordToDelete.mileage !== null && recordToDelete.mileage !== undefined && recordToDelete.mileage !== "" && (
                        <p>Rida: {formatMileage(recordToDelete.mileage)}</p>
                      )}
                    </div>
                  )}
                </>
              );
            })()}
            <p className="mt-3 text-sm text-emerald-100/80">
              Šis veiksmas negrįžtamas.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setConfirmDeleteId(null)}
                className="rounded-lg border border-emerald-700 px-4 py-2 text-xs font-black uppercase tracking-[0.12em] text-emerald-200"
              >
                Atšaukti
              </button>
              <button
                type="button"
                onClick={() => handleDeleteRecord(confirmDeleteId)}
                className="rounded-lg bg-red-500 px-4 py-2 text-xs font-black uppercase tracking-[0.12em] text-white"
              >
                TAIP, IŠTRINTI
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
