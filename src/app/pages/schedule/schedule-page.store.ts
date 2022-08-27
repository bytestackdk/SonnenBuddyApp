import { Injectable } from '@angular/core';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { OperatingMode } from '../../api/models/battery.model';
import { Store } from '@ngrx/store';
import { BatteryService } from '../../api/services/battery.service';
import { switchMap, tap } from 'rxjs/operators';

export interface IScheduleState {
  operatingMode: OperatingMode;
  loading: boolean;
  error: any;
}

export const initialState: IScheduleState = {
  operatingMode: null,
  loading: false,
  error: null,
};

@Injectable()
export class WizardPageStore extends ComponentStore<IScheduleState> {
  readonly operatingMode$ = this.select((state) => state.operatingMode);
  readonly scheduleDisabled$ = this.select(
    this.operatingMode$,
    (operatingMode) => operatingMode !== OperatingMode.TimeOfUse
  );
  readonly loading$ = this.select((state) => state.loading);
  readonly error$ = this.select((state) => state.error);

  constructor(private readonly store: Store, private readonly batteryService: BatteryService) {
    super({ ...initialState });
  }

  readonly load = this.effect((trigger$) => {
    return trigger$.pipe(
      tap(() => this.patchState({ operatingMode: null, loading: true, error: null })),
      switchMap(() =>
        this.batteryService.getOperatingMode().pipe(
          tapResponse(
            (operatingMode) => this.patchState({ operatingMode, loading: false }),
            (error) => this.patchState({ error, loading: false })
          )
        )
      )
    );
  });
}
