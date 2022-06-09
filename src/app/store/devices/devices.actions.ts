import { createAction, props } from '@ngrx/store';
import { HttpErrorResponse } from '@angular/common/http';
import { IDevice } from '../../shared/models/device.model';

export const FIND_DEVICES = '[Devices] Find';
export const FIND_DEVICES_SUCCESS = '[Devices] Find success';
export const FIND_DEVICES_FAILED = '[Devices] Find failed';

export const findDevices = createAction(FIND_DEVICES);
export const findDevicesSuccess = createAction(
  FIND_DEVICES_SUCCESS,
  props<{ devices: IDevice[] }>()
);
export const findDevicesFailed = createAction(
  FIND_DEVICES_FAILED,
  props<{ error: HttpErrorResponse }>()
);

export const SET_TOKEN = '[Devices] Set token';
export const setToken = createAction(SET_TOKEN, props<{ apiToken: string }>());
