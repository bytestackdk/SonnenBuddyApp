import { devicesFeature, selectAllDevices } from './devices.reducer';
import { createSelector } from '@ngrx/store';
import { IActiveDevice } from '../../shared/models/device-details.model';

export const { selectDevicesState, selectLoading, selectLoaded, selectFailed, selectError } = devicesFeature;

export const selectDevicesLoading = selectLoading;
export const selectDevicesFailed = selectFailed;
export const selectDevices = createSelector(selectDevicesState, (state) => selectAllDevices(state));
export const selectDevicesError = selectError;

export const selectActiveDeviceSerialNumber = createSelector(
  selectDevicesState,
  (state) => state.activeDeviceSerialNumber
);
export const selectActiveDevice = createSelector(
  selectDevicesState,
  (state): IActiveDevice => ({
    ...state.entities[state.activeDeviceSerialNumber],
    ...state.details[state.activeDeviceSerialNumber],
  })
);

export const selectActiveDeviceTokenAndIP = createSelector(selectActiveDevice, (device) => {
  const { apiToken, lanIp } = device;
  return { apiToken, lanIp };
});

export const selectActiveDevicePanelCapacity = createSelector(selectActiveDevice, (device) => device.panelCapacity);
export const selectActiveDeviceInverterMaxPower = createSelector(selectActiveDevice, (device) => device.maxPower);
export const selectActiveDeviceBatteryMaxPower = createSelector(selectActiveDevice, (device) =>
  // https://www.myenergy.dk/wp-content/uploads/2021/01/Sonnen-Hybrid-9.53.pdf
  device.batteryQuantity === 1 ? 2500 : 3300
);
export const selectActiveDeviceBatteryCapacity = createSelector(
  selectActiveDevice,
  (device) => device.batteryQuantity * device.batteryModuleCapacity
);
