export class VehicleCatalogProvider {
  getMakes() {
    throw new Error("VehicleCatalogProvider.getMakes() must be implemented");
  }

  getModels(makeId) {
    throw new Error(`VehicleCatalogProvider.getModels() must be implemented for ${makeId}`);
  }

  getGenerations(modelId) {
    throw new Error(`VehicleCatalogProvider.getGenerations() must be implemented for ${modelId}`);
  }

  getYears(generationId) {
    throw new Error(`VehicleCatalogProvider.getYears() must be implemented for ${generationId}`);
  }

  getEngines(generationId, year) {
    throw new Error(`VehicleCatalogProvider.getEngines() must be implemented for ${generationId}, ${year}`);
  }
}
