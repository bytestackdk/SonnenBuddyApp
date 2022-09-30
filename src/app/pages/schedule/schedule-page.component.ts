import { Component, OnInit } from '@angular/core';
import { SchedulePageStore } from './schedule-page.store';
import { ISchedule, OperatingMode } from '../../api/models/battery.model';
import * as fromSonnenBatterie from '../../store/sonnen-batterie';
import { Store } from '@ngrx/store';
import { TimespanChangeEvent } from '../../shared/components/timespan/timespan.component.store';

@Component({
  selector: 'app-schedule',
  templateUrl: 'schedule-page.component.html',
  styleUrls: ['schedule-page.component.scss'],
  providers: [SchedulePageStore],
})
export class SchedulePage implements OnInit {
  OperatingMode = OperatingMode;

  start: string;
  stop: string;
  threshold: string;
  new = false;
  unchanged = true;

  constructor(private readonly store: Store, public readonly componentStore: SchedulePageStore) {}

  ngOnInit() {
    this.componentStore.load();
  }

  ionViewWillEnter() {
    this.store.dispatch(fromSonnenBatterie.refreshConfigurations());
  }

  timespanChange(e: TimespanChangeEvent) {
    // TODO: Validate there's no overlap with existing schedules
    const { start, stop } = e;
    this.componentStore.updateTimespan({ start, stop });
  }

  thresholdChange(e: CustomEvent) {
    this.threshold = e.detail.value;
    this.componentStore.updateThreshold(parseInt(this.threshold, 10));
  }

  addClick() {
    // TODO: Don't start with something that's not valid
    this.start = '01:00';
    this.stop = '05:00';
    this.threshold = '2000';

    const schedule: ISchedule = {
      start: this.start,
      stop: this.stop,
      threshold_p_max: parseInt(this.threshold, 10),
    };

    this.componentStore.add(schedule);
  }

  editClick(schedule: ISchedule) {
    this.start = schedule.start;
    this.stop = schedule.stop;
    this.threshold = schedule.threshold_p_max.toString();

    this.componentStore.edit(schedule);
  }

  save() {
    this.componentStore.save(this.start);
    this.componentStore.sync();
  }

  remove() {
    this.componentStore.remove();
    this.componentStore.sync();
  }

  clear() {
    this.componentStore.clear();
    this.componentStore.sync();
  }

  wattFormatter = (value: string) => {
    return value + 'W';
  };
}
