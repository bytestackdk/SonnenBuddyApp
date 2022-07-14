import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'live',
        loadChildren: () => import('../pages/live/live-page.module').then((m) => m.LivePageModule),
      },
      {
        path: 'schedule',
        loadChildren: () => import('../pages/schedule/schedule-page.module').then((m) => m.SchedulePageModule),
      },
      {
        path: 'settings',
        loadChildren: () => import('../pages/settings/settings-page.module').then((m) => m.SettingsPageModule),
      },
      {
        path: '',
        redirectTo: '/tabs/live',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    redirectTo: '/tabs/live',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class TabsPageRoutingModule {}
