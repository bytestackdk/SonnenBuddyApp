export type IP = string;
export type SerialNumber = number;

/**
 * Model from the find URL provided by Sonnen
 */
export interface INetworkDevice {
  lanip: IP;
  ca20: boolean;
  info: 'sonnenBatterie' | undefined;
  device: number;
}

/**
 * Mapped model with a bit more meaningful property names
 */
export interface Device {
  lanIp: IP;
  ca20: boolean;
  info: string;
  serialNumber: SerialNumber;
}

export const mapToDevice = (networkDevice: INetworkDevice) => {
  const { lanip, ca20, info, device } = networkDevice;
  const battery: Device = {
    lanIp: lanip,
    ca20,
    info,
    serialNumber: device,
  };

  return battery;
};
