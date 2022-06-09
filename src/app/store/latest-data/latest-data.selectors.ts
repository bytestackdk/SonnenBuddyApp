import { createSelector } from '@ngrx/store';
import { latestDataFeature } from './latest-data.reducer';

export const selectLatestData = createSelector(
  latestDataFeature.selectLatestDataState,
  (state) => state.entity
);
