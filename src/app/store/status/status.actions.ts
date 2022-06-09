import { createAction, props } from '@ngrx/store';
import { HttpErrorResponse } from '@angular/common/http';
import { IBatteryStatus } from '../../api/models/battery.model';

export const GET_STATUS = '[Battery] Get status';
export const GET_STATUS_SUCCESS = '[Battery] Get status success';
export const GET_STATUS_FAILED = '[Battery] Get status failed';

export const getBatteryStatus = createAction(GET_STATUS);
export const getBatteryStatusSuccess = createAction(
  GET_STATUS_SUCCESS,
  props<{ status: IBatteryStatus }>()
);
export const getBatteryStatusFailed = createAction(
  GET_STATUS_FAILED,
  props<{ error: HttpErrorResponse }>()
);
