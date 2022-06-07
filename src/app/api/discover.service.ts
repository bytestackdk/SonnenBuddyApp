import { Injectable } from '@angular/core';
import { HTTP } from '@awesome-cordova-plugins/http/ngx';
import { from } from 'rxjs';
import { map } from 'rxjs/operators';
import { IDiscoverResponse } from './discover.model';

@Injectable({ providedIn: 'root' })
export class DiscoverService {
  constructor(private readonly http: HTTP) {}

  find() {
    const url = ' https://find-my.sonnen-batterie.com/find';

    return from(this.http.get(url, {}, {})).pipe(
      map((response) => JSON.parse(response.data) as IDiscoverResponse[])
    );
  }
}
