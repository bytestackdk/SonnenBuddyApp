import { createAction, props } from '@ngrx/store';
import { HttpErrorResponse } from '@angular/common/http';
import { IDeviceConfiguration } from '../../shared/models/sonnen-batterie.model';
import { IDevice } from '../../api/models/network.model';
import { ConfigurationKey } from '../../api/models/battery.model';

export const CLEAR_DEVICE = '[SonnenBatterie] Clear';
export const clearDevice = createAction(CLEAR_DEVICE);

export const FIND_DEVICE = '[SonnenBatterie] Find';
export const FIND_DEVICE_SUCCESS = '[SonnenBatterie] Find success';
export const FIND_DEVICE_FAILED = '[SonnenBatterie] Find failed';

export const findDevice = createAction(FIND_DEVICE, props<{ stopAfterFind: boolean }>());
export const findDeviceSuccess = createAction(
  FIND_DEVICE_SUCCESS,
  props<{ device: IDevice; stopAfterFind: boolean }>()
);
export const findDeviceFailed = createAction(FIND_DEVICE_FAILED, props<{ error: HttpErrorResponse }>());

export const GET_CONFIGURATION = '[SonnenBatterie] Get configuration';
export const GET_CONFIGURATION_SUCCESS = '[SonnenBatterie] Get configuration success';
export const GET_CONFIGURATION_FAILED = '[SonnenBatterie] Get configuration failed';

export const getConfiguration = createAction(GET_CONFIGURATION, props<{ key: ConfigurationKey }>());
export const getConfigurationSuccess = createAction(
  GET_CONFIGURATION_SUCCESS,
  props<{ key: ConfigurationKey; configuration: string }>()
);
export const getConfigurationFailed = createAction(GET_CONFIGURATION_FAILED, props<{ error: HttpErrorResponse }>());

export const SET_CONFIGURATION = '[SonnenBatterie] Set configuration';
export const SET_CONFIGURATION_SUCCESS = '[SonnenBatterie] Set configuration success';
export const SET_CONFIGURATION_FAILED = '[SonnenBatterie] Set configuration failed';

export const setConfiguration = createAction(
  SET_CONFIGURATION,
  props<{ key: ConfigurationKey; configuration: string }>()
);
export const setConfigurationSuccess = createAction(SET_CONFIGURATION_SUCCESS);
export const setConfigurationFailed = createAction(
  SET_CONFIGURATION_FAILED,
  props<{ error: HttpErrorResponse; oldConfiguration: IDeviceConfiguration }>()
);

export const REFRESH_CONFIGURATIONS = '[SonnenBatterie] Refresh configurations';
export const refreshConfigurations = createAction(REFRESH_CONFIGURATIONS);

export const FINISH_WIZARD = '[SonnenBatterie] Finish wizard';
export const finishWizard = createAction(
  FINISH_WIZARD,
  props<{
    device: IDevice;
    configuration: IDeviceConfiguration;
  }>()
);
