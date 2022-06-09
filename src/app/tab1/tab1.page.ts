import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromStatus from '../store/status';
import * as fromDevices from '../store/devices';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
})
export class Tab1Page {
  device$ = this.store.select(fromDevices.selectCurrentDevice);
  status$ = this.store.select(fromStatus.selectStatus);

  constructor(private readonly store: Store) {}

  findDevices() {
    this.store.dispatch(fromDevices.findDevices());
  }

  setToken() {
    this.store.dispatch(
      fromDevices.setToken({ apiToken: '5cb9e400-dac7-4211-942d-c03eeaaed186' })
    );
  }

  getStatus() {
    this.store.dispatch(fromStatus.getBatteryStatus());
  }
}
