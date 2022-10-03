import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { IPowerMeter } from '../../api/models/battery.model';
import { HttpErrorResponse } from '@angular/common/http';

export const PowerMeterActions = createActionGroup({
  source: 'Power Meter',
  events: {
    'Get Power Meter': emptyProps(),
    'Get Power Meter Success': props<{ powerMeter: IPowerMeter[] }>(),
    'Get Power Meter Failed': props<{ error: HttpErrorResponse }>(),
  },
});
