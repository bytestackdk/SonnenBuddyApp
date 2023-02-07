import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { ConnectionStatus } from '@capacitor/network';

export const PlatformActions = createActionGroup({
  source: 'Platform',
  events: {
    'Platform Ready': emptyProps(),
    'Platform Stop': emptyProps(),
    'Wifi Connection Change': props<{ status: ConnectionStatus }>(),
    'Using Known Active Device': emptyProps(),
    'No Active Device Exists': emptyProps(),
    'Check Active Device Responding': emptyProps(),
    'Active Device Responding': emptyProps(),
    'Active Device Not Responding': emptyProps(),
    'Check Online': emptyProps(),
    Online: emptyProps(),
    Offline: emptyProps(),
    'Device Not Found': emptyProps(),
    'Device Found But No Connection': emptyProps(),
    'Goto Wizard': emptyProps(),
    'Goto Live Page': emptyProps(),
    'Run Wizard': emptyProps(),
  },
});
