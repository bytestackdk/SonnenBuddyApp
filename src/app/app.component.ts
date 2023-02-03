import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Platform } from '@ionic/angular';
import { PlatformActions } from './store/platform';
import { ScreenOrientation } from '@awesome-cordova-plugins/screen-orientation/ngx';
import { InputSelectors } from './store/input';
import { StatusActions } from './store/status';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  constructor(
    private readonly store: Store,
    private readonly screenOrientation: ScreenOrientation,
    private readonly platform: Platform,
    private readonly zone: NgZone
  ) {}

  ngOnInit() {
    this.platform.ready().then(() => {
      if (!this.platform.url().startsWith('http')) {
        this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);
      }

      this.store.select(InputSelectors.selectDarkMode).subscribe((enabled) => {
        document.body.classList.toggle('dark', enabled);
      });

      this.store.dispatch(PlatformActions.platformReady());
    });

    this.platform.pause.subscribe(() => {
      this.store.dispatch(StatusActions.stopPolling());
    });

    this.platform.resume.subscribe(() => {
      // No polling when on wizard - It will start normally after wizard has finished
      if (!this.platform.url().includes('wizard')) {
        this.zone.run(() => this.store.dispatch(StatusActions.startPolling()));
      }
    });
  }

  ngOnDestroy() {
    this.store.dispatch(PlatformActions.platformStop());
  }
}
