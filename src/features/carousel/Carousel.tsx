import React from 'react';
import {
  AccessibilityInfo,
  Animated,
  Easing,
  Image,
  type ImageSourcePropType,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import type {
  CarouselProps,
  CarouselSlide,
  CarouselTransition,
} from '../../types/carousel';
import { useZoraTheme } from '../theme/composition/useZoraTheme';

/***
 * Present images, arbitrary React content, or both as a cross-platform slideshow.
 * A published web artifact exposes the same API without consumer source imports.
 */
export function Carousel({
  slides,
  index,
  defaultIndex = 0,
  onIndexChange,
  autoPlay = true,
  paused = false,
  loop = true,
  intervalMs = 6000,
  transition = 'fade',
  enterDurationMs = 1200,
  exitDurationMs = 800,
  initialScale = 1.06,
  animateOnMount = false,
  reducedMotion,
  showProgress = true,
  progressHeight = 4,
  progressTrackColor,
  progressIndicatorColor,
  progressTrackStyle,
  progressIndicatorStyle,
  showArrows = false,
  showIndicators = false,
  previousLabel = 'Previous slide',
  nextLabel = 'Next slide',
  controlColor,
  controlBackgroundColor,
  controlsStyle,
  activeIndicatorColor,
  inactiveIndicatorColor,
  indicatorsStyle,
  resizeMode = 'cover',
  imageStyle,
  style,
  renderImage,
  testID,
}: CarouselProps) {
  const { theme } = useZoraTheme();
  const [uncontrolledIndex, setUncontrolledIndex] = React.useState(defaultIndex);
  const [direction, setDirection] = React.useState<1 | -1>(1);
  const [width, setWidth] = React.useState(0);
  const [progress] = React.useState(() => new Animated.Value(0));
  const systemReducedMotion = useSystemReducedMotion();
  const shouldReduceMotion = reducedMotion ?? systemReducedMotion;
  const activeIndex = normalizeIndex(index ?? uncontrolledIndex, slides.length);
  const duration = Math.max(1, intervalMs);
  const controlledWithoutHandler = index !== undefined && onIndexChange === undefined;
  const canAdvance = loop || activeIndex < slides.length - 1;
  const shouldPlay = autoPlay && !paused && slides.length > 1 && canAdvance && !controlledWithoutHandler;

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
      useNativeDriver: false,
    });
    animation.start();
    return () => animation.stop();
  }, [activeIndex, duration, progress, shouldPlay, shouldReduceMotion]);

  if (slides.length === 0) return null;

  const canPrevious = loop || activeIndex > 0;
  const canNext = loop || activeIndex < slides.length - 1;
  const markerColor = activeIndicatorColor ?? theme.colors.primary;
  const idleMarkerColor = inactiveIndicatorColor ?? theme.semantics.neutral.divider;

  return (
    <View
      onLayout={(event) => setWidth(event.nativeEvent.layout.width)}
      testID={testID}
      style={[{ position: 'relative', overflow: 'hidden', width: '100%', height: '100%' }, style]}
    >
      {slides.map((slide, slideIndex) => (
        <CarouselLayer
          key={slide.key}
          active={activeIndex === slideIndex}
          animate={slides.length > 1}
          animateOnMount={animateOnMount}
          direction={direction}
          enterDurationMs={enterDurationMs}
          exitDurationMs={exitDurationMs}
          imageStyle={imageStyle}
          initialScale={initialScale}
          reducedMotion={shouldReduceMotion}
          renderImage={renderImage}
          resizeMode={resizeMode}
          slide={slide}
          slideIndex={slideIndex}
          transition={transition}
          width={width}
        />
      ))}
      {showArrows && slides.length > 1 ? (
        <View pointerEvents="box-none" style={[styles.controls, controlsStyle]}>
          <Pressable
            accessibilityLabel={previousLabel}
            accessibilityRole="button"
            disabled={!canPrevious || controlledWithoutHandler}
            onPress={() => navigate(activeIndex - 1, -1)}
            style={[
              styles.control,
              { backgroundColor: controlBackgroundColor ?? theme.semantics.surface.raised },
            ]}
            testID={testID ? `${testID}-previous` : undefined}
          >
            <Text style={{ color: controlColor ?? theme.semantics.content.default, fontSize: 30 }}>
              {'‹'}
            </Text>
          </Pressable>
          <Pressable
            accessibilityLabel={nextLabel}
            accessibilityRole="button"
            disabled={!canNext || controlledWithoutHandler}
            onPress={() => navigate(activeIndex + 1, 1)}
            style={[styles.control, { backgroundColor: controlBackgroundColor ?? theme.semantics.surface.raised }]}
            testID={testID ? `${testID}-next` : undefined}
          >
            <Text style={{ color: controlColor ?? theme.semantics.content.default, fontSize: 30 }}>
              {'›'}
            </Text>
          </Pressable>
        </View>
      ) : null}
      {showIndicators && slides.length > 1 ? (
        <View pointerEvents="box-none" style={[styles.indicators, indicatorsStyle]}>
          {slides.map((slide, slideIndex) => (
            <Pressable
              key={slide.key}
              accessibilityLabel={`Go to slide ${slideIndex + 1} of ${slides.length}`}
              accessibilityRole="button"
              accessibilityState={{ selected: slideIndex === activeIndex }}
              disabled={controlledWithoutHandler}
              onPress={() => navigate(slideIndex, slideIndex < activeIndex ? -1 : 1)}
              style={[
                styles.indicator,
                {
                  backgroundColor: slideIndex === activeIndex ? markerColor : idleMarkerColor,
                  width: slideIndex === activeIndex ? 24 : 8,
                },
              ]}
              testID={testID ? `${testID}-indicator-${slideIndex}` : undefined}
            />
          ))}
        </View>
      ) : null}
      {showProgress && slides.length > 1 ? (
        <View
          pointerEvents="none"
          style={[
            styles.progress,
            {
              height: progressHeight,
              backgroundColor: progressTrackColor ?? theme.semantics.neutral.divider,
            },
            progressTrackStyle,
          ]}
          testID={testID ? `${testID}-progress` : undefined}
        >
          <Animated.View
            style={[
              {
                height: '100%',
                width: progress.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }),
                backgroundColor: progressIndicatorColor ?? theme.colors.primary,
              },
              progressIndicatorStyle,
            ]}
          />
        </View>
      ) : null}
    </View>
  );
}

