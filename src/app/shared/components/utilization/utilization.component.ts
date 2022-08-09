import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-utilization',
  templateUrl: './utilization.component.html',
  styleUrls: ['./utilization.component.scss'],
})
export class UtilizationComponent {
  @Input() percent = 0;
}
