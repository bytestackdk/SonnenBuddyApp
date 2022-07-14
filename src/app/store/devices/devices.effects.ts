import { Injectable } from '@angular/core';
import { catchError, exhaustMap, map } from 'rxjs/operators';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { Store } from '@ngrx/store';
import { NetworkService } from '../../api/services/network.service';
import * as fromActions from './devices.actions';
import { INetworkDevice } from '../../api/models/network.model';
import { IDevice } from '../../shared/models/device.model';
import { BatteryService } from '../../api/services/battery.service';
import { getInverterMaxPowerFailed } from './devices.actions';

@Injectable()
export class DevicesEffects {
  constructor(
    private readonly actions$: Actions,
    private readonly store: Store,
    private readonly deviceService: NetworkService,
    private readonly batteryService: BatteryService
  ) {}

  findDevices$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(fromActions.findDevices),
      exhaustMap(() =>
        this.deviceService.find().pipe(
          map((devices) =>
            fromActions.findDevicesSuccess({
              devices: devices.map((device) => this.mapToDevice(device)),
            })
          ),
          catchError((error) => of(fromActions.findDevicesFailed({ error })))
        )
      )
    );
  });

  getInverterMaxPower$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(fromActions.getInverterMaxPower),
      exhaustMap(() =>
        this.batteryService.getInverterMaxPower().pipe(
          map((maxPower) => fromActions.getInverterMaxPowerSuccess({ maxPower })),
          catchError((error) => of(fromActions.getInverterMaxPowerFailed({ error })))
        )
      )
    );
  });

  getBatteryQuantity$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(fromActions.getBatteryQuantity),
      exhaustMap(() =>
        this.batteryService.getBatteryQuantity().pipe(
          map((batteryQuantity) => fromActions.getBatteryQuantitySuccess({ batteryQuantity })),
          catchError((error) => of(fromActions.getBatteryQuantityFailed({ error })))
        )
      )
    );
  });

  private mapToDevice(networkDevice: INetworkDevice) {
    const { ca20, info, device } = networkDevice;
    const battery: IDevice = {
      lanIp: networkDevice.lanip,
      serialNumber: device,
      ca20,
      info,
    };

    return battery;
  }
}
