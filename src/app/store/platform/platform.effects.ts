import { Injectable } from '@angular/core';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { BatteryService } from '../../api/services/battery.service';
import * as fromPlatformActions from './platform.actions';
import { exhaustMap, filter, map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { SonnenBatterieActions } from '../sonnen-batterie/';
import { SonnenBatterieSelectors } from 'src/app/store/sonnen-batterie';

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
      concatLatestFrom(() => this.store.select(SonnenBatterieSelectors.selectDevice)),
      map(([, device]) => {
        return device === null
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
      map(() => SonnenBatterieActions.findDevice({ stopAfterFind: false }))
    )
  );

  findDevicesSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SonnenBatterieActions.findDeviceSuccess),
      filter(({ stopAfterFind }) => !stopAfterFind),
      map(({ device }) => {
        return !device ? fromPlatformActions.deviceNotFound() : fromPlatformActions.checkActiveDeviceResponding();
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
