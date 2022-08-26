import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { WizardPage } from './wizard-page.component';
import { WizardPageRoutingModule } from './wizard-routing.module';

@NgModule({
  imports: [SharedModule, WizardPageRoutingModule],
  declarations: [WizardPage],
})
export class WizardPageModule {}
