import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import * as fromSonnenBatterie from '../sonnen-batterie/sonnen-batterie.actions';
import * as fromStatus from '../status/status.actions';
import { tap } from 'rxjs/operators';
import { ToastController } from '@ionic/angular';
import { HttpErrorResponse } from '@angular/common/http';

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
        ofType(
          fromSonnenBatterie.findDeviceFailed,
          fromSonnenBatterie.setConfigurationFailed,
          fromStatus.getBatteryStatusFailed
        ),
        tap(async ({ error }) => {
          const httpError = typeof error !== 'string' ? (error as HttpErrorResponse) : null;
          const message = httpError
            ? `Error: ${httpError.message} (${JSON.stringify(httpError.error)})`
            : (error as string);
          const toast = await this.toastController.create({ message, duration: 5000 });

          toast.present();
        })
      );
    },
    { dispatch: false }
  );
}
