import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { ISchedule, ITimespan, OperatingMode } from '../../api/models/battery.model';
import { Store } from '@ngrx/store';
import { SonnenBatterieActions, SonnenBatterieSelectors } from './../../store/sonnen-batterie';

export interface IScheduleState {
  showModal?: boolean;
  unchanged?: boolean;
  edit?: boolean;
  initialStart?: string;
  schedule?: ISchedule;
}

export const initialState: IScheduleState = {
  showModal: false,
  unchanged: true,
  edit: true,
  initialStart: null,
  schedule: null,
};

@Injectable()
export class SchedulePageStore extends ComponentStore<IScheduleState> {
  // From global store
  readonly operatingMode$ = this.select(
    this.store.select(SonnenBatterieSelectors.selectSonnenBatterieOperatingMode),
    (mode) => mode
  );
  readonly schedules$ = this.select(
    this.store.select(SonnenBatterieSelectors.selectSonnenBatterieSchedules),
    (schedules) => schedules
  );

  // Local selectors
  readonly schedule$ = this.select((state) => state.schedule);
  readonly unchanged$ = this.select((state) => state.unchanged);
  readonly edit$ = this.select((state) => state.edit);
  readonly scheduleStart$ = this.select(this.schedule$, (schedule) => schedule?.start || '01:00');
  readonly scheduleStop$ = this.select(this.schedule$, (schedule) => schedule?.stop || '05:00');
  readonly scheduleThreshold$ = this.select(this.schedule$, (schedule) => schedule?.threshold_p_max || 0);
  readonly scheduleDisabled$ = this.select(
    this.operatingMode$,
    (operatingMode) => operatingMode !== OperatingMode.TimeOfUse
  );
  readonly scheduleEnabled$ = this.select(
    this.operatingMode$,
    (operatingMode) => operatingMode === OperatingMode.TimeOfUse
  );
  readonly showModal$ = this.select((state) => state.showModal);

  constructor(private readonly store: Store) {
    super({ ...initialState });
  }

  readonly showAddModal = this.updater((state, schedule: ISchedule) => {
    return {
      ...state,
      showModal: true,
      unchanged: false,
      edit: false,
      initialStart: schedule.start,
      schedule,
    };
  });

  readonly showEditModal = this.updater((state, schedule: ISchedule) => {
    return {
      ...state,
      showModal: true,
      unchanged: true,
      edit: true,
      initialStart: schedule.start,
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

  remove() {
    this.store.dispatch(SonnenBatterieActions.removeSchedule({ start: this.get().initialStart }));
    this.patchState({ showModal: false });
  }

  clear() {
    this.store.dispatch(SonnenBatterieActions.clearSchedules());
  }

  save() {
    const { initialStart, edit, schedule } = this.get();
    const { start, stop } = schedule;

    if (stop === '24:00') {
      // stop can't be 00:00 when start is the same, so need this workaround
      schedule.stop = start === '00:00' ? '23:59' : '00:00';
    }

    if (edit) {
      this.store.dispatch(SonnenBatterieActions.updateSchedule({ start: initialStart, schedule }));
    } else {
      this.store.dispatch(SonnenBatterieActions.addSchedule({ schedule }));
    }

    this.patchState({ showModal: false });
  }

  toggleModal(showModal: boolean) {
    this.patchState(() => ({ showModal, ...(!showModal && { schedule: null }) }));
  }
}
