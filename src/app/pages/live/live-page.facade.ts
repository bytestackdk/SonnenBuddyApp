import { Injectable } from '@angular/core';
import { Direction } from '../../shared/components/power-square/power-square.component';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { StatusSelectors } from '../../store/status';
import { map } from 'rxjs/operators';

export interface ILivePageViewModel {
  solarToBattery$?: Observable<Direction>;
  solarToInverter$?: Observable<Direction>;
  batteryAndInverter$?: Observable<Direction>;
  inverterAndGrid$?: Observable<Direction>;
  inverterToHome$?: Observable<Direction>;
  gridToHome$?: Observable<Direction>;
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

      batteryAndInverter$: this.store.select(StatusSelectors.selectBatteryAndInverter).pipe(
        map(({ batteryToInverter, inverterToBattery }) => {
          if (batteryToInverter) {
            return Direction.CounterClockwise;
          } else if (inverterToBattery) {
            return Direction.Clockwise;
          }
          return Direction.None;
        })
      ),

      inverterAndGrid$: this.store.select(StatusSelectors.selectInverterAndGrid).pipe(
        map(({ inverterToGrid, gridToInverter }) => {
          if (inverterToGrid) {
            return Direction.CounterClockwise;
          } else if (gridToInverter) {
            return Direction.Clockwise;
          }
          return Direction.None;
        })
      ),

      inverterToHome$: this.store
        .select(StatusSelectors.selectInverterToHome)
        .pipe(map((inverterToHome) => (inverterToHome ? Direction.Clockwise : Direction.None))),

      gridToHome$: this.store
        .select(StatusSelectors.selectGridToHome)
        .pipe(map((gridToHome) => (gridToHome ? Direction.CounterClockwise : Direction.None))),
    };
  }
}
