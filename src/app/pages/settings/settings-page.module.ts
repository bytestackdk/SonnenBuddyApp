import { NgModule } from '@angular/core';
import { SettingsPage } from './settings-page.component';
import { ExploreContainerComponentModule } from '../../explore-container/explore-container.module';
import { SettingsPageRoutingModule } from './settings-routing.module';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  imports: [SharedModule, ExploreContainerComponentModule, SettingsPageRoutingModule],
  declarations: [SettingsPage],
})
export class SettingsPageModule {}
