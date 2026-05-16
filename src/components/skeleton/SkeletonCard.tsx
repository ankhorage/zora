import React from 'react';

import { Card } from '../card';
import { ButtonGroup } from '../button-group';
import { Stack } from '../../foundation';
import { Skeleton } from './Skeleton';
import { SkeletonText } from './SkeletonText';
import type { SkeletonCardProps } from './types';
import { withZoraThemeScope } from '../../theme/withZoraThemeScope';

function SkeletonCardInner({
  themeId: _themeId,
  mode: _mode,
  testID,
  media = false,
  actions = false,
  lines = 3,
  compact = false,
}: SkeletonCardProps) {
  return (
    <Card compact={compact} testID={testID} tone="default">
      <Stack gap={compact ? 's' : 'm'}>
        {media ? <Skeleton height={compact ? 120 : 180} radius="m" /> : null}
        <Stack gap="s">
          <Skeleton height={18} radius="full" width="54%" />
          <SkeletonText lines={lines} />
        </Stack>
        {actions ? (
          <ButtonGroup align="end">
            <Skeleton height={36} radius="m" width={88} />
            <Skeleton height={36} radius="m" width={120} />
          </ButtonGroup>
        ) : null}
      </Stack>
    </Card>
  );
}

export const SkeletonCard = withZoraThemeScope(SkeletonCardInner);
