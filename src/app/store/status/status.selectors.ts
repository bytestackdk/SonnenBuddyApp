import { createSelector } from '@ngrx/store';
import { statusFeature } from './status.reducer';

export const selectStatus = createSelector(
  statusFeature.selectStatusState,
  (state) => state.entity
);

export const selectStatusError = createSelector(
  statusFeature.selectStatusState,
  (state) => state.error
);
