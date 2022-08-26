import { createAction } from '@ngrx/store';

export const PLATFORM_READY = '[Platform] Ready';
export const PLATFORM_STOP = '[Platform] Stop';

export const platformReady = createAction(PLATFORM_READY);
export const platformStop = createAction(PLATFORM_STOP);

export const USING_KNOWN_ACTIVE_DEVICE = '[Platform] Using known active device';
export const usingKnownActiveDevice = createAction(USING_KNOWN_ACTIVE_DEVICE);

export const NO_ACTIVE_DEVICE_EXISTS = '[Platform] No active device exists';
export const noActiveDeviceExists = createAction(NO_ACTIVE_DEVICE_EXISTS);

export const CHECK_ACTIVE_DEVICE_RESPONDING = '[Platform] Check if active device is responding...';
export const ACTIVE_DEVICE_RESPONDING = '[Platform] Active device is responding';
export const ACTIVE_DEVICE_NOT_RESPONDING = '[Platform] Current device is NOT responding';

export const checkActiveDeviceResponding = createAction(CHECK_ACTIVE_DEVICE_RESPONDING);
export const activeDeviceResponding = createAction(ACTIVE_DEVICE_RESPONDING);
export const activeDeviceNotResponding = createAction(ACTIVE_DEVICE_NOT_RESPONDING);

export const CHECK_ONLINE = '[Platform] Check online';
export const ONLINE = '[Platform] Online';
export const OFFLINE = '[Platform] Offline';

export const checkOnline = createAction(CHECK_ONLINE);
export const online = createAction(ONLINE);
export const offline = createAction(OFFLINE);

export const DEVICE_NOT_FOUND = '[Platform] Device not found';
export const deviceNotFound = createAction(DEVICE_NOT_FOUND);

export const DEVICE_FOUND_BUT_NO_CONNECTION = '[Platform] Device found but no connection';
export const deviceFoundButNoConnection = createAction(DEVICE_FOUND_BUT_NO_CONNECTION);

export const GOTO_WIZARD = '[Platform] Goto wizard';
export const gotoWizard = createAction(GOTO_WIZARD);

export const GOTO_LIVE_PAGE = '[Platform] Goto live page';
export const gotoLivePage = createAction(GOTO_LIVE_PAGE);

export const RESET_APP = '[Platform] Reset app';
export const resetApp = createAction(RESET_APP);
