import { createFeature, createReducer, on } from '@ngrx/store';
import { InputActions } from './input.actions';
import { ApiToken } from '../../shared/models/wizard.model';
import { WizardActions } from '../wizard/wizard.actions';

export interface InputState {
  /**
   * The token used for more advanced API operations
   */
  apiToken: ApiToken;
  /**
   * Capacity of solar installation panel in Watts
   */
  solarCapacity: number;
  darkMode: boolean;
}

export const initialState: InputState = {
  apiToken: null,
  solarCapacity: null,
  darkMode: false,
};

export const inputFeature = createFeature({
  name: 'input',
  reducer: createReducer(
    initialState,

    on(WizardActions.finishWizard, (state, { output: { apiToken, solarCapacity } }) => ({
      ...state,
      apiToken,
      solarCapacity,
    })),
    on(InputActions.setDarkMode, (state, { enabled }) => ({
      ...state,
      darkMode: enabled,
    }))
  ),
});
