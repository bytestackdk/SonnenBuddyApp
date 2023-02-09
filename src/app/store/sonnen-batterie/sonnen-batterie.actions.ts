import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { HttpErrorResponse } from '@angular/common/http';
import { ConfigurationKey, ISchedule } from '../../api/models/battery.model';
import { Device } from '../../api/models/network.model';

export const SonnenBatterieActions = createActionGroup({
  source: 'Sonnen Batterie',
  events: {
    'Clear Device': emptyProps(),
    'Update Device': props<{ device: Device }>(),

    // Dispatched by UI and mapped to SaveSchedules for persisting in sonnenBatterie
    'Add Schedule': props<{ schedule: ISchedule }>(),
    'Update Schedule': props<{ start: string; schedule: ISchedule }>(),
    'Remove Schedule': props<{ start: string }>(),
    'Clear Schedules': emptyProps(),

    // Handles persisting in configuration
    'Save Schedules': props<{ schedules: ISchedule[] }>(),

    // Get configuration
    'Get Configuration': props<{ key: ConfigurationKey }>(),
    'Get Configuration Success': props<{ key: ConfigurationKey; configuration: string }>(),
    'Get Configuration Failed': props<{ error: HttpErrorResponse }>(),

    // Set configuration
    'Set Configuration': props<{ key: ConfigurationKey; configuration: string }>(),
    'Set Configuration Success': props<{ configuration: string }>(),
    'Set Configuration Failed': props<{ error?: string | HttpErrorResponse }>(),

    'Refresh Configurations': emptyProps(),

    'Set IP': emptyProps(),
    'Fucking Crap': emptyProps(),
  },
});
