import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromDevices from './store/devices';
import { Platform } from '@ionic/angular';
import * as fromPlatform from './store/platform';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  constructor(
    private readonly store: Store,
    private readonly platform: Platform
  ) {}

  ngOnInit() {
    this.platform
      .ready()
      .then(() => this.store.dispatch(fromPlatform.platformReady()));
  }

  ngOnDestroy() {
    this.store.dispatch(fromPlatform.platformStop());
  }
}
