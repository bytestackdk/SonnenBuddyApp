import { Component, OnInit, ViewChild } from '@angular/core';
import { SwiperComponent } from 'swiper/angular';
import { WizardPageStore } from './wizard-page.store';
import { ApiToken } from '../../shared/models/wizard.model';
import { enterFadeAnimation } from '../../shared/utilities/animations';
import { IpService } from '../../core/services/ip.service';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-wizard',
  templateUrl: './wizard-page.component.html',
  styleUrls: ['./wizard-page.component.scss'],
  providers: [WizardPageStore],
  animations: [enterFadeAnimation()],
})
export class WizardPage implements OnInit {
  @ViewChild('swiper', { static: false }) swiper?: SwiperComponent;

  presentingElement = null;

  constructor(public readonly componentStore: WizardPageStore, private readonly ipService: IpService) {}

  ngOnInit() {
    this.presentingElement = document.querySelector('.ion-content');
  }

  previous() {
    this.swiper.swiperRef.slidePrev(100);
  }

  next() {
    this.swiper.swiperRef.slideNext(100);
  }

  addIpManually() {
    this.componentStore.deviceLanIp$.pipe(take(1)).subscribe((ip) => {
      this.ipService.show(ip).then((lanIp) => {
        if (lanIp) {
          this.componentStore.addDeviceManually(lanIp);
        }
      });
    });
  }

  updateToken(e: CustomEvent<{ value: ApiToken }>) {
    this.componentStore.setToken(e.detail.value.trim());
  }

  updateSolarPowerOutput(e: CustomEvent<{ value: string }>) {
    const solarPowerOutput = parseInt(e.detail.value, 10);

    if (!isNaN(solarPowerOutput)) {
      this.componentStore.setSolarPowerOutput(solarPowerOutput);
    }
  }

  finish() {
    this.componentStore.finish();
    this.componentStore.reset();

    // Reset position
    setTimeout(() => this.swiper.swiperRef.slideTo(0, 100), 2000);
  }
}
