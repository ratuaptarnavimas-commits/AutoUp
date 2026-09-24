import { ApiError } from "./errors.js";

export function requireQuery(value, field) {
  if (!value) throw new ApiError(400, `${field} is required`);
  return value;
}

export function validateOrderInput(body) {
  if (!body || !body.customer) throw new ApiError(400, "customer is required");
  for (const field of ["firstName", "lastName", "phone", "email"]) {
    if (!String(body.customer[field] || "").trim()) throw new ApiError(400, `customer.${field} is required`);
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.customer.email)) throw new ApiError(400, "customer.email is invalid");
  if (!["pickup", "courier"].includes(body.deliveryMethod)) throw new ApiError(400, "deliveryMethod is invalid");
  if (!["bank", "cash"].includes(body.paymentMethod)) throw new ApiError(400, "paymentMethod is invalid");
  if (!Array.isArray(body.items) || body.items.length === 0) throw new ApiError(400, "items are required");
  body.items.forEach((item) => {
    if (!item?.productId || !Number.isInteger(item.quantity) || item.quantity < 1) throw new ApiError(400, "Each item requires productId and a positive integer quantity");
  });
}
