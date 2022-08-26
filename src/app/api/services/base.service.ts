import { Directive } from '@angular/core';
import { HTTP } from '@awesome-cordova-plugins/http/ngx';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { selectActiveDeviceTokenAndIP } from '../../store/devices';
import { Store } from '@ngrx/store';
import { from, iif, Observable, of } from 'rxjs';
import { map, mergeMap, switchMap, take } from 'rxjs/operators';
import { Capacitor } from '@capacitor/core';
import { ApiToken } from '../../shared/models/device-details.model';
import { IP } from '../models/network.model';

@Directive()
export class BaseService {
  constructor(
    private readonly angularHttp: HttpClient,
    private readonly nativeHttp: HTTP,
    protected readonly store: Store
  ) {}

  protected get<T>(url: string, apiToken?: ApiToken, lanIp?: IP): Observable<T> {
    const useOverride$ = of({ apiToken, lanIp });
    const useStore$ = this.store.select(selectActiveDeviceTokenAndIP);

    return of({}).pipe(
      mergeMap(() => iif(() => !!apiToken && !!lanIp, useOverride$, useStore$)),
      take(1),
      switchMap((device) => {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        const authHeader = { 'Auth-Token': device.apiToken };

        if (Capacitor.isNativePlatform()) {
          const absoluteUrl = `http://${device.lanIp}/${url}`;
          return this.nativeGet<T>(absoluteUrl, {}, authHeader);
        }

        return this.angularHttp.get<T>(url, {
          headers: new HttpHeaders(authHeader),
        });
      })
    );
  }

  protected nativeGet<T>(absoluteUrl: string, parameters = {}, headers = {}) {
    return from(this.nativeHttp.get(absoluteUrl, parameters, headers)).pipe(
      map((response) => JSON.parse(response.data) as T)
    );
  }
}
