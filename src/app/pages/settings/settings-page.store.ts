import { OperatingMode } from '../../api/models/battery.model';
import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { Store } from '@ngrx/store';
import { SonnenBatterieSelectors } from 'src/app/store/sonnen-batterie';
import { PreferencesSelectors } from 'src/app/store/preferences';

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
  readonly operatingMode$ = this.store.select(SonnenBatterieSelectors.selectSonnenBatterieOperatingMode);
  readonly darkMode$ = this.store.select(PreferencesSelectors.selectDarkMode);
  readonly prognosisCharging$ = this.store.select(SonnenBatterieSelectors.selectSonnenBatteriePrognosisCharging);
  readonly showOperatingMode$ = this.select((state) => state.showOperatingModeModal);

  constructor(private readonly store: Store) {
    super({ ...initialState });
  }

  toggleOperatingModeModal(showOperatingModeModal: boolean) {
    this.patchState(() => ({ showOperatingModeModal }));
  }
}
