import { Pipe, PipeTransform } from '@angular/core';
import { OperatingMode } from '../../api/models/battery.model';

@Pipe({
  name: 'om',
})
export class OmPipe implements PipeTransform {
  transform(value: OperatingMode): string {
    switch (value) {
      case OperatingMode.Manual:
        return 'Manual';
      case OperatingMode.SelfConsumption:
        return 'Self-Consumption';
      case OperatingMode.BatteryModuleExtension:
        return 'Battery-Module-Extension';
      case OperatingMode.TimeOfUse:
        return 'Time-Of-Use';
    }
  }
}
