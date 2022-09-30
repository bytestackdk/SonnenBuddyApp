import { Injectable } from '@angular/core';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { ISchedule, ITimespan, OperatingMode } from '../../api/models/battery.model';
import { Store } from '@ngrx/store';
import { BatteryService } from '../../api/services/battery.service';
import { switchMap, tap } from 'rxjs/operators';
import { forkJoin } from 'rxjs';

export interface IScheduleState {
  schedules: ISchedule[];
  operatingMode: OperatingMode;
  loading: boolean;
  error: any;
  showScheduleModal?: boolean;
  schedule?: ISchedule;
  unchanged?: boolean;
  new?: boolean;
}

export const initialState: IScheduleState = {
  schedules: null,
  operatingMode: null,
  loading: false,
  error: null,
  showScheduleModal: false,
  schedule: null,
  unchanged: true,
  new: true,
};

@Injectable()
export class SchedulePageStore extends ComponentStore<IScheduleState> {
  readonly operatingMode$ = this.select((state) => state.operatingMode);
  readonly schedules$ = this.select((state) => state.schedules);
  readonly schedule$ = this.select((state) => state.schedule);
  readonly unchanged$ = this.select((state) => state.unchanged);
  readonly new$ = this.select((state) => state.new);
  readonly scheduleStart$ = this.select(this.schedule$, (schedule) => schedule?.start || '01:00');
  readonly scheduleStop$ = this.select(this.schedule$, (schedule) => schedule?.stop || '05:00');
  readonly scheduleThreshold$ = this.select(this.schedule$, (schedule) => schedule?.threshold_p_max || 0);
  readonly scheduleDisabled$ = this.select(
    this.operatingMode$,
    (operatingMode) => operatingMode !== OperatingMode.TimeOfUse
  );
  readonly loading$ = this.select((state) => state.loading);
  readonly error$ = this.select((state) => state.error);
  readonly showScheduleModal$ = this.select((state) => state.showScheduleModal);

  constructor(private readonly store: Store, private readonly batteryService: BatteryService) {
    super({ ...initialState });
  }

  readonly load = this.effect((trigger$) => {
    return trigger$.pipe(
      tap(() => this.patchState({ operatingMode: null, loading: true, error: null })),
      switchMap(() =>
        forkJoin([this.batteryService.getOperatingMode(), this.batteryService.getSchedule()]).pipe(
          tapResponse(
            // TODO: Join schedules that crosses 24:00
            ([operatingMode, schedules]) => this.patchState({ operatingMode, schedules, loading: false }),
            (error) => this.patchState({ error, loading: false })
          )
        )
      )
    );
  });

  readonly sync = this.effect((trigger$) => {
    return trigger$.pipe(
      tap(() => this.patchState({ loading: true, error: null })),
      switchMap(() => {
        const { schedules } = this.get();

        // TODO: Join schedules that crosses 24:00
        return this.batteryService.setSchedule(schedules).pipe(
          tapResponse(
            () => this.patchState({ loading: false }),
            (error) => this.patchState({ error, loading: false })
          )
        );
      })
    );
  });

  readonly add = this.updater((state, schedule: ISchedule) => {
    return {
      ...state,
      showScheduleModal: true,
      unchanged: false,
      new: true,
      schedule,
    };
  });

  readonly edit = this.updater((state, schedule: ISchedule) => {
    return {
      ...state,
      showScheduleModal: true,
      unchanged: true,
      new: false,
      schedule,
    };
  });

  readonly updateTimespan = this.updater((state, timespan: ITimespan) => {
    const { start, stop } = timespan;
    return {
      ...state,
      unchanged: false,
      schedule: { ...state.schedule, start, stop },
    };
  });

  readonly updateThreshold = this.updater((state, threshold: number) => {
    return {
      ...state,
      unchanged: false,
      schedule: { ...state.schedule, threshold_p_max: threshold },
    };
  });

  readonly remove = this.updater((state) => {
    return {
      ...state,
      showScheduleModal: false,
      schedules: [...state.schedules.filter((s) => s.start !== state.schedule.start)],
      schedule: null,
    };
  });

  readonly clear = this.updater((state) => {
    return {
      ...state,
      schedules: [],
    };
  });

  readonly save = this.updater((state, initialStart: string) => {
    let schedule = state.schedule;

    if (!state.new) {
      // Find existing schedule
      schedule = state.schedules.find((s) => s.start === initialStart);

      // Extract new values
      const { start, stop, threshold_p_max } = state.schedule;

      // Update existing schedule
      schedule.start = start;
      schedule.stop = stop;
      schedule.threshold_p_max = threshold_p_max;
    }

    const schedules = state.new ? [...state.schedules, schedule] : [...state.schedules];

    return {
      ...state,
      showScheduleModal: false,
      schedules,
      schedule: null,
    };
  });

  toggleScheduleModal(showScheduleModal: boolean) {
    this.patchState(() => ({ showScheduleModal, ...(!showScheduleModal && { schedule: null }) }));
  }
}
