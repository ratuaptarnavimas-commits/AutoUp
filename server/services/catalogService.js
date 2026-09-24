import { products } from "../data/products.js";
import { calculateRetailPrice } from "./pricingService.js";
import { getBestOffer } from "./supplierService.js";

export async function toPublicProduct(product) {
  const offer = await getBestOffer(product);
  return { id: product.id, slug: product.slug, brand: product.brand, name: product.name, sku: product.sku, ean: product.ean, oemNumbers: product.oemNumbers, category: product.category, description: product.description, images: product.images, specifications: product.specifications, compatibility: product.compatibility, price: offer ? calculateRetailPrice(offer.costPrice) : null, stockStatus: offer?.stock > 0 ? "Sandėlyje" : "Nėra sandėlyje", deliveryEstimate: offer ? `${offer.deliveryDays} d. d.` : "Pagal užsakymą" };
}
export async function listProducts({ category, vehicleId, query }) { const filtered = products.filter((product) => (!category || product.category === category) && (!vehicleId || product.compatibility.includes(vehicleId)) && (!query || `${product.brand} ${product.name} ${product.sku} ${product.ean} ${product.oemNumbers.join(" ")}`.toLowerCase().includes(query.toLowerCase()))); return Promise.all(filtered.map(toPublicProduct)); }
export async function getProduct(id) { const product = products.find((item) => item.id === id); return product ? toPublicProduct(product) : null; }
