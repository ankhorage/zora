import type { ButtonIconSpec } from '@ankhorage/surface';
import type { MediaAssetReference } from '@ankhorage/contracts';
import type React from 'react';

import type { ZoraBaseProps } from './base';
import type { ImageProps } from './image';
import type { ZoraColor } from './theme';

/** Portable Timeline item shape accepted by an AppManifest component node. */
export interface TimelineManifestItem {
  readonly id: string;
  readonly title: string;
  readonly description?: string;
  readonly meta?: string;
  readonly status?: ZoraColor;
  readonly marker?: MediaAssetReference;
  readonly markerAlt?: string;
}

/** Portable Timeline props accepted by an AppManifest component node. */
export interface TimelineManifestProps {
  readonly items: readonly TimelineManifestItem[];
  readonly compact?: boolean;
}

export interface TimelineItem {
  id: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  meta?: React.ReactNode;
  status?: ZoraColor;
  icon?: ButtonIconSpec;
  marker?: ImageProps['source'];
  markerAlt?: string;
  testID?: string;
}

export interface TimelineProps extends ZoraBaseProps {
  items: readonly TimelineItem[];
  compact?: boolean;
}
