import { MockAdBalticProvider } from "../providers/suppliers/MockAdBalticProvider.js";
import { MockInterCarsProvider } from "../providers/suppliers/MockInterCarsProvider.js";

const providers = [new MockInterCarsProvider(), new MockAdBalticProvider()];
export function selectBestSupplier(offers = []) { return offers.filter((offer) => offer.stock > 0).sort((a, b) => a.costPrice - b.costPrice || a.deliveryDays - b.deliveryDays)[0] || null; }
export async function getOffers(product) { return (await Promise.all(providers.map((provider) => provider.getProduct(product)))).filter(Boolean); }
export async function getBestOffer(product) { return selectBestSupplier(await getOffers(product)); }
