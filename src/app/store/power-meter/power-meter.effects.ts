import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { BatteryService } from '../../api/services/battery.service';
import * as fromActions from './power-meter.actions';
import { catchError, exhaustMap, map } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable()
export class PowerMeterEffects {
  constructor(
    private readonly actions$: Actions,
    private readonly store: Store,
    private readonly batteryService: BatteryService
  ) {}

  getPowerMeter$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromActions.getPowerMeter),
      exhaustMap(() =>
        this.batteryService.getPowerMeter().pipe(
          map((powerMeter) => fromActions.getPowerMeterSuccess({ powerMeter })),
          catchError((error) => of(fromActions.getPowerMeterFailed({ error })))
        )
      )
    )
  );
}
