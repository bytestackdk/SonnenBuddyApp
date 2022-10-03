import { Injectable } from '@angular/core';
import { catchError, concatMap, exhaustMap, map } from 'rxjs/operators';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { Store } from '@ngrx/store';
import { NetworkService } from '../../api/services/network.service';
import { SonnenBatterieActions, SonnenBatterieSelectors } from './';
import { PlatformActions } from '../platform';
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
      ofType(SonnenBatterieActions.findDevice),
      exhaustMap(({ stopAfterFind }) =>
        this.deviceService.find().pipe(
          map((devices) =>
            SonnenBatterieActions.findDeviceSuccess({
              // For now just picking first device always
              device: devices[0],
              stopAfterFind,
            })
          ),
          catchError((error) => of(SonnenBatterieActions.findDeviceFailed({ error })))
        )
      )
    );
  });

  finishWizard$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(SonnenBatterieActions.finishWizard),
      map(() => PlatformActions.gotoLivePage())
    );
  });

  addSchedule$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(SonnenBatterieActions.addSchedule),
      concatLatestFrom(() => this.store.select(SonnenBatterieSelectors.selectSonnenBatterieSchedules)),
      map(([{ schedule }, schedules]) => SonnenBatterieActions.saveSchedules({ schedules: [...schedules, schedule] }))
    );
  });

  updateSchedule$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(SonnenBatterieActions.updateSchedule),
      concatLatestFrom(() => this.store.select(SonnenBatterieSelectors.selectSonnenBatterieSchedules)),
      map(([{ start, schedule }, schedules]) =>
        SonnenBatterieActions.saveSchedules({
          schedules: schedules.map((s) => (s.start === start ? schedule : s)),
        })
      )
    );
  });

  removeSchedule$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(SonnenBatterieActions.removeSchedule),
      concatLatestFrom(() => this.store.select(SonnenBatterieSelectors.selectSonnenBatterieSchedules)),
      map(([{ start }, schedules]) =>
        SonnenBatterieActions.saveSchedules({
          schedules: schedules.filter((s) => s.start !== start),
        })
      )
    );
  });

  clearSchedules$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(SonnenBatterieActions.clearSchedules),
      map(() => SonnenBatterieActions.saveSchedules({ schedules: [] }))
    );
  });

  saveSchedules$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(SonnenBatterieActions.saveSchedules),
      map(({ schedules }) => {
        const configuration = JSON.stringify(schedules);
        return SonnenBatterieActions.setConfiguration({ key: ConfigurationKey.EM_ToU_Schedule, configuration });
      })
    );
  });

  getConfiguration$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(SonnenBatterieActions.getConfiguration),
      concatMap(({ key }) =>
        this.batteryService.getConfiguration(key).pipe(
          map((configuration) => SonnenBatterieActions.getConfigurationSuccess({ key, configuration })),
          catchError((error) => of(SonnenBatterieActions.getConfigurationFailed({ error })))
        )
      )
    );
  });

  setConfiguration$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(SonnenBatterieActions.setConfiguration),
      exhaustMap(({ key, configuration }) =>
        this.batteryService.setConfiguration(key, configuration).pipe(
          map((response) =>
            response
              ? SonnenBatterieActions.setConfigurationSuccess({ configuration: response })
              : SonnenBatterieActions.setConfigurationFailed({ error: 'Error saving configuration' })
          ),
          catchError((error) => of(SonnenBatterieActions.setConfigurationFailed({ error })))
        )
      )
    );
  });

  refreshOperatingMode$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(SonnenBatterieActions.refreshConfigurations),
      map(() => SonnenBatterieActions.getConfiguration({ key: ConfigurationKey.EM_OperatingMode }))
    );
  });

  refreshSchedules$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(SonnenBatterieActions.refreshConfigurations),
      map(() => SonnenBatterieActions.getConfiguration({ key: ConfigurationKey.EM_ToU_Schedule }))
    );
  });

  // refreshPrognosisCharging$ = createEffect(() => {
  //   return this.actions$.pipe(
  //     ofType(fromSonnenBatterie.refreshConfigurations),
  //     map(() => fromSonnenBatterie.getConfiguration({ key: ConfigurationKey.EM_Prognosis_Charging }))
  //   );
  // });
}
