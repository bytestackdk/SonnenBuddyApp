import { devicesFeature, selectAllDevices } from './devices.reducer';
import { createSelector } from '@ngrx/store';

export const { selectDevicesState, selectLoading, selectFailed } =
  devicesFeature;

export const selectDevicesLoading = selectLoading;
export const selectDevicesFailed = selectFailed;
export const selectDevices = createSelector(selectDevicesState, (state) =>
  selectAllDevices(state)
);
