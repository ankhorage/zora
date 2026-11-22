import type { ReactNode } from 'react';
import type { ImageResizeMode, ImageSourcePropType, ImageStyle, StyleProp, ViewStyle } from 'react-native';

/** A platform-neutral image reference. App-specific image optimizers use renderImage. */
export interface HeroBackgroundSlide {
  source: string | ImageSourcePropType;
  alt?: string;
}

/** Configuration for a full-bleed, cross-platform animated hero background. */
export interface HeroBackgroundSliderProps {
  slides: readonly HeroBackgroundSlide[];
  /** Controlled active slide. If omitted, the slider owns its index. */
  index?: number;
  defaultIndex?: number;
  onIndexChange?: (index: number) => void;
  autoPlay?: boolean;
  paused?: boolean;
  loop?: boolean;
  intervalMs?: number;
  enterDurationMs?: number;
  exitDurationMs?: number;
  initialScale?: number;
  /** Overrides the platform's reduced-motion preference when supplied. */
  reducedMotion?: boolean;
  showProgress?: boolean;
  progressHeight?: number;
  progressTrackColor?: string;
  progressIndicatorColor?: string;
  progressTrackStyle?: StyleProp<ViewStyle>;
  progressIndicatorStyle?: StyleProp<ViewStyle>;
  resizeMode?: ImageResizeMode;
  imageStyle?: StyleProp<ImageStyle>;
  style?: StyleProp<ViewStyle>;
  /** Allows a web consumer to retain Next/Image optimization without coupling ZORA to Next.js. */
  renderImage?: (slide: HeroBackgroundSlide, index: number) => ReactNode;
  testID?: string;
}
