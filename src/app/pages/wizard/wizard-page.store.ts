import { Injectable } from '@angular/core';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { ApiToken, IDeviceConfiguration } from '../../shared/models/sonnen-batterie.model';
import { NetworkService } from '../../api/services/network.service';
import { Store } from '@ngrx/store';
import { switchMap, tap } from 'rxjs/operators';
import { IDevice } from '../../api/models/network.model';
import { forkJoin } from 'rxjs';
import { concatLatestFrom } from '@ngrx/effects';
import { Guid } from 'guid-typescript';
import { SonnenBatterieActions } from '../../store/sonnen-batterie';
import { BatteryService } from '../../api/services/battery.service';
import { ConfigurationKey } from '../../api/models/battery.model';

export interface IWizardState {
  device: IDevice;
  apiToken: ApiToken;
  panelPowerOutput: number;
  panelQuantity: number;
  maxPower: number;
  batteryQuantity: number;
  batteryModuleCapacity: number;
  showFindHelp: boolean;
  showTokenHelp: boolean;
  loading: boolean;
  error: any;
}

export const initialState: IWizardState = {
  device: null,
  apiToken: null,
  panelPowerOutput: null,
  panelQuantity: null,
  maxPower: null,
  batteryQuantity: null,
  batteryModuleCapacity: null,
  showFindHelp: false,
  showTokenHelp: false,
  loading: false,
  error: null,
};

@Injectable()
export class WizardPageStore extends ComponentStore<IWizardState> {
  readonly device$ = this.select((state) => state.device);
  readonly noDevice$ = this.select((state) => !state.device);
  readonly apiToken$ = this.select((state) => state.apiToken);
  readonly apiTokenInvalid$ = this.select(this.apiToken$, (apiToken) => !Guid.isGuid(apiToken || ''));
  readonly apiTokenUntested$ = this.select(
    (state) => state.maxPower === null && state.batteryModuleCapacity === null && state.batteryQuantity === null
  );
  readonly apiTokenTested$ = this.select(
    (state) => state.maxPower !== null && state.batteryModuleCapacity !== null && state.batteryQuantity !== null
  );
  readonly lanIp$ = this.select(this.device$, (device) => device?.lanIp);
  readonly maxPower$ = this.select((state) => state.maxPower);
  readonly batteryQuantity$ = this.select((state) => state.batteryQuantity);
  readonly batteryModuleCapacity$ = this.select((state) => state.batteryModuleCapacity);
  readonly panelTotalCapacity$ = this.select((state) => state.panelPowerOutput * state.panelQuantity);
  readonly showFindHelp$ = this.select((state) => state.showFindHelp);
  readonly showTokenHelp$ = this.select((state) => state.showTokenHelp);
  readonly loading$ = this.select((state) => state.loading);
  readonly error$ = this.select((state) => state.error);

  constructor(
    private readonly batteryService: BatteryService,
    private readonly networkService: NetworkService,
    private readonly store: Store
  ) {
    super({ ...initialState });
  }

  toggleFindHelp(showFindHelp: boolean) {
    this.patchState((state) => ({ showFindHelp }));
  }

  toggleTokenHelp(showTokenHelp: boolean) {
    this.patchState((state) => ({ showTokenHelp }));
  }

  setToken(apiToken: ApiToken) {
    this.patchState((state) => ({ apiToken }));
  }

  setPanelPowerOutput(panelPowerOutput: number) {
    this.patchState((state) => ({ panelPowerOutput }));
  }

  setPanelQuantity(panelQuantity: number) {
    this.patchState((state) => ({ panelQuantity }));
  }

  finish() {
    const { apiToken, device, maxPower, batteryQuantity, batteryModuleCapacity, panelPowerOutput, panelQuantity } =
      this.get();

    const panelCapacity = panelPowerOutput * panelQuantity;
    const configuration: IDeviceConfiguration = {
      apiToken,
      maxPower,
      batteryQuantity,
      batteryModuleCapacity,
      panelCapacity,
    };

    this.store.dispatch(SonnenBatterieActions.finishWizard({ device, configuration }));
  }

  reset() {
    this.setState((state) => ({ ...initialState }));
  }

  readonly findDevice = this.effect((trigger$) => {
    return trigger$.pipe(
      tap(() => this.patchState({ device: null, loading: true, error: null })),
      switchMap(() =>
        this.networkService.find().pipe(
          tapResponse(
            (devices) => this.patchState({ device: devices[0], loading: false }),
            (error) => this.patchState({ error, loading: false })
          )
        )
      )
    );
  });

  readonly testToken = this.effect((trigger$) => {
    return trigger$.pipe(
      tap(() =>
        this.patchState({
          maxPower: null,
          batteryQuantity: null,
          batteryModuleCapacity: null,
          error: null,
          loading: true,
        })
      ),
      concatLatestFrom(() => [this.apiToken$, this.lanIp$]),
      switchMap(([, apiToken, lanIp]) =>
        forkJoin({
          maxPower: this.batteryService.getConfigurationAsNumber(
            ConfigurationKey.IC_InverterMaxPower_w,
            apiToken,
            lanIp
          ),
          batteryQuantity: this.batteryService.getConfigurationAsNumber(
            ConfigurationKey.IC_BatteryModules,
            apiToken,
            lanIp
          ),
          batteryModuleCapacity: this.batteryService.getConfigurationAsNumber(
            ConfigurationKey.CM_MarketingModuleCapacity,
            apiToken,
            lanIp
          ),
        }).pipe(
          tapResponse(
            (configurations) => {
              const { maxPower, batteryQuantity, batteryModuleCapacity } = configurations;
              this.patchState({
                maxPower,
                batteryQuantity,
                batteryModuleCapacity,
                loading: false,
              });
            },
            (error) => this.patchState({ error, loading: false })
          )
        )
      )
    );
  });
}
