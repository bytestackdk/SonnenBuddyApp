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

  // testToken$ = createEffect(() => {
  //   return this.actions$.pipe(
  //     ofType(fromActions.testToken),
  //     map(() => fromActions.setToken())
  //   );
  // });
  //
  // testTokenInverterMaxPower$ = createEffect(() => {
  //   return this.actions$.pipe(
  //     ofType(fromActions.testToken),
  //     map(() => fromActions.getInverterMaxPower())
  //   );
  // });
  //
  // testTokenBatteryQuantity$ = createEffect(() => {
  //   return this.actions$.pipe(
  //     ofType(fromActions.testToken),
  //     map(() => fromActions.getBatteryQuantity())
  //   );
  // });
  //
  // testTokenBatteryModuleCapacity$ = createEffect(() => {
  //   return this.actions$.pipe(
  //     ofType(fromActions.testToken),
  //     map(() => fromActions.getBatteryModuleCapacity())
  //   );
  // });

  // getInverterMaxPower$ = createEffect(() => {
  //   return this.actions$.pipe(
  //     ofType(fromActions.getInverterMaxPower),
  //     exhaustMap(() =>
  //       this.batteryService.getInverterMaxPower().pipe(
  //         map((maxPower) => fromActions.getInverterMaxPowerSuccess({ maxPower })),
  //         catchError((error) => of(fromActions.getInverterMaxPowerFailed({ error })))
  //       )
  //     )
  //   );
  // });
  //
  // getBatteryQuantity$ = createEffect(() => {
  //   return this.actions$.pipe(
  //     ofType(fromActions.getBatteryQuantity),
  //     exhaustMap(() =>
  //       this.batteryService.getBatteryQuantity().pipe(
  //         map((batteryQuantity) => fromActions.getBatteryQuantitySuccess({ batteryQuantity })),
  //         catchError((error) => of(fromActions.getBatteryQuantityFailed({ error })))
  //       )
  //     )
  //   );
  // });
  //
  // getBatteryModuleCapacity$ = createEffect(() => {
  //   return this.actions$.pipe(
  //     ofType(fromActions.getBatteryModuleCapacity),
  //     exhaustMap(() =>
  //       this.batteryService.getBatteryModuleCapacity().pipe(
  //         map((batteryModuleCapacity) => fromActions.getBatteryModuleCapacitySuccess({ batteryModuleCapacity })),
  //         catchError((error) => of(fromActions.getBatteryModuleCapacityFailed({ error })))
  //       )
  //     )
  //   );
  // });
}
