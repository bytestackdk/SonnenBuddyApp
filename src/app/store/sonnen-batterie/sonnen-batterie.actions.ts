import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { HttpErrorResponse } from '@angular/common/http';
import { IDeviceConfiguration } from '../../shared/models/sonnen-batterie.model';
import { IDevice } from '../../api/models/network.model';
import { ConfigurationKey, ISchedule } from '../../api/models/battery.model';

export const SonnenBatterieActions = createActionGroup({
  source: 'Sonnen Batterie',
  events: {
    'Clear Device': emptyProps(),
    'Find Device': props<{ stopAfterFind: boolean }>(),
    'Find Device Success': props<{ device: IDevice; stopAfterFind: boolean }>(),
    'Find Device Failed': props<{ error: HttpErrorResponse }>(),
    'Add Schedule': props<{ schedule: ISchedule }>(),
    'Update Schedule': props<{ start: string; schedule: ISchedule }>(),
    'Remove Schedule': props<{ start: string }>(),
    'Clear Schedules': emptyProps(),
    'Save Schedules': props<{ schedules: ISchedule[] }>(),
    'Get Configuration': props<{ key: ConfigurationKey }>(),
    'Get Configuration Success': props<{ key: ConfigurationKey; configuration: string }>(),
    'Get Configuration Failed': props<{ error: HttpErrorResponse }>(),
    'Set Configuration': props<{ key: ConfigurationKey; configuration: string }>(),
    'Set Configuration Success': props<{ configuration: string }>(),
    'Set Configuration Failed': props<{ error?: string | HttpErrorResponse }>(),
    'Refresh Configurations': emptyProps(),
    'Finish Wizard': props<{ device: IDevice; configuration: IDeviceConfiguration }>(),
  },
});
