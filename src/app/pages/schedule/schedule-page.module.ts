import { NgModule } from '@angular/core';
import { SchedulePage } from './schedule-page.component';
import { ExploreContainerComponentModule } from '../../explore-container/explore-container.module';
import { SchedulePageRoutingModule } from './schedule-routing.module';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  imports: [SharedModule, ExploreContainerComponentModule, SchedulePageRoutingModule],
  declarations: [SchedulePage],
})
export class SchedulePageModule {}
