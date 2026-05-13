import React from 'react';
import { Pressable, Text as ReactNativeText } from 'react-native';

import { Icon } from '../../components/icon';
import { Box, Surface } from '../../foundation';
import {
  createTabBarItemPressHandler,
  resolveNavigationItems,
} from '../../internal/resolveZoraNavigationItems';
import { useZoraTheme } from '../../theme/useZoraTheme';
import { withZoraThemeScope } from '../../theme/withZoraThemeScope';
import type { ZoraTabBarProps } from './types';

function resolveAccessibilityLabel(label: React.ReactNode, explicitLabel?: string): string | undefined {
  if (explicitLabel !== undefined) {
    return explicitLabel;
  }

  if (typeof label === 'string') {
    return label;
  }

  if (typeof label === 'number') {
    return String(label);
  }

  return undefined;
}

function ZoraTabBarInner({
  themeId: _themeId,
  mode: _mode,
  state,
  navigation,
  descriptors,
  insets,
  routeMap,
  compact = false,
  chrome = 'raised',
  testID,
}: ZoraTabBarProps) {
  const { theme } = useZoraTheme();
  const resolved = resolveNavigationItems({
    state,
    descriptors,
    routeMap,
    kind: 'tab',
  });

  const bottomInset = insets?.bottom ?? 0;
  const minHeight = compact ? 56 : 64;
  const labelSize = compact ? theme.typography.sizes.xs : theme.typography.sizes.s;
  const labelWeight = theme.typography.weights.medium;
  const content = (
    <Box
      bg="surface"
      style={{
        borderTopColor: theme.semantics.border.default,
        borderTopWidth: 1,
        flexDirection: 'row',
        minHeight: minHeight + bottomInset,
        paddingBottom: bottomInset,
      }}
      testID={testID}
    >
      {resolved.map((item) => {
        const active = item.active;
        const disabled = item.disabled;
        const contentColor = disabled
          ? theme.semantics.content.subtle
          : active
            ? theme.semantics.action.primary.base
            : theme.semantics.content.muted;
        const backgroundColor = active
          ? theme.semantics.action.primary.softBg
          : theme.semantics.surface.default;

        return (
          <Pressable
            accessibilityLabel={resolveAccessibilityLabel(
              item.label,
              item.metadata?.accessibilityLabel,
            )}
            accessibilityRole="tab"
            accessibilityState={{ selected: active, disabled }}
            disabled={disabled}
            key={item.route.key}
            onPress={createTabBarItemPressHandler({ item, navigation })}
            style={{
              alignItems: 'center',
              backgroundColor,
              flex: 1,
              justifyContent: 'center',
              minHeight,
              opacity: disabled ? 0.48 : 1,
              paddingHorizontal: theme.spacing.s,
              paddingVertical: compact ? theme.spacing.xs : theme.spacing.s,
            }}
            testID={item.metadata?.testID ?? (testID ? `${testID}-item-${item.route.key}` : undefined)}
          >
            {item.metadata?.icon ? (
              <Icon
                color={contentColor}
                name={item.metadata.icon.name}
                provider={item.metadata.icon.provider}
                size={compact ? theme.spacing.m : theme.spacing.l}
              />
            ) : null}
            <ReactNativeText
              numberOfLines={1}
              style={{
                color: contentColor,
                fontSize: labelSize,
                fontWeight: labelWeight,
                lineHeight: compact ? 16 : 20,
                marginTop: item.metadata?.icon ? theme.spacing.xs : 0,
                textAlign: 'center',
              }}
            >
              {item.label}
            </ReactNativeText>
          </Pressable>
        );
      })}
    </Box>
  );

  if (chrome === 'none') {
    return content;
  }

  return (
    <Surface variant="raised" testID={testID ? `${testID}-chrome` : undefined}>
      {content}
    </Surface>
  );
}

export const ZoraTabBar = withZoraThemeScope(ZoraTabBarInner);
