import { OperatingMode } from '../../api/models/battery.model';
import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { Store } from '@ngrx/store';
import { SonnenBatterieSelectors } from 'src/app/store/sonnen-batterie';
import { InputSelectors } from 'src/app/store/input';

export interface ISettingsState {
  operatingMode: OperatingMode;
  showOperatingModeModal: boolean;
  loading: boolean;
  error: unknown;
}

export const initialState: ISettingsState = {
  operatingMode: null,
  showOperatingModeModal: false,
  loading: false,
  error: null,
};

@Injectable()
export class SettingsPageStore extends ComponentStore<ISettingsState> {
  readonly showOperatingMode$ = this.select((state) => state.showOperatingModeModal);

  readonly operatingMode$ = this.store.select(SonnenBatterieSelectors.selectSonnenBatterieOperatingMode);
  readonly darkMode$ = this.store.select(InputSelectors.selectDarkMode);
  readonly prognosisCharging$ = this.store.select(SonnenBatterieSelectors.selectSonnenBatteriePrognosisCharging);
  readonly device$ = this.store.select(SonnenBatterieSelectors.selectDevice);

  constructor(private readonly store: Store) {
    super({ ...initialState });
  }

  toggleOperatingModeModal(showOperatingModeModal: boolean) {
    this.patchState(() => ({ showOperatingModeModal }));
  }
}
