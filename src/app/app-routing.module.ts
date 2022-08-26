import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'wizard',
    loadChildren: () => import('./pages/wizard/wizard-page.module').then((m) => m.WizardPageModule),
  },
  {
    path: '',
    loadChildren: () => import('./tabs/tabs-page.module').then((m) => m.TabsPageModule),
  },
];
@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
