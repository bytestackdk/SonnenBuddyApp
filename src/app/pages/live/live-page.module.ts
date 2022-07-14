import { NgModule } from '@angular/core';
import { LivePage } from './live-page.component';
import { ExploreContainerComponentModule } from '../../explore-container/explore-container.module';
import { LivePageRoutingModule } from './live-routing.module';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  imports: [SharedModule, ExploreContainerComponentModule, LivePageRoutingModule],
  declarations: [LivePage],
})
export class LivePageModule {}
