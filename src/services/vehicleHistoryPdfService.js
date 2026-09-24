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

const downloadPdfBlob = (pdfDocument, fileName) => new Promise((resolve, reject) => {
  let timeoutId;

  const finish = (callback) => {
    clearTimeout(timeoutId);
    callback();
  };

  timeoutId = setTimeout(() => {
    reject(new Error("PDF generavimas užtruko per ilgai."));
  }, 30000);

  try {
    pdfDocument.getBlob((blob) => {
      try {
        const objectUrl = URL.createObjectURL(blob);
        const anchor = document.createElement("a");
        anchor.href = objectUrl;
        anchor.download = fileName;
        anchor.rel = "noopener";
        document.body.appendChild(anchor);
        anchor.click();
        anchor.remove();
        setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
        finish(resolve);
      } catch (error) {
        finish(() => reject(error));
      }
    });
  } catch (error) {
    finish(() => reject(error));
  }
});

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

const formatDate = (value) => {
  const match = String(value || "").match(/^(\d{4})-(\d{2})-(\d{2})$/);
  return match ? `${match[3]}.${match[2]}.${match[1]}` : String(value || "");
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
  // Allow long history entries to continue on the next page instead of blocking layout.
  unbreakable: false,
  stack: [
    {
      columns: [
        { text: formatDate(record.date), style: "recordDate" },
        { text: formatMileage(record.mileage), style: "recordMileage", alignment: "right" },
      ],
      margin: [0, 0, 0, 6],
    },
    { text: record.category || "", style: "recordCategory", margin: [0, 0, 0, 10] },
    ...addField("Kliento nurodyta problema", record.customerComplaint),
    ...addListField("Atlikti darbai", record.workPerformed),
    ...addListField("Naudotos / pakeistos dalys", record.partsUsed, formatPart),
    ...addListField("Panaudotos medžiagos", record.materialsUsed),
    ...addField("Pastabos", record.publicNotes),
    ...addField("Atliko", record.performedBy || "AutoUP"),
    ...(record.verifiedByAutoup ? [{ text: "PATVIRTINTA AUTOUP", style: "verified", margin: [0, 3, 0, 0] }] : []),
  ],
  margin: [0, 0, 0, 10],
  style: "recordBlock",
});

export const downloadVehicleHistoryPdf = async (vehicle) => {
  if (!vehicle || !Array.isArray(vehicle.records)) {
    throw new Error("Automobilio istorijos duomenys nepasiekiami.");
  }

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
        { text: "AutoUP • Automobilio techninės priežiūros istorija", style: "footer" },
        { text: `${currentPage} / ${pageCount}`, style: "footer", alignment: "right" },
      ],
      margin: [42, 8, 42, 0],
    }),
    content: [
      {
        table: {
          widths: ["*", "auto"],
          body: [[
            {
              stack: [
                { text: [{ text: "Auto", color: "#ffffff" }, { text: "UP", color: "#e53935" }], style: "brand" },
                { text: "Techninės priežiūros ir remonto istorija", style: "subtitle" },
                { text: "Dokumentas sugeneruotas AutoUP sistemoje", style: "generated" },
              ],
            },
            { text: "AUTOMOBILIO\nISTORIJA", style: "headerSide", alignment: "right" },
          ]],
        },
        layout: {
          fillColor: () => "#063b27",
          hLineWidth: () => 0,
          vLineWidth: () => 0,
          paddingLeft: () => 18,
          paddingRight: () => 18,
          paddingTop: () => 11,
          paddingBottom: () => 11,
        },
        margin: [0, 0, 0, 18],
      },
      { text: "AUTOMOBILIO DUOMENYS", style: "sectionTitle", margin: [0, 0, 0, 8] },
      {
        stack: [
          { text: `${vehicle.make || ""} ${vehicle.model || ""}`.trim(), style: "vehicleName" },
          { text: vehicle.engine || "", style: "vehicleEngine", margin: [0, 2, 0, 10] },
          {
            table: {
              widths: ["auto", "*", "auto", "*"],
              body: [
                [
                  { text: "Valstybinis numeris", style: "infoLabel" }, { text: registrationNumber, style: "infoValue" },
                  { text: "VIN", style: "infoLabel" }, { text: vehicle.vin || "", style: "infoValue" },
                ],
                [
                  { text: "Pagaminimo metai", style: "infoLabel" }, { text: nonEmpty(vehicle.year) ? String(vehicle.year) : "", style: "infoValue" },
                  { text: "Paskutinė užfiksuota rida", style: "infoLabel" }, { text: formatMileage(latestRecordWithMileage?.mileage) || "Nenurodyta", style: "infoValue" },
                ],
              ],
            },
            layout: "noBorders",
          },
        ],
        style: "vehicleCard",
      },
      { text: "APTARNAVIMO IR REMONTO ISTORIJA", style: "sectionTitle", margin: [0, 18, 0, 10] },
      records.length
        ? records.map(createRecordBlock)
        : { text: "Aptarnavimo ir remonto įrašų nėra.", style: "emptyState" },
    ],
    styles: {
      brand: { fontSize: 22, bold: true, characterSpacing: -0.5 },
      subtitle: { color: "#ffffff", fontSize: 9, bold: true, margin: [0, 2, 0, 0] },
      generated: { color: "#b9d3c3", fontSize: 7, margin: [0, 2, 0, 0] },
      headerSide: { color: "#f4bd24", fontSize: 8, bold: true, characterSpacing: 0.8, margin: [10, 4, 0, 0] },
      sectionTitle: { color: "#075633", fontSize: 12, bold: true, characterSpacing: 0.4 },
      vehicleCard: { fillColor: "#eef5f0", margin: [0, 0, 0, 0] },
      vehicleName: { color: "#12271d", fontSize: 20, bold: true },
      vehicleEngine: { color: "#b67b00", fontSize: 11, bold: true },
      infoLabel: { color: "#557065", fontSize: 7.5, bold: true, margin: [0, 4, 8, 4] },
      infoValue: { color: "#18251f", fontSize: 9, margin: [0, 4, 12, 4] },
      fieldLabel: { color: "#557065", fontSize: 8, bold: true },
      fieldValue: { color: "#18251f", fontSize: 9 },
      lastMileage: { color: "#075633", fontSize: 11, bold: true },
      recordBlock: { fillColor: "#f7faf8", margin: [0, 0, 0, 10] },
      recordDate: { color: "#075633", fontSize: 12, bold: true },
      recordMileage: { color: "#526b5f", fontSize: 10, bold: true },
      recordCategory: { color: "#b67b00", fontSize: 10, bold: true },
      listValue: { color: "#18251f", fontSize: 9 },
      verified: { color: "#075633", fontSize: 9, bold: true },
      emptyState: { color: "#526b5f" },
      footer: { color: "#71847a", fontSize: 7 },
    },
  };

  const safeRegistrationNumber = registrationNumber.replace(/[^A-Z0-9-]/gi, "-");
  const fileName = `AutoUP-${safeRegistrationNumber}-istorija.pdf`;

  try {
    const pdfDocument = pdfMake.createPdf(documentDefinition);
    await downloadPdfBlob(pdfDocument, fileName);
  } catch (error) {
    console.error("PDF generation failed:", error);
    throw error;
  }
};

export default downloadVehicleHistoryPdf;
