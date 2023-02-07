import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { PlatformActions } from '../../store/platform';
import { SettingsPageStore } from './settings-page.store';
import { ConfigurationKey, OperatingMode } from '../../api/models/battery.model';
import { SonnenBatterieActions } from '../../store/sonnen-batterie';
import { InputActions } from '../../store/input/input.actions';
import { Platform, ToggleChangeEventDetail } from '@ionic/angular';

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

  presentingElement = null;

  constructor(
    private readonly store: Store,
    readonly componentStore: SettingsPageStore,
    private readonly platform: Platform
  ) {}

  ngOnInit() {
    this.presentingElement = document.querySelector('.ion-content');
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

  setDarkMode(e: CustomEvent<ToggleChangeEventDetail>) {
    this.store.dispatch(InputActions.setDarkMode({ enabled: e.detail.checked }));
  }

  setPrognosisCharging(e: CustomEvent<ToggleChangeEventDetail>) {
    this.store.dispatch(
      SonnenBatterieActions.setConfiguration({
        key: ConfigurationKey.EM_Prognosis_Charging,
        configuration: e.detail.checked ? '1' : '0',
      })
    );
  }

  runWizard() {
    this.store.dispatch(PlatformActions.runWizard());

    if (!this.platform.url().startsWith('http')) {
      // When running on device also clear all input
      this.store.dispatch(InputActions.clearInput());
    }
  }
}
