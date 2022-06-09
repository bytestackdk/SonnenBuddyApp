import { createAction, props } from '@ngrx/store';
import { ILatestData } from '../../api/models/battery.model';
import { HttpErrorResponse } from '@angular/common/http';

export const GET_LATEST_DATA = '[Battery] Get latest data';
export const GET_LATEST_DATA_SUCCESS = '[Battery] Get latest data success';
export const GET_LATEST_DATA_FAILED = '[Battery] Get latest data failed';

export const getLatestData = createAction(GET_LATEST_DATA);
export const getLatestDataSuccess = createAction(
  GET_LATEST_DATA_SUCCESS,
  props<{ data: ILatestData }>()
);
export const getLatestDataFailed = createAction(
  GET_LATEST_DATA_FAILED,
  props<{ error: HttpErrorResponse }>()
);
