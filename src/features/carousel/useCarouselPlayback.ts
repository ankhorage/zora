import React from 'react';
import { AccessibilityInfo, Animated, Easing } from 'react-native';

import type { CarouselProps } from '../../types/carousel';

/*** Own controlled/uncontrolled slide navigation, autoplay, and progress lifecycle. */
export function useCarouselPlayback({
  slides,
  index,
  defaultIndex = 0,
  onIndexChange,
  autoPlay = true,
  paused = false,
  loop = true,
  intervalMs = 6000,
  reducedMotion,
}: CarouselPlaybackOptions) {
  const [uncontrolledIndex, setUncontrolledIndex] = React.useState(defaultIndex);
  const [direction, setDirection] = React.useState<1 | -1>(1);
  const [progress] = React.useState(() => new Animated.Value(0));
  const systemReducedMotion = useSystemReducedMotion();
  const shouldReduceMotion = reducedMotion ?? systemReducedMotion;
  const activeIndex = normalizeIndex(index ?? uncontrolledIndex, slides.length);
  const duration = Math.max(1, intervalMs);
  const controlledWithoutHandler = index !== undefined && onIndexChange === undefined;
  const canAdvance = loop || activeIndex < slides.length - 1;
  const shouldPlay =
    autoPlay && !paused && slides.length > 1 && canAdvance && !controlledWithoutHandler;

  const navigate = React.useCallback(
    (target: number, nextDirection: 1 | -1) => {
      if (slides.length < 2 || controlledWithoutHandler) return;
      const next = loop
        ? (target + slides.length) % slides.length
        : normalizeIndex(target, slides.length);
      if (next === activeIndex) return;
      setDirection(nextDirection);
      if (index === undefined) setUncontrolledIndex(next);
      onIndexChange?.(next);
    },
    [activeIndex, controlledWithoutHandler, index, loop, onIndexChange, slides.length],
  );

  React.useEffect(() => {
    if (!shouldPlay) return;
    const timeout = setTimeout(() => navigate(activeIndex + 1, 1), duration);
    return () => clearTimeout(timeout);
  }, [activeIndex, duration, navigate, shouldPlay]);

  React.useEffect(() => {
    progress.stopAnimation();
    progress.setValue(0);
    if (!shouldPlay || shouldReduceMotion) return;
    const animation = Animated.timing(progress, {
      toValue: 1,
      duration,
      easing: Easing.linear,
      useNativeDriver: true,
      isInteraction: false,
    });
    animation.start();
    return () => animation.stop();
  }, [activeIndex, duration, progress, shouldPlay, shouldReduceMotion]);

  return {
    activeIndex,
    controlledWithoutHandler,
    direction,
    loop,
    navigate,
    progress,
    shouldReduceMotion,
  } as const;
}

type CarouselPlaybackOptions = Pick<
  CarouselProps,
  | 'slides'
  | 'index'
  | 'defaultIndex'
  | 'onIndexChange'
  | 'autoPlay'
  | 'paused'
  | 'loop'
  | 'intervalMs'
  | 'reducedMotion'
>;

/*** Clamp a controlled index whenever the consumer changes the slide collection. */
function normalizeIndex(value: number, count: number): number {
  if (count <= 0 || !Number.isFinite(value)) return 0;
  return Math.min(Math.max(Math.trunc(value), 0), count - 1);
}

/*** Observe reduced-motion preferences without adding browser-only imports. */
function useSystemReducedMotion(): boolean {
  const [reduced, setReduced] = React.useState(false);
  React.useEffect(() => {
    void AccessibilityInfo.isReduceMotionEnabled().then(setReduced);
    const listener = AccessibilityInfo.addEventListener('reduceMotionChanged', setReduced);
    return () => listener.remove();
  }, []);
  return reduced;
}
