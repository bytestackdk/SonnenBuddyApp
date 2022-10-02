import { createFeature, createReducer, on } from '@ngrx/store';
import { SonnenBatterieActions } from './sonnen-batterie.actions';
import * as fromPlatform from '../platform';
import { IDeviceConfiguration } from '../../shared/models/sonnen-batterie.model';
import { LoadingState } from 'src/app/shared/models/loading-state.model';
import { IDevice } from '../../api/models/network.model';
import { ConfigurationKey, ISchedule, OperatingMode } from '../../api/models/battery.model';

export const asSchedules = (json: string) => {
  const schedules: ISchedule[] = JSON.parse(json);
  return schedules;
};

export interface SonnenBatterieState extends LoadingState {
  device: IDevice;
  previousConfiguration: IDeviceConfiguration;
  configuration: IDeviceConfiguration;
}

export const initialState: SonnenBatterieState = {
  device: null,
  previousConfiguration: null,
  configuration: null,
  ...LoadingState.initial(),
};

export const sonnenBatterieFeature = createFeature({
  name: 'sonnenBatterie',
  reducer: createReducer(
    initialState,

    on(SonnenBatterieActions.clearDevice, (state) => ({
      ...state,
      device: null,
    })),
    on(SonnenBatterieActions.finishWizard, (state, { device, configuration }) => ({
      ...state,
      device,
      configuration,
    })),
    on(fromPlatform.resetApp, (state) => ({
      ...state,
      device: null,
      configuration: null,
    })),

    // Loading
    // ====================================================================================
    on(SonnenBatterieActions.findDevice, SonnenBatterieActions.getConfiguration, (state) => ({
      ...state,
      ...LoadingState.loading(),
    })),

    // Failed
    // ====================================================================================
    on(SonnenBatterieActions.findDeviceFailed, SonnenBatterieActions.getConfigurationFailed, (state, { error }) => ({
      ...state,
      ...LoadingState.failed(error),
    })),

    // Find device
    // ====================================================================================
    on(
      SonnenBatterieActions.findDeviceSuccess,
      (state, { device }): SonnenBatterieState => ({
        ...state,
        device,
        ...LoadingState.loaded(),
      })
    ),

    // Get configuration
    // ====================================================================================
    on(
      SonnenBatterieActions.getConfigurationSuccess,
      (state, { key, configuration }): SonnenBatterieState => ({
        ...state,
        configuration: {
          ...state.configuration,
          ...(key === ConfigurationKey.EM_OperatingMode && { operatingMode: configuration as OperatingMode }),
          ...(key === ConfigurationKey.EM_ToU_Schedule && { schedules: asSchedules(configuration) }),
          // ...(key === ConfigurationKey.EM_Prognosis_Charging && { prognosisCharging: configuration === '1' }),
        },
        ...LoadingState.loaded(),
      })
    ),

    // Set configuration
    // ====================================================================================
    on(SonnenBatterieActions.setConfiguration, (state, { key, configuration }) => ({
      ...state,
      previousConfiguration: { ...state.configuration },
      // Set configuration optimistically because we back up current as previous
      configuration: {
        ...state.configuration,
        // Individual mapping from enum names to something meaningful
        ...(key === ConfigurationKey.EM_OperatingMode && { operatingMode: configuration as OperatingMode }),
        ...(key === ConfigurationKey.EM_ToU_Schedule && { schedules: asSchedules(configuration) }),
      },
      ...LoadingState.loading(),
    })),
    on(
      SonnenBatterieActions.setConfigurationSuccess,
      (state): SonnenBatterieState => ({
        ...state,
        ...LoadingState.loaded(),
      })
    ),
    on(SonnenBatterieActions.setConfigurationFailed, (state, { error }) => ({
      ...state,
      // Revert changes to the old configuration object
      configuration: { ...state.previousConfiguration },
      ...LoadingState.failed(error),
    }))
  ),
});
