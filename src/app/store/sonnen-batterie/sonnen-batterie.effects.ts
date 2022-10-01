import { Injectable } from '@angular/core';
import { catchError, concatMap, exhaustMap, map } from 'rxjs/operators';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { Store } from '@ngrx/store';
import { NetworkService } from '../../api/services/network.service';
import * as fromSonnenBatterie from './';
import * as fromPlatform from '../platform/platform.actions';
import { BatteryService } from '../../api/services/battery.service';
import { ConfigurationKey } from '../../api/models/battery.model';

@Injectable()
export class SonnenBatterieEffects {
  constructor(
    private readonly actions$: Actions,
    private readonly store: Store,
    private readonly deviceService: NetworkService,
    private readonly batteryService: BatteryService
  ) {}

  findDevices$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(fromSonnenBatterie.findDevice),
      exhaustMap(({ stopAfterFind }) =>
        this.deviceService.find().pipe(
          map((devices) =>
            fromSonnenBatterie.findDeviceSuccess({
              // For now just picking first device always
              device: devices[0],
              stopAfterFind,
            })
          ),
          catchError((error) => of(fromSonnenBatterie.findDeviceFailed({ error })))
        )
      )
    );
  });

  finishWizard$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(fromSonnenBatterie.finishWizard),
      map(() => fromPlatform.gotoLivePage())
    );
  });

  addSchedule$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(fromSonnenBatterie.addSchedule),
      concatLatestFrom(() => this.store.select(fromSonnenBatterie.selectSonnenBatterieSchedules)),
      map(([{ schedule }, schedules]) => fromSonnenBatterie.saveSchedules({ schedules: [...schedules, schedule] }))
    );
  });

  updateSchedule$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(fromSonnenBatterie.updateSchedule),
      concatLatestFrom(() => this.store.select(fromSonnenBatterie.selectSonnenBatterieSchedules)),
      map(([{ start, schedule }, schedules]) =>
        fromSonnenBatterie.saveSchedules({
          schedules: schedules.map((s) => (s.start === start ? schedule : s)),
        })
      )
    );
  });

  removeSchedule$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(fromSonnenBatterie.removeSchedule),
      concatLatestFrom(() => this.store.select(fromSonnenBatterie.selectSonnenBatterieSchedules)),
      map(([{ start }, schedules]) =>
        fromSonnenBatterie.saveSchedules({
          schedules: schedules.filter((s) => s.start !== start),
        })
      )
    );
  });

  clearSchedules$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(fromSonnenBatterie.clearSchedules),
      map(() => fromSonnenBatterie.saveSchedules({ schedules: [] }))
    );
  });

  saveSchedules$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(fromSonnenBatterie.saveSchedules),
      map(({ schedules }) => {
        const configuration = JSON.stringify(schedules);
        return fromSonnenBatterie.setConfiguration({ key: ConfigurationKey.EM_ToU_Schedule, configuration });
      })
    );
  });

  getConfiguration$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(fromSonnenBatterie.getConfiguration),
      concatMap(({ key }) =>
        this.batteryService.getConfiguration(key).pipe(
          map((configuration) => fromSonnenBatterie.getConfigurationSuccess({ key, configuration })),
          catchError((error) => of(fromSonnenBatterie.getConfigurationFailed({ error })))
        )
      )
    );
  });

  setConfiguration$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(fromSonnenBatterie.setConfiguration),
      exhaustMap(({ key, configuration }) =>
        this.batteryService.setConfiguration(key, configuration).pipe(
          map((response) =>
            response
              ? fromSonnenBatterie.setConfigurationSuccess({ configuration: response })
              : fromSonnenBatterie.setConfigurationFailed({ error: 'Error saving configuration' })
          ),
          catchError((error) => of(fromSonnenBatterie.setConfigurationFailed({ error })))
        )
      )
    );
  });

  refreshOperatingMode$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(fromSonnenBatterie.refreshConfigurations),
      map(() => fromSonnenBatterie.getConfiguration({ key: ConfigurationKey.EM_OperatingMode }))
    );
  });

  refreshSchedules$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(fromSonnenBatterie.refreshConfigurations),
      map(() => fromSonnenBatterie.getConfiguration({ key: ConfigurationKey.EM_ToU_Schedule }))
    );
  });

  // refreshPrognosisCharging$ = createEffect(() => {
  //   return this.actions$.pipe(
  //     ofType(fromSonnenBatterie.refreshConfigurations),
  //     map(() => fromSonnenBatterie.getConfiguration({ key: ConfigurationKey.EM_Prognosis_Charging }))
  //   );
  // });
}
