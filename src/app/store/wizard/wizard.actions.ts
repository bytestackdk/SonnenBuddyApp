import { createActionGroup, props } from '@ngrx/store';
import { Device } from '../../api/models/network.model';
import { WizardOutput } from '../../shared/models/wizard.model';

export const WizardActions = createActionGroup({
  source: 'Wizard',
  events: {
    'Finish Wizard': props<{ device: Device; output: WizardOutput }>(),
  },
});
