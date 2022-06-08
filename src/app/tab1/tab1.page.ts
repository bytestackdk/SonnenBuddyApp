import { Component } from '@angular/core';
import { selectDevices } from '../store/devices/devices.selectors';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
})
export class Tab1Page {
  devices$ = this.store.select(selectDevices);

  constructor(private readonly store: Store) {}
}
