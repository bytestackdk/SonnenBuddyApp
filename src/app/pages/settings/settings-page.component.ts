import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { PlatformActions } from '../../store/platform';
import { SettingsPageStore } from './settings-page.store';
import { ConfigurationKey, OperatingMode } from '../../api/models/battery.model';
import { SonnenBatterieActions } from '../../store/sonnen-batterie';

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

  constructor(private readonly store: Store, readonly componentStore: SettingsPageStore) {}

  ngOnInit() {
    console.log('TODO: Read configuration from API');
  }

  ionViewWillEnter() {
    this.store.dispatch(SonnenBatterieActions.refreshConfigurations());
  }

  toggleOperatingModeModal(show: boolean) {
    this.componentStore.toggleOperatingModeModal(show);
  }

  setOperatingMode(operatingMode: OperatingMode) {
    this.componentStore.toggleOperatingModeModal(false);

    this.store.dispatch(
      SonnenBatterieActions.setConfiguration({ key: ConfigurationKey.EM_OperatingMode, configuration: operatingMode })
    );
  }

  resetApp() {
    this.store.dispatch(PlatformActions.resetApp());
  }
}
