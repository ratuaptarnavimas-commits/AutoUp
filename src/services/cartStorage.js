const CART_STORAGE_KEY = "autoup_preview_cart";

const isValidItem = (item) => Boolean(item?.id && item?.name && Number.isFinite(item?.price) && Number.isInteger(item?.quantity) && item.quantity > 0);

export function loadCart() {
  try {
    const parsed = JSON.parse(localStorage.getItem(CART_STORAGE_KEY) || "[]");
    if (!Array.isArray(parsed)) {
      saveCart([]);
      return [];
    }
    return parsed.filter(isValidItem);
  } catch {
    saveCart([]);
    return [];
  }
}

export function saveCart(cart) {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
}

export function addCartItem(cart, product) {
  const existing = cart.find((item) => item.id === product.id);
  return existing
    ? cart.map((item) => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item)
    : [...cart, { ...product, quantity: 1 }];
}

export function updateCartQuantity(cart, id, change) {
  return cart
    .map((item) => item.id === id ? { ...item, quantity: item.quantity + change } : item)
    .filter((item) => item.quantity > 0);
}

export function removeCartItem(cart, id) {
  return cart.filter((item) => item.id !== id);
}
