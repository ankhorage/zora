import React from 'react';

import type { SkeletonCardProps } from '../../../../types/skeleton';
import { ButtonGroup } from '../../../button/public';
import { Card } from '../../../card/public';
import { View } from '../../../layout/public';
import { withZoraThemeScope } from '../../../theme/adapters/inbound/withZoraThemeScope';
import { Skeleton } from './Skeleton';
import { SkeletonText } from './SkeletonText';

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
      <View gap={compact ? 's' : 'm'}>
        {media ? <Skeleton height={compact ? 120 : 180} radius="m" /> : null}
        <View gap="s">
          <Skeleton height={18} radius="full" width="54%" />
          <SkeletonText lines={lines} />
        </View>
        {actions ? (
          <ButtonGroup align="end">
            <Skeleton height={36} radius="m" width={88} />
            <Skeleton height={36} radius="m" width={120} />
          </ButtonGroup>
        ) : null}
      </View>
    </Card>
  );
}

/***
 * Skeleton placeholder that matches the structure of a `Card`.
 */
export const SkeletonCard = withZoraThemeScope(SkeletonCardInner);
