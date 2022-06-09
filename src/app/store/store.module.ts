import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { NgModule } from '@angular/core';
import { environment } from '../../environments/environment';
import { metaReducers, reducers } from './index';
import { DevicesEffects } from './devices/devices.effects';
import { StatusEffects } from './status/status.effects';
import { LatestDataEffects } from './latest-data/latest-data.effects';
import { PowerMeterEffects } from './power-meter/power-meter.effects';
import { ToastEffects } from './toast/toast.effects';

@NgModule({
  imports: [
    StoreModule.forRoot(reducers, {
      metaReducers,
      runtimeChecks: {
        strictStateImmutability: true,
        strictActionImmutability: true,
      },
    }),
    !environment.production ? StoreDevtoolsModule.instrument() : [],
    EffectsModule.forRoot([
      DevicesEffects,
      LatestDataEffects,
      PowerMeterEffects,
      StatusEffects,
      ToastEffects,
    ]),
  ],
})
export class AppStoreModule {}
