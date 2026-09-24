import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { VehicleProvider } from "./VehicleProvider.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../../src/data/vehicles");
const read = (name) => fs.readFile(path.join(root, name), "utf8").then(JSON.parse);

export class MockVehicleProvider extends VehicleProvider {
  getMakes() { return read("makes.json"); }
  async getModels(makeId) { return (await read("models.json")).filter((item) => item.makeId === makeId); }
  async getGenerations(modelId) { return (await read("generations.json")).filter((item) => item.modelId === modelId); }
  async getYears(generationId) { return (await this.getGenerationsForYear(generationId)).map((item) => ({ generationId: item.generationId, yearFrom: item.yearFrom, yearTo: item.yearTo, label: item.yearTo ? `${item.yearFrom}–${item.yearTo}` : `${item.yearFrom}–dabar` })); }
  async getGenerationsForYear(generationId) { return (await read("generations.json")).filter((item) => item.generationId === generationId); }
  async getEngines(generationId, year) { const generations = await this.getGenerationsForYear(generationId); const generation = generations[0]; const matches = !year || !generation || (year.yearFrom === generation.yearFrom && year.yearTo === generation.yearTo); return matches ? (await read("engines.json")).filter((item) => item.generationId === generationId) : []; }
}
