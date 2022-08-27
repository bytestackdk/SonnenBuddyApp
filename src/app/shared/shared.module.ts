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
import { OmPipe } from './pipes/om.pipe';

@NgModule({
  declarations: [KwPipe, OmPipe, UtilizationComponent, BatteryComponent, PowerSquareComponent],
  imports: [CommonModule, IonicModule, FormsModule, FlexModule, SwiperModule],
  exports: [
    BatteryComponent,
    CommonModule,
    FlexModule,
    FormsModule,
    IonicModule,
    KwPipe,
    OmPipe,
    PowerSquareComponent,
    SwiperModule,
    UtilizationComponent,
  ],
})
export class SharedModule {}
