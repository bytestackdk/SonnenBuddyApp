import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';

export interface RangeValue {
  lower?: number;
  upper?: number;
}

export enum Knob {
  start = 'start',
  stop = 'stop',
  none = 'none',
}

export interface TimespanState extends RangeValue {
  initialLower?: number;
  initialUpper?: number;
  preMoveUpper?: number;
  preMoveLower?: number;
  preMoveUpperKnob?: Knob;
  moving?: boolean;
  upperKnob?: Knob;
  movingKnob: Knob;
}

export interface TimespanChangeEvent {
  start: string;
  stop: string;
}

@Injectable()
export class TimespanComponentStore extends ComponentStore<TimespanState> {
  constructor() {
    super({ movingKnob: Knob.none, moving: false });
  }

  readonly state$ = this.select((state) => state);
  readonly startIsUpperKnob$ = this.select((state) => state.upperKnob === Knob.start);

  initialize(start: string, stop: string) {
    start = start.length < 5 ? `0${start}` : start;
    stop = stop.length < 5 ? `0${stop}` : stop;

    const upperKnob = start > stop ? Knob.start : Knob.stop;
    const initialLower = this.timeToNumber(upperKnob === Knob.start ? stop : start);
    const initialUpper = this.timeToNumber(upperKnob === Knob.start ? start : stop);

    this.patchState({
      initialLower,
      initialUpper,
      lower: initialLower,
      upper: initialUpper,
      upperKnob,
    });
  }

  getInitialValue(): RangeValue {
    const { initialLower, initialUpper } = this.get();
    return { lower: initialLower, upper: initialUpper };
  }

  getTimespanChangeEvent(): TimespanChangeEvent {
    const { lower, upper, upperKnob } = this.get();
    const start = this.numberToTime(upperKnob === Knob.start ? upper : lower);
    const stop = this.numberToTime(upperKnob === Knob.start ? lower : upper);

    return { start, stop };
  }

  readonly startMove = this.updater((state, range: RangeValue) => {
    const { lower, upper } = range;
    const { upperKnob } = state;

    return {
      ...state,
      lower,
      upper,
      preMoveLower: lower,
      preMoveUpper: upper,
      preMoveUpperKnob: upperKnob,
      movingKnob: Knob.none,
      moving: true,
    };
  });

  stopMove = this.updater((state, range: RangeValue) => {
    const { lower, upper } = range;

    return {
      ...state,
      lower,
      upper,
      movingKnob: Knob.none,
      moving: false,
      preMoveLower: null,
      preMoveUpper: null,
      preMoveUpperKnob: null,
    };
  });

  readonly move = this.updater((state, range: RangeValue) => {
    if (!state.moving) return state;

    const { lower, upper } = range;
    const { preMoveLower, preMoveUpper, preMoveUpperKnob, movingKnob } = state;
    const lowerIsMoving = lower !== preMoveLower;
    const upperIsMoving = upper !== preMoveUpper;

    let nextMovingKnob = movingKnob;

    // Moving knob is determined only once since start and remains the same for the duration of the move
    if (state.movingKnob === Knob.none) {
      if (lowerIsMoving) {
        nextMovingKnob = preMoveUpperKnob === Knob.stop ? Knob.start : Knob.stop;
      } else if (upperIsMoving) {
        nextMovingKnob = preMoveUpperKnob === Knob.stop ? Knob.stop : Knob.start;
      }
    }

    // When lower moves paste upper or vice versa then both knobs have moved from pre move -> Upper knob has changed
    const upperKnob = lowerIsMoving && upperIsMoving ? this.invertKnob(preMoveUpperKnob) : preMoveUpperKnob;

    return {
      ...state,
      lower,
      upper,
      upperKnob,
      ...(nextMovingKnob !== Knob.none && { movingKnob: nextMovingKnob }),
    };
  });

  timeToNumber(time: string) {
    const timeSplit = time.split(':');
    const hours = parseInt(timeSplit[0], 10);
    const minutes = parseInt(timeSplit[1], 10);

    return hours * 4 + minutes / 15;
  }

  numberToTime(value: number) {
    const date = new Date(0);

    date.setMinutes(value * 15);

    const hours = this.prefixZero(date.getUTCHours());
    const minutes = this.prefixZero(date.getUTCMinutes());

    return `${hours}:${minutes}`;
  }

  private prefixZero(hoursOrMinutes: number) {
    return hoursOrMinutes.toString().padStart(2, '0');
  }

  private invertKnob(knob: Knob) {
    return knob === Knob.start ? Knob.stop : Knob.start;
  }
}
