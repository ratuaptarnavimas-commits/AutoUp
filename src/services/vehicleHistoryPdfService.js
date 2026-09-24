import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";

pdfMake.addVirtualFileSystem(pdfFonts);
pdfMake.addFonts({
  NotoSans: {
    normal: "Roboto-Regular.ttf",
    bold: "Roboto-Medium.ttf",
  },
});

const formatMileage = (value) => {
  if (value === null || value === undefined || value === "") return "";
  return `${Number(value).toLocaleString("lt-LT", { useGrouping: true }).replace(/\u00a0/g, " ")} km`;
};

const nonEmpty = (value) => value !== null && value !== undefined && String(value).trim() !== "";

const loadLogoDataUrl = async () => {
  const response = await fetch("/images/logo.png");
  if (!response.ok) {
    throw new Error(`Nepavyko įkelti AutoUP logotipo (${response.status}).`);
  }

  const buffer = await response.arrayBuffer();
  const bytes = new Uint8Array(buffer);
  let binary = "";
  const chunkSize = 0x8000;

  for (let index = 0; index < bytes.length; index += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(index, index + chunkSize));
  }

  return `data:image/png;base64,${btoa(binary)}`;
};

const addField = (label, value, options = {}) => {
  if (!nonEmpty(value)) return [];

  return [{
    columns: [
      { text: label, style: "fieldLabel", width: options.labelWidth || 130 },
      { text: String(value), style: options.valueStyle || "fieldValue" },
    ],
    columnGap: 8,
    margin: [0, 0, 0, 7],
  }];
};

const addListField = (label, items, formatter = (item) => item) => {
  const values = (items || [])
    .map(formatter)
    .filter(nonEmpty);

  if (!values.length) return [];

  return [{
    stack: [
      { text: label, style: "fieldLabel", margin: [0, 0, 0, 3] },
      {
        ul: values,
        style: "listValue",
        margin: [8, 0, 0, 0],
      },
    ],
    margin: [0, 0, 0, 8],
  }];
};

const formatPart = (part) => {
  if (typeof part === "string") return part;
  if (!part) return "";
  return [part.name, part.location ? `— ${part.location}` : ""].filter(Boolean).join(" ");
};

const createRecordBlock = (record) => ({
  unbreakable: false,
  stack: [
    {
      columns: [
        { text: record.date || "", style: "recordDate" },
        { text: formatMileage(record.mileage), style: "recordMileage", alignment: "right" },
      ],
      margin: [0, 0, 0, 5],
    },
    { text: record.category || "", style: "recordCategory", margin: [0, 0, 0, 10] },
    ...addField("Kliento problema / nusiskundimas", record.customerComplaint),
    ...addListField("Atlikti darbai", record.workPerformed),
    ...addListField("Panaudotos dalys", record.partsUsed, formatPart),
    ...addListField("Panaudotos medžiagos", record.materialsUsed),
    ...addField("Viešos pastabos", record.publicNotes),
    ...addField("Atliko", record.performedBy),
    ...(record.verifiedByAutoup ? [{ text: "PATVIRTINTA AUTOUP", style: "verified", margin: [0, 3, 0, 0] }] : []),
  ],
  margin: [0, 0, 0, 14],
  style: "recordBlock",
});

