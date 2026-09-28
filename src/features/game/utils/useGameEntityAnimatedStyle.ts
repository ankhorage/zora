import { Animated } from 'react-native';

import type { GameEntityProps } from '../../../types/gamePresentation';
import { resolveGameEntityMotionPlan } from './resolveGameEntityMotionPlan';
import { useAnimatedGameEntityValue } from './useAnimatedGameEntityValue';
import { useGameEntityMotionProgress } from './useGameEntityMotionProgress';
import { useGameReducedMotion } from './useGameReducedMotion';

interface GameEntityAnimatedValues {
  readonly x: Animated.Value;
  readonly y: Animated.Value;
  readonly opacity: Animated.Value;
  readonly scale: Animated.Value;
  readonly rotation: Animated.Value;
  readonly progress: Animated.Value;
}

/*** Compose bound GameEntity values with optional relative presentation motion. */
export function useGameEntityAnimatedStyle(input: GameEntityProps) {
  const reduceMotion = useGameReducedMotion();
  const plan = resolveGameEntityMotionPlan(input, reduceMotion);
  const values: GameEntityAnimatedValues = {
    x: useAnimatedGameEntityValue(input.x ?? 0, plan.transitionDurationMs, plan.transitionEasing),
    y: useAnimatedGameEntityValue(input.y ?? 0, plan.transitionDurationMs, plan.transitionEasing),
    opacity: useAnimatedGameEntityValue(
      input.opacity ?? 1,
      plan.transitionDurationMs,
      plan.transitionEasing,
    ),
    scale: useAnimatedGameEntityValue(
      input.scale ?? 1,
      plan.transitionDurationMs,
      plan.transitionEasing,
    ),
    rotation: useAnimatedGameEntityValue(
      input.rotation ?? 0,
      plan.transitionDurationMs,
      plan.transitionEasing,
    ),
    progress: useGameEntityMotionProgress(plan),
  };

  return createGameEntityAnimatedStyle(values, input);
}

/*** Build one animated React Native style from base values and relative motion progress. */
function createGameEntityAnimatedStyle(values: GameEntityAnimatedValues, input: GameEntityProps) {
  const left = Animated.add(values.x, Animated.multiply(values.progress, input.motionOffsetX ?? 0));
  const top = Animated.add(values.y, Animated.multiply(values.progress, input.motionOffsetY ?? 0));
  const opacity = Animated.add(
    values.opacity,
    Animated.multiply(values.progress, input.motionOpacityDelta ?? 0),
  );
  const scale = Animated.add(
    values.scale,
    Animated.multiply(values.progress, input.motionScaleDelta ?? 0),
  );
  const rotation = Animated.add(
    values.rotation,
    Animated.multiply(values.progress, input.motionRotationDelta ?? 0),
  );

  return {
    left: left.interpolate({
      inputRange: [-10_000, 10_000],
      outputRange: ['-10000%', '10000%'],
    }),
    top: top.interpolate({
      inputRange: [-10_000, 10_000],
      outputRange: ['-10000%', '10000%'],
    }),
    opacity: opacity.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1],
      extrapolate: 'clamp',
    }),
    transform: [
      { scale },
      {
        rotate: rotation.interpolate({
          inputRange: [-36_000, 36_000],
          outputRange: ['-36000deg', '36000deg'],
        }),
      },
    ],
  };
}
