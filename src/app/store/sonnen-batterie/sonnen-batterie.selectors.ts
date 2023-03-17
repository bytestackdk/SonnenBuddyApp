import { sonnenBatterieFeature } from './sonnen-batterie.reducer';
import { createSelector } from '@ngrx/store';
import { SonnenBatterie } from '../../shared/models/sonnen-batterie.model';
import { OperatingMode } from '../../api/models/battery.model';
import { InputSelectors } from '../input';

export const { selectSonnenBatterieState, selectLoading, selectLoaded, selectFailed, selectError } =
  sonnenBatterieFeature;

export const selectDevice = createSelector(selectSonnenBatterieState, (state) => state.device);
export const selectDeviceLoading = selectLoading;
export const selectDeviceFailed = selectFailed;
export const selectDeviceError = selectError;

export const selectSonnenBatterie = createSelector(
  selectSonnenBatterieState,
  (state): SonnenBatterie => ({
    ...state.device,
    ...state.configuration,
  })
);

export const selectSonnenBatterieConfiguration = createSelector(
  selectSonnenBatterieState,
  (state) => state.configuration
);

export const selectSonnenBatterieTokenAndIP = createSelector(
  selectSonnenBatterie,
  InputSelectors.selectApiToken,
  ({ lanIp }, apiToken) => {
    return { lanIp, apiToken };
  }
);

export const selectSonnenBatterieInverterMaxPower = createSelector(
  selectSonnenBatterie,
  (sonnenBatterie) => sonnenBatterie.maxPower
);

export const selectSonnenBatterieBatteryCapacity = createSelector(
  selectSonnenBatterie,
  ({ batteryModuleCapacity, batteryQuantity }) => batteryModuleCapacity * batteryQuantity
);

export const selectSonnenBatterieBatteryMaxPower = createSelector(
  selectSonnenBatterie,
  InputSelectors.selectBatteryMaxPower,
  ({ batteryQuantity }, batteryMaxPower) => {
    // TODO: Consider making the sonnen product selectable and extract battery max power from specs and hardcode for each device
    // hybrid 9.53: https://www.myenergy.dk/wp-content/uploads/2021/06/Operating-instructions-sonnenBatterie-hybrid-9.53_22358_UK507EN.pdf
    // hybrid 8.1:  https://d3pcsg2wjq9izr.cloudfront.net/files/56540/download/731344/82.pdf
    // eco 8:       https://www.sonnensupportaustralia.com.au/uploads/2/9/8/5/29857561/sonnen_-_datasheet_-_australia_-_eco_8.0__3_.pdf
    // 10:          https://webatt.energy/wp-content/uploads/2020/02/Datasheet_sonnenBatterie_10.pdf
    if (batteryMaxPower > 0) {
      // Manual battery max power has been input, so we just use that - Else fallback to 9.53 hard codes
      return batteryMaxPower;
    }

    if (batteryQuantity === 1) {
      return 1100;
    } else if (batteryQuantity === 2) {
      return 2500;
    }
    return 3300;
  }
);

export const selectSonnenBatterieBatteryUsableCapacity = createSelector(
  selectSonnenBatterie,
  ({ batteryQuantity, batteryModuleCapacity }) =>
    // usableCapacity x 1.1 = totalCapacity => usableCapacity = totalCapacity / 1.1
    (batteryQuantity * batteryModuleCapacity) / 1.1
);
export const selectSonnenBatterieBatteryReservedCapacity = createSelector(
  selectSonnenBatterieBatteryCapacity,
  selectSonnenBatterieBatteryUsableCapacity,
  (totalCapacity, usableCapacity) => totalCapacity - usableCapacity
);
export const selectSonnenBatterieOperatingMode = createSelector(
  selectSonnenBatterie,
  (sonnenBatterie) => sonnenBatterie.operatingMode
);
export const selectSonnenBatteriePrognosisCharging = createSelector(
  selectSonnenBatterie,
  (sonnenBatterie) => sonnenBatterie.prognosisCharging
);
export const selectSonnenBatterieSchedules = createSelector(
  selectSonnenBatterie,
  (sonnenBatterie) => sonnenBatterie.schedules || []
);

export const selectSonnenBatterieShowSchedules = createSelector(
  selectSonnenBatterie,
  selectSonnenBatterieOperatingMode,
  (sonnenBatterie, operatingMode) => operatingMode === OperatingMode.TimeOfUse && sonnenBatterie.schedules?.length
);
