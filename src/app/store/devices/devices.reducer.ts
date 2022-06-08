import { createFeature, createReducer, on } from '@ngrx/store';
import * as fromActions from './devices.actions';
import { IDevice } from '../../shared/models/device.model';
import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { LoadingState } from 'src/app/shared/models/loading-state.model';

export const adapter = createEntityAdapter<IDevice>({
  selectId: (device) => device.serialNumber,
});

export interface DevicesState extends EntityState<IDevice>, LoadingState {}

export const initialState: DevicesState = adapter.getInitialState({
  ...LoadingState.initial(),
});

export const devicesFeature = createFeature({
  name: 'devices',
  reducer: createReducer(
    initialState,
    on(fromActions.findDevices, (state) => ({
      ...state,
      ...LoadingState.loading(),
    })),
    on(fromActions.findDevicesSuccess, (state, { devices }) => ({
      ...adapter.setAll(devices, state),
      ...LoadingState.loaded(),
    })),
    on(fromActions.findDevicesFailed, (state, { error }) => ({
      ...state,
      ...LoadingState.failed(error),
    }))
  ),
});

const { selectAll } = adapter.getSelectors();

export const selectAllDevices = selectAll;
