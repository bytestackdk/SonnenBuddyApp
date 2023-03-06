import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { BatteryService } from '../../api/services/battery.service';
import { PlatformActions } from './platform.actions';
import { catchError, filter, map, switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { SonnenBatterieActions, sonnenBatterieFeature } from '../sonnen-batterie/';
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
      map(() => StatusActions.stopStatusPolling())
    )
  );

  readyOrResume$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PlatformActions.ready, PlatformActions.resume),
      switchMap(() => {
        // Use localStorage directly as sometimes meta reducer hasn't picked up state yet
        const sonnenBatterie = localStorage.getItem(sonnenBatterieFeature.name);
        const currentDevice = sonnenBatterie ? JSON.parse(sonnenBatterie)?.device : null;

        if (!currentDevice) {
          return of(PlatformActions.gotoWizard());
        }

        return this.batteryService.pingLan().pipe(
          map(() => StatusActions.startStatusPolling()),
          catchError(() =>
            this.networkService.find().pipe(
              // If devices is empty we just ignore it as we might just be off WI-FI or on a different WI-FI
              filter((devices) => devices.length > 0),
              map((devices) =>
                SonnenBatterieActions.updateDevice({
                  device: devices.find(({ serialNumber }) => serialNumber === currentDevice.serialNumber),
                })
              )
            )
          )
        );
      })
    )
  );

  startPolling$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SonnenBatterieActions.updateDevice),
      map(() => StatusActions.startStatusPolling())
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
