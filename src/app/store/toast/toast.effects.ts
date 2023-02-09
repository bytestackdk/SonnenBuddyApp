import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { SonnenBatterieActions } from '../sonnen-batterie';
import { tap } from 'rxjs/operators';
import { ToastController } from '@ionic/angular';
import { HttpErrorResponse } from '@angular/common/http';
import { PlatformActions } from '../platform';

@Injectable()
export class ToastEffects {
  private wifiToast: HTMLIonToastElement = null;

  constructor(
    private readonly actions$: Actions,
    private readonly store: Store,
    private readonly toastController: ToastController
  ) {}

  showErrorToast$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(SonnenBatterieActions.setConfigurationFailed),
        tap(async ({ error }) => {
          const httpError = typeof error !== 'string' ? (error as HttpErrorResponse) : null;
          const message = httpError
            ? `Error: ${httpError.message} (${JSON.stringify(httpError.error)})`
            : (error as string);

          if (!this.wifiToast) {
            const toast = await this.toastController.create({ message, duration: 5000, position: 'bottom' });

            toast.present();
          }
        })
      );
    },
    { dispatch: false }
  );

  showWifiToast$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(PlatformActions.wifiConnectionChange),
        tap(async ({ status }) => {
          const { connected, connectionType } = status;

          if ((!connected || connectionType !== 'wifi') && !this.wifiToast) {
            this.wifiToast = await this.toastController.create({
              icon: 'warning',
              message: 'Wifi not connected',
              duration: 60000,
              position: 'top',
              color: 'warning',
            });

            this.wifiToast.present();
            this.wifiToast.onDidDismiss().then(() => (this.wifiToast = null));
          }

          if (this.wifiToast && connected && connectionType === 'wifi') {
            await this.wifiToast.dismiss();

            this.wifiToast = null;

            this.wifiToast = await this.toastController.create({
              icon: 'checkmark',
              message: 'Wifi connected',
              duration: 3000,
              position: 'top',
              color: 'success',
            });

            this.wifiToast.present();
            this.wifiToast.onDidDismiss().then(() => (this.wifiToast = null));
          }
        })
      );
    },
    { dispatch: false }
  );
}
