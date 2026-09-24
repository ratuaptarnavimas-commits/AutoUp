import { createOrder } from "../services/orderService.js";
export async function ordersRoute(body) { return createOrder(body); }