interface CarouselLayerProps
  extends Pick<
    CarouselProps,
    'enterDurationMs' | 'exitDurationMs' | 'imageStyle' | 'initialScale' | 'renderImage' | 'resizeMode'
  > {
  readonly slide: CarouselSlide;
  readonly slideIndex: number;
  readonly active: boolean;
  readonly animate: boolean;
  readonly animateOnMount: boolean;
  readonly direction: 1 | -1;
  readonly width: number;
  readonly transition: CarouselTransition;
  readonly reducedMotion: boolean;
}

/*** Keep departing slides mounted for an animated overlap without unmounting content. */
function CarouselLayer({
  slide,
  slideIndex,
  active,
  animate,
  animateOnMount,
  direction,
  enterDurationMs = 1200,
  exitDurationMs = 800,
  initialScale = 1.06,
  reducedMotion,
  renderImage,
  resizeMode,
  imageStyle,
  transition,
  width,
}: CarouselLayerProps) {
  const [opacity] = React.useState(() => new Animated.Value(active && !animateOnMount ? 1 : 0));
  const [scale] = React.useState(() => new Animated.Value(active && animateOnMount ? initialScale : 1));
  const [offset] = React.useState(() => new Animated.Value(0));
  const hasMounted = React.useRef(false);

  React.useEffect(() => {
    const firstRender = !hasMounted.current;
    hasMounted.current = true;
    if (firstRender && !animateOnMount) return;
    opacity.stopAnimation();
    scale.stopAnimation();
    offset.stopAnimation();
    if (!animate || reducedMotion || transition === 'none') {
      opacity.setValue(active ? 1 : 0);
      scale.setValue(1);
      offset.setValue(0);
      return;
    }
    if (transition === 'slide') {
      scale.setValue(1);
      if (active) {
        offset.setValue(direction * width);
        opacity.setValue(1);
      }
      Animated.parallel([
        Animated.timing(offset, {
          toValue: active ? 0 : -direction * width,
          duration: Math.max(0, active ? enterDurationMs : exitDurationMs),
          easing: Easing.bezier(0.4, 0, 0.2, 1),
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: active ? 1 : 0,
          duration: Math.max(0, active ? enterDurationMs : exitDurationMs),
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ]).start();
    } else if (active) {
      opacity.setValue(0);
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
    return () => {
      opacity.stopAnimation();
      scale.stopAnimation();
      offset.stopAnimation();
    };
  }, [
    active,
    animate,
    animateOnMount,
    direction,
    enterDurationMs,
    exitDurationMs,
    initialScale,
    offset,
    opacity,
    reducedMotion,
    scale,
    transition,
    width,
  ]);

  return (
    <Animated.View
      accessibilityElementsHidden={!active}
      importantForAccessibility={active ? 'auto' : 'no-hide-descendants'}
      pointerEvents={active ? 'auto' : 'none'}
      style={[StyleSheet.absoluteFill, { opacity, transform: [{ scale }, { translateX: offset }] }]}
    >
      {slide.source !== undefined ? (
        renderImage ? (
          renderImage(slide, slideIndex)
        ) : (
          <Image
            accessibilityLabel={slide.alt}
            accessible={Boolean(slide.alt)}
            resizeMode={resizeMode}
            source={typeof slide.source === 'string' ? { uri: slide.source } : slide.source}
            style={[StyleSheet.absoluteFill, imageStyle]}
          />
        )
      ) : null}
      {slide.content}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  controls: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 14,
    right: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  control: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  indicators: {
    position: 'absolute',
    bottom: 24,
    left: 0,
    right: 0,
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  indicator: { height: 8, borderRadius: 8 },
  progress: { position: 'absolute', bottom: 0, left: 0, right: 0, overflow: 'hidden' },
});

/*** Clamp an index safely when a consumer replaces the slide collection. */
function normalizeIndex(value: number, count: number): number {
  if (count <= 0 || !Number.isFinite(value)) return 0;
  return Math.min(Math.max(Math.trunc(value), 0), count - 1);
}

/*** Observe the platform-level reduced-motion preference on native and web. */
function useSystemReducedMotion(): boolean {
  const [reduced, setReduced] = React.useState(false);
  React.useEffect(() => {
    void AccessibilityInfo.isReduceMotionEnabled().then(setReduced);
    const listener = AccessibilityInfo.addEventListener('reduceMotionChanged', setReduced);
    return () => listener.remove();
  }, []);
  return reduced;
}
