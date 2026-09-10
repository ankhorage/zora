import type React from 'react';

import type { ZoraBaseProps } from '../theme/ZoraBaseProps';

export interface ManifestListProps extends ZoraBaseProps {
  children?: React.ReactNode;
  horizontal?: boolean;
  refreshing?: boolean;
  initialNumToRender?: number;
  maxToRenderPerBatch?: number;
  windowSize?: number;
  onEndReachedThreshold?: number;
  showsScrollIndicator?: boolean;
  bounces?: boolean;
  showSeparators?: boolean;
  headerText?: string;
  footerText?: string;
  emptyText?: string;
  onRefresh?: () => void;
  onEndReached?: (event: { distanceFromEnd: number }) => void;
  onVisibleItemsChange?: (event: { keys: readonly string[] }) => void;
}

export interface ManifestListSection {
  key: string;
  title?: string;
  itemCount: number;
}

export interface ManifestSectionListProps extends ManifestListProps {
  sections: readonly ManifestListSection[];
  stickySectionHeadersEnabled?: boolean;
}
