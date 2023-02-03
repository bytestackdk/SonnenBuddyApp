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
   * Max power of solar installation in Watts
   */
  solarMaxPower: number;
  darkMode: boolean;
}

export const initialState: InputState = {
  apiToken: null,
  solarMaxPower: null,
  darkMode: false,
};

export const inputFeature = createFeature({
  name: 'input',
  reducer: createReducer(
    initialState,

    on(WizardActions.finishWizard, (state, { output: { apiToken, solarMaxPower } }) => ({
      ...state,
      apiToken,
      solarMaxPower,
    })),
    on(InputActions.setDarkMode, (state, { enabled }) => ({
      ...state,
      darkMode: enabled,
    }))
  ),
});
