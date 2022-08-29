import * as fromSonnenBatterieReducer from './sonnen-batterie/sonnen-batterie.reducer';
import { sonnenBatterieFeature } from './sonnen-batterie/sonnen-batterie.reducer';
import { ActionReducerMap, MetaReducer } from '@ngrx/store';
import * as fromStatusReducer from './status/status.reducer';
import * as fromLatestDataReducer from './latest-data/latest-data.reducer';
import * as fromPowerMeterReducer from './power-meter/power-meter.reducer';
import { statusFeature } from './status/status.reducer';
import { sonnenBatterieSyncReducer } from './sonnen-batterie/sonnen-batterie-sync.reducer';
import { latestDataFeature } from './latest-data/latest-data.reducer';
import { powerMeterFeature } from './power-meter/power-meter.reducer';

export interface RootState {
  [sonnenBatterieFeature.name]: fromSonnenBatterieReducer.SonnenBatterieState;
  [latestDataFeature.name]: fromLatestDataReducer.LatestDataState;
  [powerMeterFeature.name]: fromPowerMeterReducer.PowerMeterState;
  [statusFeature.name]: fromStatusReducer.StatusState;
}

export const reducers: ActionReducerMap<RootState> = {
  [sonnenBatterieFeature.name]: sonnenBatterieFeature.reducer,
  [latestDataFeature.name]: latestDataFeature.reducer,
  [powerMeterFeature.name]: powerMeterFeature.reducer,
  [statusFeature.name]: statusFeature.reducer,
};

export const metaReducers: Array<MetaReducer<RootState>> = [sonnenBatterieSyncReducer];
