import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  HTTP_INTERCEPTORS,
  HttpClientJsonpModule,
  HttpClientModule,
} from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP } from '@awesome-cordova-plugins/http/ngx';
import { NativeHttpInterceptor } from './interceptors/native-http.interceptor';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    BrowserModule,
    HttpClientModule,
    HttpClientJsonpModule,
  ],
  providers: [
    HTTP,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: NativeHttpInterceptor,
      multi: true,
    },
  ],
})
export class CoreModule {}
