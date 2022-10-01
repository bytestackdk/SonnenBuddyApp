import { createAction, props } from '@ngrx/store';
import { HttpErrorResponse } from '@angular/common/http';
import { IDeviceConfiguration } from '../../shared/models/sonnen-batterie.model';
import { IDevice } from '../../api/models/network.model';
import { ConfigurationKey, ISchedule } from '../../api/models/battery.model';

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

export const ADD_SCHEDULE = '[SonnenBatterie] Add schedule';
export const UPDATE_SCHEDULE = '[SonnenBatterie] Update schedule';
export const REMOVE_SCHEDULE = '[SonnenBatterie] Remove schedule';
export const CLEAR_SCHEDULES = '[SonnenBatterie] Clear schedules';
export const SAVE_SCHEDULES = '[SonnenBatterie] Save schedules';

export const addSchedule = createAction(ADD_SCHEDULE, props<{ schedule: ISchedule }>());
export const updateSchedule = createAction(UPDATE_SCHEDULE, props<{ start: string; schedule: ISchedule }>());
export const removeSchedule = createAction(REMOVE_SCHEDULE, props<{ start: string }>());
export const clearSchedules = createAction(CLEAR_SCHEDULES);
export const saveSchedules = createAction(SAVE_SCHEDULES, props<{ schedules: ISchedule[] }>());

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
export const setConfigurationSuccess = createAction(SET_CONFIGURATION_SUCCESS, props<{ configuration: string }>());
export const setConfigurationFailed = createAction(
  SET_CONFIGURATION_FAILED,
  props<{ error?: string | HttpErrorResponse }>()
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
