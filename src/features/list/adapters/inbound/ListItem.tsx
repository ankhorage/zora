import { ListItem as SurfaceListItem } from '@ankhorage/surface';
import React from 'react';

import type { ListItemProps, ListItemVariant } from '../../../../types/list';
import { View } from '../../../layout/public';
import { withZoraThemeScope } from '../../../theme/adapters/inbound/withZoraThemeScope';
import { useZoraTheme } from '../../../theme/composition/useZoraTheme';
import { Text } from '../../../typography/public';

function ListItemInner({
  themeId: _themeId,
  mode: _mode,
  testID,
  interactionPolicy,
  title,
  description,
  meta,
  leading,
  trailing,
  action,
  onPress,
  selected = false,
  disabled = false,
  compact = false,
  variant = 'divider',
}: ListItemProps) {
  const { theme } = useZoraTheme();
  const trailingContent = renderTrailing(trailing, action);

  return (
    <View
      bg={variant === 'card' ? theme.semantics.surface.raised : 'transparent'}
      borderColor={
        selected
          ? theme.semantics.border.focus
          : variant === 'card'
            ? theme.semantics.border.default
            : 'transparent'
      }
      borderWidth={variant === 'card' || selected ? 1 : 0}
      overflow="hidden"
      radius={resolveRadius(variant)}
    >
      <SurfaceListItem
        compact={compact}
        disabled={disabled}
        interactionPolicy={interactionPolicy}
        leading={leading}
        onPress={action ? undefined : onPress}
        selected={selected}
        testID={testID}
        trailing={trailingContent}
      >
        <View gap="xxs">
          <Text variant="body" weight={selected ? 'semiBold' : 'medium'}>
            {title}
          </Text>
          {description ? (
            <Text emphasis="muted" variant="bodySmall">
              {description}
            </Text>
          ) : null}
          {meta ? (
            <Text emphasis="subtle" variant="caption">
              {meta}
            </Text>
          ) : null}
        </View>
      </SurfaceListItem>
    </View>
  );
}

function resolveRadius(variant: ListItemVariant) {
  return variant === 'card' ? ('l' as const) : ('m' as const);
}

function renderTrailing(trailing: React.ReactNode, action: React.ReactNode) {
  if (!trailing && !action) return undefined;
  return (
    <View align="center" direction="row" gap="s" wrap="nowrap">
      {trailing}
      {action}
    </View>
  );
}

/*** Opinionated list item built on the Surface list-item interaction and geometry boundary. */
export const ListItem = withZoraThemeScope(ListItemInner);
