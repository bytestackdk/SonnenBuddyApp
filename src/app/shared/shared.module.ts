import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexModule } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { KwPipe } from './pipes/kw.pipe';
import { UtilizationComponent } from './components/utilization/utilization.component';
import { BatteryComponent } from './components/battery/battery.component';
import { PowerSquareComponent } from './components/power-square/power-square.component';
import { SwiperModule } from 'swiper/angular';

@NgModule({
  declarations: [KwPipe, UtilizationComponent, BatteryComponent, PowerSquareComponent],
  imports: [CommonModule, IonicModule, FormsModule, FlexModule, SwiperModule],
  exports: [
    BatteryComponent,
    CommonModule,
    FlexModule,
    FormsModule,
    IonicModule,
    KwPipe,
    PowerSquareComponent,
    SwiperModule,
    UtilizationComponent,
  ],
})
export class SharedModule {}
