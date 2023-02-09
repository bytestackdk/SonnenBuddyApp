import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { ConnectionStatus } from '@capacitor/network';

export const PlatformActions = createActionGroup({
  source: 'Platform',
  events: {
    Ready: emptyProps(),
    Resume: emptyProps(),
    Pause: emptyProps(),
    Stop: emptyProps(),
    'Wifi Connection Change': props<{ status: ConnectionStatus }>(),
    'Goto Wizard': emptyProps(),
    'Goto Live Page': emptyProps(),
    'Run Wizard': emptyProps(),
  },
});
