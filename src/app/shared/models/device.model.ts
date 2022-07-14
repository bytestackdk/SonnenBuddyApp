import { IP } from '../../api/models/network.model';

export type SerialNumber = number;

export interface IDevice {
  lanIp: IP;
  ca20: boolean;
  info: string;
  serialNumber: SerialNumber;
  apiToken?: string;
  /**
   * Capacity of attached solar panels in Watts
   */
  panelCapacity?: number;
  /**
   * Max power output of system in Watts
   */
  maxPower?: number;
  /**
   * Number of batteries installed in system
   */
  batteryQuantity?: number;
}
