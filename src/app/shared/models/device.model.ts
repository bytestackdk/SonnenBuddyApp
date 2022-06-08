import { IP } from '../../api/models/network.model';

export interface IDevice {
  lanIp: IP;
  ca20: boolean;
  info: string;
  serialNumber: number;
  apiToken?: string;
}
