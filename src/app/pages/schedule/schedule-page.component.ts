import { Component, OnInit } from '@angular/core';
import { WizardPageStore } from './schedule-page.store';
import { ConfigurationKey, OperatingMode } from '../../api/models/battery.model';
import * as fromSonnenBatterie from '../../store/sonnen-batterie';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-schedule',
  templateUrl: 'schedule-page.component.html',
  styleUrls: ['schedule-page.component.scss'],
  providers: [WizardPageStore],
})
export class SchedulePage implements OnInit {
  OperatingMode = OperatingMode;

  constructor(private readonly store: Store, private readonly componentStore: WizardPageStore) {}

  ngOnInit() {
    console.log('TODO: Read Operation Mode to determine if we can set a schedule - Must be TimeOfUse');
    this.componentStore.load();
  }

  ionViewWillEnter() {
    // Silently get current operating mode
    this.store.dispatch(fromSonnenBatterie.getConfiguration({ key: ConfigurationKey.EM_OperatingMode }));
  }

  removeEvent(someId: any) {}

  disableEvent(someId: any) {}
}
