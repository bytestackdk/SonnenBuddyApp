import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromPlatform from '../../store/platform';

@Component({
  selector: 'app-settings',
  templateUrl: 'settings-page.component.html',
  styleUrls: ['settings-page.component.scss'],
})
export class SettingsPage {
  constructor(private readonly store: Store) {}

  resetApp() {
    this.store.dispatch(fromPlatform.resetApp());
  }
}
