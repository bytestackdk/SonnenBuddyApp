import { ActionReducer } from '@ngrx/store';
import { RootState } from '../index';
import { storageSync } from '@larscom/ngrx-store-storagesync';
import { sonnenBatterieFeature } from './sonnen-batterie.reducer';

export function sonnenBatterieSyncReducer(reducer: ActionReducer<RootState>) {
  const sync = storageSync<RootState>({
    features: [{ stateKey: sonnenBatterieFeature.name, storageForFeature: window.localStorage }],
    storage: window.localStorage,
  });

  return sync(reducer);
}
