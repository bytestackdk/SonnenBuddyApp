import { NgModule } from '@angular/core';
import { SchedulePage } from './schedule-page.component';
import { SchedulePageRoutingModule } from './schedule-routing.module';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  imports: [SharedModule, SchedulePageRoutingModule],
  declarations: [SchedulePage],
})
export class SchedulePageModule {}
