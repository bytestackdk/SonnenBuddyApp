import { Component, OnInit } from '@angular/core';
import { WizardPageStore } from './schedule-page.store';
import { OperatingMode } from '../../api/models/battery.model';
import * as fromSonnenBatterie from '../../store/sonnen-batterie';
import { Store } from '@ngrx/store';
import { TimespanChangeEvent } from '../../shared/components/timespan/timespan.component.store';

@Component({
  selector: 'app-schedule',
  templateUrl: 'schedule-page.component.html',
  styleUrls: ['schedule-page.component.scss'],
  providers: [WizardPageStore],
})
export class SchedulePage implements OnInit {
  OperatingMode = OperatingMode;

  start: string;
  stop: string;

  constructor(private readonly store: Store, private readonly componentStore: WizardPageStore) {}

  ngOnInit() {
    console.log('TODO: Read Operation Mode to determine if we can set a schedule - Must be TimeOfUse');
    this.componentStore.load();
  }

  ionViewWillEnter() {
    this.store.dispatch(fromSonnenBatterie.refreshConfigurations());
  }

  timespanChange(e: TimespanChangeEvent) {
    this.start = e.start;
    this.stop = e.stop;
  }

  removeEvent(someId: any) {}

  disableEvent(someId: any) {}
}
