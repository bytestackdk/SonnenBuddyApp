import { Device } from '../../api/models/network.model';
import { ISchedule, OperatingMode } from '../../api/models/battery.model';

export interface SonnenBatterie extends Device, DeviceConfiguration {}

export interface DeviceConfiguration {
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
   * Whether prognosis charging is enabled (from API)
   */
  prognosisCharging?: boolean;
  /**
   * Charging schedules setup on the battery (from API but copy maintained in state)
   */
  schedules?: ISchedule[];
}
