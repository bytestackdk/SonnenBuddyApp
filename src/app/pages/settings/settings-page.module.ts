import { NgModule } from '@angular/core';
import { SettingsPage } from './settings-page.component';
import { SettingsPageRoutingModule } from './settings-routing.module';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  imports: [SharedModule, SettingsPageRoutingModule],
  declarations: [SettingsPage],
})
export class SettingsPageModule {}
