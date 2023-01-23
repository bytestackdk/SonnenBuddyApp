import { ActionReducer } from '@ngrx/store';
import { RootState } from '../index';
import { storageSync } from '@larscom/ngrx-store-storagesync';
import { preferencesFeature } from './preferences.reducer';

export const preferencesSyncReducer = (reducer: ActionReducer<RootState>) => {
  const sync = storageSync<RootState>({
    features: [{ stateKey: preferencesFeature.name, storageForFeature: window.localStorage }],
    storage: window.localStorage,
  });

  return sync(reducer);
};
