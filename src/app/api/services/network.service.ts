import { Injectable } from '@angular/core';
import { HTTP } from '@awesome-cordova-plugins/http/ngx';
import { of } from 'rxjs';
import { INetworkDevice } from '../models/network.model';
import { HttpClient } from '@angular/common/http';
import { Capacitor } from '@capacitor/core';
import { BaseService } from './base.service';
import { Store } from '@ngrx/store';

@Injectable({ providedIn: 'root' })
export class NetworkService extends BaseService {
  constructor(angularHttp: HttpClient, nativeHttp: HTTP, store: Store) {
    super(angularHttp, nativeHttp, store);
  }

  find() {
    if (Capacitor.isNativePlatform()) {
      const url = 'https://find-my.sonnen-batterie.com/find';
      return this.nativeGet<INetworkDevice[]>(url);
    }

    const devices: INetworkDevice[] = [
      {
        lanip: '192.168.1.130',
        ca20: true,
        info: 'sonnenBatterie',
        device: 162099,
      },
    ];
    return of(devices);
  }
}
