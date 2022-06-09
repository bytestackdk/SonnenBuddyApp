import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { BatteryService } from '../../api/services/battery.service';
import * as fromActions from './latest-data.actions';
import { catchError, exhaustMap, map } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable()
export class LatestDataEffects {
  constructor(
    private readonly actions$: Actions,
    private readonly store: Store,
    private readonly batteryService: BatteryService
  ) {}

  getLatestData$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromActions.getLatestData),
      exhaustMap(() =>
        this.batteryService.getLatestData().pipe(
          map((data) => fromActions.getLatestDataSuccess({ data })),
          catchError((error) => of(fromActions.getLatestDataFailed({ error })))
        )
      )
    )
  );
}
