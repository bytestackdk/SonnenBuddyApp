import { createSelector } from '@ngrx/store';
import { statusFeature } from './status.reducer';
import * as fromDevices from '../devices/devices.selectors';
import { selectCurrentDeviceInverterMaxPower } from '../devices/devices.selectors';

export const selectStatus = createSelector(statusFeature.selectStatusState, (state) => state.entity);
export const selectStatusError = createSelector(statusFeature.selectStatusState, (state) => state.error);

export const selectSolarProduction = createSelector(selectStatus, (entity) => entity?.Production_W || 0);
export const selectSolarUtilization = createSelector(
  fromDevices.selectCurrentDevicePanelCapacity,
  selectSolarProduction,
  (capacity, production) => (production / capacity) * 100
);

export const selectSolarToBattery = createSelector(selectStatus, (entity) => entity?.FlowProductionBattery);
export const selectSolarToInverter = createSelector(selectStatus, (entity) => entity?.FlowConsumptionProduction);

export const selectBatteryUsage = createSelector(selectStatus, (entity) => entity?.Pac_total_W);
export const selectBatteryUtilization = createSelector(
  fromDevices.selectCurrentDeviceBatteryMaxPower,
  selectBatteryUsage,
  (capacity, current) => (!!current ? Math.abs((current / capacity) * 100) : 0)
);
export const selectBatteryCharge = createSelector(selectStatus, (entity) => entity?.RSOC || 0);
export const selectBatteryRemaining = createSelector(selectStatus, (entity) => entity?.RemainingCapacity_Wh);
export const selectBatteryToInverter = createSelector(selectStatus, (entity) => entity?.FlowConsumptionBattery);

export const selectHouseConsumption = createSelector(selectStatus, (entity) => entity?.Consumption_W);

export const selectInverterCurrentPower = createSelector(selectStatus, (entity) => {
  if (!entity) return null;

  const { Sac1, Sac2, Sac3 } = entity;

  return Sac1 + Sac2 + Sac3;
});

export const selectInverterUtilization = createSelector(
  selectCurrentDeviceInverterMaxPower,
  selectInverterCurrentPower,
  (capacity, current) => (current / capacity) * 100
);
export const selectInverterToBattery = createSelector(selectStatus, (entity) => entity?.FlowGridBattery);
export const selectInverterToHouse = createSelector(
  selectStatus,
  (entity) => entity?.FlowConsumptionBattery || entity?.FlowConsumptionProduction
);
export const selectInverterToGrid = createSelector(selectStatus, (entity) => entity?.FlowProductionGrid);

export const selectGridFeedIn = createSelector(selectStatus, (entity) => entity?.GridFeedIn_W);
export const selectGridToHouse = createSelector(selectStatus, (entity) => entity?.FlowConsumptionGrid);
