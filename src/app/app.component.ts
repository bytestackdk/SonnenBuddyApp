import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Platform } from '@ionic/angular';
import { PlatformActions } from './store/platform';
import { ScreenOrientation } from '@awesome-cordova-plugins/screen-orientation/ngx';
import { InputSelectors } from './store/input';
import { Network } from '@capacitor/network';
import { SubSink } from 'subsink';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  private readonly subs = new SubSink();

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

        Network.getStatus().then((status) => this.store.dispatch(PlatformActions.wifiConnectionChange({ status })));
        Network.addListener('networkStatusChange', (status) =>
          this.store.dispatch(PlatformActions.wifiConnectionChange({ status }))
        );
      }

      this.subs.add(
        this.store.select(InputSelectors.selectDarkMode).subscribe((enabled) => {
          document.body.classList.toggle('dark', enabled);
        })
      );

      // READY (DOM ready when not running on native)
      this.store.dispatch(PlatformActions.ready());
    });

    this.subs.add(
      // PAUSE (Only on native)
      this.platform.pause.subscribe(() => {
        this.store.dispatch(PlatformActions.pause());
      }),

      // RESUME (Only on native)
      this.platform.resume.subscribe(() => {
        // Wizard doesn't need resume action as all are disabled there anyway
        if (!this.platform.url().includes('wizard')) {
          this.zone.run(() => this.store.dispatch(PlatformActions.resume()));
        }
      })
    );
  }

  ngOnDestroy() {
    // STOP
    this.store.dispatch(PlatformActions.stop());
    this.subs.unsubscribe();
    Network.removeAllListeners();
  }
}
