import React from 'react';

import type { SkeletonTextProps } from '../../../../types/skeleton';
import { View } from '../../../layout/public';
import { withZoraThemeScope } from '../../../theme/adapters/inbound/withZoraThemeScope';
import { Skeleton } from './Skeleton';

function clampLines(lines: number): number {
  if (!Number.isFinite(lines)) {
    return 1;
  }

  return Math.max(1, Math.floor(lines));
}

function SkeletonTextInner({
  themeId: _themeId,
  mode: _mode,
  testID,
  lines = 3,
  lineHeight = 12,
  gap = 'xs',
  width = '100%',
  lastLineWidth = '70%',
}: SkeletonTextProps) {
  const lineCount = clampLines(lines);

  return (
    <View gap={gap} testID={testID}>
      {Array.from({ length: lineCount }).map((_, index) => {
        const isLastLine = index === lineCount - 1;
        return (
          <Skeleton
            height={lineHeight}
            key={`${index}`}
            radius="full"
            width={isLastLine && lineCount > 1 ? lastLineWidth : width}
          />
        );
      })}
    </View>
  );
}

/***
 * Multi-line skeleton placeholder for text content.
 *
 
 */
export const SkeletonText = withZoraThemeScope(SkeletonTextInner);
