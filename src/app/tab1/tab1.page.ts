import { Component, OnInit } from '@angular/core';
import { DiscoverService } from '../api/discover.service';
import { IDiscoverResponse } from '../api/discover.model';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {
  responses: IDiscoverResponse[];

  constructor(private readonly discoverService: DiscoverService) {}

  ngOnInit() {
    this.discoverService.find().subscribe(responses => this.responses = responses);
  }
}
