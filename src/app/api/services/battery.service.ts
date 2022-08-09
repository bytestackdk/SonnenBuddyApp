import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { HTTP } from '@awesome-cordova-plugins/http/ngx';
import {
  CM_MarketingModuleCapacity,
  IBatteryStatus,
  IC_BatteryModules,
  IC_InverterMaxPower_w,
  ILatestData,
  IPowerMeter,
} from '../models/battery.model';
import { BaseService } from './base.service';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class BatteryService extends BaseService {
  constructor(angularHttp: HttpClient, nativeHttp: HTTP, store: Store) {
    super(angularHttp, nativeHttp, store);
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

  getInverterMaxPower() {
    return this.getConfiguration<IC_InverterMaxPower_w>(IC_InverterMaxPower_w.key).pipe(
      map((configuration) => parseInt(configuration[IC_InverterMaxPower_w.key], 10))
    );
  }

  getBatteryQuantity() {
    return this.getConfiguration<IC_BatteryModules>(IC_BatteryModules.key).pipe(
      map((configuration) => parseInt(configuration[IC_BatteryModules.key], 10))
    );
  }

  getBatteryModuleCapacity() {
    return this.getConfiguration<CM_MarketingModuleCapacity>(CM_MarketingModuleCapacity.key).pipe(
      map((configuration) => parseInt(configuration[CM_MarketingModuleCapacity.key], 10))
    );
  }

  private getConfiguration<T>(configuration: string) {
    return this.get<T>('api/v2/configurations/' + configuration);
  }
}
