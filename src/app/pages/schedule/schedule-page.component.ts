import { Component, OnInit } from '@angular/core';
import { WizardPageStore } from './schedule-page.store';
import { OperatingMode } from '../../api/models/battery.model';

@Component({
  selector: 'app-schedule',
  templateUrl: 'schedule-page.component.html',
  styleUrls: ['schedule-page.component.scss'],
  providers: [WizardPageStore],
})
export class SchedulePage implements OnInit {
  OperatingMode = OperatingMode;

  constructor(private readonly componentStore: WizardPageStore) {}

  ngOnInit() {
    console.log('TODO: Read Operation Mode to determine if we can set a schedule - Must be TimeOfUse');
    this.componentStore.load();
  }

  removeEvent(someId: any) {}

  disableEvent(someId: any) {}
}
