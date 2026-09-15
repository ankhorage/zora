import { AppBar as SurfaceAppBar, type ButtonIconSpec } from '@ankhorage/surface';
import React from 'react';

import type { AppBarMode, AppBarOverflowMenu, AppBarProps } from '../../../../types/app-bar';
import { IconButton } from '../../../button/public';
import { View } from '../../../layout/public';
import { PopoverMenu } from '../../../popover-menu/public';
import { withZoraThemeScope } from '../../../theme/adapters/inbound/withZoraThemeScope';
import { useZoraTheme } from '../../../theme/composition/useZoraTheme';
import { Heading, Text } from '../../../typography/public';

const DEFAULT_CANCEL_ICON = { name: 'close-outline' } satisfies ButtonIconSpec;
const DEFAULT_OVERFLOW_ICON = { name: 'ellipsis-vertical' } satisfies ButtonIconSpec;

/*** Renders a top app bar with title/subtitle and optional leading/trailing actions. */
export const AppBar = withZoraThemeScope(AppBarInner);

/*** Composes the opinionated ZORA AppBar over the Surface layout primitive. */
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
  const overflowMenu = resolveOverflowMenu(overflow, interactionPolicy, testID);
  const resolvedTrailing = resolveTrailing(actions, overflowMenu);
  const resolvedCenter = resolveCenter({
    children,
    isSelectionMode,
    resolvedMode,
    subtitle,
    title,
  });

  return (
    <SurfaceAppBar
      bg={isSelectionMode ? theme.semantics.action.primary.softBg : undefined}
      divider={divider}
      leading={resolvedLeading}
      safeAreaTop={safeAreaTop}
      testID={testID}
      trailing={resolvedTrailing}
    >
      {resolvedCenter ? <View style={{ minWidth: 0 }}>{resolvedCenter}</View> : null}
    </SurfaceAppBar>
  );
}

/*** Resolves the effective AppBar mode. */
function resolveMode(mode: AppBarMode | undefined): AppBarMode {
  return mode ?? { type: 'default' };
}

/*** Formats the active selection label with its optional count. */
function resolveSelectionLabel({ count, label }: { count?: number; label: string }): string {
  if (count === undefined) return label;
  return `${label} (${count})`;
}

/*** Resolves the accessible label for the overflow menu trigger. */
function resolveOverflowLabel(overflow: AppBarOverflowMenu): string {
  return overflow.label ?? 'More options';
}

/*** Resolves the accessible label for leaving selection mode. */
function resolveCancelLabel(mode: Extract<AppBarMode, { type: 'selection' }>): string {
  return mode.cancelLabel ?? 'Cancel selection';
}

/*** Resolves the selection action shown at the leading edge. */
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

/*** Resolves the optional AppBar overflow action menu. */
function resolveOverflowMenu(
  overflow: AppBarOverflowMenu | undefined,
  interactionPolicy: AppBarProps['interactionPolicy'],
  testID: string | undefined,
): React.ReactNode {
  if (overflow === undefined || overflow.actions.length === 0) return null;

  return (
    <PopoverMenu
      actions={overflow.actions}
      closeOnSelect={overflow.closeOnSelect}
      interactionPolicy={interactionPolicy}
      onDismiss={overflow.onDismiss}
      testID={testID ? `${testID}-overflow` : undefined}
      trigger={({ toggle }) => (
        <IconButton
          color="neutral"
          disabled={overflow.disabled}
          icon={overflow.icon ?? DEFAULT_OVERFLOW_ICON}
          interactionPolicy={interactionPolicy}
          label={resolveOverflowLabel(overflow)}
          onPress={toggle}
          size="m"
          variant="ghost"
        />
      )}
    />
  );
}

/*** Composes trailing actions and overflow controls. */
function resolveTrailing(actions: React.ReactNode, overflowMenu: React.ReactNode): React.ReactNode {
  if (!actions && !overflowMenu) return undefined;
  return (
    <View direction="row" align="center" gap="s" wrap="nowrap">
      {actions}
      {overflowMenu}
    </View>
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
    <View gap="xs">
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
    </View>
  );
}
