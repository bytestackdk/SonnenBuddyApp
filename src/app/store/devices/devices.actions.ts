import { createAction, props } from '@ngrx/store';
import { HttpErrorResponse } from '@angular/common/http';
import { ApiToken } from '../../shared/models/device-details.model';
import { IDevice } from '../../api/models/network.model';
import { ConfigurationKey } from '../../api/models/battery.model';

export const CLEAR_DEVICES = '[Devices] Clear';
export const clearDevices = createAction(CLEAR_DEVICES);

export const FIND_DEVICES = '[Devices] Find';
export const FIND_DEVICES_SUCCESS = '[Devices] Find success';
export const FIND_DEVICES_FAILED = '[Devices] Find failed';

export const findDevices = createAction(FIND_DEVICES, props<{ stopAfterFind: boolean }>());
export const findDevicesSuccess = createAction(
  FIND_DEVICES_SUCCESS,
  props<{ devices: IDevice[]; stopAfterFind: boolean }>()
);
export const findDevicesFailed = createAction(FIND_DEVICES_FAILED, props<{ error: HttpErrorResponse }>());

export const GET_CONFIGURATION = '[Devices] Get configuration';
export const GET_CONFIGURATION_SUCCESS = '[Devices] Get configuration success';
export const GET_CONFIGURATION_FAILED = '[Devices] Get configuration failed';

export const getConfiguration = createAction(GET_CONFIGURATION, props<{ key: ConfigurationKey }>());
export const getConfigurationSuccess = createAction(
  GET_CONFIGURATION_SUCCESS,
  props<{ key: ConfigurationKey; configuration: string }>()
);
export const getConfigurationFailed = createAction(GET_CONFIGURATION_FAILED, props<{ error: HttpErrorResponse }>());

export const FINISH_WIZARD = '[Platform] Finish wizard';
export const finishWizard = createAction(
  FINISH_WIZARD,
  props<{
    apiToken: ApiToken;
    device: IDevice;
    maxPower: number;
    batteryQuantity: number;
    batteryModuleCapacity: number;
    panelCapacity: number;
  }>()
);
