import type { RoleSemantics, SurfaceTheme } from '@ankhorage/surface';
import React from 'react';

import { Heading } from '../../components/heading';
import { Icon } from '../../components/icon';
import { Text } from '../../components/text';
import { Box, Inline, Stack } from '../../foundation';
import type { ZoraColor } from '../../internal/recipes';
import { resolveIconSize } from '../../internal/recipes';
import { useZoraTheme } from '../../theme/useZoraTheme';
import { withZoraThemeScope } from '../../theme/withZoraThemeScope';
import type { TimelineItem, TimelineProps } from './types';

function resolveRoleSemantics(theme: SurfaceTheme, color: ZoraColor): RoleSemantics {
  switch (color) {
    case 'secondary':
      return theme.semantics.secondary;
    case 'tertiary':
      return theme.semantics.accent;
    case 'quaternary':
      return theme.semantics.highlight;
    case 'error':
      return theme.semantics.error;
    case 'info':
      return theme.semantics.info;
    case 'primary':
      return theme.semantics.action.primary;
    case 'danger':
      return theme.semantics.action.danger;
    case 'success':
      return theme.semantics.success;
    case 'warning':
      return theme.semantics.warning;
    case 'neutral':
    default:
      return theme.semantics.action.neutral;
  }
}

function TimelineInner({
  themeId: _themeId,
  mode: _mode,
  testID,
  items,
  compact = false,
}: TimelineProps) {
  const { theme } = useZoraTheme();
  const gap = compact ? 'm' : 'l';
  const connectorHeight = compact ? 20 : 36;

  const renderItem = (item: TimelineItem, index: number) => {
    const status = item.status ?? 'neutral';
    const role = resolveRoleSemantics(theme, status);
    const showConnector = index < items.length - 1;
    const iconSize = Math.max(12, resolveIconSize('s'));

    return (
      <Inline key={item.id} align="flex-start" gap="m" testID={item.testID} wrap="nowrap">
        <Stack align="center" flexShrink={0} gap="xs" style={{ width: 24 }}>
          <Box
            bg={status === 'neutral' ? theme.semantics.neutral.surface : role.softBg}
            borderColor={status === 'neutral' ? theme.semantics.neutral.divider : role.base}
            borderWidth={1}
            height={20}
            radius="full"
            width={20}
            style={{ alignItems: 'center', justifyContent: 'center' }}
          >
            {item.icon ? (
              <Icon
                color={status === 'neutral' ? theme.semantics.content.muted : role.base}
                name={item.icon.name}
                provider={item.icon.provider}
                size={iconSize}
              />
            ) : null}
          </Box>

          {showConnector ? (
            <Box
              bg={theme.semantics.neutral.divider}
              height={connectorHeight}
              radius="full"
              style={{ width: 2 }}
            />
          ) : null}
        </Stack>

        <Stack flex={1} gap="xs" testID={testID}>
          <Inline align="flex-start" gap="s" justify="space-between" wrap="wrap">
            <Heading level={compact ? 4 : 3}>{item.title}</Heading>
            {item.meta ? (
              <Text emphasis="muted" variant="caption">
                {item.meta}
              </Text>
            ) : null}
          </Inline>
          {item.description ? (
            <Text emphasis="muted" variant="bodySmall">
              {item.description}
            </Text>
          ) : null}
        </Stack>
      </Inline>
    );
  };

  return (
    <Stack gap={gap} testID={testID}>
      {items.map(renderItem)}
    </Stack>
  );
}

/***
 * Timeline pattern for displaying a sequence of events.
 *
 * @readme
 */
export const Timeline = withZoraThemeScope(TimelineInner);
