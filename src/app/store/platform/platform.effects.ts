import { Injectable } from '@angular/core';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { BatteryService } from '../../api/services/battery.service';
import { PlatformActions } from './platform.actions';
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
      ofType(PlatformActions.platformReady),
      concatLatestFrom(() => this.store.select(SonnenBatterieSelectors.selectDevice)),
      map(([, device]) => {
        return device === null ? PlatformActions.noActiveDeviceExists() : PlatformActions.usingKnownActiveDevice();
      })
    )
  );

  noActiveDeviceExists$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PlatformActions.noActiveDeviceExists),
      map(() => PlatformActions.gotoWizard())
    )
  );

  currentDeviceKnown$$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PlatformActions.usingKnownActiveDevice),
      map(() => PlatformActions.checkActiveDeviceResponding())
    )
  );

  checkCurrentDeviceResponding$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PlatformActions.checkActiveDeviceResponding),
      exhaustMap(() =>
        this.batteryService
          .check()
          .pipe(
            map((isResponding) =>
              isResponding ? PlatformActions.activeDeviceResponding() : PlatformActions.activeDeviceNotResponding()
            )
          )
      )
    )
  );

  currentDeviceNotResponding$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PlatformActions.activeDeviceNotResponding),
      map(() => PlatformActions.checkOnline())
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
      ofType(PlatformActions.online),
      map(() => SonnenBatterieActions.findDevice({ stopAfterFind: false }))
    )
  );

  findDevicesSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SonnenBatterieActions.findDeviceSuccess),
      filter(({ stopAfterFind }) => !stopAfterFind),
      map(({ device }) => {
        return !device ? PlatformActions.deviceNotFound() : PlatformActions.checkActiveDeviceResponding();
      })
    )
  );

  resetApp$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PlatformActions.resetApp),
      map(() => PlatformActions.gotoWizard())
    )
  );

  gotoWizard$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(PlatformActions.gotoWizard),
        map(() => this.router.navigate(['/wizard']))
      ),
    { dispatch: false }
  );

  gotoLivePage$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(PlatformActions.gotoLivePage),
        map(() => this.router.navigate(['/tabs/live']))
      ),
    { dispatch: false }
  );
}
