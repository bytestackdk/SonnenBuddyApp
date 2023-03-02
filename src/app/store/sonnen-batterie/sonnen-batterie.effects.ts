import { Injectable } from '@angular/core';
import { catchError, concatMap, exhaustMap, map } from 'rxjs/operators';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { Store } from '@ngrx/store';
import { NetworkService } from '../../api/services/network.service';
import { SonnenBatterieActions, SonnenBatterieSelectors } from './';
import { PlatformActions } from '../platform';
import { BatteryService } from '../../api/services/battery.service';
import { ConfigurationKey } from '../../api/models/battery.model';
import { WizardActions } from '../wizard/wizard.actions';

@Injectable()
export class SonnenBatterieEffects {
  constructor(
    private readonly actions$: Actions,
    private readonly store: Store,
    private readonly deviceService: NetworkService,
    private readonly batteryService: BatteryService
  ) {}

  finishWizard$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(WizardActions.finishWizard),
      map(() => PlatformActions.gotoLivePage())
    );
  });

  addSchedule$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(SonnenBatterieActions.addSchedule),
      concatLatestFrom(() => this.store.select(SonnenBatterieSelectors.selectSonnenBatterieSchedules)),
      map(([{ schedule }, schedules]) => SonnenBatterieActions.saveSchedules({ schedules: [...schedules, schedule] }))
    );
  });

  updateSchedule$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(SonnenBatterieActions.updateSchedule),
      concatLatestFrom(() => this.store.select(SonnenBatterieSelectors.selectSonnenBatterieSchedules)),
      map(([{ start, schedule }, schedules]) =>
        SonnenBatterieActions.saveSchedules({
          schedules: schedules.map((s) => (s.start === start ? schedule : s)),
        })
      )
    );
  });

  removeSchedule$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(SonnenBatterieActions.removeSchedule),
      concatLatestFrom(() => this.store.select(SonnenBatterieSelectors.selectSonnenBatterieSchedules)),
      map(([{ start }, schedules]) =>
        SonnenBatterieActions.saveSchedules({
          schedules: schedules.filter((s) => s.start !== start),
        })
      )
    );
  });

  clearSchedules$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(SonnenBatterieActions.clearSchedules),
      map(() => SonnenBatterieActions.saveSchedules({ schedules: [] }))
    );
  });

  saveSchedules$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(SonnenBatterieActions.saveSchedules),
      map(({ schedules }) => {
        // API doesn't understand a full 24 hours, so we need a minute less than that
        if (schedules.length === 1) {
          const { start, stop } = schedules[0];

          if (start === '00:00' && stop === '24:00') {
            schedules[0].stop = '23:59';
          }
        }

        // Model stores stop as 24:00 as that helps visuals, but API needs it to be 00:00
        const stopCorrectedSchedules = schedules.map((schedule) =>
          schedule.stop !== '24:00' ? schedule : { ...schedule, stop: '00:00' }
        );

        const configuration = JSON.stringify(stopCorrectedSchedules);
        return SonnenBatterieActions.setConfiguration({ key: ConfigurationKey.EM_ToU_Schedule, configuration });
      })
    );
  });

  getConfiguration$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(SonnenBatterieActions.getConfiguration),
      concatMap(({ key }) =>
        this.batteryService.getConfiguration(key).pipe(
          map((configuration) => SonnenBatterieActions.getConfigurationSuccess({ key, configuration })),
          catchError((error) => of(SonnenBatterieActions.getConfigurationFailed({ error })))
        )
      )
    );
  });

  setConfiguration$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(SonnenBatterieActions.setConfiguration),
      exhaustMap(({ key, configuration }) =>
        this.batteryService.setConfiguration(key, configuration).pipe(
          map((response) =>
            response
              ? SonnenBatterieActions.setConfigurationSuccess({ configuration: response })
              : SonnenBatterieActions.setConfigurationFailed({ error: 'Error saving configuration' })
          ),
          catchError((error) => of(SonnenBatterieActions.setConfigurationFailed({ error })))
        )
      )
    );
  });

  refreshOperatingMode$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(SonnenBatterieActions.refreshConfigurations),
      map(() => SonnenBatterieActions.getConfiguration({ key: ConfigurationKey.EM_OperatingMode }))
    );
  });

  refreshSchedules$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(SonnenBatterieActions.refreshConfigurations),
      map(() => SonnenBatterieActions.getConfiguration({ key: ConfigurationKey.EM_ToU_Schedule }))
    );
  });

  refreshPrognosisCharging$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(SonnenBatterieActions.refreshConfigurations),
      map(() => SonnenBatterieActions.getConfiguration({ key: ConfigurationKey.EM_Prognosis_Charging }))
    );
  });
}
