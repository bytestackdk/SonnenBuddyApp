import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { BatteryService } from '../../api/services/battery.service';
import * as fromActions from './status.actions';
import * as fromPlatform from '../platform';
import { catchError, exhaustMap, map, startWith, switchMap, takeUntil } from 'rxjs/operators';
import { interval, of } from 'rxjs';

const POLLING_INTERVAL = 2000;

@Injectable()
export class StatusEffects {
  constructor(
    private readonly actions$: Actions,
    private readonly store: Store,
    private readonly batteryService: BatteryService
  ) {}

  getStatus$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(fromActions.getBatteryStatus),
      exhaustMap(() =>
        this.batteryService.getStatus().pipe(
          map((status) => fromActions.getBatteryStatusSuccess({ status })),
          catchError((error) => of(fromActions.getBatteryStatusFailed({ error })))
        )
      )
    );
  });

  clearStatus$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(fromPlatform.resetApp),
      map(() => fromActions.clearStatus())
    );
  });

  stopPolling$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(fromPlatform.gotoWizard),
      map(() => fromActions.stopPolling())
    );
  });

  startPolling$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(fromPlatform.gotoLivePage, fromPlatform.activeDeviceResponding),
      map(() => fromActions.startPolling())
    );
  });

  polling$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(fromActions.startPolling),
      switchMap(() =>
        interval(POLLING_INTERVAL).pipe(
          startWith(0),
          takeUntil(this.actions$.pipe(ofType(fromActions.stopPolling))),
          map(() => fromActions.getBatteryStatus())
        )
      )
    );
  });
}
