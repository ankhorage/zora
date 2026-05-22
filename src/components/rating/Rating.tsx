import React from 'react';

import { Inline } from '../../foundation';
import { resolveIconSize } from '../../internal/recipes';
import { useZoraTheme } from '../../theme/useZoraTheme';
import { withZoraThemeScope } from '../../theme/withZoraThemeScope';
import { Icon } from '../icon';
import { resolveRatingSegments } from './resolveRatingSegments';
import { type RatingProps, resolveRatingRole } from './types';

function RatingInner({
  themeId: _themeId,
  mode: _mode,
  testID,
  value,
  max = 5,
  color = 'warning',
  size = 'm',
}: RatingProps) {
  const { theme } = useZoraTheme();
  const role = resolveRatingRole(theme, color);
  const segments = resolveRatingSegments({ value, max });
  const iconSize = resolveIconSize(size);

  return (
    <Inline align="center" gap="xxs" testID={testID} wrap="nowrap">
      {segments.map((segment, index) => {
        const name =
          segment === 'full' ? 'star' : segment === 'half' ? 'star-half' : 'star-outline';
        const color = segment === 'empty' ? theme.semantics.content.muted : role.base;

        return <Icon key={index} color={color} name={name} size={iconSize} />;
      })}
    </Inline>
  );
}

/***
 * Displays a star-based rating value with optional half steps.
 *
 * @readme
 */
export const Rating = withZoraThemeScope(RatingInner);
