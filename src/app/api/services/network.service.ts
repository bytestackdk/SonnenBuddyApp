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

    // return of([]);

    // const devices: Device[] = [
    //   { lanIp: '192.168.86.21', ca20: true, info: 'sonnenBatterie', serialNumber: 1234 },
    //   { lanIp: '192.168.1.40', ca20: true, info: 'sonnenBatterie', serialNumber: 5678 },
    // ];
    // return of(devices);

    const devices: Device[] = [
      {
        // IP is irrelevant here as all /api calls are proxied regardless when developing
        lanIp: '192.168.1.130',
        ca20: true,
        info: 'sonnenBatterie',
        serialNumber: 123456, // Hardcode your serial to be found here when you're developing
      },
    ];
    return of(devices);
  }
}
