import { Injectable } from '@angular/core';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { ApiToken } from '../../shared/models/device-details.model';
import { WizardPageService } from './wizard-page.service';
import { NetworkService } from '../../api/services/network.service';
import { Store } from '@ngrx/store';
import { switchMap, tap } from 'rxjs/operators';
import { IDevice } from '../../api/models/network.model';
import { forkJoin } from 'rxjs';
import { concatLatestFrom } from '@ngrx/effects';
import { Guid } from 'guid-typescript';
import * as fromDevices from '../../store/devices';

export interface IWizardState {
  device: IDevice;
  apiToken: ApiToken;
  panelPowerOutput: number;
  panelQuantity: number;
  maxPower: number;
  batteryQuantity: number;
  batteryModuleCapacity: number;
  loading: boolean;
  error: any;
}

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
  readonly loading$ = this.select((state) => state.loading);
  readonly error$ = this.select((state) => state.error);

  constructor(
    private readonly wizardService: WizardPageService,
    private readonly networkService: NetworkService,
    private readonly store: Store
  ) {
    super({
      device: null,
      apiToken: null,
      panelPowerOutput: null,
      panelQuantity: null,
      maxPower: null,
      batteryQuantity: null,
      batteryModuleCapacity: null,
      loading: false,
      error: null,
    });
  }

  setToken(apiToken: ApiToken) {
    this.patchState((state) => ({
      apiToken,
    }));
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

    this.store.dispatch(
      fromDevices.finishWizard({ apiToken, device, maxPower, batteryQuantity, batteryModuleCapacity, panelCapacity })
    );
  }

  readonly find = this.effect((trigger$) => {
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
          maxPower: this.wizardService.getInverterMaxPower(apiToken, lanIp),
          batteryQuantity: this.wizardService.getBatteryQuantity(apiToken, lanIp),
          batteryModuleCapacity: this.wizardService.getBatteryModuleCapacity(apiToken, lanIp),
        }).pipe(
          tapResponse(
            (configurations) => {
              const { maxPower, batteryQuantity, batteryModuleCapacity } = configurations;
              this.patchState({
                maxPower,
                batteryQuantity,
                batteryModuleCapacity,
                apiToken,
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
