const createOrderNumber = () => `AU-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`;

export function createMockOrder({ customer, company, deliveryMethod, deliveryAddress, paymentMethod, items, subtotal }) {
  // Preview only. Production must revalidate prices, stock and supplier selection in the AutoUp backend.
  return {
    orderNumber: createOrderNumber(),
    createdAt: new Date().toISOString(),
    customer,
    company,
    deliveryMethod,
    deliveryAddress,
    paymentMethod,
    items: items.map(({ id, brand, name, code, price, quantity }) => ({ id, brand, name, code, price, quantity })),
    subtotal,
    total: subtotal
  };
}
