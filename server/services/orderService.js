import { ApiError } from "../utils/errors.js";
import { validateOrderInput } from "../utils/validation.js";
import { getProduct } from "./catalogService.js";

export async function createOrder(body) {
  validateOrderInput(body);
  const items = [];
  for (const input of body.items) {
    const product = await getProduct(input.productId);
    if (!product) throw new ApiError(400, `Unknown product: ${input.productId}`);
    items.push({ productId: product.id, name: product.name, quantity: input.quantity, unitPrice: product.price, lineTotal: Number((product.price * input.quantity).toFixed(2)) });
  }
  const subtotal = Number(items.reduce((sum, item) => sum + item.lineTotal, 0).toFixed(2));
  return { orderNumber: `AU-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`, createdAt: new Date().toISOString(), customer: body.customer, company: body.company || null, deliveryMethod: body.deliveryMethod, deliveryAddress: body.deliveryAddress || null, paymentMethod: body.paymentMethod, items, subtotal, total: subtotal };
}
