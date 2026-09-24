import { autopartsProducts } from "../../components/autoparts/autopartsData";
import { calculateRetailPrice } from "../../utils/pricing";
import { AdBalticProvider } from "./AdBalticProvider";
import { InterCarsProvider } from "./InterCarsProvider";

export const supplierProviders = [new InterCarsProvider(), new AdBalticProvider()];

export function selectBestSupplier(offers = []) {
  return offers
    .filter((offer) => offer.stock > 0)
    .sort((left, right) => left.costPrice - right.costPrice || left.deliveryDays - right.deliveryDays)[0] || null;
}

export function toCustomerProduct(product) {
  const selectedOffer = selectBestSupplier(product.supplierOffers);
  const { supplierOffers, ...publicProduct } = product;
  return {
    ...publicProduct,
    price: selectedOffer ? calculateRetailPrice(selectedOffer.costPrice) : null,
    stock: selectedOffer?.stock > 0 ? "Sandėlyje" : "Nėra sandėlyje",
    delivery: selectedOffer ? `${selectedOffer.deliveryDays} d. d.` : "Pagal užsakymą"
  };
}

export function getCustomerCatalog() {
  return autopartsProducts.map(toCustomerProduct);
}

export function getCustomerProductBySlug(slug) {
  const product = autopartsProducts.find((item) => item.slug === slug);
  return product ? toCustomerProduct(product) : null;
}
