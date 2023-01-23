import * as fromSonnenBatterieReducer from './sonnen-batterie/sonnen-batterie.reducer';
import { sonnenBatterieFeature } from './sonnen-batterie/sonnen-batterie.reducer';
import { ActionReducerMap, MetaReducer } from '@ngrx/store';
import * as fromStatusReducer from './status/status.reducer';
import * as fromLatestDataReducer from './latest-data/latest-data.reducer';
import * as fromPowerMeterReducer from './power-meter/power-meter.reducer';
import * as fromPreferencesReducer from './preferences/preferences.reducer';
import { statusFeature } from './status/status.reducer';
import { sonnenBatterieSyncReducer } from './sonnen-batterie/sonnen-batterie-sync.reducer';
import { latestDataFeature } from './latest-data/latest-data.reducer';
import { powerMeterFeature } from './power-meter/power-meter.reducer';
import { preferencesFeature } from './preferences/preferences.reducer';
import { preferencesSyncReducer } from './preferences/preferences-sync.reducer';

export interface RootState {
  [sonnenBatterieFeature.name]: fromSonnenBatterieReducer.SonnenBatterieState;
  [latestDataFeature.name]: fromLatestDataReducer.LatestDataState;
  [powerMeterFeature.name]: fromPowerMeterReducer.PowerMeterState;
  [statusFeature.name]: fromStatusReducer.StatusState;
  [preferencesFeature.name]: fromPreferencesReducer.PreferencesState;
}

export const reducers: ActionReducerMap<RootState> = {
  [sonnenBatterieFeature.name]: sonnenBatterieFeature.reducer,
  [latestDataFeature.name]: latestDataFeature.reducer,
  [powerMeterFeature.name]: powerMeterFeature.reducer,
  [statusFeature.name]: statusFeature.reducer,
  [preferencesFeature.name]: preferencesFeature.reducer,
};

export const metaReducers: Array<MetaReducer<RootState>> = [sonnenBatterieSyncReducer, preferencesSyncReducer];
