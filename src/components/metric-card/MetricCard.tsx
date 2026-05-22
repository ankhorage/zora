import React from 'react';

import { Box, Inline, Stack } from '../../foundation';
import { resolveBadgeRecipe, resolveIconSize } from '../../internal/recipes';
import { useZoraTheme } from '../../theme/useZoraTheme';
import { withZoraThemeScope } from '../../theme/withZoraThemeScope';
import { Badge } from '../badge';
import { Card } from '../card';
import { Heading } from '../heading';
import { Icon } from '../icon';
import { Text } from '../text';
import type { MetricCardProps } from './types';

function MetricCardInner({
  themeId: _themeId,
  mode: _mode,
  testID,
  label,
  value,
  description,
  icon,
  delta,
  deltaColor = 'neutral',
  actions,
  tone = 'default',
  compact = false,
  onPress,
}: MetricCardProps) {
  const { theme } = useZoraTheme();
  const isInteractive = Boolean(onPress) && !actions;

  const badgeRecipe = resolveBadgeRecipe({ color: deltaColor, variant: 'soft', size: 's' });
  const iconColor = theme.semantics.content.muted;

  return (
    <Card
      compact={compact}
      onPress={isInteractive ? onPress : undefined}
      testID={testID}
      tone={tone}
    >
      <Stack gap={compact ? 's' : 'm'}>
        <Inline align="flex-start" gap="m" justify="space-between">
          <Stack flex={1} gap="xs">
            <Inline align="center" gap="xs" wrap="wrap">
              {icon ? (
                <Icon
                  color={iconColor}
                  name={icon.name}
                  provider={icon.provider}
                  size={resolveIconSize('s')}
                />
              ) : null}
              <Text emphasis="muted" variant="caption" weight="semiBold">
                {label}
              </Text>
              {delta != null ? (
                <Badge
                  variant={badgeRecipe.variant}
                  size={badgeRecipe.size}
                  color={badgeRecipe.color}
                >
                  {delta}
                </Badge>
              ) : null}
            </Inline>

            <Heading level={compact ? 3 : 2}>{value}</Heading>

            {description ? (
              <Text emphasis="muted" variant="bodySmall">
                {description}
              </Text>
            ) : null}
          </Stack>

          {actions ? <Box>{actions}</Box> : null}
        </Inline>
      </Stack>
    </Card>
  );
}

/***
 * Highlights a key metric with label, value, and optional trend/actions.
 *
 * @readme
 */
export const MetricCard = withZoraThemeScope(MetricCardInner);
