import { createAction } from '@ngrx/store';

export const PLATFORM_READY = '[Platform] Ready';
export const PLATFORM_STOP = '[Platform] Stop';

export const platformReady = createAction(PLATFORM_READY);
export const platformStop = createAction(PLATFORM_STOP);
