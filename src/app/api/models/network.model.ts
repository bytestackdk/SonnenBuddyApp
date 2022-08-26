export type IP = string;
export type SerialNumber = number;

export interface INetworkDevice {
  lanip: IP;
  ca20: boolean;
  info: 'sonnenBatterie' | undefined;
  device: number;
}

export interface IDevice {
  lanIp: IP;
  ca20: boolean;
  info: string;
  serialNumber: SerialNumber;
}

export const mapToDevice = (networkDevice: INetworkDevice) => {
  const { ca20, info, device } = networkDevice;
  const battery: IDevice = {
    lanIp: networkDevice.lanip,
    serialNumber: device,
    ca20,
    info,
  };

  return battery;
};
