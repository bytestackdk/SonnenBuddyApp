import { Component, ViewChild } from '@angular/core';
import { SwiperComponent } from 'swiper/angular';
import { WizardPageStore } from './wizard-page.store';
import { ApiToken } from '../../shared/models/device-details.model';

@Component({
  selector: 'app-wizard',
  templateUrl: './wizard-page.component.html',
  styleUrls: ['./wizard-page.component.scss'],
  providers: [WizardPageStore],
})
export class WizardPage {
  @ViewChild('swiper', { static: false }) swiper?: SwiperComponent;

  constructor(private readonly componentStore: WizardPageStore) {}

  next() {
    this.swiper.swiperRef.slideNext(100);
  }

  findDevice() {
    this.componentStore.findDevice();
  }

  toggleFindHelp(show: boolean) {
    this.componentStore.toggleFindHelp(show);
  }

  toggleTokenHelp(show: boolean) {
    this.componentStore.toggleTokenHelp(show);
  }

  testToken() {
    this.componentStore.testToken();
  }

  updateToken(e: CustomEvent<{ value: ApiToken }>) {
    this.componentStore.setToken(e.detail.value.trim());
  }

  updatePanelQuantity(e: CustomEvent<{ value: number }>) {
    const panelQuantity = e.detail.value;

    if (!isNaN(panelQuantity)) {
      this.componentStore.setPanelQuantity(e.detail.value);
    }
  }

  updatePanelPowerOutput(e: CustomEvent<{ value: number }>) {
    const panelPowerOutput = e.detail.value;

    if (!isNaN(panelPowerOutput)) {
      this.componentStore.setPanelPowerOutput(e.detail.value);
    }
  }

  finish() {
    this.componentStore.finish();
    this.componentStore.reset();

    // Reset position
    setTimeout(() => this.swiper.swiperRef.slideTo(0, 100), 2000);
  }
}
