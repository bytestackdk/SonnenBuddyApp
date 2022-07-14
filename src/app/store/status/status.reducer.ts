import { IBatteryStatus } from '../../api/models/battery.model';
import { LoadingState } from '../../shared/models/loading-state.model';
import { createFeature, createReducer, on } from '@ngrx/store';
import * as fromActions from './status.actions';

export interface StatusState extends LoadingState {
  entity: IBatteryStatus;
}

export const initialState: StatusState = {
  entity: null,
  ...LoadingState.initial(),
};

export const statusFeature = createFeature({
  name: 'status',
  reducer: createReducer(
    initialState,

    on(fromActions.getBatteryStatus, (state): StatusState => ({ ...state, ...LoadingState.loading() })),
    on(
      fromActions.getBatteryStatusSuccess,
      (state, { status }): StatusState => ({
        ...state,
        entity: status,
        ...LoadingState.loaded(),
      })
    ),
    on(
      fromActions.getBatteryStatusFailed,
      (state, { error }): StatusState => ({
        ...state,
        ...LoadingState.failed(error),
      })
    )
  ),
});
