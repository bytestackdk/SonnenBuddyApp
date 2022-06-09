import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { HTTP } from '@awesome-cordova-plugins/http/ngx';
import { IBatteryStatus, ILatestData } from '../models/battery.model';
import { BaseService } from './base.service';

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
}
