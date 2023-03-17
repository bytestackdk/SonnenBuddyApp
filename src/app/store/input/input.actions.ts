import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const InputActions = createActionGroup({
  source: 'Input',
  events: {
    'Set Dark Mode': props<{ enabled: boolean }>(),
    'Set Battery Max Power': props<{ batteryMaxPower: number }>(),
    'Set Solar Max Power': props<{ solarMaxPower: number }>(),
    'Clear Input': emptyProps(),
  },
});
