import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { SonnenBatterieSelectors } from '../store/sonnen-batterie';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
})
export class TabsPage {
  schedules$ = this.store.select(SonnenBatterieSelectors.selectSonnenBatterieSchedules);

  constructor(private readonly store: Store) {}
}
