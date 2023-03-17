import { OperatingMode } from '../../api/models/battery.model';
import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { Store } from '@ngrx/store';
import { SonnenBatterieSelectors } from 'src/app/store/sonnen-batterie';
import { InputSelectors } from 'src/app/store/input';

export interface ISettingsState {
  operatingMode: OperatingMode;
  showOperatingModeModal: boolean;
  // showPowerModal: boolean;
  loading: boolean;
  error: unknown;
}

export const initialState: ISettingsState = {
  operatingMode: null,
  showOperatingModeModal: false,
  // showPowerModal: false,
  loading: false,
  error: null,
};

@Injectable()
export class SettingsPageStore extends ComponentStore<ISettingsState> {
  readonly showOperatingModeModal$ = this.select((state) => state.showOperatingModeModal);
  // readonly showPowerModal$ = this.select((state) => state.showPowerModal);

  readonly operatingMode$ = this.store.select(SonnenBatterieSelectors.selectSonnenBatterieOperatingMode);
  readonly darkMode$ = this.store.select(InputSelectors.selectDarkMode);
  readonly prognosisCharging$ = this.store.select(SonnenBatterieSelectors.selectSonnenBatteriePrognosisCharging);
  readonly device$ = this.store.select(SonnenBatterieSelectors.selectDevice);
  readonly inverterMaxPower$ = this.store.select(SonnenBatterieSelectors.selectSonnenBatterieInverterMaxPower);
  readonly batteryCapacity$ = this.store.select(SonnenBatterieSelectors.selectSonnenBatterieBatteryCapacity);
  readonly batteryMaxPower$ = this.store.select(SonnenBatterieSelectors.selectSonnenBatterieBatteryMaxPower);
  readonly solarMaxPower$ = this.store.select(InputSelectors.selectSolarMaxPower);

  constructor(private readonly store: Store) {
    super({ ...initialState });
  }

  toggleOperatingModeModal(showOperatingModeModal: boolean) {
    this.patchState(() => ({ showOperatingModeModal }));
  }

  // togglePowerModal(showPowerModal: boolean) {
  //   this.patchState(() => ({ showPowerModal }));
  // }
}
