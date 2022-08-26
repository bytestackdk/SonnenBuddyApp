import { Injectable } from '@angular/core';
import { BaseService } from '../../api/services/base.service';
import { HttpClient } from '@angular/common/http';
import { HTTP } from '@awesome-cordova-plugins/http/ngx';
import { Store } from '@ngrx/store';
import { map } from 'rxjs/operators';
import { ApiToken } from '../../shared/models/device-details.model';
import { IP } from '../../api/models/network.model';

export enum ConfigurationKeys {
  IC_InverterMaxPower_w = 'IC_InverterMaxPower_w',
  IC_BatteryModules = 'IC_BatteryModules',
  CM_MarketingModuleCapacity = 'CM_MarketingModuleCapacity',
}

@Injectable()
export class WizardPageService extends BaseService {
  constructor(angularHttp: HttpClient, nativeHttp: HTTP, store: Store) {
    super(angularHttp, nativeHttp, store);
  }

  getInverterMaxPower(apiToken: ApiToken, lanIp: IP) {
    return this.getConfigurationAsNumber(ConfigurationKeys.IC_InverterMaxPower_w, apiToken, lanIp);
  }

  getBatteryQuantity(apiToken: ApiToken, lanIp: IP) {
    return this.getConfigurationAsNumber(ConfigurationKeys.IC_BatteryModules, apiToken, lanIp);
  }

  getBatteryModuleCapacity(apiToken: ApiToken, lanIp: IP) {
    return this.getConfigurationAsNumber(ConfigurationKeys.CM_MarketingModuleCapacity, apiToken, lanIp);
  }

  private getConfigurationAsNumber(key: ConfigurationKeys, apiToken: ApiToken, lanIp: IP) {
    return this.getConfiguration(key, apiToken, lanIp).pipe(map((configuration) => parseInt(configuration[key], 10)));
  }

  private getConfiguration(key: ConfigurationKeys, apiToken: ApiToken, lanIp: IP) {
    return this.get<Record<keyof ConfigurationKeys, string>>('api/v2/configurations/' + key, apiToken, lanIp);
  }
}
