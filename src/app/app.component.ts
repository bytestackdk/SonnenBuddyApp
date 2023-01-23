import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Platform } from '@ionic/angular';
import { PlatformActions } from './store/platform';
import { ScreenOrientation } from '@awesome-cordova-plugins/screen-orientation/ngx';
import { PreferencesSelectors } from './store/preferences';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  constructor(
    private readonly store: Store,
    private readonly screenOrientation: ScreenOrientation,
    private readonly platform: Platform
  ) {}

  ngOnInit() {
    this.platform.ready().then(() => {
      if (!this.platform.url().startsWith('http')) {
        this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);
      }

      this.store.select(PreferencesSelectors.selectDarkMode).subscribe((enabled) => {
        document.body.classList.toggle('dark', enabled);
      });

      this.store.dispatch(PlatformActions.platformReady());
    });
  }

  ngOnDestroy() {
    this.store.dispatch(PlatformActions.platformStop());
  }
}
