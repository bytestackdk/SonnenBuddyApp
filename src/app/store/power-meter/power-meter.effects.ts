import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { BatteryService } from '../../api/services/battery.service';
import { PowerMeterActions } from './power-meter.actions';
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
      ofType(PowerMeterActions.getPowerMeter),
      exhaustMap(() =>
        this.batteryService.getPowerMeter().pipe(
          map((powerMeter) => PowerMeterActions.getPowerMeterSuccess({ powerMeter })),
          catchError((error) => of(PowerMeterActions.getPowerMeterFailed({ error })))
        )
      )
    )
  );
}
