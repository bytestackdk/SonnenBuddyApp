import { Component, Input } from '@angular/core';

export enum Direction {
  None = 'None',
  Clockwise = 'Clockwise',
  CounterClockwise = 'CounterClockwise',
}

@Component({
  selector: 'app-power-square',
  templateUrl: './power-square.component.html',
  styleUrls: ['./power-square.component.scss'],
})
export class PowerSquareComponent {
  @Input() left = false;
  @Input() right = false;
  @Input() top = false;
  @Input() bottom = false;
  @Input() direction = Direction.None;

  Direction = Direction;

  get sideCount() {
    return [this.left, this.right, this.top, this.bottom].filter((side) => side).length;
  }
}
