export type IP = string;

export interface INetworkDevice {
  lanip: IP;
  ca20: boolean;
  info: 'sonnenBatterie' | undefined;
  device: number;
}
