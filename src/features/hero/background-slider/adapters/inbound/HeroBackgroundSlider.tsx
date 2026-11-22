import React from 'react';
import {
  AccessibilityInfo,
  Animated,
  Easing,
  Image,
  type ImageResizeMode,
  type ImageSourcePropType,
  Pressable,
  StyleSheet,
} from 'react-native';

import type {
  HeroBackgroundSlide,
  HeroBackgroundSliderProps,
} from '../../../../../types/hero-background-slider';
import { useZoraTheme } from '../../../../theme/composition/useZoraTheme';

/***
 * Cross-platform background slideshow with synchronized index reporting.
 * The image host, overlay, copy, and brand treatment remain consumer-owned.
 */
export function HeroBackgroundSlider({
  slides,
  index,
  defaultIndex = 0,
  onIndexChange,
  autoPlay = true,
  paused = false,
  loop = true,
  intervalMs = 6000,
  enterDurationMs = 1200,
  exitDurationMs = 800,
  initialScale = 1.06,
  reducedMotion,
  showProgress = true,
  progressHeight = 4,
  progressTrackColor,
  progressIndicatorColor,
  progressTrackStyle,
  progressIndicatorStyle,
  resizeMode = 'cover',
  imageStyle,
  style,
  renderImage,
  testID,
}: HeroBackgroundSliderProps) {
  const { theme } = useZoraTheme();
  const [uncontrolledIndex, setUncontrolledIndex] = React.useState(defaultIndex);
  const systemReducedMotion = useSystemReducedMotion();
  const shouldReduceMotion = reducedMotion ?? systemReducedMotion;
  const activeIndex = normalizeIndex(index ?? uncontrolledIndex, slides.length);
  const duration = Math.max(1, intervalMs);
  const canAdvance = loop || activeIndex < slides.length - 1;
  const shouldPlay = autoPlay && !paused && slides.length > 1 && canAdvance;
  const [progress] = React.useState(() => new Animated.Value(0));

  React.useEffect(() => {
    if (!shouldPlay || (index !== undefined && onIndexChange === undefined)) return;
    const timeout = setTimeout(() => {
      const nextIndex = loop ? (activeIndex + 1) % slides.length : activeIndex + 1;
      if (index === undefined) setUncontrolledIndex(nextIndex);
      onIndexChange?.(nextIndex);
    }, duration);
    return () => clearTimeout(timeout);
  }, [activeIndex, duration, index, loop, onIndexChange, shouldPlay, slides.length]);

  React.useEffect(() => {
    progress.stopAnimation();
    progress.setValue(0);
    if (!shouldPlay || (index !== undefined && onIndexChange === undefined)) return;
    if (shouldReduceMotion) return;
    const animation = Animated.timing(progress, {
      toValue: 1,
      duration,
      easing: Easing.linear,
      useNativeDriver: false,
    });
    animation.start();
    return () => animation.stop();
  }, [activeIndex, duration, index, onIndexChange, progress, shouldPlay, shouldReduceMotion]);

  if (slides.length === 0) return null;

  return (
    <Pressable
      accessible={false}
      pointerEvents="none"
      testID={testID}
      style={[StyleSheet.absoluteFill, { overflow: 'hidden' }, style]}
    >
      {slides.map((slide, slideIndex) => (
        <HeroBackgroundSlideLayer
          key={slideIndex}
          active={activeIndex === slideIndex}
          animate={slides.length > 1}
          enterDurationMs={enterDurationMs}
          exitDurationMs={exitDurationMs}
          imageStyle={imageStyle}
          initialScale={initialScale}
          reducedMotion={shouldReduceMotion}
          renderImage={renderImage}
          resizeMode={resizeMode}
          slide={slide}
          slideIndex={slideIndex}
        />
      ))}
      {showProgress && slides.length > 1 ? (
        <Animated.View
          pointerEvents="none"
          testID={testID ? `${testID}-progress` : undefined}
          style={[
            {
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: progressHeight,
              backgroundColor: progressTrackColor ?? theme.semantics.neutral.divider,
              overflow: 'hidden',
              zIndex: 10,
            },
            progressTrackStyle,
          ]}
        >
          <Animated.View
            style={[
              {
                width: progress.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0%', '100%'],
                }),
                height: '100%',
                backgroundColor: progressIndicatorColor ?? theme.colors.primary,
              },
              progressIndicatorStyle,
            ]}
          />
        </Animated.View>
      ) : null}
    </Pressable>
  );
}

