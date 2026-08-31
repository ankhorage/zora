import React from 'react';
import { AccessibilityInfo } from 'react-native';

import type { ContentRailMotion } from './types';

export function useContentRailReducedMotion(motion: ContentRailMotion): boolean {
  const [systemReducedMotion, setSystemReducedMotion] = React.useState(false);

  React.useEffect(() => {
    if (motion !== 'system') return;

    let active = true;
    void AccessibilityInfo.isReduceMotionEnabled().then((enabled) => {
      if (active) setSystemReducedMotion(enabled);
    });
    const subscription = AccessibilityInfo.addEventListener(
      'reduceMotionChanged',
      setSystemReducedMotion,
    );

    return () => {
      active = false;
      subscription.remove();
    };
  }, [motion]);

  return motion === 'reduced' || (motion === 'system' && systemReducedMotion);
}
