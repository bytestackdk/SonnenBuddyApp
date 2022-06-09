import * as fromDevicesReducer from './devices/devices.reducer';
import { devicesFeature } from './devices/devices.reducer';
import { ActionReducerMap, MetaReducer } from '@ngrx/store';
import * as fromStatusReducer from './status/status.reducer';
import * as fromLatestDataReducer from './latest-data/latest-data.reducer';
import * as fromPowerMeterReducer from './power-meter/power-meter.reducer';
import { statusFeature } from './status/status.reducer';
import { devicesSyncReducer } from './devices/devices-sync.reducer';
import { latestDataFeature } from './latest-data/latest-data.reducer';
import { powerMeterFeature } from './power-meter/power-meter.reducer';

export interface RootState {
  [devicesFeature.name]: fromDevicesReducer.DevicesState;
  [latestDataFeature.name]: fromLatestDataReducer.LatestDataState;
  [powerMeterFeature.name]: fromPowerMeterReducer.PowerMeterState;
  [statusFeature.name]: fromStatusReducer.StatusState;
}

export const reducers: ActionReducerMap<RootState> = {
  [devicesFeature.name]: devicesFeature.reducer,
  [latestDataFeature.name]: latestDataFeature.reducer,
  [powerMeterFeature.name]: powerMeterFeature.reducer,
  [statusFeature.name]: statusFeature.reducer,
};

export const metaReducers: Array<MetaReducer<RootState>> = [devicesSyncReducer];
