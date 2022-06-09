import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { BatteryService } from '../../api/services/battery.service';
import * as fromActions from './status.actions';
import * as fromPlatform from '../platform';
import {
  catchError,
  exhaustMap,
  map,
  switchMap,
  takeUntil,
} from 'rxjs/operators';
import { interval, of } from 'rxjs';

const POLLING_INTERVAL = 2000;

@Injectable()
export class StatusEffects {
  constructor(
    private readonly actions$: Actions,
    private readonly store: Store,
    private readonly batteryService: BatteryService
  ) {}

  getStatus$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromActions.getBatteryStatus),
      exhaustMap(() =>
        this.batteryService.getStatus().pipe(
          map((status) => fromActions.getBatteryStatusSuccess({ status })),
          catchError((error) =>
            of(fromActions.getBatteryStatusFailed({ error }))
          )
        )
      )
    )
  );

  getStatusPolling$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(fromPlatform.platformReady),
      switchMap(() =>
        interval(POLLING_INTERVAL).pipe(
          takeUntil(this.actions$.pipe(ofType(fromPlatform.platformStop))),
          map(() => fromActions.getBatteryStatus())
        )
      )
    );
  });
}
