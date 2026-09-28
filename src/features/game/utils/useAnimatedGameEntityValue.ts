import React from 'react';
import { Animated, Easing } from 'react-native';

import type { GameEntityEasing } from '../../../types/gamePresentation';

/*** Animate one bound numeric GameEntity presentation value toward its latest session-driven target. */
export function useAnimatedGameEntityValue(
  target: number,
  durationMs: number,
  easing: GameEntityEasing,
): Animated.Value {
  const [value] = React.useState(() => new Animated.Value(target));

  React.useEffect(() => {
    value.stopAnimation();

    if (durationMs === 0) {
      value.setValue(target);
      return undefined;
    }

    const animation = Animated.timing(value, {
      toValue: target,
      duration: durationMs,
      easing: resolveGameEntityEasing(easing),
      useNativeDriver: false,
    });
    animation.start();
    return () => animation.stop();
  }, [durationMs, easing, target, value]);

  return value;
}

/*** Map serializable easing names onto React Native easing functions. */
function resolveGameEntityEasing(easing: GameEntityEasing) {
  if (easing === 'ease-in') return Easing.in(Easing.ease);
  if (easing === 'ease-out') return Easing.out(Easing.ease);
  if (easing === 'ease-in-out') return Easing.inOut(Easing.ease);
  return Easing.linear;
}
