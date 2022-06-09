import { LoadingState } from '../../shared/models/loading-state.model';
import { ILatestData } from '../../api/models/battery.model';
import { createFeature, createReducer, on } from '@ngrx/store';
import * as fromActions from './latest-data.actions';

export interface LatestDataState extends LoadingState {
  entity: ILatestData;
}

export const initialState: LatestDataState = {
  entity: null,
  ...LoadingState.initial(),
};

export const latestDataFeature = createFeature({
  name: 'latestData',
  reducer: createReducer(
    initialState,

    on(
      fromActions.getLatestData,
      (state): LatestDataState => ({ ...state, ...LoadingState.loading() })
    ),
    on(
      fromActions.getLatestDataSuccess,
      (state, { data }): LatestDataState => ({
        ...state,
        entity: data,
        ...LoadingState.loaded(),
      })
    ),
    on(
      fromActions.getLatestDataFailed,
      (state, { error }): LatestDataState => ({
        ...state,
        ...LoadingState.failed(error),
      })
    )
  ),
});
