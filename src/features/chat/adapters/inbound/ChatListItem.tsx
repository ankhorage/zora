import { Pressable } from '@ankhorage/surface';
import React from 'react';

import type { ChatListAvatar, ChatListItemProps } from '../../../../types/chat';
import { Avatar } from '../../../avatar/public';
import { Badge } from '../../../badge/public';
import { View } from '../../../layout/public';
import { withZoraThemeScope } from '../../../theme/adapters/inbound/withZoraThemeScope';
import { useZoraTheme } from '../../../theme/composition/useZoraTheme';
import { Text } from '../../../typography/public';

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
    <Badge size="s" color="primary">
      {unreadCount}
    </Badge>
  );
}

function ChatListItemInner({
  themeId: _themeId,
  mode: _mode,
  interactionPolicy,
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
      <View
        bg={styles.bg}
        borderColor={styles.borderColor}
        borderWidth={styles.borderWidth}
        px={padding.px}
        py={padding.py}
        radius="m"
        style={{ opacity: styles.opacity }}
      >
        <View direction="row" align="center" gap="m" wrap="nowrap">
          {leading ?? (
            <Avatar
              initials={avatar?.initials}
              label={avatar?.label ?? avatarName}
              name={avatarName}
              shape={avatar?.shape}
              size={avatar?.size ?? (compact ? 's' : 'm')}
              source={avatar?.source}
              color={avatar?.color}
            />
          )}

          <View flex={1}>
            <View gap="xxs">
              <View direction="row" align="center" gap="s" justify="space-between" wrap="nowrap">
                <View flex={1}>
                  <Text
                    numberOfLines={1}
                    emphasis={disabled ? 'muted' : 'default'}
                    variant="bodySmall"
                    weight={unread || selected ? 'semiBold' : 'medium'}
                  >
                    {title}
                  </Text>
                </View>
                {hasTimestamp ? (
                  <Text
                    numberOfLines={1}
                    color={unread ? 'primary' : undefined}
                    emphasis={unread ? 'default' : 'subtle'}
                    variant="caption"
                    weight={unread ? 'semiBold' : 'regular'}
                  >
                    {timestamp}
                  </Text>
                ) : null}
              </View>

              {hasSecondaryRow ? (
                <View direction="row" align="center" gap="s" justify="space-between" wrap="nowrap">
                  <View flex={1}>
                    <View gap="xxs">
                      {hasPreview ? (
                        <Text
                          numberOfLines={1}
                          emphasis={unread ? 'default' : 'muted'}
                          variant="bodySmall"
                          weight={unread ? 'medium' : 'regular'}
                        >
                          {preview}
                        </Text>
                      ) : null}
                      {hasMeta ? (
                        <Text numberOfLines={1} emphasis="subtle" variant="caption">
                          {meta}
                        </Text>
                      ) : null}
                    </View>
                  </View>

                  {hasUnreadCount || hasTrailing ? (
                    <View direction="row" align="center" gap="s" wrap="nowrap">
                      {renderUnreadCount(unreadCount)}
                      {trailing}
                    </View>
                  ) : null}
                </View>
              ) : null}
            </View>
          </View>
        </View>
      </View>
    );
  };

  if (!isInteractive) {
    return <View testID={testID}>{content({ pressed: false, hovered: false })}</View>;
  }

  return (
    <Pressable
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
      accessibilityState={{ disabled, selected }}
      disabled={disabled}
      interactionPolicy={interactionPolicy}
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
    </Pressable>
  );
}

/***
 * Chat-style list row with avatar, title, preview text, and unread indicators.
 *
 
 */
export const ChatListItem = withZoraThemeScope(ChatListItemInner);
