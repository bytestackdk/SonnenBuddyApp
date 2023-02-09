import { Directive } from '@angular/core';
import { HTTP } from '@awesome-cordova-plugins/http/ngx';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { from, iif, Observable, of } from 'rxjs';
import { map, mergeMap, switchMap, take } from 'rxjs/operators';
import { Capacitor } from '@capacitor/core';
import { IP } from '../models/network.model';
import { SonnenBatterieSelectors } from 'src/app/store/sonnen-batterie';
import { ApiToken } from '../../shared/models/wizard.model';

@Directive()
export class BaseService {
  constructor(
    private readonly angularHttp: HttpClient,
    private readonly nativeHttp: HTTP,
    protected readonly store: Store
  ) {}

  protected get<T>(url: string, apiToken?: ApiToken, lanIp?: IP): Observable<T> {
    const useOverride$ = of({ apiToken, lanIp });
    const useStore$ = this.store.select(SonnenBatterieSelectors.selectSonnenBatterieTokenAndIP);

    return of({}).pipe(
      mergeMap(() => iif(() => !!apiToken && !!lanIp, useOverride$, useStore$)),
      take(1),
      switchMap((device) => {
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

  protected put<T>(url: string, body: unknown) {
    return this.store.select(SonnenBatterieSelectors.selectSonnenBatterieTokenAndIP).pipe(
      take(1),
      switchMap((device) => {
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

  protected nativeGet<T>(absoluteUrl: string, params = {}, headers = {}) {
    const timeoutInSeconds = 5;

    /* eslint-disable  @typescript-eslint/no-explicit-any */
    return from(
      // Cast to any because type is incorrect
      // https://github.com/silkimen/cordova-plugin-advanced-http/issues/471
      this.nativeHttp.sendRequest(absoluteUrl, {
        method: 'get',
        headers,
        params,
        timeout: timeoutInSeconds,
        connectTimeout: timeoutInSeconds,
        readTimeout: timeoutInSeconds,
      } as any)
    ).pipe(map((response) => JSON.parse(response.data) as T));
  }

  protected nativePut<T>(absoluteUrl: string, body = {}, headers = {}) {
    return from(this.nativeHttp.put(absoluteUrl, body, headers)).pipe(
      map((response) => JSON.parse(response.data) as T)
    );
  }
}
