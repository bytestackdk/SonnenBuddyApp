import { createFeature, createReducer, on } from '@ngrx/store';
import * as fromActions from './sonnen-batterie.actions';
import * as fromPlatform from '../platform';
import { IDeviceConfiguration } from '../../shared/models/sonnen-batterie.model';
import { LoadingState } from 'src/app/shared/models/loading-state.model';
import { IDevice } from '../../api/models/network.model';
import { ConfigurationKey, OperatingMode } from '../../api/models/battery.model';

export interface SonnenBatterieState extends LoadingState {
  device: IDevice;
  configuration: IDeviceConfiguration;
}

export const initialState: SonnenBatterieState = {
  device: null,
  configuration: null,
  ...LoadingState.initial(),
};

export const sonnenBatterieFeature = createFeature({
  name: 'sonnenBatterie',
  reducer: createReducer(
    initialState,

    on(fromActions.clearDevice, (state) => ({
      ...state,
      device: null,
    })),
    on(fromActions.finishWizard, (state, { device, configuration }) => ({
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
    on(fromActions.findDevice, fromActions.getConfiguration, (state) => ({
      ...state,
      ...LoadingState.loading(),
    })),

    // Failed
    // ====================================================================================
    on(fromActions.findDeviceFailed, fromActions.getConfigurationFailed, (state, { error }) => ({
      ...state,
      ...LoadingState.failed(error),
    })),

    // Find device
    // ====================================================================================
    on(
      fromActions.findDeviceSuccess,
      (state, { device }): SonnenBatterieState => ({
        ...state,
        device,
        ...LoadingState.loaded(),
      })
    ),

    // Get configuration
    // ====================================================================================
    on(
      fromActions.getConfigurationSuccess,
      (state, { key, configuration }): SonnenBatterieState => ({
        ...state,
        configuration: {
          ...state.configuration,
          ...(key === ConfigurationKey.EM_OperatingMode && { operatingMode: configuration as OperatingMode }),
        },
        ...LoadingState.loaded(),
      })
    ),

    // Set configuration
    // ====================================================================================
    on(fromActions.setConfiguration, (state, { key, configuration }) => ({
      ...state,
      // Set configuration optimistically
      configuration: {
        ...state.configuration,
        // Individual mapping from enum names to something meaningful
        ...(key === ConfigurationKey.EM_OperatingMode && { operatingMode: configuration as OperatingMode }),
      },
      ...LoadingState.loading(),
    })),
    on(
      fromActions.setConfigurationSuccess,
      (state): SonnenBatterieState => ({
        ...state,
        ...LoadingState.loaded(),
      })
    ),
    on(fromActions.setConfigurationFailed, (state, { error, oldConfiguration }) => ({
      ...state,
      // Revert changes to the old configuration object
      configuration: oldConfiguration,
      ...LoadingState.failed(error),
    }))
  ),
});
