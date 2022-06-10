import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromDevices from '../store/devices';
import * as fromLatestData from '../store/latest-data';
import * as fromPowerMeter from '../store/power-meter';
import * as fromStatus from '../store/status';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
})
export class Tab1Page {
  device$ = this.store.select(fromDevices.selectCurrentDevice);
  latestData$ = this.store.select(fromLatestData.selectLatestData);
  powerMeter$ = this.store.select(fromPowerMeter.selectPowerMeter);
  status$ = this.store.select(fromStatus.selectStatus);
  deviceError$ = this.store.select(fromDevices.selectDevicesError);
  statusError$ = this.store.select(fromStatus.selectStatusError);

  constructor(private readonly store: Store) {}

  findDevices() {
    this.store.dispatch(fromDevices.findDevices());
  }

  setToken() {
    this.store.dispatch(
      fromDevices.setToken({ apiToken: '5cb9e400-dac7-4211-942d-c03eeaaed186' })
    );
  }

  setDevice() {
    this.store.dispatch(
      fromDevices.findDevicesSuccess({
        devices: [
          {
            lanIp: '192.168.1.130',
            ca20: true,
            info: 'sonnenBatterie',
            serialNumber: 162099,
          },
        ],
      })
    );
  }

  getStatus() {
    this.store.dispatch(fromStatus.getBatteryStatus());
  }

  getLatestData() {
    this.store.dispatch(fromLatestData.getLatestData());
  }

  getPowerMeter() {
    this.store.dispatch(fromPowerMeter.getPowerMeter());
  }
}
