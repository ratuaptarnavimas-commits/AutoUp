export class SupplierProvider {
  searchProducts() {
    throw new Error("SupplierProvider.searchProducts() must be implemented");
  }

  getProduct() {
    throw new Error("SupplierProvider.getProduct() must be implemented");
  }

  getPrice() {
    throw new Error("SupplierProvider.getPrice() must be implemented");
  }

  getStock() {
    throw new Error("SupplierProvider.getStock() must be implemented");
  }

  createOrder() {
    throw new Error("SupplierProvider.createOrder() must be implemented");
  }
}
