import { Injectable } from '@angular/core';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { BatteryService } from '../../api/services/battery.service';
import { PlatformActions } from './platform.actions';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { SonnenBatterieActions } from '../sonnen-batterie/';
import { SonnenBatterieSelectors } from 'src/app/store/sonnen-batterie';
import { StatusActions } from '../status';
import { of } from 'rxjs';
import { NetworkService } from '../../api/services/network.service';

@Injectable()
export class PlatformEffects {
  constructor(
    private readonly actions$: Actions,
    private readonly store: Store,
    private readonly batteryService: BatteryService,
    private readonly networkService: NetworkService,
    private readonly router: Router
  ) {}

  pause$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PlatformActions.pause),
      map(() => StatusActions.stopPolling())
    )
  );

  readyOrResume$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PlatformActions.ready, PlatformActions.resume),
      concatLatestFrom(() => this.store.select(SonnenBatterieSelectors.selectDevice)),
      switchMap(([, currentDevice]) => {
        console.log('currentDevice', JSON.stringify(currentDevice));
        if (!currentDevice) {
          return of(PlatformActions.gotoWizard());
        }

        console.log('pingLan');
        return this.batteryService.pingLan().pipe(
          tap(() => console.log('startPolling')),
          map(() => StatusActions.startPolling()),
          catchError((error) => {
            console.log('error', JSON.stringify(error));

            // Ignore error as we might be on a different WI-FI with no sonnenBatterie
            return this.networkService.find().pipe(
              tap((devices) => console.log('devices', JSON.stringify(devices[0]))),
              map((devices) => SonnenBatterieActions.updateDevice({ device: devices[0] }))
            );
          })
        );
      })
    )
  );

  startPolling$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SonnenBatterieActions.updateDevice),
      map(() => StatusActions.startPolling())
    )
  );

  resetApp$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PlatformActions.runWizard),
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
