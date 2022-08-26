import { IDevice } from '../../api/models/network.model';

export type ApiToken = string;

export interface IActiveDevice extends IDevice, IDeviceDetails {}

export interface IDeviceDetails {
  /**
   * The token used for more advanced API operations (Needs to be manually input)
   */
  apiToken?: ApiToken;
  /**
   * Capacity of attached solar panels in Watts (Needs to be manually input)
   */
  panelCapacity?: number;
  /**
   * Max power output of system in Watts (from API)
   */
  maxPower?: number;
  /**
   * Number of batteries installed in system (from API)
   */
  batteryQuantity?: number;
  /**
   * Capacity of a single battery module in the system (from API)
   */
  batteryModuleCapacity?: number;
}
