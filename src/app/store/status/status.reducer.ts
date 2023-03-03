import { IBatteryStatus } from '../../api/models/battery.model';
import { LoadingState } from '../../shared/models/loading-state.model';
import { createFeature, createReducer, on } from '@ngrx/store';
import { StatusActions } from './status.actions';

export interface StatusState extends LoadingState {
  entity: IBatteryStatus;
  updated: Date;
  now: Date;
}

export const initialState: StatusState = {
  entity: null,
  updated: null,
  now: null,
  ...LoadingState.initial(),
};

export const statusFeature = createFeature({
  name: 'status',
  reducer: createReducer(
    initialState,

    on(StatusActions.refreshUpdated, (state): StatusState => ({ ...state, now: new Date() })),
    on(StatusActions.getStatus, (state): StatusState => ({ ...state, ...LoadingState.loading() })),
    on(
      StatusActions.getStatusSuccess,
      (state, { status }): StatusState => ({
        ...state,
        entity: status,
        updated: new Date(),
        ...LoadingState.loaded(),
      })
    ),
    on(
      StatusActions.getStatusFailed,
      (state, { error }): StatusState => ({
        ...state,
        ...LoadingState.failed(error),
      })
    ),
    on(StatusActions.clearStatus, () => ({
      ...initialState,
    }))
  ),
});
