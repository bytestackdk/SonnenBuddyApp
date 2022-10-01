import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectSonnenBatterieSchedules } from '../store/sonnen-batterie';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
})
export class TabsPage {
  schedules$ = this.store.select(selectSonnenBatterieSchedules);

  constructor(private readonly store: Store) {}
}
