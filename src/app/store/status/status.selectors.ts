import { createSelector } from '@ngrx/store';
import { statusFeature } from './status.reducer';
import * as fromSonnenBatterie from '../sonnen-batterie/sonnen-batterie.selectors';
import * as timeFunctions from '../../shared/functions/timespan';
import { SonnenBatterieSelectors } from '../sonnen-batterie';
import { capacityReservedPerBatteryModule } from '../sonnen-batterie/sonnen-batterie.selectors';
import { InputSelectors } from '../input';

export const selectStatus = createSelector(statusFeature.selectStatusState, (state) => state.entity);
export const selectStatusError = createSelector(statusFeature.selectStatusState, (state) => state.error);

export const selectSolarProduction = createSelector(selectStatus, (entity) => entity?.Production_W || 0);
export const selectSolarUtilization = createSelector(
  InputSelectors.selectSolarCapacity,
  selectSolarProduction,
  (solarCapacity, production) => (production / solarCapacity) * 100
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
export const selectBatteryChargePercent = createSelector(selectStatus, (entity) => entity?.USOC || 0);
export const selectBatteryRemaining = createSelector(
  selectStatus,
  SonnenBatterieSelectors.selectSonnenBatterieConfiguration,
  (entity, configuration) =>
    entity?.RemainingCapacity_Wh - configuration?.batteryQuantity * capacityReservedPerBatteryModule || 0
);
export const selectBatteryChargingTime = createSelector(
  selectBatteryCharging,
  SonnenBatterieSelectors.selectSonnenBatterieBatteryCapacity,
  selectBatteryRemaining,
  selectBatteryUsage,
  (charging, capacity, batteryRemaining, currentUsage) => {
    if (!charging) return 0;

    const now = new Date();
    const chargeTimeInSeconds = Math.floor(((capacity - batteryRemaining) / currentUsage) * 3600);
    const fullTime = new Date(now.getTime() + chargeTimeInSeconds * 1000);
    const timespan = timeFunctions.getTimespan(now, fullTime);

    return timespan.day > 0 ? '> 1 day' : `${timespan.hour}:${timespan.minute.toString().padStart(2, '0')}`;
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

    return timespan.day > 0 ? '> 1 day' : `${timespan.hour}:${timespan.minute.toString().padStart(2, '0')}`;
  }
);

export const selectBatteryToInverter = createSelector(selectStatus, (entity) => entity?.FlowConsumptionBattery);
export const selectHouseConsumption = createSelector(selectStatus, (entity) => entity?.Consumption_W);
export const selectInverterToHome = createSelector(
  selectStatus,
  (entity) => entity?.FlowConsumptionBattery || entity?.FlowConsumptionProduction
);
export const selectGridFeedIn = createSelector(selectStatus, (entity) => entity?.GridFeedIn_W);
export const selectInverterCurrentPower = createSelector(
  selectStatus,
  selectInverterToHome,
  selectBatteryUsage,
  (entity, inverterToHome, batteryUsage) => {
    if (!entity) return null;

    const { Apparent_output } = entity;

    return inverterToHome || batteryUsage < 0 ? Apparent_output : 0;
  }
);
export const selectInverterUtilization = createSelector(
  SonnenBatterieSelectors.selectSonnenBatterieInverterMaxPower,
  selectInverterCurrentPower,
  (capacity, current) => (current / capacity) * 100
);
export const selectInverterToBattery = createSelector(
  selectStatus,
  // Sometimes grid flows to battery even though we're exporting power
  (entity) => entity?.FlowGridBattery && entity?.GridFeedIn_W <= -50
);
export const selectInverterToGrid = createSelector(selectStatus, (entity) => entity?.FlowProductionGrid);
export const selectGridToHome = createSelector(
  selectStatus,
  // We don't want to show feed in below 50W as that shows as 0.1 kW
  (entity) => entity?.FlowConsumptionGrid && entity?.GridFeedIn_W <= -50
);
export const selectBatteryAndInverter = createSelector(
  selectBatteryToInverter,
  selectInverterToBattery,
  (batteryToInverter, inverterToBattery) => ({ batteryToInverter, inverterToBattery })
);
export const selectInverterAndGrid = createSelector(
  selectInverterToGrid,
  selectInverterToBattery,
  (inverterToGrid, gridToInverter) => ({ inverterToGrid, gridToInverter })
);
export const selectTimestamp = createSelector(selectStatus, (entity) => entity?.Timestamp.split(' ')[1]);
