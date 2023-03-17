import { Injectable } from '@angular/core';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { NetworkService } from '../../api/services/network.service';
import { Store } from '@ngrx/store';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { Device } from '../../api/models/network.model';
import { forkJoin, of } from 'rxjs';
import { concatLatestFrom } from '@ngrx/effects';
import { Guid } from 'guid-typescript';
import { BatteryService } from '../../api/services/battery.service';
import { ConfigurationKey } from '../../api/models/battery.model';
import { WizardActions } from '../../store/wizard/wizard.actions';
import { ApiToken, WizardOutput } from '../../shared/models/wizard.model';
import { inputFeature, InputState } from '../../store/input/input.reducer';

const MANUAL_SERIAL_NUMBER = 'Unknown';

export interface IWizardState {
  devices: Device[];
  device: Device;
  apiToken: ApiToken;
  solarMaxPower: number;
  maxPower: number;
  batteryQuantity: number;
  batteryModuleCapacity: number;
  showFindHelp: boolean;
  showSelectDevice: boolean;
  showTokenHelp: boolean;
  showMaxSolarHelp: boolean;
  loading: boolean;
  error: unknown;
}

export const initialState: IWizardState = {
  devices: null,
  device: null,
  apiToken: null,
  solarMaxPower: null,
  maxPower: null,
  batteryQuantity: null,
  batteryModuleCapacity: null,
  showFindHelp: false,
  showSelectDevice: false,
  showTokenHelp: false,
  showMaxSolarHelp: false,
  loading: false,
  error: null,
};

export const tokenNotTestedState: Partial<IWizardState> = {
  maxPower: null,
  batteryQuantity: null,
  batteryModuleCapacity: null,
};

@Injectable()
export class WizardPageStore extends ComponentStore<IWizardState> {
  readonly devices$ = this.select((state) => state.devices);
  readonly noDevices$ = this.select(this.devices$, (devices) => devices?.length === 0);
  readonly device$ = this.select((state) => state.device);
  readonly deviceLanIp$ = this.select((state) => state.device?.lanIp);
  readonly deviceAddedManually$ = this.select(this.device$, (device) => device?.serialNumber === MANUAL_SERIAL_NUMBER);
  readonly deviceSelected$ = this.select(this.device$, (device) => !!device);
  readonly multipleDevices$ = this.select(this.devices$, (devices) => devices?.length > 1);
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
  readonly solarMaxPower$ = this.select((state) => state.solarMaxPower);
  readonly showFindHelp$ = this.select((state) => state.showFindHelp);
  readonly showSelectDevice$ = this.select((state) => state.showSelectDevice);
  readonly showTokenHelp$ = this.select((state) => state.showTokenHelp);
  readonly showMaxSolarHelp$ = this.select((state) => state.showMaxSolarHelp);
  readonly loading$ = this.select((state) => state.loading);
  readonly error$ = this.select((state) => state.error);

  constructor(
    private readonly batteryService: BatteryService,
    private readonly networkService: NetworkService,
    private readonly store: Store
  ) {
    super({ ...initialState });

    // Restore some input if it's there (is only the case in the browser)
    const input = localStorage.getItem(inputFeature.name);
    const inputState: InputState = input ? JSON.parse(input) : null;

    if (inputState?.apiToken || inputState?.solarMaxPower) {
      this.patchState({
        ...(inputState.apiToken && { apiToken: inputState?.apiToken }),
        ...(inputState?.solarMaxPower && { solarMaxPower: inputState?.solarMaxPower }),
      });
    }
  }

  selectDevice(device: Device) {
    // Select device and clear any test of a token if tried before
    this.patchState({ device, ...tokenNotTestedState });

    // ion-modal needs device set and modal dismiss in separate operations to work, thus this hack
    setTimeout(() => this.patchState({ showSelectDevice: false }));
  }

  toggleSelectDevice() {
    this.patchState({ showSelectDevice: !this.get().showSelectDevice });
  }

  toggleFindHelp(showFindHelp: boolean) {
    this.patchState(() => ({ showFindHelp }));
  }

  toggleTokenHelp(showTokenHelp: boolean) {
    this.patchState(() => ({ showTokenHelp }));
  }

  toggleMaxSolarHelp(showMaxSolarHelp: boolean) {
    this.patchState(() => ({ showMaxSolarHelp }));
  }

  setToken(apiToken: ApiToken) {
    this.patchState(() => ({ apiToken }));
  }

  setSolarPowerOutput(solarMaxPower: number) {
    this.patchState(() => ({ solarMaxPower }));
  }

  finish() {
    const { device, solarMaxPower, apiToken, maxPower, batteryQuantity, batteryModuleCapacity } = this.get();
    const output: WizardOutput = {
      apiToken,
      maxPower,
      batteryQuantity,
      batteryModuleCapacity,
      solarMaxPower,
    };

    this.store.dispatch(WizardActions.finishWizard({ device, output }));
  }

  reset() {
    this.setState(() => ({ ...initialState }));
  }

  addDeviceManually(lanIp: string) {
    const device: Device = { lanIp, ca20: true, info: 'sonnenBatterie', serialNumber: MANUAL_SERIAL_NUMBER };
    this.patchState({ device, devices: [device], error: null, ...tokenNotTestedState });
  }

  readonly findDevices = this.effect((trigger$) =>
    trigger$.pipe(
      tap(() => this.patchState({ devices: null, device: null, loading: true, error: null })),
      switchMap(() =>
        this.networkService.find().pipe(
          tapResponse(
            (devices) =>
              this.patchState({
                devices,
                ...(devices?.length === 1 && { device: devices[0] }),
                ...(devices?.length > 1 && { showSelectDevice: true }),
                loading: false,
              }),
            (error) => this.patchState({ error, loading: false })
          )
        )
      )
    )
  );

  readonly testToken = this.effect((trigger$) => {
    return trigger$.pipe(
      concatLatestFrom(() => [this.apiToken$, this.lanIp$]),
      tap(() =>
        this.patchState({
          maxPower: null,
          batteryQuantity: null,
          batteryModuleCapacity: null,
          error: null,
          loading: true,
        })
      ),
      switchMap(([, apiToken, lanIp]) =>
        // This ping is redundant unless user haven't given permissions to local area network access
        this.batteryService.pingLan(apiToken, lanIp).pipe(
          switchMap(() =>
            forkJoin([
              this.batteryService.getConfigurationAsNumber(ConfigurationKey.IC_InverterMaxPower_w, apiToken, lanIp),
              this.batteryService.getConfigurationAsNumber(ConfigurationKey.IC_BatteryModules, apiToken, lanIp),
              this.batteryService.getConfigurationAsNumber(
                ConfigurationKey.CM_MarketingModuleCapacity,
                apiToken,
                lanIp
              ),
            ]).pipe(
              tapResponse(
                ([maxPower, batteryQuantity, batteryModuleCapacity]) => {
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
          ),
          // If pingLan fails we're on iOS and the user was permission prompted
          catchError(() => of({}).pipe(tap(() => this.patchState({ loading: false }))))
        )
      )
    );
  });
}
