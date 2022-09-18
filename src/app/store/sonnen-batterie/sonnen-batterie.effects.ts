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
      concatLatestFrom(() => this.store.select(fromSonnenBatterie.selectSonnenBatterieConfiguration)),
      exhaustMap(([{ key, configuration }, oldConfiguration]) =>
        this.batteryService.setConfiguration(key, configuration).pipe(
          map(() => fromSonnenBatterie.setConfigurationSuccess()),
          catchError((error) => of(fromSonnenBatterie.setConfigurationFailed({ error, oldConfiguration })))
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

  // refreshPrognosisCharging$ = createEffect(() => {
  //   return this.actions$.pipe(
  //     ofType(fromSonnenBatterie.refreshConfigurations),
  //     map(() => fromSonnenBatterie.getConfiguration({ key: ConfigurationKey.EM_Prognosis_Charging }))
  //   );
  // });
}
