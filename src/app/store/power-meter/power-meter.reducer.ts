import { LoadingState } from '../../shared/models/loading-state.model';
import { IPowerMeter } from '../../api/models/battery.model';
import { createFeature, createReducer, on } from '@ngrx/store';
import { PowerMeterActions } from './power-meter.actions';

export interface PowerMeterState extends LoadingState {
  entity: IPowerMeter[];
}

export const initialState: PowerMeterState = {
  entity: null,
  ...LoadingState.initial(),
};

export const powerMeterFeature = createFeature({
  name: 'powerMeter',
  reducer: createReducer(
    initialState,

    on(PowerMeterActions.getPowerMeter, (state): PowerMeterState => ({ ...state, ...LoadingState.loading() })),
    on(
      PowerMeterActions.getPowerMeterSuccess,
      (state, { powerMeter }): PowerMeterState => ({
        ...state,
        entity: powerMeter,
        ...LoadingState.loaded(),
      })
    ),
    on(
      PowerMeterActions.getPowerMeterFailed,
      (state, { error }): PowerMeterState => ({
        ...state,
        ...LoadingState.failed(error),
      })
    )
  ),
});
