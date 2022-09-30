import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { HTTP } from '@awesome-cordova-plugins/http/ngx';
import {
  ConfigurationKey,
  IBatteryStatus,
  ILatestData,
  IPowerMeter,
  ISchedule,
  OperatingMode,
} from '../models/battery.model';
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

  getSchedule(): Observable<ISchedule[]> {
    return this.getConfiguration(ConfigurationKey.EM_ToU_Schedule).pipe(map((schedule) => JSON.parse(schedule)));
  }

  setSchedule(schedules: ISchedule[]) {
    const configuration = JSON.stringify(schedules);
    return this.setConfiguration(ConfigurationKey.EM_ToU_Schedule, configuration);
  }

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

  // Use weather:
  // EM_Prognosis_Charging: 1 or 0

  // Online status
  // GET: http://192.168.1.130/api/online_status
  // Return true / false

  // Charge event
  // PUT - Request - Single
  // http://192.168.1.130/api/configs
  // EM_ToU_Schedule: [{"start":"21:00","stop":"22:00","threshold_p_max":2000}]
  // IN_ToUHighTariffWindows: []

  // PUT - Request - Multiple
  // EM_ToU_Schedule: [{"start":"21:00","stop":"22:00","threshold_p_max":2000},{"start":"23:00","stop":"23:30","threshold_p_max":2000}]
  // IN_ToUHighTariffWindows: []

  // Deleting just removed an item from the list and PUTs the latest version

  // Deleting all:
  // EM_ToU_Schedule: []
  // IN_ToUHighTariffWindows: []

  // GET: EM_ToU_Schedule
  // "EM_ToU_Schedule": "[{\"start\":\"09:00\",\"stop\":\"12:00\",\"threshold_p_max\":2000}]"
}
