import { OperatingMode } from '../../api/models/battery.model';
import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { Store } from '@ngrx/store';
import * as fromSonnenBatterie from '../../store/sonnen-batterie';

export interface ISettingsState {
  operatingMode: OperatingMode;
  showOperatingModeModal: boolean;
  loading: boolean;
  error: any;
}

export const initialState: ISettingsState = {
  operatingMode: null,
  showOperatingModeModal: false,
  loading: false,
  error: null,
};

@Injectable()
export class SettingsPageStore extends ComponentStore<ISettingsState> {
  readonly operatingMode$ = this.store.select(fromSonnenBatterie.selectSonnenBatterieOperatingMode);
  readonly showOperatingMode$ = this.select((state) => state.showOperatingModeModal);

  constructor(private readonly store: Store) {
    super({ ...initialState });
  }

  toggleOperatingModeModal(showOperatingModeModal: boolean) {
    this.patchState((state) => ({ showOperatingModeModal }));
  }
}