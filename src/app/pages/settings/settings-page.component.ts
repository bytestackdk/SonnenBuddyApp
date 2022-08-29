import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromPlatform from '../../store/platform';
import * as fromSonnenBatterie from '../../store/sonnen-batterie';
import { SettingsPageStore } from './settings-page.store';
import { ConfigurationKey, OperatingMode } from '../../api/models/battery.model';

@Component({
  selector: 'app-settings',
  templateUrl: 'settings-page.component.html',
  styleUrls: ['settings-page.component.scss'],
  providers: [SettingsPageStore],
})
export class SettingsPage implements OnInit {
  operatingModes = [
    OperatingMode.TimeOfUse,
    OperatingMode.SelfConsumption,
    OperatingMode.BatteryModuleExtension,
    OperatingMode.Manual,
  ];

  OperatingMode = OperatingMode;

  constructor(private readonly store: Store, private readonly componentStore: SettingsPageStore) {}

  ngOnInit() {
    console.log('TODO: Read configuration from API');
  }

  ionViewWillEnter() {
    // Silently get current operating mode
    this.store.dispatch(fromSonnenBatterie.getConfiguration({ key: ConfigurationKey.EM_OperatingMode }));
  }

  toggleOperatingModeModal(show: boolean) {
    this.componentStore.toggleOperatingModeModal(show);
  }

  setOperatingMode(operatingMode: OperatingMode) {
    this.componentStore.toggleOperatingModeModal(false);

    this.store.dispatch(
      fromSonnenBatterie.setConfiguration({ key: ConfigurationKey.EM_OperatingMode, configuration: operatingMode })
    );
  }

  resetApp() {
    this.store.dispatch(fromPlatform.resetApp());
  }
}
