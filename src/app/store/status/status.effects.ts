import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { BatteryService } from '../../api/services/battery.service';
import { StatusActions } from './status.actions';
import { PlatformActions } from '../platform';
import { catchError, exhaustMap, map, startWith, switchMap, takeUntil } from 'rxjs/operators';
import { interval, of } from 'rxjs';

const UPDATED_POLLING_INTERVAL = 2000;
const STATUS_POLLING_INTERVAL = 2000;

@Injectable()
export class StatusEffects {
  constructor(
    private readonly actions$: Actions,
    private readonly store: Store,
    private readonly batteryService: BatteryService
  ) {}

  getStatus$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(StatusActions.getStatus),
      exhaustMap(() =>
        this.batteryService.getStatus().pipe(
          map((status) => StatusActions.getStatusSuccess({ status })),
          catchError((error) => of(StatusActions.getStatusFailed({ error })))
        )
      )
    );
  });

  clearStatus$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(PlatformActions.runWizard),
      map(() => StatusActions.clearStatus())
    );
  });

  stopPollingWhenGoingToWizard$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(PlatformActions.gotoWizard),
      map(() => StatusActions.stopStatusPolling())
    );
  });

  startPolling$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(PlatformActions.gotoLivePage),
      map(() => StatusActions.startStatusPolling())
    );
  });

  refreshUpdated$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(PlatformActions.ready, PlatformActions.resume),
      switchMap(() =>
        interval(UPDATED_POLLING_INTERVAL).pipe(
          startWith(0),
          takeUntil(this.actions$.pipe(ofType(PlatformActions.pause, PlatformActions.stop))),
          map(() => StatusActions.refreshUpdated())
        )
      )
    );
  });

  statusPolling$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(StatusActions.startStatusPolling),
      switchMap(() =>
        interval(STATUS_POLLING_INTERVAL).pipe(
          startWith(0),
          takeUntil(this.actions$.pipe(ofType(StatusActions.stopStatusPolling))),
          map(() => StatusActions.getStatus())
        )
      )
    );
  });
}
