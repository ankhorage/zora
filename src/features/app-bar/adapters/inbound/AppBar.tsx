import { AppBar as SurfaceAppBar, type ButtonIconSpec } from '@ankhorage/surface';
import React from 'react';

import { withZoraThemeScope } from '../../../../theme/withZoraThemeScope';
import type { AppBarMode, AppBarOverflowAction, AppBarProps } from '../../../../types/app-bar';
import { IconButton } from '../../../button/public';
import { Box, Stack } from '../../../layout/public';
import { Heading, Text } from '../../../typography/public';
import { Inline } from '../../../../foundation';
import { useZoraTheme } from '../../../../theme/useZoraTheme';

const DEFAULT_CANCEL_ICON = { name: 'close-outline' } satisfies ButtonIconSpec;
const DEFAULT_OVERFLOW_ICON = { name: 'ellipsis-vertical' } satisfies ButtonIconSpec;

function resolveMode(mode: AppBarMode | undefined): AppBarMode {
  return mode ?? { type: 'default' };
}

function resolveSelectionLabel({ count, label }: { count?: number; label: string }): string {
  if (count === undefined) return label;
  return `${label} (${count})`;
}

function resolveOverflowLabel(overflow: AppBarOverflowAction): string {
  return overflow.label ?? 'More options';
}

function resolveCancelLabel(mode: Extract<AppBarMode, { type: 'selection' }>): string {
  return mode.cancelLabel ?? 'Cancel selection';
}

/*** Renders a top app bar with title/subtitle and optional leading/trailing actions. */
export const AppBar = withZoraThemeScope(AppBarInner);

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
  interactionPolicy,
}: AppBarProps) {
  const { theme } = useZoraTheme();
  const resolvedMode = resolveMode(appMode);
  const isSelectionMode = resolvedMode.type === 'selection';
  const resolvedLeading = leading ?? resolveSelectionLeading(resolvedMode, interactionPolicy);
  const overflowButton = resolveOverflowButton(overflow, interactionPolicy);
  const resolvedTrailing = resolveTrailing(actions, overflowButton);
  const resolvedCenter = resolveCenter({ children, isSelectionMode, resolvedMode, subtitle, title });

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

/*** Resolves the selection cancel action shown at the leading edge. */
function resolveSelectionLeading(
  mode: AppBarMode,
  interactionPolicy: AppBarProps['interactionPolicy'],
): React.ReactNode | undefined {
  if (mode.type !== 'selection') return undefined;

  return (
    <IconButton
      color="neutral"
      icon={mode.cancelIcon ?? DEFAULT_CANCEL_ICON}
      interactionPolicy={interactionPolicy}
      label={resolveCancelLabel(mode)}
      onPress={mode.onCancel}
      size="m"
      variant="ghost"
    />
  );
}

/*** Resolves the optional overflow action. */
function resolveOverflowButton(
  overflow: AppBarOverflowAction | undefined,
  interactionPolicy: AppBarProps['interactionPolicy'],
): React.ReactNode {
  if (!overflow?.onPress) return null;

  return (
    <IconButton
      color="neutral"
      disabled={overflow.disabled}
      icon={overflow.icon ?? DEFAULT_OVERFLOW_ICON}
      interactionPolicy={interactionPolicy}
      label={resolveOverflowLabel(overflow)}
      onPress={overflow.onPress}
      size="m"
      variant="ghost"
    />
  );
}

/*** Composes trailing actions and overflow controls. */
function resolveTrailing(actions: React.ReactNode, overflowButton: React.ReactNode): React.ReactNode {
  if (!actions && !overflowButton) return undefined;
  return (
    <Inline align="center" gap="s" wrap="nowrap">
      {actions}
      {overflowButton}
    </Inline>
  );
}

/*** Resolves the center content for default and selection modes. */
function resolveCenter({
  children,
  isSelectionMode,
  resolvedMode,
  subtitle,
  title,
}: {
  children: React.ReactNode;
  isSelectionMode: boolean;
  resolvedMode: AppBarMode;
  subtitle: React.ReactNode;
  title: React.ReactNode;
}): React.ReactNode {
  if (children !== undefined) return children;
  if (isSelectionMode && resolvedMode.type === 'selection') {
    return (
      <Text emphasis="default" numberOfLines={1} variant="label" weight="semiBold">
        {resolveSelectionLabel(resolvedMode)}
      </Text>
    );
  }
  if (title == null && subtitle == null) return null;

  return (
    <Stack gap="xs">
      {title != null ? (
        <Heading ellipsizeMode="tail" level={3} numberOfLines={1} size="h5">
          {title}
        </Heading>
      ) : null}
      {subtitle != null ? (
        <Text ellipsizeMode="tail" emphasis="muted" numberOfLines={1} variant="bodySmall">
          {subtitle}
        </Text>
      ) : null}
    </Stack>
  );
}
