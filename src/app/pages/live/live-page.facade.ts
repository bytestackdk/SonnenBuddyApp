import { Injectable } from '@angular/core';
import { Direction } from '../../shared/components/power-square/power-square.component';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { StatusSelectors } from '../../store/status';
import { map } from 'rxjs/operators';

export interface ILivePageViewModel {
  solarToBattery$?: Observable<Direction>;
  solarToInverter$?: Observable<Direction>;
}

@Injectable()
export class LivePageFacade {
  vm: ILivePageViewModel;

  constructor(private readonly store: Store) {
    this.vm = {
      solarToBattery$: this.store
        .select(StatusSelectors.selectSolarToBattery)
        .pipe(map((solarToBattery) => (solarToBattery ? Direction.Clockwise : Direction.None))),
      solarToInverter$: this.store
        .select(StatusSelectors.selectSolarToInverter)
        .pipe(map((solarToInverter) => (solarToInverter ? Direction.CounterClockwise : Direction.None))),
    };
  }
}
