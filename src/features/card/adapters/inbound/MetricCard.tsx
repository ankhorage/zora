import React from 'react';

import type { MetricCardProps } from '../../../../types/metric-card';
import { Badge } from '../../../badge/public';
import { resolveBadgeRecipe } from '../../../badge/utils/resolveBadgeRecipe';
import { Icon } from '../../../icon/public';
import { resolveIconSize } from '../../../icon/utils/resolveIconSize';
import { View } from '../../../layout/public';
import { withZoraThemeScope } from '../../../theme/adapters/inbound/withZoraThemeScope';
import { useZoraTheme } from '../../../theme/composition/useZoraTheme';
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
      <View gap={compact ? 's' : 'm'}>
        <View direction="row" align="flex-start" gap="m" justify="space-between">
          <View flex={1} gap="xs">
            <View direction="row" align="center" gap="xs" wrap="wrap">
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
            </View>

            <Heading level={compact ? 3 : 2}>{value}</Heading>

            {description ? (
              <Text emphasis="muted" variant="bodySmall">
                {description}
              </Text>
            ) : null}
          </View>

          {actions ? <View>{actions}</View> : null}
        </View>
      </View>
    </Card>
  );
}
