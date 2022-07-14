import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import * as fromDevices from '../devices/devices.actions';
import * as fromStatus from '../status/status.actions';
import { tap } from 'rxjs/operators';
import { ToastController } from '@ionic/angular';

@Injectable()
export class ToastEffects {
  constructor(
    private readonly actions$: Actions,
    private readonly store: Store,
    private readonly toastController: ToastController
  ) {}

  showToast$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(fromDevices.findDevicesFailed, fromStatus.getBatteryStatusFailed),
        tap(async ({ error }) => {
          const toast = await this.toastController.create({
            message: 'Error: ' + error.message + `(${JSON.stringify(error.error)})`,
            duration: 5000,
          });
          toast.present();
        })
      );
    },
    { dispatch: false }
  );
}
