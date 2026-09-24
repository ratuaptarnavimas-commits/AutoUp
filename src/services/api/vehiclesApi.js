import { apiRequest } from "./apiClient";

export const vehiclesApi = {
  getMakes: () => apiRequest("/vehicles/makes"),
  getModels: (makeId) => apiRequest(`/vehicles/models?makeId=${encodeURIComponent(makeId)}`),
  getGenerations: (modelId) => apiRequest(`/vehicles/generations?modelId=${encodeURIComponent(modelId)}`),
  getYears: (generationId) => apiRequest(`/vehicles/years?generationId=${encodeURIComponent(generationId)}`),
  getEngines: (generationId, year) => apiRequest(`/vehicles/engines?generationId=${encodeURIComponent(generationId)}&yearFrom=${year.yearFrom}&yearTo=${year.yearTo}`)
};
