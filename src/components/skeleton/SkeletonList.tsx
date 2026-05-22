import React from 'react';

import { List, type ListRowProps } from '../../patterns/list';
import { withZoraThemeScope } from '../../theme/withZoraThemeScope';
import { Skeleton } from './Skeleton';
import { SkeletonText } from './SkeletonText';
import type { SkeletonListProps } from './types';

function clampRows(rows: number): number {
  if (!Number.isFinite(rows)) {
    return 1;
  }

  return Math.max(1, Math.floor(rows));
}

function renderLeading({ avatar, media }: Pick<SkeletonListProps, 'avatar' | 'media'>) {
  if (media) {
    return <Skeleton height={64} radius="m" width={64} />;
  }

  if (avatar) {
    return <Skeleton height={40} radius="full" width={40} />;
  }

  return undefined;
}

function SkeletonListInner({
  themeId: _themeId,
  mode: _mode,
  testID,
  rows = 5,
  avatar = false,
  media = false,
  lines = 2,
  variant = 'divider',
  compact = false,
}: SkeletonListProps) {
  const rowCount = clampRows(rows);
  const items: ListRowProps[] = Array.from({ length: rowCount }).map(() => ({
    compact,
    description: <SkeletonText lines={lines} />,
    leading: renderLeading({ avatar, media }),
    title: <Skeleton height={16} radius="full" width="48%" />,
    variant,
  }));

  return <List compact={compact} items={items} rowVariant={variant} testID={testID} />;
}

/***
 * Skeleton placeholder list for loading states in list views.
 *
 * @readme
 */
export const SkeletonList = withZoraThemeScope(SkeletonListInner);
