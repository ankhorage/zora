import { ButtonBase } from '@ankhorage/surface';
import React from 'react';

import { Avatar } from '../../components/avatar';
import { Badge } from '../../components/badge';
import { Text } from '../../components/text';
import { Box, Inline, Stack } from '../../foundation';
import { useZoraTheme } from '../../theme/useZoraTheme';
import { withZoraThemeScope } from '../../theme/withZoraThemeScope';
import type { ChatListAvatar, ChatListItemProps } from './types';

function resolveAvatarName({
  avatar,
  title,
}: {
  avatar: ChatListAvatar | undefined;
  title: React.ReactNode;
}): string | undefined {
  if (avatar?.name) {
    return avatar.name;
  }

  return typeof title === 'string' ? title : undefined;
}

function resolvePadding(compact: boolean) {
  return compact ? { px: 'm' as const, py: 's' as const } : { px: 'm' as const, py: 'm' as const };
}

function resolveContainerStyles({
  theme,
  selected,
  pressed,
  hovered,
  disabled,
}: {
  theme: ReturnType<typeof useZoraTheme>['theme'];
  selected: boolean;
  pressed: boolean;
  hovered: boolean;
  disabled: boolean;
}) {
  const borderColor = selected ? theme.semantics.border.focus : 'transparent';

  return {
    bg: pressed
      ? theme.semantics.neutral.surfaceActive
      : hovered
        ? theme.semantics.neutral.surfaceHover
        : selected
          ? theme.semantics.neutral.surface
          : 'transparent',
    borderColor,
    borderWidth: selected ? 1 : 0,
    opacity: disabled ? 0.72 : 1,
  };
}

function renderUnreadCount(unreadCount: React.ReactNode) {
  if (unreadCount == null) {
    return null;
  }

  return (
    <Badge size="s" tone="primary">
      {unreadCount}
    </Badge>
  );
}

function ChatListItemInner({
  themeId: _themeId,
  mode: _mode,
  testID,
  title,
  preview,
  meta,
  timestamp,
  avatar,
  leading,
  trailing,
  unread = false,
  unreadCount,
  selected = false,
  disabled = false,
  compact = false,
  accessibilityLabel,
  onPress,
}: ChatListItemProps) {
  const { theme } = useZoraTheme();
  const padding = resolvePadding(compact);
  const avatarName = resolveAvatarName({ avatar, title });
  const isInteractive = Boolean(onPress);
  const hasTimestamp = timestamp != null;
  const hasPreview = preview != null;
  const hasMeta = meta != null;
  const hasTrailing = trailing != null;
  const hasUnreadCount = unreadCount != null;
  const hasSecondaryRow = hasPreview || hasMeta || hasUnreadCount || hasTrailing;

  const content = ({ pressed, hovered }: { pressed: boolean; hovered: boolean }) => {
    const styles = resolveContainerStyles({
      theme,
      selected,
      pressed,
      hovered,
      disabled,
    });

    return (
      <Box
        bg={styles.bg}
        borderColor={styles.borderColor}
        borderWidth={styles.borderWidth}
        px={padding.px}
        py={padding.py}
        radius="m"
        style={{ alignSelf: 'stretch', maxWidth: '100%', minWidth: 0, opacity: styles.opacity }}
      >
        <Stack
          align="center"
          direction="row"
          gap="m"
          style={{ alignSelf: 'stretch', maxWidth: '100%', minWidth: 0 }}
        >
          <Box style={{ flexShrink: 0 }}>
            {leading ?? (
              <Avatar
                initials={avatar?.initials}
                label={avatar?.label ?? avatarName}
                name={avatarName}
                shape={avatar?.shape}
                size={avatar?.size ?? (compact ? 's' : 'm')}
                source={avatar?.source}
                tone={avatar?.tone}
              />
            )}
          </Box>

          <Box flex={1} style={{ minWidth: 0 }}>
            <Stack gap="xxs" style={{ minWidth: 0 }}>
              <Inline align="center" gap="s" justify="space-between" wrap="nowrap" style={{ minWidth: 0 }}>
                <Box flex={1} style={{ minWidth: 0 }}>
                  <Text
                    numberOfLines={1}
                    tone={disabled ? 'muted' : 'default'}
                    variant="bodySmall"
                    weight={unread || selected ? 'semiBold' : 'medium'}
                  >
                    {title}
                  </Text>
                </Box>
                {hasTimestamp ? (
                  <Box style={{ flexShrink: 0 }}>
                    <Text
                      numberOfLines={1}
                      tone={unread ? 'primary' : 'subtle'}
                      variant="caption"
                      weight={unread ? 'semiBold' : 'regular'}
                    >
                      {timestamp}
                    </Text>
                  </Box>
                ) : null}
              </Inline>

              {hasSecondaryRow ? (
                <Inline align="center" gap="s" justify="space-between" wrap="nowrap" style={{ minWidth: 0 }}>
                  <Box flex={1} style={{ minWidth: 0 }}>
                    <Stack gap="xxs" style={{ minWidth: 0 }}>
                      {hasPreview ? (
                        <Text
                          numberOfLines={1}
                          tone={unread ? 'default' : 'muted'}
                          variant="bodySmall"
                          weight={unread ? 'medium' : 'regular'}
                        >
                          {preview}
                        </Text>
                      ) : null}
                      {hasMeta ? (
                        <Text numberOfLines={1} tone="subtle" variant="caption">
                          {meta}
                        </Text>
                      ) : null}
                    </Stack>
                  </Box>

                  {hasUnreadCount || hasTrailing ? (
                    <Inline align="center" gap="s" wrap="nowrap" style={{ flexShrink: 0 }}>
                      {renderUnreadCount(unreadCount)}
                      {trailing}
                    </Inline>
                  ) : null}
                </Inline>
              ) : null}
            </Stack>
          </Box>
        </Stack>
      </Box>
    );
  };

  if (!isInteractive) {
    return <Box testID={testID}>{content({ pressed: false, hovered: false })}</Box>;
  }

  return (
    <ButtonBase
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
      accessibilityState={{ disabled, selected }}
      disabled={disabled}
      onPress={onPress}
      radius="m"
      testID={testID}
    >
      {(state) =>
        content({
          pressed: state.pressed,
          hovered: state.hovered,
        })
      }
    </ButtonBase>
  );
}

export const ChatListItem = withZoraThemeScope(ChatListItemInner);
