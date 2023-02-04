import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-step-header',
  templateUrl: './step-header.component.html',
  styleUrls: ['./step-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StepHeaderComponent {
  @Input() icon = '';
  @Input() title = '';
}
