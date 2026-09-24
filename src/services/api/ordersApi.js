import { apiRequest } from "./apiClient";

export const ordersApi = {
  create: (order) => apiRequest("/orders", { method: "POST", body: JSON.stringify(order) })
};
