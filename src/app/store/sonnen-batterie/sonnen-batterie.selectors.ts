import { sonnenBatterieFeature } from './sonnen-batterie.reducer';
import { createSelector } from '@ngrx/store';
import { ISonnenBatterie } from '../../shared/models/sonnen-batterie.model';

export const { selectSonnenBatterieState, selectLoading, selectLoaded, selectFailed, selectError } =
  sonnenBatterieFeature;

export const selectDevice = createSelector(selectSonnenBatterieState, (state) => state.device);
export const selectDeviceLoading = selectLoading;
export const selectDeviceFailed = selectFailed;
export const selectDeviceError = selectError;

export const selectSonnenBatterie = createSelector(
  selectSonnenBatterieState,
  (state): ISonnenBatterie => ({
    ...state.device,
    ...state.configuration,
  })
);

export const selectSonnenBatterieConfiguration = createSelector(
  selectSonnenBatterieState,
  (state) => state.configuration
);

export const selectSonnenBatterieTokenAndIP = createSelector(selectSonnenBatterie, (sonnenBatterie) => {
  const { apiToken, lanIp } = sonnenBatterie;
  return { apiToken, lanIp };
});

export const selectSonnenBatteriePanelCapacity = createSelector(
  selectSonnenBatterie,
  (sonnenBatterie) => sonnenBatterie.panelCapacity
);
export const selectSonnenBatterieInverterMaxPower = createSelector(
  selectSonnenBatterie,
  (sonnenBatterie) => sonnenBatterie.maxPower
);
export const selectSonnenBatterieBatteryMaxPower = createSelector(selectSonnenBatterie, (sonnenBatterie) =>
  // https://www.myenergy.dk/wp-content/uploads/2021/01/Sonnen-Hybrid-9.53.pdf
  sonnenBatterie.batteryQuantity === 1 ? 2500 : 3300
);
export const selectSonnenBatterieBatteryCapacity = createSelector(
  selectSonnenBatterie,
  (sonnenBatterie) => sonnenBatterie.batteryQuantity * sonnenBatterie.batteryModuleCapacity
);
export const selectSonnenBatterieOperatingMode = createSelector(
  selectSonnenBatterie,
  (sonnenBatterie) => sonnenBatterie.operatingMode
);

export const selectSonnenBatterieSchedules = createSelector(
  selectSonnenBatterie,
  (sonnenBatterie) => sonnenBatterie.schedules || []
);
