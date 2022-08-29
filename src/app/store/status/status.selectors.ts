import { createSelector } from '@ngrx/store';
import { statusFeature } from './status.reducer';
import * as fromSonnenBatterie from '../sonnen-batterie/sonnen-batterie.selectors';
import {
  selectSonnenBatterieBatteryCapacity,
  selectSonnenBatterieInverterMaxPower,
} from '../sonnen-batterie/sonnen-batterie.selectors';
import * as timeFunctions from '../../shared/functions/timespan';

export const selectStatus = createSelector(statusFeature.selectStatusState, (state) => state.entity);
export const selectStatusError = createSelector(statusFeature.selectStatusState, (state) => state.error);

export const selectSolarProduction = createSelector(selectStatus, (entity) => entity?.Production_W || 0);
export const selectSolarUtilization = createSelector(
  fromSonnenBatterie.selectSonnenBatteriePanelCapacity,
  selectSolarProduction,
  (capacity, production) => (production / capacity) * 100
);

export const selectSolarToBattery = createSelector(selectStatus, (entity) => entity?.FlowProductionBattery);
export const selectSolarToInverter = createSelector(selectStatus, (entity) => entity?.FlowConsumptionProduction);

export const selectBatteryCharging = createSelector(selectStatus, (entity) => entity?.BatteryCharging);
export const selectBatteryDischarging = createSelector(selectStatus, (entity) => entity?.BatteryDischarging);
export const selectBatteryUsage = createSelector(selectStatus, (entity) => entity?.Pac_total_W);
export const selectBatteryUtilization = createSelector(
  fromSonnenBatterie.selectSonnenBatterieBatteryMaxPower,
  selectBatteryUsage,
  (capacity, current) => (!!current ? Math.abs((current / capacity) * 100) : 0)
);
export const selectBatteryChargePercent = createSelector(selectStatus, (entity) => entity?.RSOC || 0);
export const selectBatteryRemaining = createSelector(selectStatus, (entity) => entity?.RemainingCapacity_Wh);
export const selectBatteryChargingTime = createSelector(
  selectBatteryCharging,
  fromSonnenBatterie.selectSonnenBatterieBatteryCapacity,
  selectBatteryRemaining,
  selectBatteryUsage,
  (charging, capacity, batteryRemaining, currentUsage) => {
    if (!charging) return 0;

    const now = new Date();
    const chargeTimeInSeconds = Math.floor(((capacity - batteryRemaining) / currentUsage) * 3600);
    const fullTime = new Date(now.getTime() + chargeTimeInSeconds * 1000);
    const timespan = timeFunctions.getTimespan(now, fullTime);

    return `${timespan.hour}:${timespan.minute.toString().padStart(2, '0')}`;
  }
);

export const selectBatteryDischargingTime = createSelector(
  selectBatteryDischarging,
  selectBatteryRemaining,
  selectBatteryUsage,
  (discharging, batteryRemaining, currentUsage) => {
    if (!discharging) return 0;

    const now = new Date();
    const dischargeTimeInSeconds = Math.floor((batteryRemaining / currentUsage) * 3600);
    const drainedTime = new Date(now.getTime() + dischargeTimeInSeconds * 1000);
    const timespan = timeFunctions.getTimespan(now, drainedTime);

    return `${timespan.hour}:${timespan.minute.toString().padStart(2, '0')}`;
  }
);

export const selectBatteryToInverter = createSelector(selectStatus, (entity) => entity?.FlowConsumptionBattery);

export const selectHouseConsumption = createSelector(selectStatus, (entity) => entity?.Consumption_W);

export const selectInverterCurrentPower = createSelector(selectStatus, (entity) => {
  if (!entity) return null;

  const { Sac1, Sac2, Sac3 } = entity;

  return Sac1 + Sac2 + Sac3;
});

export const selectInverterUtilization = createSelector(
  selectSonnenBatterieInverterMaxPower,
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
