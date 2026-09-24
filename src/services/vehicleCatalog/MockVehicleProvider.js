import makes from "../../data/vehicles/makes.json";
import models from "../../data/vehicles/models.json";
import generations from "../../data/vehicles/generations.json";
import engines from "../../data/vehicles/engines.json";
import { VehicleCatalogProvider } from "./VehicleCatalogProvider";

const clone = (value) => value == null ? value : JSON.parse(JSON.stringify(value));

export class MockVehicleProvider extends VehicleCatalogProvider {
  async getMakes() {
    return clone(makes);
  }

  async getModels(makeId) {
    return clone(models.filter((model) => model.makeId === makeId));
  }

  async getGenerations(modelId) {
    return clone(generations.filter((generation) => generation.modelId === modelId));
  }

  async getYears(generationId) {
    return clone(generations
      .filter((generation) => generation.generationId === generationId)
      .map((generation) => ({
        generationId: generation.generationId,
        yearFrom: generation.yearFrom,
        yearTo: generation.yearTo,
        label: generation.yearTo ? `${generation.yearFrom}–${generation.yearTo}` : `${generation.yearFrom}–dabar`
      })));
  }

  async getEngines(generationId, year) {
    return clone(engines.filter((engine) => {
      const generation = generations.find((item) => item.generationId === generationId);
      const matchesGeneration = engine.generationId === generationId;
      const matchesYear = !year || !generation || (year.yearFrom === generation.yearFrom && year.yearTo === generation.yearTo);
      return matchesGeneration && matchesYear;
    }));
  }
}
