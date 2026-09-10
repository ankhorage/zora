import React from 'react';

import { Inline } from '../../../../foundation';
import { resolveBadgeRecipe, resolveIconSize } from '../../../../internal/recipes';
import { useZoraTheme } from '../../../../theme/useZoraTheme';
import { withZoraThemeScope } from '../../../../theme/withZoraThemeScope';
import type { MetricCardProps } from '../../../../types/metric-card';
import { Badge } from '../../../badge/public';
import { Icon } from '../../../icon/public';
import { Box, Stack } from '../../../layout/public';
import { Heading } from '../../../typography/public';
import { Text } from '../../../typography/public';
import { Card } from '../../public';
/***
 * Highlights a key metric with label, value, and optional trend/actions.
 */
export const MetricCard = withZoraThemeScope(MetricCardInner);

function MetricCardInner({
  themeId: _themeId,
  mode: _mode,
  interactionPolicy,
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
      interactionPolicy={interactionPolicy}
      onPress={isInteractive ? onPress : undefined}
      testID={testID}
      tone={tone}
    >
      <Stack gap={compact ? 's' : 'm'}>
        <Inline align="flex-start" gap="m" justify="space-between">
          <Stack flex={1} gap="xs">
            <Inline align="center" gap="xs" wrap="wrap">
              {icon ? <Icon {...icon} color={iconColor} size={resolveIconSize('s')} /> : null}
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