export const downloadVehicleHistoryPdf = async (vehicle) => {
  if (!vehicle || !Array.isArray(vehicle.records)) {
    throw new Error("Automobilio istorijos duomenys nepasiekiami.");
  }

  const logoDataUrl = await loadLogoDataUrl();
  const registrationNumber = String(vehicle.registrationNumber || "AUTOMOBILIS").trim();
  const records = vehicle.records
    .map((record, index) => ({ record, index }))
    .sort((a, b) => {
      const dateOrder = String(b.record.date || "").localeCompare(String(a.record.date || ""));
      return dateOrder || a.index - b.index;
    })
    .map(({ record }) => record);
  const latestRecordWithMileage = records.find(
    (record) => record.mileage !== null && record.mileage !== undefined && record.mileage !== ""
  );

  const documentDefinition = {
    pageSize: "A4",
    pageMargins: [42, 42, 42, 42],
    defaultStyle: {
      font: "NotoSans",
      fontSize: 9,
      color: "#18251f",
      lineHeight: 1.15,
    },
    footer: (currentPage, pageCount) => ({
      columns: [
        { text: "Automobilio techninės priežiūros ir remonto istorija užfiksuota AutoUP sistemoje.", style: "footer" },
        { text: `${currentPage} / ${pageCount}`, style: "footer", alignment: "right" },
      ],
      margin: [42, 10, 42, 0],
    }),
    content: [
      {
        table: {
          widths: ["*"],
          body: [[{
            stack: [
              { image: logoDataUrl, width: 118, fit: [118, 76], alignment: "left" },
              { text: "AUTOMOBILIO TECHNINĖS PRIEŽIŪROS IR REMONTO ISTORIJA", style: "title" },
            ],
          }]],
        },
        layout: {
          fillColor: () => "#063b27",
          hLineWidth: () => 0,
          vLineWidth: () => 0,
          paddingLeft: () => 18,
          paddingRight: () => 18,
          paddingTop: () => 16,
          paddingBottom: () => 16,
        },
        margin: [0, 0, 0, 20],
      },
      { text: "AUTOMOBILIO DUOMENYS", style: "sectionTitle" },
      {
        table: {
          widths: ["*", "*"],
          body: [
            [
              { stack: [...addField("Markė", vehicle.make), ...addField("Modelis", vehicle.model), ...addField("Variklis", vehicle.engine)] },
              { stack: [...addField("Pagaminimo metai", vehicle.year), ...addField("Valstybinis numeris", registrationNumber), ...addField("VIN", vehicle.vin)] },
            ],
          ],
        },
        layout: {
          fillColor: () => "#eef5f0",
          hLineColor: () => "#cbded2",
          vLineColor: () => "#cbded2",
          hLineWidth: () => 0.6,
          vLineWidth: () => 0.6,
          paddingLeft: () => 12,
          paddingRight: () => 12,
          paddingTop: () => 12,
          paddingBottom: () => 8,
        },
        margin: [0, 0, 0, 20],
      },
      ...addField("Paskutinė užfiksuota rida", formatMileage(latestRecordWithMileage?.mileage), { valueStyle: "lastMileage" }),
      { text: "APTARNAVIMO IR REMONTO ISTORIJA", style: "sectionTitle", margin: [0, 12, 0, 10] },
      records.length
        ? records.map(createRecordBlock)
        : { text: "Aptarnavimo ir remonto įrašų nėra.", style: "emptyState" },
    ],
    styles: {
      title: { color: "#ffffff", fontSize: 11, bold: true, margin: [0, 4, 0, 0] },
      sectionTitle: { color: "#075633", fontSize: 13, bold: true, characterSpacing: 0.4 },
      fieldLabel: { color: "#557065", fontSize: 8, bold: true },
      fieldValue: { color: "#18251f", fontSize: 9 },
      lastMileage: { color: "#075633", fontSize: 11, bold: true },
      recordBlock: { fillColor: "#f7faf8", margin: [0, 0, 0, 14] },
      recordDate: { color: "#075633", fontSize: 12, bold: true },
      recordMileage: { color: "#526b5f", fontSize: 10, bold: true },
      recordCategory: { color: "#b67b00", fontSize: 10, bold: true },
      listValue: { color: "#18251f", fontSize: 9 },
      verified: { color: "#075633", fontSize: 9, bold: true },
      emptyState: { color: "#526b5f", italics: true },
      footer: { color: "#71847a", fontSize: 7 },
    },
  };

  const safeRegistrationNumber = registrationNumber.replace(/[^A-Z0-9-]/gi, "-");
  return new Promise((resolve, reject) => {
    try {
      pdfMake.createPdf(documentDefinition).download(
        `AutoUP-${safeRegistrationNumber}-istorija.pdf`,
        resolve
      );
    } catch (error) {
      reject(error);
    }
  });
};

export default downloadVehicleHistoryPdf;
