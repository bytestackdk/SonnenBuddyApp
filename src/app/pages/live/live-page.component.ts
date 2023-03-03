import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { StatusSelectors } from '../../store/status';
import { LivePageFacade } from './live-page.facade';
import { SonnenBatterieActions, SonnenBatterieSelectors } from '../../store/sonnen-batterie';
import { InputSelectors } from 'src/app/store/input';
import { map } from 'rxjs/operators';
import { combineLatest } from 'rxjs';

@Component({
  selector: 'app-live',
  templateUrl: 'live-page.component.html',
  styleUrls: ['live-page.component.scss'],
  providers: [LivePageFacade],
})
export class LivePage {
  // device$ = this.store.select(fromSonnenBatterie.selectActiveDevice);
  // latestData$ = this.store.select(fromLatestData.selectLatestData);
  // powerMeter$ = this.store.select(fromPowerMeter.selectPowerMeter);
  // status$ = this.store.select(fromStatus.selectStatus);

  solarMaxPower$ = this.store.select(InputSelectors.selectSolarMaxPower);
  solarProduction$ = this.store.select(StatusSelectors.selectSolarProduction);
  solarUtilization$ = this.store.select(StatusSelectors.selectSolarUtilization);
  solarToBattery$ = this.store.select(StatusSelectors.selectSolarToBattery);
  solarToInverter$ = this.store.select(StatusSelectors.selectSolarToInverter);

  batteryCharge$ = this.store.select(StatusSelectors.selectBatteryChargePercent);
  batteryCharging$ = this.store.select(StatusSelectors.selectBatteryCharging);
  batteryChargingTime$ = this.store.select(StatusSelectors.selectBatteryChargingTime);
  batteryDischarging$ = this.store.select(StatusSelectors.selectBatteryDischarging);
  batteryDischargingTime$ = this.store.select(StatusSelectors.selectBatteryDischargingTime);
  batteryUtilization$ = this.store.select(StatusSelectors.selectBatteryUtilization);
  batteryRemaining$ = this.store.select(StatusSelectors.selectBatteryRemaining);
  batteryUsage$ = this.store.select(StatusSelectors.selectBatteryUsage);
  batteryToInverter$ = this.store.select(StatusSelectors.selectBatteryToInverter);

  houseConsumption$ = this.store.select(StatusSelectors.selectHouseConsumption);

  inverterUsage$ = this.store.select(StatusSelectors.selectInverterCurrentPower);
  inverterUtilization$ = this.store.select(StatusSelectors.selectInverterUtilization);
  inverterToBattery$ = this.store.select(StatusSelectors.selectInverterToBattery);
  inverterToHome$ = this.store.select(StatusSelectors.selectInverterToHome);
  inverterToGrid$ = this.store.select(StatusSelectors.selectInverterToGrid);

  gridFeedIn$ = this.store.select(StatusSelectors.selectGridFeedIn);
  gridToHome$ = this.store.select(StatusSelectors.selectGridToHome);

  updated$ = this.store.select(StatusSelectors.selectTimestamp);
  delayed$ = this.store.select(StatusSelectors.selectDelayed);
  delayColor$ = this.store
    .select(StatusSelectors.selectDelayed)
    .pipe(map((delayed) => (delayed ? 'warning' : 'success')));
  delayIcon$ = this.store
    .select(StatusSelectors.selectDelayed)
    .pipe(map((delayed) => (delayed ? 'alert-circle-outline' : 'checkmark-circle-outline')));
  delayText$ = combineLatest([
    this.store.select(StatusSelectors.selectDelayed),
    this.store.select(StatusSelectors.selectDelayInSeconds),
  ]).pipe(
    map(([delayed, seconds]) => {
      if (delayed) {
        return seconds < 60 ? `${seconds}s` : '> 1 min';
      }
      return 'None';
    })
  );

  device$ = this.store.select(SonnenBatterieSelectors.selectDevice);

  constructor(private readonly store: Store, readonly facade: LivePageFacade) {}

  ionViewWillEnter() {
    this.store.dispatch(SonnenBatterieActions.refreshConfigurations());
  }

  // findDevices() {
  //   this.store.dispatch(fromSonnenBatterie.findDevices({ stopAfterFind: true }));
  // }
  //
  // getInverterMaxPower() {
  //   this.store.dispatch(fromSonnenBatterie.getInverterMaxPower());
  // }
  //
  // getBatteryQuantity() {
  //   this.store.dispatch(fromSonnenBatterie.getBatteryQuantity());
  // }
  //
  // getBatteryModuleCapacity() {
  //   this.store.dispatch(fromSonnenBatterie.getBatteryModuleCapacity());
  // }
  //
  // setToken() {
  //   this.store.dispatch(fromSonnenBatterie.setToken({ apiToken: '5cb9e400-dac7-4211-942d-c03eeaaed186' }));
  // }
  //
  // setPanelCapacity(panelCapacity: number) {
  //   this.store.dispatch(fromSonnenBatterie.setPanelCapacity({ panelCapacity }));
  // }
  //
  // getStatus() {
  //   this.store.dispatch(fromStatus.getBatteryStatus());
  // }
  //
  // getLatestData() {
  //   this.store.dispatch(fromLatestData.getLatestData());
  // }
  //
  // getPowerMeter() {
  //   this.store.dispatch(fromPowerMeter.getPowerMeter());
  // }
}
