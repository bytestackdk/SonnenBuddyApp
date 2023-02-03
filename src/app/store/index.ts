import * as fromSonnenBatterieReducer from './sonnen-batterie/sonnen-batterie.reducer';
import { sonnenBatterieFeature } from './sonnen-batterie';
import { ActionReducerMap, MetaReducer } from '@ngrx/store';
import * as fromStatusReducer from './status/status.reducer';
import * as fromLatestDataReducer from './latest-data/latest-data.reducer';
import * as fromPowerMeterReducer from './power-meter/power-meter.reducer';
import * as fromInputReducer from './input/input.reducer';
import { statusFeature } from './status';
import { sonnenBatterieSyncReducer } from './sonnen-batterie/sonnen-batterie-sync.reducer';
import { latestDataFeature } from './latest-data/latest-data.reducer';
import { powerMeterFeature } from './power-meter';
import { inputFeature } from './input/input.reducer';
import { inputSyncReducer } from './input/input-sync.reducer';

export interface RootState {
  [sonnenBatterieFeature.name]: fromSonnenBatterieReducer.SonnenBatterieState;
  [latestDataFeature.name]: fromLatestDataReducer.LatestDataState;
  [powerMeterFeature.name]: fromPowerMeterReducer.PowerMeterState;
  [statusFeature.name]: fromStatusReducer.StatusState;
  [inputFeature.name]: fromInputReducer.InputState;
}

export const reducers: ActionReducerMap<RootState> = {
  [sonnenBatterieFeature.name]: sonnenBatterieFeature.reducer,
  [latestDataFeature.name]: latestDataFeature.reducer,
  [powerMeterFeature.name]: powerMeterFeature.reducer,
  [statusFeature.name]: statusFeature.reducer,
  [inputFeature.name]: inputFeature.reducer,
};

export const metaReducers: Array<MetaReducer<RootState>> = [sonnenBatterieSyncReducer, inputSyncReducer];
