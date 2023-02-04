import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { WizardPage } from './wizard-page.component';
import { WizardPageRoutingModule } from './wizard-routing.module';
import { StepHeaderComponent } from './components/step-header/step-header.component';

@NgModule({
  imports: [SharedModule, WizardPageRoutingModule],
  declarations: [WizardPage, StepHeaderComponent],
})
export class WizardPageModule {}
