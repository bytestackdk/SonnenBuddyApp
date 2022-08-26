import { createAction, props } from '@ngrx/store';
import { HttpErrorResponse } from '@angular/common/http';
import { ApiToken, IDeviceDetails } from '../../shared/models/device-details.model';
import { IDevice } from '../../api/models/network.model';

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

export const TEST_TOKEN = '[Devices] Test token';
export const testToken = createAction(TEST_TOKEN, props<{ apiToken: string }>());

export const GET_INVERTER_MAX_POWER = '[Devices] Get inverter max power';
export const GET_INVERTER_MAX_POWER_SUCCESS = '[Devices] Get inverter max power success';
export const GET_INVERTER_MAX_POWER_FAILED = '[Devices] Get inverter max power failed';

export const getInverterMaxPower = createAction(GET_INVERTER_MAX_POWER);
export const getInverterMaxPowerSuccess = createAction(GET_INVERTER_MAX_POWER_SUCCESS, props<{ maxPower: number }>());
export const getInverterMaxPowerFailed = createAction(
  GET_INVERTER_MAX_POWER_FAILED,
  props<{ error: HttpErrorResponse }>()
);

export const GET_BATTERY_QUANTITY = '[Devices] Get battery quantity';
export const GET_BATTERY_QUANTITY_SUCCESS = '[Devices] Get battery quantity success';
export const GET_BATTERY_QUANTITY_FAILED = '[Devices] Get battery quantity failed';

export const getBatteryQuantity = createAction(GET_BATTERY_QUANTITY);
export const getBatteryQuantitySuccess = createAction(
  GET_BATTERY_QUANTITY_SUCCESS,
  props<{ batteryQuantity: number }>()
);
export const getBatteryQuantityFailed = createAction(
  GET_BATTERY_QUANTITY_FAILED,
  props<{ error: HttpErrorResponse }>()
);

export const GET_BATTERY_MODULE_CAPACITY = '[Devices] Get battery module capacity';
export const GET_BATTERY_MODULE_CAPACITY_SUCCESS = '[Devices] Get battery module capacity success';
export const GET_BATTERY_MODULE_CAPACITY_FAILED = '[Devices] Get battery module capacity failed';

export const getBatteryModuleCapacity = createAction(GET_BATTERY_MODULE_CAPACITY);
export const getBatteryModuleCapacitySuccess = createAction(
  GET_BATTERY_MODULE_CAPACITY_SUCCESS,
  props<{ batteryModuleCapacity: number }>()
);
export const getBatteryModuleCapacityFailed = createAction(
  GET_BATTERY_MODULE_CAPACITY_FAILED,
  props<{ error: HttpErrorResponse }>()
);

export const SET_TOKEN = '[Devices] Set token';
export const setToken = createAction(SET_TOKEN, props<{ apiToken: string }>());

export const SET_PANEL_CAPACITY = '[Devices] Set panel capacity';
export const setPanelCapacity = createAction(SET_PANEL_CAPACITY, props<{ panelCapacity: number }>());

export const SET_DEVICE_DETAILS = '[Devices] Set device details';
export const setDeviceDetails = createAction(
  SET_DEVICE_DETAILS,
  props<{ deviceSerialNumber: number; details: IDeviceDetails }>()
);

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
