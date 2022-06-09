import { createSelector } from '@ngrx/store';
import { powerMeterFeature } from './power-meter.reducer';

export const selectPowerMeter = createSelector(
  powerMeterFeature.selectPowerMeterState,
  (state) => state.entity
);
