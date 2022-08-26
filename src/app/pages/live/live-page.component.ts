import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromDevices from '../../store/devices';
import * as fromLatestData from '../../store/latest-data';
import * as fromPowerMeter from '../../store/power-meter';
import * as fromStatus from '../../store/status';
import { LivePageFacade } from './live-page.facade';

@Component({
  selector: 'app-live',
  templateUrl: 'live-page.component.html',
  styleUrls: ['live-page.component.scss'],
  providers: [LivePageFacade],
})
export class LivePage {
  device$ = this.store.select(fromDevices.selectActiveDevice);
  latestData$ = this.store.select(fromLatestData.selectLatestData);
  powerMeter$ = this.store.select(fromPowerMeter.selectPowerMeter);
  status$ = this.store.select(fromStatus.selectStatus);

  solarCapacity$ = this.store.select(fromDevices.selectActiveDevicePanelCapacity);
  solarProduction$ = this.store.select(fromStatus.selectSolarProduction);
  solarUtilization$ = this.store.select(fromStatus.selectSolarUtilization);
  solarToBattery$ = this.store.select(fromStatus.selectSolarToBattery);
  solarToInverter$ = this.store.select(fromStatus.selectSolarToInverter);

  batteryCharge$ = this.store.select(fromStatus.selectBatteryChargePercent);
  batteryCharging$ = this.store.select(fromStatus.selectBatteryCharging);
  batteryChargingTime$ = this.store.select(fromStatus.selectBatteryChargingTime);
  batteryDischarging$ = this.store.select(fromStatus.selectBatteryDischarging);
  batteryDischargingTime$ = this.store.select(fromStatus.selectBatteryDischargingTime);
  batteryUtilization$ = this.store.select(fromStatus.selectBatteryUtilization);
  batteryRemaining$ = this.store.select(fromStatus.selectBatteryRemaining);
  batteryUsage$ = this.store.select(fromStatus.selectBatteryUsage);
  batteryToInverter$ = this.store.select(fromStatus.selectBatteryToInverter);

  houseConsumption$ = this.store.select(fromStatus.selectHouseConsumption);

  inverterUsage$ = this.store.select(fromStatus.selectInverterCurrentPower);
  inverterUtilization$ = this.store.select(fromStatus.selectInverterUtilization);
  inverterToBattery$ = this.store.select(fromStatus.selectInverterToBattery);
  inverterToHouse$ = this.store.select(fromStatus.selectInverterToHouse);
  inverterToGrid$ = this.store.select(fromStatus.selectInverterToGrid);

  gridFeedIn$ = this.store.select(fromStatus.selectGridFeedIn);
  gridToHouse$ = this.store.select(fromStatus.selectGridToHouse);

  constructor(private readonly store: Store, readonly facade: LivePageFacade) {}

  findDevices() {
    this.store.dispatch(fromDevices.findDevices({ stopAfterFind: true }));
  }

  getInverterMaxPower() {
    this.store.dispatch(fromDevices.getInverterMaxPower());
  }

  getBatteryQuantity() {
    this.store.dispatch(fromDevices.getBatteryQuantity());
  }

  getBatteryModuleCapacity() {
    this.store.dispatch(fromDevices.getBatteryModuleCapacity());
  }

  setToken() {
    this.store.dispatch(fromDevices.setToken({ apiToken: '5cb9e400-dac7-4211-942d-c03eeaaed186' }));
  }

  setPanelCapacity(panelCapacity: number) {
    this.store.dispatch(fromDevices.setPanelCapacity({ panelCapacity }));
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
