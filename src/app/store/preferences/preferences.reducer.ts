import { createFeature, createReducer, on } from '@ngrx/store';
import { PreferencesActions } from './preferences.actions';

export interface PreferencesState {
  darkMode: boolean;
}

export const initialState: PreferencesState = {
  darkMode: false,
};

export const preferencesFeature = createFeature({
  name: 'preferences',
  reducer: createReducer(
    initialState,

    on(PreferencesActions.setDarkMode, (state, { enabled }) => ({
      ...state,
      darkMode: enabled,
    }))
  ),
});
