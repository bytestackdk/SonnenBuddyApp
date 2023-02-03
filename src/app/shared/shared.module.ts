import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { KwPipe } from './pipes/kw.pipe';
import { UtilizationComponent } from './components/utilization/utilization.component';
import { BatteryComponent } from './components/battery/battery.component';
import { PowerSquareComponent } from './components/power-square/power-square.component';
import { SwiperModule } from 'swiper/angular';
import { OmPipe } from './pipes/om.pipe';
import { TimespanComponent } from './components/timespan/timespan.component';
import { LetModule, PushModule } from '@ngrx/component';

@NgModule({
  declarations: [KwPipe, OmPipe, UtilizationComponent, BatteryComponent, PowerSquareComponent, TimespanComponent],
  imports: [CommonModule, IonicModule, FormsModule, SwiperModule, LetModule, PushModule],
  exports: [
    BatteryComponent,
    CommonModule,
    FormsModule,
    IonicModule,
    KwPipe,
    LetModule,
    OmPipe,
    PowerSquareComponent,
    PushModule,
    SwiperModule,
    TimespanComponent,
    UtilizationComponent,
  ],
})
export class SharedModule {}
