import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexModule } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { KwPipe } from './pipes/kw.pipe';
import { UtilizationComponent } from './components/utilization/utilization.component';
import { BatteryComponent } from './components/battery/battery.component';

@NgModule({
  declarations: [KwPipe, UtilizationComponent, BatteryComponent],
  imports: [CommonModule, IonicModule, FormsModule, FlexModule],
  exports: [CommonModule, IonicModule, FormsModule, FlexModule, KwPipe, UtilizationComponent, BatteryComponent],
})
export class SharedModule {}
