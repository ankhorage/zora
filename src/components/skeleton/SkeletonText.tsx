import React from 'react';

import { Stack } from '../../foundation';
import { withZoraThemeScope } from '../../theme/withZoraThemeScope';
import { Skeleton } from './Skeleton';
import type { SkeletonTextProps } from './types';

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
    <Stack gap={gap} testID={testID}>
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
    </Stack>
  );
}

/***
 * Multi-line skeleton placeholder for text content.
 *
 * @readme
 */
export const SkeletonText = withZoraThemeScope(SkeletonTextInner);
