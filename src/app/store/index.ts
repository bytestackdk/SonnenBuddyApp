import * as fromDevicesReducer from './devices/devices.reducer';
import { devicesFeature } from './devices/devices.reducer';
import { ActionReducerMap, MetaReducer } from '@ngrx/store';
import * as fromStatusReducer from './status/status.reducer';
import { statusFeature } from './status/status.reducer';
import { devicesSyncReducer } from './devices/devices-sync.reducer';

export interface RootState {
  [devicesFeature.name]: fromDevicesReducer.DevicesState;
  [statusFeature.name]: fromStatusReducer.StatusState;
}

export const reducers: ActionReducerMap<RootState> = {
  [devicesFeature.name]: devicesFeature.reducer,
  [statusFeature.name]: statusFeature.reducer,
};

export const metaReducers: Array<MetaReducer<RootState>> = [devicesSyncReducer];
