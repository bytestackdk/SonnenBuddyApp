import { createSelector } from '@ngrx/store';
import { statusFeature } from './status.reducer';
import * as fromSonnenBatterie from '../sonnen-batterie/sonnen-batterie.selectors';
import { capacityReservedPerBatteryModule } from '../sonnen-batterie/sonnen-batterie.selectors';
import * as timeFunctions from '../../shared/functions/timespan';
import { SonnenBatterieSelectors } from '../sonnen-batterie';
import { InputSelectors } from '../input';
import { getTimespan } from '../../shared/functions/timespan';

export const selectStatus = createSelector(statusFeature.selectStatusState, (state) => state.entity);
export const selectStatusError = createSelector(statusFeature.selectStatusState, (state) => state.error);

export const selectSolarProduction = createSelector(selectStatus, (entity) => entity?.Production_W || 0);
export const selectSolarUtilization = createSelector(
  InputSelectors.selectSolarMaxPower,
  selectSolarProduction,
  (maxPower, currentPower) => {
    const utilization = Math.ceil((currentPower / maxPower) * 100);
    return utilization > 100 ? 100 : utilization;
  }
);

export const selectSolarToBattery = createSelector(selectStatus, (entity) => entity?.FlowProductionBattery);
export const selectSolarToInverter = createSelector(
  selectStatus,
  (entity) => entity?.FlowConsumptionProduction && entity?.Production_W >= 50
);
export const selectBatteryCharging = createSelector(selectStatus, (entity) => entity?.BatteryCharging);
export const selectBatteryDischarging = createSelector(selectStatus, (entity) => entity?.BatteryDischarging);
export const selectBatteryUsage = createSelector(selectStatus, (entity) =>
  Math.abs(entity?.Pac_total_W || 0) >= 50 ? entity.Pac_total_W : 0
);
export const selectBatteryUtilization = createSelector(
  fromSonnenBatterie.selectSonnenBatterieBatteryMaxPower,
  selectBatteryUsage,
  (maxPower, currentPower = 0) => {
    if (currentPower < 0) {
      return 0;
    }
    const utilization = Math.ceil((currentPower / maxPower) * 100);
    return utilization > 100 ? 100 : utilization;
  }
);
export const selectBatteryChargePercent = createSelector(selectStatus, (entity) => entity?.USOC || 0);
export const selectBatteryRemaining = createSelector(
  selectStatus,
  SonnenBatterieSelectors.selectSonnenBatterieConfiguration,
  (entity, configuration) =>
    // Remaining capacity minus reserved capacity
    // TODO: Is entity?.RemainingCapacity_Wh 0 or reserve when RSOC is 0%?
    entity?.RemainingCapacity_Wh - configuration?.batteryQuantity * capacityReservedPerBatteryModule || 0
);
export const selectBatteryChargingTime = createSelector(
  selectBatteryCharging,
  SonnenBatterieSelectors.selectSonnenBatterieBatteryUsableCapacity,
  selectBatteryRemaining,
  selectBatteryUsage,
  (charging, usableCapacity, batteryRemaining, currentUsage) => {
    if (!charging) return 0;

    const now = new Date();
    const chargeTimeInSeconds = Math.floor(((usableCapacity - batteryRemaining) / currentUsage) * 3600);
    const fullTime = new Date(now.getTime() + chargeTimeInSeconds * 1000);
    const timespan = timeFunctions.getTimespan(now, fullTime);

    return timeFunctions.timeSpanToLabel(timespan);
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

    return timeFunctions.timeSpanToLabel(timespan);
  }
);

export const selectBatteryToInverter = createSelector(selectStatus, (entity) => entity?.FlowConsumptionBattery);
export const selectHouseConsumption = createSelector(selectStatus, (entity) => entity?.Consumption_W);
export const selectInverterToHome = createSelector(
  selectStatus,
  (entity) => entity?.FlowConsumptionBattery || entity?.FlowConsumptionProduction
);
export const selectGridFeedIn = createSelector(selectStatus, (entity) => entity?.GridFeedIn_W);
export const selectInverterToGrid = createSelector(selectStatus, (entity) => entity?.FlowProductionGrid);
export const selectInverterCurrentPower = createSelector(
  selectStatus,
  selectInverterToHome,
  selectInverterToGrid,
  selectBatteryUsage,
  (entity, inverterToHome, inverterToGrid, batteryUsage) => {
    if (!entity) return null;

    const { Apparent_output } = entity;

    return inverterToHome || inverterToGrid || batteryUsage < 0 ? Apparent_output : 0;
  }
);
export const selectInverterUtilization = createSelector(
  SonnenBatterieSelectors.selectSonnenBatterieInverterMaxPower,
  selectInverterCurrentPower,
  (maxPower, currentPower) => {
    const utilization = Math.ceil((currentPower / maxPower) * 100);
    return utilization > 100 ? 100 : utilization;
  }
);
export const selectInverterToBattery = createSelector(
  selectStatus,
  // Sometimes grid flows to battery even though we're exporting power
  (entity) => entity?.FlowGridBattery && entity?.GridFeedIn_W <= -50
);
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
export const selectDelayInSeconds = createSelector(statusFeature.selectStatusState, ({ updated, now }) => {
  if (updated && now) {
    const { second, minute, hour, day, week, month, year } = getTimespan(updated, now);
    const moreThanOneMinute = minute + hour + day + week + month + year > 0;
    return moreThanOneMinute ? 61 : second;
  }
  return 0;
});
export const selectDelayed = createSelector(selectDelayInSeconds, (delayInSeconds) => delayInSeconds > 5);
