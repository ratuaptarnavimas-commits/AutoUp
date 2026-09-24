import { autopartsProducts } from "../../components/autoparts/autopartsData";
import { SupplierProvider } from "./SupplierProvider";

// Real Inter Cars requests must be made by the AutoUp backend, never from this frontend adapter.
export class InterCarsProvider extends SupplierProvider {
  async searchProducts(query = "") {
    const normalizedQuery = query.toLowerCase();
    return autopartsProducts.filter((product) => `${product.brand} ${product.name} ${product.sku}`.toLowerCase().includes(normalizedQuery)).map((product) => this.getProduct(product));
  }

  async getProduct(product) {
    return product.supplierOffers.find((offer) => offer.supplier === "intercars") || null;
  }

  async getPrice(product) {
    const offer = await this.getProduct(product);
    return offer?.costPrice ?? null;
  }

  async getStock(product) {
    const offer = await this.getProduct(product);
    return offer?.stock ?? 0;
  }

  async createOrder() {
    throw new Error("Inter Cars orders require the AutoUp backend integration");
  }
}
