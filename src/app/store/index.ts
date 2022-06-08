import { devicesFeature } from './devices/devices.reducer';
import { ActionReducerMap, MetaReducer } from '@ngrx/store';
import * as fromDevicesReducer from './devices/devices.reducer';
import { devicesSyncReducer } from './devices/devices-sync.reducer';

export interface RootState {
  [devicesFeature.name]: fromDevicesReducer.DevicesState;
}

export const reducers: ActionReducerMap<RootState> = {
  [devicesFeature.name]: devicesFeature.reducer,
};

export const metaReducers: Array<MetaReducer<RootState>> = [devicesSyncReducer];
