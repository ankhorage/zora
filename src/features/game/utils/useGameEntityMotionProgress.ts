import React from 'react';
import { Animated, Easing } from 'react-native';

import type { GameEntityEasing } from '../../../types/gamePresentation';
import type { GameEntityMotionPlan } from './resolveGameEntityMotionPlan';

interface MotionAnimationInput {
  readonly durationMs: number;
  readonly delayMs: number;
  readonly easing: GameEntityEasing;
  readonly repeat: boolean;
  readonly alternate: boolean;
}

/*** Drive one optional relative GameEntity motion timeline without changing game-session state. */
export function useGameEntityMotionProgress(plan: GameEntityMotionPlan): Animated.Value {
  const [progress] = React.useState(() => new Animated.Value(0));
  const signature = createMotionSignature(plan);
  const previousSignature = React.useRef(signature);
  const {
    motionEnabled,
    motionPaused,
    motionDurationMs,
    motionDelayMs,
    motionEasing,
    motionRepeat,
    motionAlternate,
  } = plan;

  React.useEffect(() => {
    progress.stopAnimation();

    if (!motionEnabled) {
      progress.setValue(0);
      return undefined;
    }

    if (previousSignature.current !== signature) {
      progress.setValue(0);
      previousSignature.current = signature;
    }

    if (motionPaused) return undefined;

    const animation = createMotionAnimation(progress, {
      durationMs: motionDurationMs,
      delayMs: motionDelayMs,
      easing: motionEasing,
      repeat: motionRepeat,
      alternate: motionAlternate,
    });
    animation.start();
    return () => animation.stop();
  }, [
    motionAlternate,
    motionDelayMs,
    motionDurationMs,
    motionEasing,
    motionEnabled,
    motionPaused,
    motionRepeat,
    progress,
    signature,
  ]);

  return progress;
}

/*** Create the one-shot or repeating React Native motion sequence for one entity. */
function createMotionAnimation(progress: Animated.Value, input: MotionAnimationInput) {
  const forward = () =>
    Animated.timing(progress, {
      toValue: 1,
      duration: input.durationMs,
      easing: resolveMotionEasing(input.easing),
      useNativeDriver: false,
    });
  const reverse = () =>
    Animated.timing(progress, {
      toValue: 0,
      duration: input.durationMs,
      easing: resolveMotionEasing(input.easing),
      useNativeDriver: false,
    });
  const movement = input.alternate
    ? Animated.loop(Animated.sequence([forward(), reverse()]))
    : input.repeat
      ? Animated.loop(forward())
      : forward();

  return input.delayMs === 0
    ? movement
    : Animated.sequence([Animated.delay(input.delayMs), movement]);
}

/*** Create a stable signature for motion parameters that should restart the relative timeline. */
function createMotionSignature(plan: GameEntityMotionPlan): string {
  return [
    plan.motionDurationMs,
    plan.motionDelayMs,
    plan.motionEasing,
    plan.motionEnabled,
    plan.motionRepeat,
    plan.motionAlternate,
  ].join(':');
}

/*** Map serializable timeline easing names onto React Native easing functions. */
function resolveMotionEasing(easing: GameEntityEasing) {
  if (easing === 'ease-in') return Easing.in(Easing.ease);
  if (easing === 'ease-out') return Easing.out(Easing.ease);
  if (easing === 'ease-in-out') return Easing.inOut(Easing.ease);
  return Easing.linear;
}
