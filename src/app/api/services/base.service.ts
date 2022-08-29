import { Directive } from '@angular/core';
import { HTTP } from '@awesome-cordova-plugins/http/ngx';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { selectSonnenBatterieTokenAndIP } from '../../store/sonnen-batterie';
import { Store } from '@ngrx/store';
import { from, iif, Observable, of } from 'rxjs';
import { map, mergeMap, switchMap, take } from 'rxjs/operators';
import { Capacitor } from '@capacitor/core';
import { ApiToken } from '../../shared/models/sonnen-batterie.model';
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
    const useStore$ = this.store.select(selectSonnenBatterieTokenAndIP);

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

  protected put<T>(url: string, body: any) {
    return this.store.select(selectSonnenBatterieTokenAndIP).pipe(
      take(1),
      switchMap((device) => {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        const authHeader = { 'Auth-Token': device.apiToken };

        if (Capacitor.isNativePlatform()) {
          const absoluteUrl = `http://${device.lanIp}/${url}`;
          return this.nativePut<T>(absoluteUrl, body, authHeader);
        }

        return this.angularHttp.put<T>(url, body, {
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

  protected nativePut<T>(absoluteUrl: string, body = {}, headers = {}) {
    return from(this.nativeHttp.put(absoluteUrl, body, headers)).pipe(
      map((response) => JSON.parse(response.data) as T)
    );
  }
}
