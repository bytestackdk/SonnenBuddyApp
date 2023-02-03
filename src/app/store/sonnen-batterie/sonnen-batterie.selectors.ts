import { sonnenBatterieFeature } from './sonnen-batterie.reducer';
import { createSelector } from '@ngrx/store';
import { SonnenBatterie } from '../../shared/models/sonnen-batterie.model';
import { OperatingMode } from '../../api/models/battery.model';
import { InputSelectors } from '../input';

// https://www.myenergy.dk/wp-content/uploads/2021/06/Operating-instructions-sonnenBatterie-hybrid-9.53_22358_UK507EN.pdf
export const capacityReservedPerBatteryModule = 250;

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
export const selectSonnenBatterieBatteryMaxPower = createSelector(selectSonnenBatterie, ({ batteryQuantity }) => {
  // https://www.myenergy.dk/wp-content/uploads/2021/06/Operating-instructions-sonnenBatterie-hybrid-9.53_22358_UK507EN.pdf
  if (batteryQuantity === 1) {
    return 1100;
  } else if (batteryQuantity === 2) {
    return 2500;
  }
  return 3300;
});

export const selectSonnenBatterieBatteryCapacity = createSelector(
  selectSonnenBatterie,
  ({ batteryQuantity, batteryModuleCapacity }) =>
    // Max. capacity   2.5 kWh  5.0 kWh  7.5 kWh  10.0 kWh  12.5 kWh  15.0 kWh
    // Usable capacity 2.25 kWh 4.5 kWh  6.75 kWh  9.0 kWh  11.25 kWh 13.5 kWh
    // -> For every module there's 250Wh that's not usable
    batteryQuantity * (batteryModuleCapacity - capacityReservedPerBatteryModule)
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
