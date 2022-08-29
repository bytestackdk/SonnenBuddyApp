import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { HTTP } from '@awesome-cordova-plugins/http/ngx';
import { ConfigurationKey, IBatteryStatus, ILatestData, IPowerMeter, OperatingMode } from '../models/battery.model';
import { BaseService } from './base.service';
import { catchError, map } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { ApiToken } from '../../shared/models/sonnen-batterie.model';
import { IP } from '../models/network.model';

@Injectable({ providedIn: 'root' })
export class BatteryService extends BaseService {
  constructor(angularHttp: HttpClient, nativeHttp: HTTP, store: Store) {
    super(angularHttp, nativeHttp, store);
  }

  check(): Observable<boolean> {
    return this.getStatus().pipe(
      map((response) => !!response),
      catchError(() => of(false))
    );
  }

  getStatus() {
    return this.get<IBatteryStatus>(`api/v2/status`);
  }

  getLatestData() {
    return this.get<ILatestData>('api/v2/latestdata');
  }

  getPowerMeter() {
    return this.get<IPowerMeter[]>('api/v2/powermeter');
  }

  getOperatingMode() {
    return this.getConfiguration(ConfigurationKey.EM_OperatingMode) as Observable<OperatingMode>;
  }

  // setOperatingMode(operatingMode: OperatingMode) {
  //   const body = {
  //     [OperatingMode[operatingMode]]: operatingMode,
  //   };
  //   this.put('api/v2/configurations', body);
  // }

  getConfigurationAsNumber(key: ConfigurationKey, apiToken?: ApiToken, lanIp?: IP) {
    return this.getConfiguration(key, apiToken, lanIp).pipe(map((configuration) => parseInt(configuration, 10)));
  }

  getConfiguration(key: ConfigurationKey, apiToken?: ApiToken, lanIp?: IP) {
    return this.get<Record<string, string>>('api/v2/configurations/' + key, apiToken, lanIp).pipe(
      map((response) => response[key])
    );
  }

  setConfiguration(key: ConfigurationKey, configuration: string) {
    const body = {
      [ConfigurationKey[key]]: configuration,
    };

    return this.put('api/v2/configurations', body).pipe(map((response) => response[key]));
  }
}
