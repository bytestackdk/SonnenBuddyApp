import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { WizardPage } from './wizard-page.component';

const routes: Routes = [
  {
    path: '',
    component: WizardPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WizardPageRoutingModule {}
