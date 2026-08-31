import type { ReactNode } from 'react';

import type { ZoraBaseProps } from '../../theme/ZoraBaseProps';

export type ContentRailDirection = 'auto' | 'ltr' | 'rtl';
export type ContentRailItemSize = 'compact' | 'regular' | 'wide' | 'responsive';
export type ContentRailMotion = 'system' | 'animated' | 'reduced';
export type ContentRailSpacing = 'none' | 'xs' | 's' | 'm' | 'l' | 'xl';

export interface ContentRailControlPressEvent {
  direction: 'previous' | 'next';
  targetIndex: number;
}

export interface ContentRailVisibleRangeChangeEvent {
  firstVisibleIndex: number;
  lastVisibleIndex: number;
  itemCount: number;
}

export interface ContentRailProps extends ZoraBaseProps {
  children?: ReactNode;
  itemSize?: ContentRailItemSize;
  gap?: ContentRailSpacing;
  padding?: ContentRailSpacing;
  peek?: number;
  showControls?: boolean;
  direction?: ContentRailDirection;
  motion?: ContentRailMotion;
  accessibilityLabel?: string;
  previousLabel?: string;
  nextLabel?: string;
  onControlPress?: (event: ContentRailControlPressEvent) => void | Promise<void>;
  onVisibleRangeChange?: (event: ContentRailVisibleRangeChangeEvent) => void | Promise<void>;
}
