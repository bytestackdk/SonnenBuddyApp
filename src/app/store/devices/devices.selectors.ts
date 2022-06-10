import { devicesFeature, selectAllDevices } from './devices.reducer';
import { createSelector } from '@ngrx/store';

export const { selectDevicesState, selectLoading, selectFailed, selectError } =
  devicesFeature;

export const selectDevicesLoading = selectLoading;
export const selectDevicesFailed = selectFailed;
export const selectDevices = createSelector(selectDevicesState, (state) =>
  selectAllDevices(state)
);
export const selectDevicesError = selectError;

export const selectCurrentDevice = createSelector(
  selectDevicesState,
  (state) => state.entities[state.activeDevice]
);

export const selectCurrentDeviceIp = createSelector(
  selectCurrentDevice,
  (device) => device?.lanIp
);

export const selectCurrentDeviceApiToken = createSelector(
  selectCurrentDevice,
  (device) => device.apiToken
);
