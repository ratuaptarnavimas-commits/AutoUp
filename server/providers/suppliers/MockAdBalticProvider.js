import { products } from "../../data/products.js";
import { SupplierProvider } from "./SupplierProvider.js";

export class MockAdBalticProvider extends SupplierProvider {
  async searchProducts(query = "") { return products.filter((product) => `${product.brand} ${product.name} ${product.sku}`.toLowerCase().includes(query.toLowerCase())).flatMap((product) => product.supplierOffers.filter((offer) => offer.supplier === "adbaltic")); }
  async getProduct(product) { return product.supplierOffers.find((offer) => offer.supplier === "adbaltic") || null; }
  async getPrice(product) { return (await this.getProduct(product))?.costPrice ?? null; }
  async getStock(product) { return (await this.getProduct(product))?.stock ?? 0; }
  async getAvailability(product) { const offer = await this.getProduct(product); return offer ? { stock: offer.stock, deliveryDays: offer.deliveryDays } : null; }
  async createOrder() { throw new Error("Mock provider does not create external orders"); }
}
