import { Injectable } from '@angular/core';
import { HTTP } from '@awesome-cordova-plugins/http/ngx';
import { of } from 'rxjs';
import { Device, INetworkDevice, mapToDevice } from '../models/network.model';
import { HttpClient } from '@angular/common/http';
import { Capacitor } from '@capacitor/core';
import { BaseService } from './base.service';
import { Store } from '@ngrx/store';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class NetworkService extends BaseService {
  constructor(angularHttp: HttpClient, nativeHttp: HTTP, store: Store) {
    super(angularHttp, nativeHttp, store);
  }

  find() {
    if (Capacitor.isNativePlatform()) {
      const url = 'https://find-my.sonnen-batterie.com/find';
      return this.nativeGet<INetworkDevice[]>(url).pipe(
        map((networkDevices) => networkDevices.map((networkDevice) => mapToDevice(networkDevice)))
      );
    }

    const devices: Device[] = [
      {
        lanIp: '192.168.1.130',
        ca20: true,
        info: 'sonnenBatterie',
        serialNumber: 162099,
      },
    ];
    return of(devices);
  }
}
