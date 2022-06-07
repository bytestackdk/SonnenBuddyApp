export type IP = string;

export interface IDiscoverResponse {
  lanip: IP;
  ca20: boolean;
  info: string;
  device: number;
}
