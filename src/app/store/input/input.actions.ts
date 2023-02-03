import { createActionGroup, props } from '@ngrx/store';

export const InputActions = createActionGroup({
  source: 'Input',
  events: {
    'Set Dark Mode': props<{ enabled: boolean }>(),
  },
});
