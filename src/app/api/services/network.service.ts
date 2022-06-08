import { Injectable } from '@angular/core';
import { HTTP } from '@awesome-cordova-plugins/http/ngx';
import { from, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { INetworkDevice } from '../models/network.model';
import { Platform } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { Capacitor } from '@capacitor/core';

@Injectable({ providedIn: 'root' })
export class NetworkService {
  constructor(
    private readonly nativeHttp: HTTP,
    private readonly angularHttp: HttpClient,
    private readonly platform: Platform
  ) {}

  find() {
    const url = ' https://find-my.sonnen-batterie.com/find';

    if (Capacitor.isNativePlatform()) {
      return from(
        this.platform.ready().then(() => this.nativeHttp.get(url, {}, {}))
      ).pipe(map((response) => JSON.parse(response.data) as INetworkDevice[]));
    } else {
      const response: INetworkDevice[] = [
        {
          lanip: '192.168.1.130',
          ca20: true,
          info: 'sonnenBatterie',
          device: 162099,
        },
      ];
      return of(response);
    }
  }
}
