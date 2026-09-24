import { apiRequest } from "./apiClient";

export const productsApi = {
  list: (params = {}) => apiRequest(`/products?${new URLSearchParams(params)}`),
  get: (id) => apiRequest(`/products/${id}`),
  search: (query) => apiRequest(`/products/search?q=${encodeURIComponent(query)}`)
};
