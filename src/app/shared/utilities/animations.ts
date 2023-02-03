import {
  animate,
  AnimationTransitionMetadata,
  AnimationTriggerMetadata,
  style,
  transition,
  trigger,
} from '@angular/animations';

const heightFadeTransition = (
  expr: string,
  height: [number, number],
  opacity: [number, number],
  duration: number,
  delay: number
): AnimationTransitionMetadata => {
  const [heightFrom, heightTo] = height;
  const [opacityFrom, opacityTo] = opacity;

  return transition(expr, [
    style({ 'max-height': heightFrom, opacity: opacityFrom }),
    animate(
      delay > 0 ? `${duration}ms ${delay}ms` : `${duration}ms`,
      style({ 'max-height': `${heightTo}px`, opacity: opacityTo })
    ),
  ]);
};

export const enterFadeAnimation = (duration = 200): AnimationTriggerMetadata =>
  trigger('enterFadeAnimation', [
    transition(':enter', [style({ opacity: 0 }), animate(`${duration}ms`, style({ opacity: 1 }))]),
  ]);

export const enterAndLeaveFadeAnimation = (duration = 200): AnimationTriggerMetadata =>
  trigger('enterAndLeaveFadeAnimation', [
    transition(':enter', [style({ opacity: 0 }), animate(`${duration}ms`, style({ opacity: 1 }))]),
    transition(':leave', [style({ opacity: 1 }), animate(`${duration}ms`, style({ opacity: 0 }))]),
  ]);

export const enterFadeWithHeightTrigger = (height: number, duration = 200): AnimationTriggerMetadata =>
  trigger('enterFadeWithHeightAnimation', [heightFadeTransition(':enter', [0, height], [0, 1], duration, 0)]);

export const enterAndLeaveFadeWithHeightTrigger = (
  height: number,
  duration = 200,
  delay = 0
): AnimationTriggerMetadata =>
  trigger('enterAndLeaveFadeWithHeightAnimation', [
    heightFadeTransition(':enter', [0, height], [0, 1], duration, delay),
    heightFadeTransition(':leave', [height, 0], [1, 0], duration, delay),
  ]);
