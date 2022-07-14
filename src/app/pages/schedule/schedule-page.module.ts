import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SchedulePage } from './schedule-page.component';
import { ExploreContainerComponentModule } from '../../explore-container/explore-container.module';

import { SchedulePageRoutingModule } from './schedule-routing.module';

@NgModule({
  imports: [IonicModule, CommonModule, FormsModule, ExploreContainerComponentModule, SchedulePageRoutingModule],
  declarations: [SchedulePage],
})
export class SchedulePageModule {}