interface HeroBackgroundSlideLayerProps {
  readonly slide: HeroBackgroundSlide;
  readonly slideIndex: number;
  readonly active: boolean;
  readonly animate: boolean;
  readonly enterDurationMs: number;
  readonly exitDurationMs: number;
  readonly initialScale: number;
  readonly reducedMotion: boolean;
  readonly resizeMode: ImageResizeMode;
  readonly imageStyle: HeroBackgroundSliderProps['imageStyle'];
  readonly renderImage: HeroBackgroundSliderProps['renderImage'];
}

/*** Keeps every image layer mounted so a departing slide can fade out. */
function HeroBackgroundSlideLayer({
  slide,
  slideIndex,
  active,
  animate,
  enterDurationMs,
  exitDurationMs,
  initialScale,
  reducedMotion,
  resizeMode,
  imageStyle,
  renderImage,
}: HeroBackgroundSlideLayerProps) {
  const [opacity] = React.useState(() => new Animated.Value(active && !animate ? 1 : 0));
  const [scale] = React.useState(() => new Animated.Value(active && animate ? initialScale : 1));
  const wasActive = React.useRef(active);

  React.useEffect(() => {
    opacity.stopAnimation();
    scale.stopAnimation();
    if (!animate || reducedMotion) {
      opacity.setValue(active ? 1 : 0);
      scale.setValue(1);
    } else if (active) {
      if (!wasActive.current) opacity.setValue(0);
      scale.setValue(initialScale);
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: Math.max(0, enterDurationMs),
          easing: Easing.bezier(0.4, 0, 0.2, 1),
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 1,
          duration: Math.max(0, enterDurationMs),
          easing: Easing.bezier(0.4, 0, 0.2, 1),
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.timing(opacity, {
        toValue: 0,
        duration: Math.max(0, exitDurationMs),
        easing: Easing.bezier(0.4, 0, 0.2, 1),
        useNativeDriver: true,
      }).start();
    }
    wasActive.current = active;
    return () => {
      opacity.stopAnimation();
      scale.stopAnimation();
    };
  }, [
    active,
    animate,
    enterDurationMs,
    exitDurationMs,
    initialScale,
    opacity,
    reducedMotion,
    scale,
  ]);

  return (
    <Animated.View
      accessible={false}
      pointerEvents="none"
      style={[StyleSheet.absoluteFill, { opacity, transform: [{ scale }] }]}
    >
      {renderImage ? (
        renderImage(slide, slideIndex)
      ) : (
        <Image
          accessible={false}
          source={resolveSource(slide.source)}
          resizeMode={resizeMode}
          style={[StyleSheet.absoluteFill, imageStyle]}
        />
      )}
    </Animated.View>
  );
}

/*** Resolve string web image paths and native ImageSource objects consistently. */
function resolveSource(source: HeroBackgroundSlide['source']): ImageSourcePropType {
  return typeof source === 'string' ? { uri: source } : source;
}

/*** Constrain an externally supplied index when slides are replaced. */
function normalizeIndex(value: number, count: number): number {
  if (count <= 0 || !Number.isFinite(value)) return 0;
  return Math.min(Math.max(Math.trunc(value), 0), count - 1);
}

/*** Track the operating system's preferred motion policy for web and native. */
function useSystemReducedMotion(): boolean {
  const [reduced, setReduced] = React.useState(false);
  React.useEffect(() => {
    void AccessibilityInfo.isReduceMotionEnabled().then(setReduced);
    const subscription = AccessibilityInfo.addEventListener('reduceMotionChanged', setReduced);
    return () => subscription.remove();
  }, []);
  return reduced;
}
