import { createActionGroup, props } from '@ngrx/store';

export const PreferencesActions = createActionGroup({
  source: 'Preferences',
  events: {
    'Set Dark Mode': props<{ enabled: boolean }>(),
  },
});
