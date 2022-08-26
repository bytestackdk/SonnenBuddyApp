import { createFeature, createReducer, on } from '@ngrx/store';
import * as fromActions from './devices.actions';
import * as fromPlatform from '../platform';
import { IDeviceDetails } from '../../shared/models/device-details.model';
import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { LoadingState } from 'src/app/shared/models/loading-state.model';
import { IDevice } from '../../api/models/network.model';

export const adapter = createEntityAdapter<IDevice>({
  selectId: (device) => device.serialNumber,
});

export interface DevicesState extends EntityState<IDevice>, LoadingState {
  activeDeviceSerialNumber: number;
  details: Record<number, IDeviceDetails>;
}

export const initialState: DevicesState = adapter.getInitialState({
  activeDeviceSerialNumber: null,
  details: {},
  ...LoadingState.initial(),
});

export const devicesFeature = createFeature({
  name: 'devices',
  reducer: createReducer(
    initialState,

    on(fromActions.clearDevices, (state) => ({
      ...adapter.removeAll(state),
      details: {},
    })),
    on(fromActions.findDevices, (state) => ({
      ...state,
      ...LoadingState.loading(),
    })),
    on(
      fromActions.findDevicesSuccess,
      (state, { devices }): DevicesState => ({
        ...adapter.setAll(devices, state),
        activeDeviceSerialNumber: devices[0]?.serialNumber,
        ...LoadingState.loaded(),
      })
    ),
    on(fromActions.findDevicesFailed, (state, { error }) => ({
      ...state,
      ...LoadingState.failed(error),
    })),
    on(
      fromActions.finishWizard,
      (state, { apiToken, device, batteryModuleCapacity, batteryQuantity, maxPower, panelCapacity }) => ({
        ...adapter.setAll([device], state),
        activeDeviceSerialNumber: device.serialNumber,
        details: {
          [device.serialNumber]: { apiToken, batteryModuleCapacity, batteryQuantity, maxPower, panelCapacity },
        },
      })
    ),
    on(fromPlatform.resetApp, (state) => ({
      ...adapter.removeAll(state),
      activeDeviceSerialNumber: null,
      details: {},
    }))

    // From sonnenBatterie
    // on(
    //   fromActions.getInverterMaxPowerSuccess,
    //   (state, { maxPower }): DevicesState => ({
    //     ...adapter.updateOne({ id: state.activeDevice, changes: { maxPower } }, state),
    //   })
    // ),
    // on(
    //   fromActions.getBatteryQuantitySuccess,
    //   (state, { batteryQuantity }): DevicesState => ({
    //     ...adapter.updateOne({ id: state.activeDevice, changes: { batteryQuantity } }, state),
    //   })
    // ),
    // on(
    //   fromActions.getBatteryModuleCapacitySuccess,
    //   (state, { batteryModuleCapacity }): DevicesState => ({
    //     ...adapter.updateOne({ id: state.activeDevice, changes: { batteryModuleCapacity } }, state),
    //   })
    // ),

    // From the user
    // on(fromActions.setToken, (state, { apiToken }) => ({
    //   ...adapter.updateOne({ id: state.activeDevice, changes: { apiToken } }, state),
    // })),
    // on(fromActions.setPanelCapacity, (state, { panelCapacity }) => ({
    //   ...adapter.updateOne({ id: state.activeDevice, changes: { panelCapacity } }, state),
    // }))
  ),
});

const { selectAll } = adapter.getSelectors();

export const selectAllDevices = selectAll;
