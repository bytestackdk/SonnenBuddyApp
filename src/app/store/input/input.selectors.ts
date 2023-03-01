import { inputFeature } from './input.reducer';
import { createSelector } from '@ngrx/store';

export const { selectInputState, selectDarkMode, selectApiToken } = inputFeature;

export const selectSolarMaxPower = createSelector(selectInputState, (state) => state.solarMaxPower);
