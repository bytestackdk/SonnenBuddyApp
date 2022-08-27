import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromPlatform from '../../store/platform';

@Component({
  selector: 'app-settings',
  templateUrl: 'settings-page.component.html',
  styleUrls: ['settings-page.component.scss'],
})
export class SettingsPage implements OnInit {
  constructor(private readonly store: Store) {}

  ngOnInit() {
    console.log('TODO: Read configuration from API');
  }

  resetApp() {
    this.store.dispatch(fromPlatform.resetApp());
  }
}
