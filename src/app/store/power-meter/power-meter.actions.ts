import { createAction, props } from '@ngrx/store';
import { IPowerMeter } from '../../api/models/battery.model';
import { HttpErrorResponse } from '@angular/common/http';

export const GET_POWER_METER = '[Battery] Get power meter';
export const GET_POWER_METER_SUCCESS = '[Battery] Get power meter success';
export const GET_POWER_METER_FAILED = '[Battery] Get power meter failed';

export const getPowerMeter = createAction(GET_POWER_METER);
export const getPowerMeterSuccess = createAction(GET_POWER_METER_SUCCESS, props<{ powerMeter: IPowerMeter[] }>());
export const getPowerMeterFailed = createAction(GET_POWER_METER_FAILED, props<{ error: HttpErrorResponse }>());
