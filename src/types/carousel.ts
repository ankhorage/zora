import type { ReactNode } from 'react';
import type {
  ImageResizeMode,
  ImageSourcePropType,
  ImageStyle,
  StyleProp,
  ViewStyle,
} from 'react-native';

export type CarouselTransition = 'fade' | 'slide' | 'none';

/** One presentation frame: an image, arbitrary React content, or both. */
export interface CarouselSlide {
  key: string;
  source?: string | ImageSourcePropType;
  alt?: string;
  content?: ReactNode;
}

/** Configurable cross-platform carousel; the consumer owns slide content. */
export interface CarouselProps {
  slides: readonly CarouselSlide[];
  /** Controlled index. If omitted, Carousel manages its own position. */
  index?: number;
  defaultIndex?: number;
  onIndexChange?: (index: number) => void;
  autoPlay?: boolean;
  paused?: boolean;
  loop?: boolean;
  intervalMs?: number;
  transition?: CarouselTransition;
  enterDurationMs?: number;
  exitDurationMs?: number;
  initialScale?: number;
  animateOnMount?: boolean;
  /** Overrides the host OS preference when explicitly supplied. */
  reducedMotion?: boolean;
  showProgress?: boolean;
  progressHeight?: number;
  progressTrackColor?: string;
  progressIndicatorColor?: string;
  progressTrackStyle?: StyleProp<ViewStyle>;
  progressIndicatorStyle?: StyleProp<ViewStyle>;
  showArrows?: boolean;
  showIndicators?: boolean;
  previousLabel?: string;
  nextLabel?: string;
  controlColor?: string;
  controlBackgroundColor?: string;
  controlsStyle?: StyleProp<ViewStyle>;
  activeIndicatorColor?: string;
  inactiveIndicatorColor?: string;
  indicatorsStyle?: StyleProp<ViewStyle>;
  resizeMode?: ImageResizeMode;
  imageStyle?: StyleProp<ImageStyle>;
  style?: StyleProp<ViewStyle>;
  /** Enables Next/Image or another consumer-specific image optimization. */
  renderImage?: (slide: CarouselSlide, index: number) => ReactNode;
  testID?: string;
}
