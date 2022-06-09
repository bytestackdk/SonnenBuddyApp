import { Directive } from '@angular/core';
import { HTTP } from '@awesome-cordova-plugins/http/ngx';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { selectCurrentDevice } from '../../store/devices';
import { Store } from '@ngrx/store';
import { from, Observable } from 'rxjs';
import { map, switchMap, take } from 'rxjs/operators';
import { Capacitor } from '@capacitor/core';

@Directive()
export class BaseService {
  constructor(
    private readonly angularHttp: HttpClient,
    private readonly nativeHttp: HTTP,
    protected readonly store: Store
  ) {}

  protected get<T>(url: string): Observable<T> {
    return this.store.select(selectCurrentDevice).pipe(
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
