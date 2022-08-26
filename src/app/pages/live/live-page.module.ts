import { NgModule } from '@angular/core';
import { LivePage } from './live-page.component';
import { LivePageRoutingModule } from './live-routing.module';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  imports: [SharedModule, LivePageRoutingModule],
  declarations: [LivePage],
})
export class LivePageModule {}
