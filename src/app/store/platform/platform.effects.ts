import { Injectable } from '@angular/core';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { BatteryService } from '../../api/services/battery.service';
import * as fromPlatformActions from './platform.actions';
import * as fromDeviceActions from '../devices/devices.actions';
import * as fromDevices from '../devices/devices.selectors';
import { exhaustMap, filter, map } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable()
export class PlatformEffects {
  constructor(
    private readonly actions$: Actions,
    private readonly store: Store,
    private readonly batteryService: BatteryService,
    private readonly router: Router
  ) {}

  hasActiveDevice$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromPlatformActions.platformReady),
      concatLatestFrom(() => this.store.select(fromDevices.selectActiveDeviceSerialNumber)),
      map(([, activeDeviceSerialNumber]) => {
        return activeDeviceSerialNumber === null
          ? fromPlatformActions.noActiveDeviceExists()
          : fromPlatformActions.usingKnownActiveDevice();
      })
    )
  );

  noActiveDeviceExists$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromPlatformActions.noActiveDeviceExists),
      map(() => fromPlatformActions.gotoWizard())
    )
  );

  currentDeviceKnown$$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromPlatformActions.usingKnownActiveDevice),
      map(() => fromPlatformActions.checkActiveDeviceResponding())
    )
  );

  checkCurrentDeviceResponding$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromPlatformActions.checkActiveDeviceResponding),
      exhaustMap(() =>
        this.batteryService
          .check()
          .pipe(
            map((isResponding) =>
              isResponding
                ? fromPlatformActions.activeDeviceResponding()
                : fromPlatformActions.activeDeviceNotResponding()
            )
          )
      )
    )
  );

  currentDeviceNotResponding$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromPlatformActions.activeDeviceNotResponding),
      map(() => fromPlatformActions.checkOnline())
    )
  );

  // checkOnline$ = createEffect(() =>
  //   this.actions$.pipe(
  //     ofType(fromPlatformActions.checkOnline),
  //     map(() => {
  //       // TODO
  //       console.log('TODO: Do online check!');
  //       return fromPlatformActions.online();
  //     })
  //   )
  // );

  onlineFindDevice$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromPlatformActions.online),
      map(() => fromDeviceActions.findDevices({ stopAfterFind: false }))
    )
  );

  findDevicesSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromDeviceActions.findDevicesSuccess),
      filter(({ stopAfterFind }) => !stopAfterFind),
      map(({ devices }) => {
        return devices?.length === 0
          ? fromPlatformActions.deviceNotFound()
          : fromPlatformActions.checkActiveDeviceResponding();
      })
    )
  );

  resetApp$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromPlatformActions.resetApp),
      map(() => fromPlatformActions.gotoWizard())
    )
  );

  gotoWizard$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(fromPlatformActions.gotoWizard),
        map(() => this.router.navigate(['/wizard']))
      ),
    { dispatch: false }
  );

  gotoLivePage$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(fromPlatformActions.gotoLivePage),
        map(() => this.router.navigate(['/tabs/live']))
      ),
    { dispatch: false }
  );
}
