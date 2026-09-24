import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  findVehicleByRegistrationNumber,
  findVehicleByVin,
  getPublicVehicleServiceRecords,
} from "@/services/vehicleHistoryService";
import { downloadVehicleHistoryPdf } from "@/services/vehicleHistoryPdfService";

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

const formatMileage = (value) => {
  if (!value && value !== 0) return null;
  return `${Number(value).toLocaleString("lt-LT")} km`;
};

export default function VehicleHistoryPage() {
  const [searchType, setSearchType] = useState("registration");
  const [query, setQuery] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const [searchStatus, setSearchStatus] = useState("idle");
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [pdfError, setPdfError] = useState("");

  const latestMileage = useMemo(() => {
    if (!searchResult?.records?.length) return null;
    const newestRecord = [...searchResult.records].sort(
      (a, b) => parseDateValue(b.date) - parseDateValue(a.date)
    )[0];
    return newestRecord ? newestRecord.mileage : null;
  }, [searchResult]);

  const handleDownloadPdf = async () => {
    if (!searchResult || isGeneratingPdf) return;

    setIsGeneratingPdf(true);
    setPdfError("");

    try {
      await downloadVehicleHistoryPdf(searchResult);
    } catch (error) {
      console.error("PDF generation failed:", error, {
        message: error?.message,
        code: error?.code,
        details: error?.details,
        hint: error?.hint,
        error,
      });
      setPdfError("PDF failo sugeneruoti nepavyko. Bandykite dar kartą.");
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const normalizedQuery = normalizeValue(query);

    if (!normalizedQuery) {
      setSearchResult(null);
      setSearchStatus("idle");
      return;
    }

    try {
      const vehicle = searchType === "registration"
        ? await findVehicleByRegistrationNumber(normalizedQuery)
        : await findVehicleByVin(normalizedQuery);

      if (!vehicle) {
        setSearchResult(null);
        setSearchStatus("vehicle-not-found");
        return;
      }

      const records = await getPublicVehicleServiceRecords(vehicle.id);
      setSearchResult({ ...vehicle, records });
      setSearchStatus(records.length ? "success" : "history-empty");
    } catch (error) {
      console.error("Nepavyko gauti automobilio istorijos iš Supabase.", {
        message: error?.message,
        code: error?.code,
        details: error?.details,
        hint: error?.hint,
        error,
      });
      setSearchResult(null);
      setSearchStatus("error");
    }
  };

  return (
    <main className="min-h-screen bg-transparent px-4 py-12 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-black uppercase tracking-tight text-amber-400 sm:text-4xl lg:text-5xl">
            AUTOMOBILIO ISTORIJA
          </h1>
          <p className="mx-auto mt-4 max-w-3xl text-sm text-emerald-100/80 sm:text-base">
            Peržiūrėkite AutoUP užfiksuotą automobilio techninės priežiūros ir remonto istoriją.
          </p>
        </header>

        <section className="rounded-[28px] border border-emerald-800/70 bg-emerald-950/90 p-5 shadow-[0_18px_50px_rgba(0,0,0,0.28)] backdrop-blur-sm sm:p-7">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end">
              <div className="flex flex-wrap gap-3">
                <label className="inline-flex items-center gap-2 rounded-xl border border-emerald-700 bg-[#072416] px-4 py-3 text-xs font-black uppercase tracking-[0.12em] text-emerald-100">
                  <input
                    type="radio"
                    name="searchType"
                    checked={searchType === "registration"}
                    onChange={() => setSearchType("registration")}
                    className="h-4 w-4 accent-amber-500"
                  />
                  Valstybinis numeris
                </label>

                <label className="inline-flex items-center gap-2 rounded-xl border border-emerald-700 bg-[#072416] px-4 py-3 text-xs font-black uppercase tracking-[0.12em] text-emerald-100">
                  <input
                    type="radio"
                    name="searchType"
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
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder={searchType === "registration" ? "ABC123" : "WVWZZZ1KZ6W000001"}
                  className="w-full rounded-xl border border-emerald-700 bg-[#021b12] px-4 py-3.5 text-base text-white placeholder:text-emerald-200/40 focus:border-amber-500 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-xl bg-amber-500 px-6 py-3.5 text-xs font-black uppercase tracking-[0.12em] text-black transition-colors hover:bg-amber-400"
              >
                IEŠKOTI ISTORIJOS
              </button>
            </div>
          </form>
        </section>

        {searchStatus === "vehicle-not-found" && (
          <section className="mt-10 rounded-[28px] border border-emerald-800/70 bg-[#061b12]/90 p-8 text-center shadow-lg">
            <h2 className="text-2xl font-black text-white">Šio automobilio istorijos AutoUP sistemoje dar nėra.</h2>
            <p className="mt-4 text-base text-emerald-100/75">Istorija pradedama kaupti automobiliui apsilankius AutoUP servise.</p>
            <Link
              to="/kontaktai#registracija"
              className="mt-6 inline-flex items-center justify-center rounded-xl bg-amber-500 px-6 py-3 text-xs font-black uppercase tracking-[0.12em] text-black transition-colors hover:bg-amber-400"
            >
              REGISTRUOTIS PATIKRAI / REMONTUI
            </Link>
          </section>
        )}

        {searchStatus === "history-empty" && searchResult && (
          <section className="mt-10 rounded-[28px] border border-emerald-800/70 bg-[#061b12]/90 p-8 text-center shadow-lg">
            <h2 className="text-2xl font-black text-white">Šio automobilio istorijos AutoUP sistemoje dar nėra.</h2>
            <p className="mt-4 text-base text-emerald-100/75">Automobilis rastas, tačiau jam dar nėra išsaugotų aptarnavimo įrašų.</p>
          </section>
        )}

        {searchStatus === "error" && (
          <section className="mt-10 rounded-[28px] border border-red-800/70 bg-[#24100e]/90 p-8 text-center shadow-lg">
            <h2 className="text-2xl font-black text-white">Automobilio istorijos nepavyko gauti.</h2>
            <p className="mt-4 text-base text-red-100/75">Įvyko ryšio su duomenų baze klaida. Bandykite dar kartą.</p>
          </section>
        )}

        {searchResult && searchStatus !== "history-empty" && (
          <div className="mt-10 space-y-8">
            <div className="rounded-[28px] border border-emerald-800/70 bg-[#071d15]/90 p-6 shadow-lg sm:p-8">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <h2 className="text-3xl font-black text-white sm:text-4xl">{searchResult.make} {searchResult.model}</h2>
                  <p className="mt-2 text-xl font-bold text-amber-400">{searchResult.engine}</p>
                </div>

                <button
                  type="button"
                  disabled={isGeneratingPdf}
                  className="inline-flex items-center justify-center rounded-xl border border-amber-500/70 bg-amber-500/10 px-5 py-3 text-xs font-black uppercase tracking-[0.12em] text-amber-300 transition-colors hover:bg-amber-500/20"
                  onClick={handleDownloadPdf}
                >
                  {isGeneratingPdf ? "GENERUOJAMA..." : "ATSISIŲSTI ISTORIJĄ PDF"}
                </button>
              </div>

              {pdfError && (
                <p className="mt-4 rounded-xl border border-red-500/60 bg-red-950/50 px-4 py-3 text-sm text-red-200">
                  {pdfError}
                </p>
              )}

              <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-2xl border border-emerald-800/70 bg-[#092119] p-4">
                  <p className="text-[11px] font-black uppercase tracking-[0.14em] text-emerald-300">Valstybinis numeris</p>
                  <p className="mt-3 text-lg font-bold text-white">{searchResult.registrationNumber}</p>
                </div>
                <div className="rounded-2xl border border-emerald-800/70 bg-[#092119] p-4">
                  <p className="text-[11px] font-black uppercase tracking-[0.14em] text-emerald-300">VIN</p>
                  <p className="mt-3 break-all text-lg font-bold text-white">{searchResult.vin}</p>
                </div>
                <div className="rounded-2xl border border-emerald-800/70 bg-[#092119] p-4">
                  <p className="text-[11px] font-black uppercase tracking-[0.14em] text-emerald-300">Pagaminimo metai</p>
                  <p className="mt-3 text-lg font-bold text-white">{searchResult.year}</p>
                </div>
                <div className="rounded-2xl border border-emerald-800/70 bg-[#092119] p-4">
                  <p className="text-[11px] font-black uppercase tracking-[0.14em] text-emerald-300">Paskutinė užfiksuota rida</p>
                  <p className="mt-3 text-lg font-bold text-white">{formatMileage(latestMileage) || "—"}</p>
                </div>
              </div>
            </div>

            <section className="rounded-[28px] border border-emerald-800/70 bg-[#061b12]/90 p-6 shadow-lg sm:p-8">
              <h3 className="text-2xl font-black uppercase tracking-tight text-amber-400">
                APTARNAVIMO IR REMONTO ISTORIJA
              </h3>

              <div className="mt-8 space-y-6">
                {searchResult.records.map((record) => (
                  <article
                    key={record.id}
                    className="rounded-2xl border border-emerald-800/70 bg-[#081e17] p-5 sm:p-6"
                  >
                    <div className="flex flex-col gap-2 border-b border-emerald-800/80 pb-4 sm:flex-row sm:items-center sm:justify-between">
                      <p className="text-xl font-black text-white">{record.date}</p>
                      <p className="text-sm font-bold uppercase tracking-[0.12em] text-emerald-200">
                        {formatMileage(record.mileage) || "Rida nėra nurodyta"}
                      </p>
                    </div>

                    <div className="mt-5">
                      <p className="text-lg font-black uppercase tracking-[0.12em] text-amber-400">{record.category}</p>

                      {record.customerComplaint && (
                        <div className="mt-4">
                          <p className="text-sm font-black uppercase tracking-[0.12em] text-emerald-200">Kliento problema:</p>
                          <p className="mt-2 text-base text-white">„{record.customerComplaint}“</p>
                        </div>
                      )}

                      {record.workPerformed?.length > 0 && (
                        <div className="mt-5">
                          <p className="text-sm font-black uppercase tracking-[0.12em] text-emerald-200">Atlikti darbai:</p>
                          <ul className="mt-3 space-y-2 text-base text-white">
                            {record.workPerformed.map((item) => (
                              <li key={item} className="flex items-start gap-3">
                                <span className="mt-1 text-amber-400">✓</span>
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {record.partsUsed?.length > 0 && (
                        <div className="mt-5">
                          <p className="text-sm font-black uppercase tracking-[0.12em] text-emerald-200">Pakeistos detalės:</p>
                          <ul className="mt-3 space-y-2 text-base text-white">
                            {record.partsUsed.map((item, index) => (
                              <li key={`${record.id}-part-${index}`} className="flex items-start gap-3">
                                <span className="mt-1 text-emerald-300">•</span>
                                <span>{typeof item === "string" ? item : `${item.name}${item.location ? ` (${item.location})` : ""}`}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {record.materialsUsed?.length > 0 && (
                        <div className="mt-5">
                          <p className="text-sm font-black uppercase tracking-[0.12em] text-emerald-200">Naudotos detalės / medžiagos:</p>
                          <ul className="mt-3 space-y-2 text-base text-white">
                            {record.materialsUsed.map((item) => (
                              <li key={item} className="flex items-start gap-3">
                                <span className="mt-1 text-emerald-300">•</span>
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {record.publicNotes && (
                        <div className="mt-5">
                          <p className="text-sm font-black uppercase tracking-[0.12em] text-emerald-200">Pastabos:</p>
                          <p className="mt-2 text-base text-white">{record.publicNotes}</p>
                        </div>
                      )}

                      <div className="mt-5 text-base text-white">
                        <p>
                          <span className="font-black uppercase tracking-[0.12em] text-emerald-200">Atliko:</span> {record.performedBy}
                        </p>
                      </div>

                      {record.verifiedByAutoup && (
                        <div className="mt-5 text-sm font-black uppercase tracking-[0.16em] text-amber-400">
                          PATVIRTINTA AUTOUP
                        </div>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            </section>
          </div>
        )}
      </div>
    </main>
  );
}
