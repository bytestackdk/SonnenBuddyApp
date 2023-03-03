import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { HttpErrorResponse } from '@angular/common/http';
import { IBatteryStatus } from '../../api/models/battery.model';

export const StatusActions = createActionGroup({
  source: 'Battery',
  events: {
    'Get Status': emptyProps(),
    'Get Status Success': props<{ status: IBatteryStatus }>(),
    'Get Status Failed': props<{ error: HttpErrorResponse }>(),
    'Clear Status': emptyProps(),
    'Start Polling': emptyProps(),
    'Stop Polling': emptyProps(),
    'Refresh Updated': emptyProps(),
  },
});
