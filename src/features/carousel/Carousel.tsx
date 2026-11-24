import React from 'react';
import { Animated, Easing, Image, Pressable, StyleSheet, Text, View } from 'react-native';

import type { CarouselProps, CarouselSlide, CarouselTransition } from '../../types/carousel';
import { useZoraTheme } from '../theme/composition/useZoraTheme';
import { useCarouselPlayback } from './useCarouselPlayback';

/***
 * Present images, arbitrary React content, or both as a cross-platform slideshow.
 * A published web artifact exposes the same API without consumer source imports.
 */
export function Carousel({
  slides,
  index,
  defaultIndex,
  onIndexChange,
  autoPlay,
  paused,
  loop,
  intervalMs,
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
  const [width, setWidth] = React.useState(0);
  const {
    activeIndex,
    controlledWithoutHandler,
    direction,
    loop: enabledLoop,
    navigate,
    progress,
    shouldReduceMotion,
  } = useCarouselPlayback({
    slides,
    index,
    defaultIndex,
    onIndexChange,
    autoPlay,
    paused,
    loop,
    intervalMs,
    reducedMotion,
  });

  if (slides.length === 0) return null;

  const canPrevious = enabledLoop || activeIndex > 0;
  const canNext = enabledLoop || activeIndex < slides.length - 1;
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
      <CarouselControls
        activeIndex={activeIndex}
        canNext={canNext}
        canPrevious={canPrevious}
        controlBackgroundColor={controlBackgroundColor ?? theme.semantics.surface.raised}
        controlColor={controlColor ?? theme.semantics.content.default}
        controlledWithoutHandler={controlledWithoutHandler}
        controlsStyle={controlsStyle}
        navigate={navigate}
        nextLabel={nextLabel}
        previousLabel={previousLabel}
        show={showArrows && slides.length > 1}
        testID={testID}
      />
      <CarouselIndicators
        activeIndex={activeIndex}
        activeColor={markerColor}
        controlledWithoutHandler={controlledWithoutHandler}
        idleColor={idleMarkerColor}
        indicatorsStyle={indicatorsStyle}
        navigate={navigate}
        show={showIndicators && slides.length > 1}
        slides={slides}
        testID={testID}
      />
      <CarouselProgress
        height={progressHeight}
        indicatorColor={progressIndicatorColor ?? theme.colors.primary}
        indicatorStyle={progressIndicatorStyle}
        progress={progress}
        show={showProgress && slides.length > 1}
        testID={testID}
        trackColor={progressTrackColor ?? theme.semantics.neutral.divider}
        trackStyle={progressTrackStyle}
      />
    </View>
  );
}

interface CarouselLayerProps {
  readonly enterDurationMs?: CarouselProps['enterDurationMs'];
  readonly exitDurationMs?: CarouselProps['exitDurationMs'];
  readonly imageStyle: CarouselProps['imageStyle'];
  readonly initialScale?: CarouselProps['initialScale'];
  readonly renderImage: CarouselProps['renderImage'];
  readonly resizeMode: CarouselProps['resizeMode'];
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
  const [scale] = React.useState(
    () => new Animated.Value(active && animateOnMount ? initialScale : 1),
  );
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

interface CarouselNavigationProps {
  readonly activeIndex: number;
  readonly navigate: (index: number, direction: 1 | -1) => void;
  readonly controlledWithoutHandler: boolean;
  readonly testID: CarouselProps['testID'];
}

interface CarouselControlsProps extends CarouselNavigationProps {
  readonly show: boolean;
  readonly canPrevious: boolean;
  readonly canNext: boolean;
  readonly previousLabel: string;
  readonly nextLabel: string;
  readonly controlColor: string;
  readonly controlBackgroundColor: string;
  readonly controlsStyle: CarouselProps['controlsStyle'];
}

/*** Render optional previous/next buttons without coupling the slide content to navigation. */
function CarouselControls({
  activeIndex,
  canNext,
  canPrevious,
  controlBackgroundColor,
  controlColor,
  controlledWithoutHandler,
  controlsStyle,
  navigate,
  nextLabel,
  previousLabel,
  show,
  testID,
}: CarouselControlsProps) {
  if (!show) return null;
  const buttonStyle = [styles.control, { backgroundColor: controlBackgroundColor }];
  const labelStyle = { color: controlColor, fontSize: 30 };
  return (
    <View pointerEvents="box-none" style={[styles.controls, controlsStyle]}>
      <Pressable
        accessibilityLabel={previousLabel}
        accessibilityRole="button"
        disabled={!canPrevious || controlledWithoutHandler}
        onPress={() => navigate(activeIndex - 1, -1)}
        style={buttonStyle}
        testID={testID ? `${testID}-previous` : undefined}
      >
        <Text style={labelStyle}>{'‹'}</Text>
      </Pressable>
      <Pressable
        accessibilityLabel={nextLabel}
        accessibilityRole="button"
        disabled={!canNext || controlledWithoutHandler}
        onPress={() => navigate(activeIndex + 1, 1)}
        style={buttonStyle}
        testID={testID ? `${testID}-next` : undefined}
      >
        <Text style={labelStyle}>{'›'}</Text>
      </Pressable>
    </View>
  );
}

interface CarouselIndicatorsProps extends CarouselNavigationProps {
  readonly show: boolean;
  readonly slides: CarouselProps['slides'];
  readonly activeColor: string;
  readonly idleColor: string;
  readonly indicatorsStyle: CarouselProps['indicatorsStyle'];
}

/*** Render accessible selection dots for the currently controlled slide. */
function CarouselIndicators({
  activeIndex,
  activeColor,
  controlledWithoutHandler,
  idleColor,
  indicatorsStyle,
  navigate,
  show,
  slides,
  testID,
}: CarouselIndicatorsProps) {
  if (!show) return null;
  return (
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
              backgroundColor: slideIndex === activeIndex ? activeColor : idleColor,
              width: slideIndex === activeIndex ? 24 : 8,
            },
          ]}
          testID={testID ? `${testID}-indicator-${slideIndex}` : undefined}
        />
      ))}
    </View>
  );
}

interface CarouselProgressProps {
  readonly show: boolean;
  readonly height: number;
  readonly trackColor: string;
  readonly indicatorColor: string;
  readonly trackStyle: CarouselProps['progressTrackStyle'];
  readonly indicatorStyle: CarouselProps['progressIndicatorStyle'];
  readonly progress: Animated.Value;
  readonly testID: CarouselProps['testID'];
}

/*** Render an optional linear autoplay timer without adding any required UI to slides. */
function CarouselProgress({
  height,
  indicatorColor,
  indicatorStyle,
  progress,
  show,
  testID,
  trackColor,
  trackStyle,
}: CarouselProgressProps) {
  if (!show) return null;
  return (
    <View
      pointerEvents="none"
      style={[styles.progress, { height, backgroundColor: trackColor }, trackStyle]}
      testID={testID ? `${testID}-progress` : undefined}
    >
      <Animated.View
        style={[
          {
            height: '100%',
            width: '100%',
            transformOrigin: 'left center',
            transform: [{ scaleX: progress }],
            backgroundColor: indicatorColor,
          },
          indicatorStyle,
        ]}
      />
    </View>
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
