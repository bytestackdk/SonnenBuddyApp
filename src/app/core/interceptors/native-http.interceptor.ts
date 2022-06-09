import {
  HttpEvent,
  HttpHandler,
  HttpHeaders,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';
import { Capacitor } from '@capacitor/core';
import { Platform } from '@ionic/angular';
import { HTTP } from '@awesome-cordova-plugins/http/ngx';
import { Store } from '@ngrx/store';
import { selectCurrentDevice } from '../../store/devices/devices.selectors';
import { switchMap, take } from 'rxjs/operators';
import { IDevice } from '../../shared/models/device.model';

type HttpMethod =
  | 'get'
  | 'post'
  | 'put'
  | 'patch'
  | 'head'
  | 'delete'
  | 'options'
  | 'upload'
  | 'download';

@Injectable()
export class NativeHttpInterceptor implements HttpInterceptor {
  constructor(
    private nativeHttp: HTTP,
    private platform: Platform,
    private readonly store: Store
  ) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return this.store.select(selectCurrentDevice).pipe(
      take(1),
      switchMap((device) => {
        // Add auth token to the request
        const requestWithAuth = request.clone({
          headers: request.headers.set('Auth-Token', device.apiToken),
        });

        if (Capacitor.isNativePlatform()) {
          return from(this.handleNativeRequest(requestWithAuth, device));
        }

        return next.handle(requestWithAuth);
      })
    );
  }

  private async handleNativeRequest(
    request: HttpRequest<unknown>,
    device: IDevice
  ): Promise<HttpResponse<unknown>> {
    const headers = {};

    request.headers.keys().forEach((key) => {
      headers[key] = request.headers.get(key);
    });

    try {
      await this.platform.ready();

      const method = request.method.toLowerCase() as HttpMethod;
      const url = `http://${device.lanIp}/${request.url}`;

      const nativeHttpResponse = await this.nativeHttp.sendRequest(url, {
        method,
        data: request.body,
        headers,
        serializer: 'json',
      });

      let body;

      try {
        body = JSON.parse(nativeHttpResponse.data);
      } catch (error) {
        body = { response: nativeHttpResponse.data };
      }

      const response = new HttpResponse({
        body,
        status: nativeHttpResponse.status,
        headers: new HttpHeaders(nativeHttpResponse.headers),
        url: nativeHttpResponse.url,
      });

      return Promise.resolve(response);
    } catch (error) {
      if (!error.status) {
        return Promise.reject(error);
      }

      const response = new HttpResponse({
        body: JSON.parse(error.error),
        status: error.status,
        headers: error.headers,
        url: error.url,
      });

      return Promise.reject(response);
    }
  }
}
