import { ButtonBase } from '@ankhorage/surface';
import React from 'react';

import { Text } from '../../components/text';
import { Box, Inline, Spacer, Stack } from '../../foundation';
import { useZoraTheme } from '../../theme/useZoraTheme';
import { withZoraThemeScope } from '../../theme/withZoraThemeScope';
import type { ListRowProps, ListRowVariant } from './types';

function resolvePadding(compact: boolean) {
  return compact ? { px: 'm' as const, py: 's' as const } : { px: 'm' as const, py: 'm' as const };
}

function resolveContainerStyles({
  variant,
  theme,
  selected,
  pressed,
  hovered,
  disabled,
}: {
  variant: ListRowVariant;
  theme: ReturnType<typeof useZoraTheme>['theme'];
  selected: boolean;
  pressed: boolean;
  hovered: boolean;
  disabled: boolean;
}) {
  const borderColor = selected ? theme.semantics.border.focus : theme.semantics.border.default;
  const dividerBorderColor = selected ? theme.semantics.border.focus : 'transparent';

  if (variant === 'card') {
    return {
      bg: pressed
        ? theme.semantics.neutral.surfaceActive
        : hovered
          ? theme.semantics.neutral.surfaceHover
          : theme.semantics.surface.raised,
      borderColor,
      borderWidth: 1,
      radius: 'l' as const,
      opacity: disabled ? 0.72 : 1,
    };
  }

  return {
    bg: pressed
      ? theme.semantics.neutral.surfaceActive
      : hovered
        ? theme.semantics.neutral.surfaceHover
        : selected
          ? theme.semantics.neutral.surface
          : 'transparent',
    borderColor: dividerBorderColor,
    borderWidth: selected ? 1 : 0,
    radius: 'm' as const,
    opacity: disabled ? 0.72 : 1,
  };
}

function ListRowInner({
  themeId: _themeId,
  mode: _mode,
  testID,
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
}: ListRowProps) {
  const { theme } = useZoraTheme();
  const padding = resolvePadding(compact);
  const isInteractive = Boolean(onPress) && !action;

  const content = (
    <Stack
      align="center"
      direction="row"
      style={{
        flex: 1,
        minWidth: 0,
      }}
    >
      {leading ? (
        <>
          <Box>{leading}</Box>
          <Spacer axis="horizontal" size="m" />
        </>
      ) : null}

      <Box flex={1} style={{ minWidth: 0 }}>
        <Stack gap="xxs">
          <Text variant="body" weight={selected ? 'semiBold' : 'medium'}>
            {title}
          </Text>
          {description ? (
            <Text tone="muted" variant="bodySmall">
              {description}
            </Text>
          ) : null}
          {meta ? (
            <Text numberOfLines={1} tone="subtle" variant="caption">
              {meta}
            </Text>
          ) : null}
        </Stack>
      </Box>

      {trailing || action ? (
        <>
          <Spacer axis="horizontal" size="m" />
          <Inline align="center" gap="s" wrap="nowrap" style={{ flexShrink: 0 }}>
            {trailing}
            {action}
          </Inline>
        </>
      ) : null}
    </Stack>
  );

  if (!isInteractive) {
    const styles = resolveContainerStyles({
      variant,
      theme,
      selected,
      pressed: false,
      hovered: false,
      disabled,
    });

    return (
      <Box
        bg={styles.bg}
        borderColor={styles.borderColor}
        borderWidth={styles.borderWidth}
        px={padding.px}
        py={padding.py}
        radius={styles.radius}
        testID={testID}
        style={{
          minWidth: 0,
          opacity: styles.opacity,
          width: '100%',
        }}
      >
        {content}
      </Box>
    );
  }

  return (
    <ButtonBase
      accessibilityRole="button"
      accessibilityState={{ disabled, selected }}
      disabled={disabled}
      onPress={onPress}
      radius={variant === 'card' ? 'l' : 'm'}
      testID={testID}
    >
      {(state) => {
        const styles = resolveContainerStyles({
          variant,
          theme,
          selected,
          pressed: state.pressed,
          hovered: state.hovered,
          disabled: state.disabled,
        });

        return (
          <Box
            bg={styles.bg}
            borderColor={styles.borderColor}
            borderWidth={styles.borderWidth}
            px={padding.px}
            py={padding.py}
            radius={styles.radius}
            style={{
              minWidth: 0,
              opacity: styles.opacity,
              width: '100%',
            }}
          >
            {content}
          </Box>
        );
      }}
    </ButtonBase>
  );
}

export const ListRow = withZoraThemeScope(ListRowInner);
