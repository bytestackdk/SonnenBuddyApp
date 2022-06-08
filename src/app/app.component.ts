import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromDevices from './store/devices';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(private readonly store: Store) {
    this.store.dispatch(fromDevices.findDevices());
  }
}
