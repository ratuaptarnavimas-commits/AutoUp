import { MockVehicleProvider } from "./MockVehicleProvider";
import { VehicleCatalogProvider } from "./VehicleCatalogProvider";

export const vehicleCatalogProvider = new MockVehicleProvider();
export { VehicleCatalogProvider } from "./VehicleCatalogProvider";
export { MockVehicleProvider } from "./MockVehicleProvider";

// Future adapters can implement VehicleCatalogProvider without changing VehicleSelector.
export class TecDocVehicleProvider extends VehicleCatalogProvider {}
export class SupplierVehicleProvider extends VehicleCatalogProvider {}
