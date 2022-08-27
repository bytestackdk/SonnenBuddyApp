import { Injectable } from '@angular/core';
import { catchError, exhaustMap, map } from 'rxjs/operators';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { Store } from '@ngrx/store';
import { NetworkService } from '../../api/services/network.service';
import * as fromActions from './devices.actions';
import * as fromPlatform from '../platform/platform.actions';
import { BatteryService } from '../../api/services/battery.service';

@Injectable()
export class DevicesEffects {
  constructor(
    private readonly actions$: Actions,
    private readonly store: Store,
    private readonly deviceService: NetworkService,
    private readonly batteryService: BatteryService
  ) {}

  findDevices$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(fromActions.findDevices),
      exhaustMap(({ stopAfterFind }) =>
        this.deviceService.find().pipe(
          map((devices) =>
            fromActions.findDevicesSuccess({
              devices,
              stopAfterFind,
            })
          ),
          catchError((error) => of(fromActions.findDevicesFailed({ error })))
        )
      )
    );
  });

  finishWizard$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(fromActions.finishWizard),
      map(() => fromPlatform.gotoLivePage())
    );
  });

  getOperatingMode$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(fromActions.getConfiguration),
      exhaustMap(({ key }) =>
        this.batteryService.getConfiguration(key).pipe(
          map((configuration) => fromActions.getConfigurationSuccess({ key, configuration })),
          catchError((error) => of(fromActions.getConfigurationFailed({ error })))
        )
      )
    );
  });
}
