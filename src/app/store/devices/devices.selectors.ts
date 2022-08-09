import { devicesFeature, selectAllDevices } from './devices.reducer';
import { createSelector } from '@ngrx/store';

export const { selectDevicesState, selectLoading, selectFailed, selectError } = devicesFeature;

export const selectDevicesLoading = selectLoading;
export const selectDevicesFailed = selectFailed;
export const selectDevices = createSelector(selectDevicesState, (state) => selectAllDevices(state));
export const selectDevicesError = selectError;

export const selectCurrentDevice = createSelector(selectDevicesState, (state) => state.entities[state.activeDevice]);

export const selectCurrentDeviceIp = createSelector(selectCurrentDevice, (device) => device?.lanIp);
export const selectCurrentDeviceApiToken = createSelector(selectCurrentDevice, (device) => device.apiToken);
export const selectCurrentDevicePanelCapacity = createSelector(selectCurrentDevice, (device) => device.panelCapacity);
export const selectCurrentDeviceInverterMaxPower = createSelector(selectCurrentDevice, (device) => device.maxPower);
// https://www.myenergy.dk/wp-content/uploads/2021/01/Sonnen-Hybrid-9.53.pdf
export const selectCurrentDeviceBatteryMaxPower = createSelector(selectCurrentDevice, (device) =>
  device.batteryQuantity === 1 ? 2500 : 3300
);
export const selectCurrentDeviceBatteryCapacity = createSelector(
  selectCurrentDevice,
  (device) => device.batteryQuantity * device.batteryModuleCapacity
);
