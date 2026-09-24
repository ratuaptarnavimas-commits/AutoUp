export const autopartsCategories = [
  { id: "brakes", label: "Stabdžiai", icon: "disc" },
  { id: "suspension", label: "Važiuoklė", icon: "car" },
  { id: "engine", label: "Variklio dalys", icon: "settings" },
  { id: "filters", label: "Filtrai", icon: "filter" },
  { id: "fluids", label: "Alyvos ir skysčiai", icon: "droplet" },
  { id: "clutch", label: "Sankaba", icon: "rotate" },
  { id: "transmission", label: "Transmisija", icon: "cog" },
  { id: "cooling", label: "Aušinimo sistema", icon: "thermometer" },
  { id: "electrics", label: "Elektros dalys", icon: "zap" },
  { id: "lighting", label: "Apšvietimas", icon: "lightbulb" },
  { id: "wipers", label: "Valytuvai", icon: "wind" },
  { id: "body", label: "Kėbulo dalys", icon: "car-front" }
];

export const autopartsProducts = [
  {
    id: "brembo-09701111", slug: "brembo-09-7011-11", brand: "BREMBO", name: "Priekinis stabdžių diskas", sku: "09.7011.11", code: "09.7011.11", ean: "8020584012345", oemNumbers: ["1J0615301J"], tecdocArticleId: null, category: "brakes", description: "Priekinis ventiliuojamas stabdžių diskas.", specifications: [{ label: "Skersmuo", value: "288 mm" }, { label: "Storis", value: "25 mm" }, { label: "Minimalus storis", value: "23 mm" }, { label: "Skylių skaičius", value: "5" }, { label: "Tipas", value: "Ventiliuojamas" }], images: [], compatibleVehicleIds: ["audi-a3-8l-18t-agu"], fitment: "Audi A3 8L 1.8T 110 kW",
    supplierOffers: [{ supplier: "intercars", supplierProductId: "IC-09701111", costPrice: 42.1, stock: 8, deliveryDays: 1 }, { supplier: "adbaltic", supplierProductId: "ADB-09701111", costPrice: 39.8, stock: 3, deliveryDays: 1 }]
  },
  {
    id: "sachs-3000951001", slug: "sachs-3000-951-001", brand: "SACHS", name: "Sankabos komplektas", sku: "3000 951 001", code: "3000 951 001", ean: "4013872876543", oemNumbers: ["06A141025L"], tecdocArticleId: null, category: "clutch", description: "Sankabos komplektas kasdieniam važiavimui.", images: [], compatibleVehicleIds: ["audi-a3-8l-18t-agu"], fitment: "Audi A3 8L 1.8T 110 kW",
    supplierOffers: [{ supplier: "intercars", supplierProductId: "IC-3000951001", costPrice: 168.2, stock: 2, deliveryDays: 2 }, { supplier: "adbaltic", supplierProductId: "ADB-3000951001", costPrice: 172.5, stock: 6, deliveryDays: 1 }]
  },
  {
    id: "mann-c25114", slug: "mann-c-25-114", brand: "MANN-FILTER", name: "Oro filtras", sku: "C 25 114", code: "C 25 114", ean: "4011558054321", oemNumbers: ["1J0129620"], tecdocArticleId: null, category: "filters", description: "Variklio oro filtras.", images: [], compatibleVehicleIds: ["audi-a3-8l-18t-agu"], fitment: "Audi A3 8L 1.8T 110 kW",
    supplierOffers: [{ supplier: "intercars", supplierProductId: "IC-C25114", costPrice: 14.1, stock: 12, deliveryDays: 1 }, { supplier: "adbaltic", supplierProductId: "ADB-C25114", costPrice: 13.4, stock: 0, deliveryDays: 1 }]
  },
  {
    id: "lemforder-2701501", slug: "lemforder-27015-01", brand: "LEMFÖRDER", name: "Priekinės pakabos svirtis", sku: "27015 01", code: "27015 01", ean: "4009026723456", oemNumbers: ["1J0407151C"], tecdocArticleId: null, category: "suspension", description: "Priekinės pakabos apatinė svirtis.", images: [], compatibleVehicleIds: ["audi-a3-8l-18t-agu"], fitment: "Audi A3 8L 1.8T 110 kW",
    supplierOffers: [{ supplier: "intercars", supplierProductId: "IC-2701501", costPrice: 61.3, stock: 0, deliveryDays: 3 }, { supplier: "adbaltic", supplierProductId: "ADB-2701501", costPrice: 63.8, stock: 4, deliveryDays: 2 }]
  },
  {
    id: "bosch-0242235666", slug: "bosch-0242235666", brand: "BOSCH", name: "Uždegimo žvakių komplektas", sku: "0 242 235 666", code: "0 242 235 666", ean: "4047023478901", oemNumbers: ["101000033AA"], tecdocArticleId: null, category: "engine", description: "Uždegimo žvakių komplektas benzininiam varikliui.", images: [], compatibleVehicleIds: ["audi-a3-8l-18t-agu"], fitment: "Audi A3 8L 1.8T 110 kW",
    supplierOffers: [{ supplier: "intercars", supplierProductId: "IC-0242235666", costPrice: 24.2, stock: 5, deliveryDays: 1 }, { supplier: "adbaltic", supplierProductId: "ADB-0242235666", costPrice: 22.9, stock: 2, deliveryDays: 2 }]
  },
  {
    id: "castrol-5w30-5l", slug: "castrol-edge-5w30-5l", brand: "CASTROL", name: "EDGE 5W-30 variklio alyva 5 l", sku: "15F7A4", code: "15F7A4", ean: "4008177187654", oemNumbers: [], tecdocArticleId: null, category: "fluids", description: "Sintetinė variklio alyva benzininiams ir dyzeliniams varikliams.", images: [], compatibleVehicleIds: [], fitment: "Daugeliui automobilių pagal gamintojo specifikaciją",
    supplierOffers: [{ supplier: "intercars", supplierProductId: "IC-15F7A4", costPrice: 31.5, stock: 7, deliveryDays: 1 }, { supplier: "adbaltic", supplierProductId: "ADB-15F7A4", costPrice: 33.2, stock: 9, deliveryDays: 1 }]
  },
  { id: "valeo-826577", slug: "valeo-574326", brand: "VALEO", name: "Priekinio stiklo valytuvų komplektas", sku: "574326", code: "574326", ean: "3276425743268", oemNumbers: [], tecdocArticleId: null, category: "wipers", description: "Priekinio stiklo valytuvų komplektas.", images: [], compatibleVehicleIds: ["audi-a3-8l-18t-agu"], fitment: "Audi A3 8L 1.8T 110 kW", supplierOffers: [{ supplier: "intercars", supplierProductId: "IC-574326", costPrice: 19.2, stock: 4, deliveryDays: 1 }, { supplier: "adbaltic", supplierProductId: "ADB-574326", costPrice: 18.9, stock: 2, deliveryDays: 2 }] }
];
