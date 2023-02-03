import { ActionReducer } from '@ngrx/store';
import { RootState } from '../index';
import { storageSync } from '@larscom/ngrx-store-storagesync';
import { inputFeature } from './input.reducer';

export const inputSyncReducer = (reducer: ActionReducer<RootState>) => {
  const sync = storageSync<RootState>({
    features: [{ stateKey: inputFeature.name, storageForFeature: window.localStorage }],
    storage: window.localStorage,
  });

  return sync(reducer);
};
