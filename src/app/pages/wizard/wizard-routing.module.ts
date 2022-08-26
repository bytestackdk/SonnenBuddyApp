import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { WizardPage } from './wizard-page.component';
import { WizardPageService } from './wizard-page.service';
import { WizardPageStore } from './wizard-page.store';

const routes: Routes = [
  {
    path: '',
    component: WizardPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [WizardPageService, WizardPageStore],
})
export class WizardPageRoutingModule {}
