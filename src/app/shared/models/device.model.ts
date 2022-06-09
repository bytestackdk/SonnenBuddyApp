import { IP } from '../../api/models/network.model';

export type SerialNumber = number;

export interface IDevice {
  lanIp: IP;
  ca20: boolean;
  info: string;
  serialNumber: SerialNumber;
  apiToken?: string;
}
