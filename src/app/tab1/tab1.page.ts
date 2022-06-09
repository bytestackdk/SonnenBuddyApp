import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromDevices from '../store/devices';
import * as fromLatestData from '../store/latest-data';
import * as fromStatus from '../store/status';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
})
export class Tab1Page {
  device$ = this.store.select(fromDevices.selectCurrentDevice);
  latestData$ = this.store.select(fromLatestData.selectLatestData);
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

  getLatestData() {
    this.store.dispatch(fromLatestData.getLatestData());
  }
}
