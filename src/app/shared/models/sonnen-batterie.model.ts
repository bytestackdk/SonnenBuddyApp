import { IDevice } from '../../api/models/network.model';
import { ISchedule, OperatingMode } from '../../api/models/battery.model';

export type ApiToken = string;

export interface ISonnenBatterie extends IDevice, IDeviceConfiguration {}

export interface IDeviceConfiguration {
  /**
   * The token used for more advanced API operations (Manual input)
   */
  apiToken?: ApiToken;
  /**
   * Capacity of attached solar panels in Watts (Manual input)
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
  /**
   * The operating mode of the system (from API)
   */
  operatingMode?: OperatingMode;
  /**
   * Charging schedules setup on the battery
   */
  schedules?: ISchedule[];
  /**
   * Whether prognosis charging is enabled (from API)
   */
  prognosisCharging?: boolean;
}
