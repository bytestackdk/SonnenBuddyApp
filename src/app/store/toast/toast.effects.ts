import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { SonnenBatterieActions } from '../sonnen-batterie';
import { debounceTime, tap } from 'rxjs/operators';
import { ToastController } from '@ionic/angular';
import { HttpErrorResponse } from '@angular/common/http';
import { PlatformActions } from '../platform';

@Injectable()
export class ToastEffects {
  private wifiToast: HTMLIonToastElement = null;

  /**
   * Flag to only show wifi connection is it wasn't connected in the first place
   */
  private wifiNotConnected = false;

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
          const httpError = error instanceof HttpErrorResponse ? (error as HttpErrorResponse) : null;

          let message = error as string;

          if (httpError) {
            if (httpError.message) {
              message += httpError.message;
            }
            if (httpError.error?.error) {
              message += ` - ${httpError.error.error}`;
            }
          }

          if (message.includes('401')) {
            message = 'Oops! Did you remember to enable Write API?';
          }

          if (message.includes('403') && message.includes('VPP')) {
            message = "Oops! Can't do that - VPP is active and has priority";
          }

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
        debounceTime(500),
        tap(async ({ status }) => {
          if (this.wifiToast) {
            await this.wifiToast.dismiss();
            this.wifiToast = null;
          }

          const { connected, connectionType } = status;
          const wifi = connectionType === 'wifi';

          if (!connected || !wifi) {
            this.wifiNotConnected = true;
            await this.showWifiToast('warning', 'Wifi not connected', 10000, 'warning');
          }

          if (connected && wifi && this.wifiNotConnected) {
            this.wifiNotConnected = false;
            await this.showWifiToast('checkmark', 'Wifi connected', 3000, 'success');
          }
        })
      );
    },
    { dispatch: false }
  );

  private async showWifiToast(icon, message, duration, color) {
    this.wifiToast = await this.toastController.create({
      icon,
      message,
      duration,
      color,
      position: 'top',
    });

    await this.wifiToast.present();
    this.wifiToast.onDidDismiss().then(() => (this.wifiToast = null));
  }
}
