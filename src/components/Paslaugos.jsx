import React from "react";
import { Link } from "react-router-dom";
import vaziuokle1 from "../static/image/vaziuokle-1.jpg.jpeg";
import vaziuokle2 from "../static/image/vaziuokle-2.jpg.webp";
import ratas1 from "../static/image/ratas1.jpg";
import ratas2 from "../static/image/ratas2.jpg";
import stabdziai1 from "../static/image/stabdziu-remontas-1.jpg";
import stabdziai2 from "../static/image/stabdis2.jpg";
import tepalai1 from "../static/image/tepalo keitimas1.jpg";
import tepalai2 from "../static/image/Tepalofiltras.jpg";
import diagnostika1 from "../static/image/diagnostics1.jpg";
import diagnostika2 from "../static/image/diagnotika2.jpg";
import ismetimas1 from "../static/image/ismetimosistemos.1jpg.webp";
import ismetimas2 from "../static/image/ismetimosistemos2.jpg";
import technineApziura1 from "../static/image/TA.1jpg.jpg";
import technineApziura2 from "../static/image/TA2.jpg";
import zibintai1 from "../static/image/Zibintu poliravimas-1.jpeg";
import zibintai2 from "../static/image/Zibintu poliravimas-2.jpeg";

export const paslaugosData = [
  {
    id: "vaziuokles-remontas",
    pavadinimas: "Važiuoklės | Pakabos remontas",
    aprasymas: "Išsamus pakabos patikrinimas, barskesių šalinimas ir nusidėvėjusių detalių keitimas kokybiškomis dalimis.",
    isrobintasAprasymas: "Tvarkinga automobilio važiuoklė užtikrina ne tik komfortišką, bet ir saugų važiavimą. Laiku nepastebėti pakabos gedimai skatina netolygų padangų dėvėjimąsi, blogina automobilio valdomumą ir sukelia papildomą apkrovą kitiems mazgams.",
    ikona: "🔧",
    nuotraukos: [
      vaziuokle1,
      vaziuokle2
    ],
    darbai: [
      "Važiuoklės patikra – 20 €",
      "Amortizatorių keitimas",
      "Amortizatorių spyruoklės keitimas",
      "Amortizatoriaus apsaugos keitimas",
      "Pusašio keitimas",
      "Pusašio šarnyro gaubto (granatos apsaugos) keitimas",
      "Pusašio šarnyro (granatos) keitimas",
      "Pusašio pakabinamojo guolio keitimas",
      "Rato guolio keitimas",
      "Rato stebulės keitimas",
      "Sailenblokų keitimas",
      "Šarnyrų keitimas",
      "Svirties (šakės) keitimas",
      "Stabilizatoriaus įvorės keitimas",
      "Stabilizatoriaus traukės keitimas",
      "Traukės keitimas",
      "Vairo traukės keitimas, antgalio keitimas",
      "Vairo traukės apsaugos keitimas"
    ]
  },
  {
    id: "padangu-montavimas",
    pavadinimas: "Padangų montavimas & Balansavimas",
    aprasymas: "Greitas ir kokybiškas ratų montavimas bei balansavimas tiksliomis staklėmis, užtikrinantis tolygų riedėjimą ir saugumą kelyje.",
    isrobintasAprasymas: "Reguliarus ir teisingas padangų montavimas bei balansavimas yra esminis veiksnys jūsų saugumui ir komfortui kelyje. Netiksliai subalansuoti ratai sukelia vairo vibraciją, pagreitina pakabos mazgų (guolių, amortizatorių, svirčių) nusidėvėjimą ir netolygiai nudevina padangas.",
    ikona: "⚙️",
    nuotraukos: [
      ratas1,
      ratas2
    ],
    darbai: [
      "Padangų montavimas ir išmontavimas",
      "Tikslus ratų balansavimas elektroninėmis staklėmis",
      "Ratlankių valymas ir ventilių keitimas",
      "Ratų slėgio patikra bei suderinimas (TPMS jutiklių patikra)",
      "Sezoninis ratų keitimas ir paruošimas",
      "Padangų protektoriaus gylio ir būklės įvertinimas"
    ]
  },
  {
    id: "stabdziu-remontas",
    pavadinimas: "Stabdžių sistemos remontas",
    aprasymas: "Profesionalus stabdžių diskų, kaladėlių, suportų bei vamzdelių keitimas ir sistemos nuorinimas.",
    isrobintasAprasymas: "Stabdžių sistema – pats svarbiausias automobilio saugumo elementas. Laiku neatlikta profilaktika ar neatnaujinti nusidėvėję komponentai žymiai prailgina stabdymo kelią. Atliekame visapusišką stabdžių patikrą, keičiame nusidėvėjusias kaladėles, diskus, restauruojame ar keičiame strigti pradedančius suportus bei atliekame skysčio keitimą su pilnu sistemos nuorinimu.",
    ikona: "🛑",
    nuotraukos: [
      stabdziai1,
      stabdziai2
    ],
    darbai: [
      "Stabdžių kaladėlių ir diskų keitimas",
      "Stabdžių suportų restauravimas ir keitimas",
      "Stabdžių žarnelių ir vamzdelių keitimas",
      "Stabdžių skysčio keitimas ir sistemos nuorinimas",
      "Rankinio stabdžio reguliavimas bei trosų keitimas"
    ]
  },
  {
    id: "tepalu-keitimas",
    pavadinimas: "Tepalų ir filtrų keitimas",
    aprasymas: "Reguliarus variklio alyvos bei visų filtrų keitimas, garantuojantis ilgesnį variklio tarnavimo laiką.",
    isrobintasAprasymas: "Variklio alyva atlieka lemiamą vaidmenį tepant, vėsinant ir valant vidines variklio detales. Keičiant tepalus laiku (kas 10 000 km arba kartą per metus), užtikrinama apsauga nuo trinties ir nusidėvėjimo. Kartu keičiame alyvos, oro, salono bei kuro filtrus ir nustatome naują serviso intervalą prietaisų skydelyje.",
    ikona: "🛢️",
    nuotraukos: [
      tepalai1,
      tepalai2
    ],
    darbai: [
      "Variklio alyvos nuleidimas ir užpylimas",
      "Alyvos filtro keitimas",
      "Oro ir salono filtrų keitimas",
      "Kuro filtro keitimas",
      "Serviso intervalo nustatymas (reseto atlikimas)"
    ]
  },
  {
    id: "kompiuterine-diagnostika",
    pavadinimas: "Kompiuterinė diagnostika",
    aprasymas: "Išsamus visų automobilio elektroninių sistemų ir klaidų patikrinimas naudojant modernius diagnostikos prietaisus.",
    isrobintasAprasymas: "Šiuolaikiniai automobiliai turi dešimtis valdymo blokų, kurie nuolat stebi jutiklių parodymus. Užsižiebus „Check Engine“ ar kitai įspėjamajai lemputei, profesionali kompiuterinė diagnostika leidžia greitai nustatyti tikslią gedimo priežastį be spėliojimų. Tikriname klaidų kodus, stebime parametrus gyvai ir konsultuojame dėl tolesnio remonto eigos.",
    ikona: "💻",
    nuotraukos: [
      diagnostika1,
      diagnostika2
    ],
    darbai: [
      "Klaidų kodų (DTC) nuskaitymas ir trynimas",
      "Variklio parametrų stebėjimas realiu laiku",
      "ABS, ESP, Airbag ir kitų blokų diagnostika",
      "Serviso pranešimų nustatymas",
      "Gedimų priežasčių nustatymas ir konsultacija"
    ]
  },
  {
    id: "ischeckio-remontas",
    pavadinimas: "Išmetimo sistemos remontas",
    aprasymas: "Duslintuvų suvirinimas, gofrų, laikiklių bei atskirų išmetimo sekcijų atnaujinimas ir kiti darbai.",
    isrobintasAprasymas: "Kiauras ar pažeistas duslintuvas sukelia ne tik nemalonų triukšmą, bet ir praleidžia nuodingas išmetamąsias dujas bei neigiamai veikia variklio trauką. Suviriname pažeistas išmetimo sistemos vietas, keičiame susidėvėjusias gofras, guminius laikiklius ar visą išmetimo sekciją nauja.",
    ikona: "💨",
    nuotraukos: [
      ismetimas1,
      ismetimas2
    ],
    darbai: [
      "Duslintuvų suvirinimas ir sandarinimas",
      "Išmetimo sistemos gofrų keitimas",
      "Duslintuvo laikiklių ir gumų keitimas",
      "Atskirų išmetimo vamzdžių sekcijų keitimas"
    ]
  },
  {
    id: "technine-pagalba",
    pavadinimas: "Automobilio paruošimas TA",
    aprasymas: "",
    isrobintasAprasymas: "",
    ikona: "📋",
    nuotraukos: [
      technineApziura1,
      technineApziura2
    ],
    darbai: [
      "Pakabos ir vairavimo mechanizmo patikra",
      "Šviesų ir žibintų reguliavimas - Ruošiama",
      "Skysčių nuotėkio patikra",
      "Trūkumų šalinimas prieš TA",
      "Slenksčių darbai"
    ]
  },
  {
    id: "zibintu-stiklu-poliravimas",
    pavadinimas: "Žibintų poliravimas",
    aprasymas: "Žibintų stiklų poliravimas, atkuriantis jų skaidrumą ir gerinantis matomumą kelyje.",
    isrobintasAprasymas: "Poliruojame pageltusius, matiniais tapusius ar smulkiai subraižytus žibintų stiklus, kad jie vėl būtų skaidresni ir efektyviau apšviestų kelią.",
    ikona: "💡",
    nuotraukos: [
      zibintai1,
      zibintai2
    ],
    darbai: [
      "Žibintų būklės įvertinimas",
      "Žibintų stiklų poliravimas",
      "Skaidrumo ir šviesos pralaidumo atkūrimas"
    ]
  }
];

export default function Paslaugos() {
  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 font-sans text-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-black tracking-wide text-white mb-4">
            Mūsų Atliekamos <span className="text-amber-500">Paslaugos</span>
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paslaugosData.map((item) => (
            <div
              key={item.id}
              className="bg-emerald-950/90 backdrop-blur-sm border border-emerald-800/70 rounded-2xl p-6 hover:border-amber-500/50 transition-all flex flex-col justify-between group shadow-lg min-h-[140px]"
            >
              <div>
                <h3 className="text-xl font-bold text-white group-hover:text-amber-500 transition-colors">
                  {item.pavadinimas}
                </h3>
              </div>

              <Link
                to={`/paslaugos/${item.id}`}
                className="inline-flex items-center gap-2 text-sm font-bold text-amber-500 hover:text-amber-400 transition-colors mt-auto"
              >
                Plačiau <span>→</span>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
