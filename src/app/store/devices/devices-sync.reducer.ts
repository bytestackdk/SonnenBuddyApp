import { ActionReducer } from '@ngrx/store';
import { RootState } from '../index';
import { storageSync } from '@larscom/ngrx-store-storagesync';
import { devicesFeature } from './devices.reducer';

export function devicesSyncReducer(reducer: ActionReducer<RootState>) {
  const sync = storageSync<RootState>({
    features: [{ stateKey: devicesFeature.name, storageForFeature: window.localStorage }],
    storage: window.localStorage,
  });

  return sync(reducer);
}
