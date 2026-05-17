import { Menu as SurfaceMenu, type MenuAction as SurfaceMenuAction } from '@ankhorage/surface';
import React, { useMemo } from 'react';

import { Box, Inline, Stack } from '../../foundation';
import { resolveIconSize } from '../../internal/recipes';
import { useZoraTheme } from '../../theme/useZoraTheme';
import { withZoraThemeScope } from '../../theme/withZoraThemeScope';
import { Icon } from '../icon';
import { Text } from '../text';
import type { MenuAction, MenuProps } from './types';

function renderActionLeading(action: MenuAction, iconColor: string) {
  if (action.leading) {
    return action.leading;
  }

  if (!action.icon) {
    return undefined;
  }

  return (
    <Icon
      color={iconColor}
      name={action.icon.name}
      provider={action.icon.provider}
      size={resolveIconSize('s')}
    />
  );
}

function renderActionTitle(action: MenuAction) {
  return (
    <Stack gap="xxs">
      <Text variant="bodySmall" weight={action.selected ? 'semiBold' : 'medium'}>
        {action.title}
      </Text>
      {action.description ? (
        <Text emphasis="muted" variant="caption">
          {action.description}
        </Text>
      ) : null}
    </Stack>
  );
}

function renderActionTrailing(action: MenuAction) {
  if (!action.trailing) {
    return undefined;
  }

  return <Box>{action.trailing}</Box>;
}

function toSurfaceAction(action: MenuAction, iconColor: string): SurfaceMenuAction {
  return {
    activate: action.onPress,
    description: undefined,
    disabled: action.disabled,
    id: action.id,
    intent: action.intent,
    leading: renderActionLeading(action, iconColor),
    selected: action.selected,
    title: renderActionTitle(action),
    trailing: renderActionTrailing(action),
  };
}

function MenuInner({
  themeId: _themeId,
  mode: _mode,
  actions,
  onDismiss,
  ...props
}: MenuProps) {
  const { theme } = useZoraTheme();
  const iconColor = theme.semantics.content.muted;
  const surfaceActions = useMemo(
    () => actions.map((action) => toSurfaceAction(action, iconColor)),
    [actions, iconColor],
  );

  return <SurfaceMenu {...props} actions={surfaceActions} dismiss={onDismiss} />;
}

export const Menu = withZoraThemeScope(MenuInner);
export const DropdownMenu = Menu;
