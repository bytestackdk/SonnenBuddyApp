export type DateString = string;

export interface IBatteryStatus {
  /**
   * VA, volt-ampere	All AC output of apparent power in VA
   */
  Apparent_output: number;
  /**
   * %, percentage	Backup-buffer in percentage that is set on the system
   */
  BackupBuffer: string;
  /**
   * Boolean that indicates the charge status. True if charging
   */
  BatteryCharging: boolean;
  /**
   * Boolean that indicates the discharge status. True if discharging
   */
  BatteryDischarging: boolean;
  /**
   * W, watt	House consumption in watts, average over the last 60s
   */
  Consumption_Avg: number;
  /**
   * W, watt	House consumption in watts, direct measurement
   */
  Consumption_W: number;
  /**
   * Hz, hertz	AC frequency in hertz
   */
  Fac: number;
  /**
   * Boolean that indicates the energy flow at the installation site. True if battery feeds the consumption
   */
  FlowConsumptionBattery: boolean;
  /**
   * Boolean that indicates the energy flow at the installation site. True if grid feeds the consumption
   */
  FlowConsumptionGrid: boolean;
  /**
   * Boolean that indicates the energy flow at the installation site. True if production feeds the consumption
   */
  FlowConsumptionProduction: boolean;
  /**
   * Boolean that indicates the energy flow at the installation site. True if battery is charging from grid
   */
  FlowGridBattery: boolean;
  /**
   * Boolean that indicates the energy flow at the installation site. True if production is charging the battery
   */
  FlowProductionBattery: boolean;
  /**
   * Boolean that indicates the energy flow at the installation site. True if production feeds into the grid
   */
  FlowProductionGrid: boolean;
  /**
   * W, watt	Grid Feed in negative is consumption and positive is feed in
   */
  GridFeedIn_W: number;
  /**
   * 	System is installed or not
   */
  IsSystemInstalled: number;
  /**
   * Operating mode that is set on the system:
   * 1: Manual charging or discharging via API
   * 2: Automatic Self Consumption. Default
   */
  OperatingMode: string;
  /**
   * W, watt	AC Power greater than ZERO is discharging Inverter AC Power less than ZERO is charging
   */
  Pac_total_W: number;
  /**
   * 	W, watt	PV production in watts
   */
  Production_W: number;
  /**
   * %, percentage	Relative state of charge
   */
  RSOC: number;
  /**
   * Wh	Remaining capacity based on RSOC
   */
  RemainingCapacity_Wh: number;
  /**
   * VA, volt-ampere	Output of apparent power in VA on Phase 1
   */
  Sac1: number;
  /**
   * VA, volt-ampere	Output of apparent power in VA on Phase 2
   */
  Sac2?: number;
  /**
   * VA, volt-ampere	Output of apparent power in VA on Phase 3
   */
  Sac3?: number;
  /**
   * String that indicates if the system is connected to the grid (“OnGrid”) or disconnected (“OffGrid”)
   */
  SystemStatus: 'OnGrid' | 'OffGrid';
  /**
   * Local system time
   */
  Timestamp: DateString;
  /**
   * %, percentage	User state of charge
   */
  USOC: number;
  /**
   * V, volt	AC voltage in volts
   */
  Uac: number;
  /**
   * V, volt	Battery voltage in volts
   */
  Ubat: number;
  /**
   * Boolean that indicates the discharge status. True if no discharge allowed, based on status maintenance
   */
  dischargeNotAllowed: boolean;
  /**
   * 	Boolean that indicates the autostart setting of the generator.
   */
  generator_autostart: boolean;
}

export interface ILatestData {
  Consumption_W: number;
  // TODO
}

export interface IPowerMeter {
  a_l1: number;
  a_l2: number;
  a_l3: number;
  channel: number;
  deviceid: number;
  direction: 'production' | 'consumption';
  error: number;
  kwh_exported: number;
  kwh_imported: number;
  v_l1_l2: number;
  v_l1_n: number;
  v_l2_l3: number;
  v_l2_n: number;
  v_l3_l1: number;
  v_l3_n: number;
  va_total: number;
  var_total: number;
  w_l1: number;
  w_l2: number;
  w_l3: number;
  w_total: number;
}

export class IC_InverterMaxPower_w {
  static key = 'IC_InverterMaxPower_w';
  IC_InverterMaxPower_w: string;
}

export class IC_BatteryModules {
  static key = 'IC_BatteryModules';
  IC_BatteryModules: string;
}

export class CM_MarketingModuleCapacity {
  static key = 'CM_MarketingModuleCapacity';
  CM_MarketingModuleCapacity: string;
}
