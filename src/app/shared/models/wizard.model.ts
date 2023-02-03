export type ApiToken = string;

export interface WizardOutput {
  apiToken: ApiToken;
  /**
   * Max power output of system in Watts (from API)
   */
  maxPower: number;
  /**
   * Number of batteries installed in system (from API)
   */
  batteryQuantity?: number;
  /**
   * Capacity of a single battery module in the system (from API)
   */
  batteryModuleCapacity?: number;
  /**
   * Max power output of solar installation in Watts
   */
  solarMaxPower?: number;
}
