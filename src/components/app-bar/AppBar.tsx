import { AppBar as SurfaceAppBar } from '@ankhorage/surface';
import React from 'react';

import { Box, Inline, Stack } from '../../foundation';
import { useZoraTheme } from '../../theme/useZoraTheme';
import { withZoraThemeScope } from '../../theme/withZoraThemeScope';
import { Heading } from '../heading';
import { IconButton } from '../icon-button';
import { Text } from '../text';
import type { AppBarMode, AppBarOverflowAction, AppBarProps } from './types';

const DEFAULT_CANCEL_ICON = { name: 'close-outline' };
const DEFAULT_OVERFLOW_ICON = { name: 'ellipsis-vertical' };

function resolveMode(mode: AppBarMode | undefined): AppBarMode {
  return mode ?? { type: 'default' };
}

function resolveSelectionLabel({ count, label }: { count?: number; label: string }): string {
  if (count === undefined) {
    return label;
  }

  return `${label} (${count})`;
}

function resolveOverflowLabel(overflow: AppBarOverflowAction): string {
  return overflow.label ?? 'More options';
}

function resolveCancelLabel(mode: Extract<AppBarMode, { type: 'selection' }>): string {
  return mode.cancelLabel ?? 'Cancel selection';
}

function AppBarInner({
  themeId: _themeId,
  mode: _mode,
  title,
  subtitle,
  leading,
  actions,
  overflow,
  appMode,
  children,
  safeAreaTop = true,
  divider = true,
  testID,
}: AppBarProps) {
  const { theme } = useZoraTheme();
  const resolvedMode = resolveMode(appMode);
  const isSelectionMode = resolvedMode.type === 'selection';

  const resolvedLeading =
    leading ??
    (isSelectionMode ? (
      <IconButton
        icon={resolvedMode.cancelIcon ?? DEFAULT_CANCEL_ICON}
        label={resolveCancelLabel(resolvedMode)}
        emphasis="ghost"
        size="m"
        tone="neutral"
        onPress={resolvedMode.onCancel}
      />
    ) : undefined);

  const overflowButton = overflow?.onPress ? (
    <IconButton
      disabled={overflow.disabled}
      icon={overflow.icon ?? DEFAULT_OVERFLOW_ICON}
      label={resolveOverflowLabel(overflow)}
      emphasis="ghost"
      size="m"
      tone="neutral"
      onPress={overflow.onPress}
    />
  ) : null;

  const resolvedTrailing =
    actions || overflowButton ? (
      <Inline align="center" gap="s" wrap="nowrap">
        {actions}
        {overflowButton}
      </Inline>
    ) : undefined;

  const resolvedCenter = (() => {
    if (children !== undefined) {
      return children;
    }

    if (isSelectionMode) {
      return (
        <Text numberOfLines={1} tone="default" variant="label" weight="semiBold">
          {resolveSelectionLabel(resolvedMode)}
        </Text>
      );
    }

    if (title == null && subtitle == null) {
      return null;
    }

    return (
      <Stack gap="xs">
        {title != null ? (
          <Heading ellipsizeMode="tail" level={3} numberOfLines={1} size="h5">
            {title}
          </Heading>
        ) : null}
        {subtitle != null ? (
          <Text ellipsizeMode="tail" numberOfLines={1} tone="muted" variant="bodySmall">
            {subtitle}
          </Text>
        ) : null}
      </Stack>
    );
  })();

  return (
    <SurfaceAppBar
      bg={isSelectionMode ? theme.semantics.action.primary.softBg : undefined}
      divider={divider}
      leading={resolvedLeading}
      safeAreaTop={safeAreaTop}
      testID={testID}
      trailing={resolvedTrailing}
    >
      {resolvedCenter ? <Box style={{ minWidth: 0 }}>{resolvedCenter}</Box> : null}
    </SurfaceAppBar>
  );
}

export const AppBar = withZoraThemeScope(AppBarInner);
