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
import { InputSelectors } from 'src/app/store/input';

export interface IWizardState {
  device: Device;
  apiToken: ApiToken;
  solarMaxPower: number;
  maxPower: number;
  batteryQuantity: number;
  batteryModuleCapacity: number;
  showFindHelp: boolean;
  showTokenHelp: boolean;
  showMaxSolarHelp: boolean;
  loading: boolean;
  error: unknown;
}

export const initialState: IWizardState = {
  device: null,
  apiToken: null,
  solarMaxPower: null,
  maxPower: null,
  batteryQuantity: null,
  batteryModuleCapacity: null,
  showFindHelp: false,
  showTokenHelp: false,
  showMaxSolarHelp: false,
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
  readonly solarMaxPower$ = this.select((state) => state.solarMaxPower);
  readonly showFindHelp$ = this.select((state) => state.showFindHelp);
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

  readonly findPreviousApiToken = this.effect(() =>
    this.store
      .select(InputSelectors.selectApiToken)
      .pipe(tap((apiToken: ApiToken) => this.patchState({ ...(apiToken && { apiToken }) })))
  );

  readonly findPreviousSolarMaxPower = this.effect(() =>
    this.store
      .select(InputSelectors.selectSolarMaxPower)
      .pipe(tap((solarMaxPower: number) => this.patchState({ ...(solarMaxPower && { solarMaxPower }) })))
  );

  readonly findDevice = this.effect((trigger$) =>
    trigger$.pipe(
      tap(() => this.patchState({ device: null, loading: true, error: null })),
      switchMap(() =>
        this.networkService.find().pipe(
          tapResponse(
            (devices) => this.patchState({ device: devices[0], loading: false }),
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
          catchError((error) => of({}).pipe(tap(() => this.patchState({ error, loading: false }))))
        )
      )
    );
  });
}
