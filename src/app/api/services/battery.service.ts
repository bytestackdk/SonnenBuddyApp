import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { HTTP } from '@awesome-cordova-plugins/http/ngx';
import { IBatteryStatus, ILatestData, IPowerMeter } from '../models/battery.model';
import { BaseService } from './base.service';
import { catchError, map } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

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
}
