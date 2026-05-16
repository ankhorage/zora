import { ButtonBase } from '@ankhorage/surface';
import React from 'react';

import { Avatar } from '../../components/avatar';
import { Text } from '../../components/text';
import { Box, Inline, Stack } from '../../foundation';
import { useZoraTheme } from '../../theme/useZoraTheme';
import { withZoraThemeScope } from '../../theme/withZoraThemeScope';
import type {
  MessageBubbleAvatar,
  MessageBubbleDirection,
  MessageBubbleProps,
  MessageBubbleStatus,
} from './types';

function resolveAvatarName({
  avatar,
  authorName,
}: {
  avatar: MessageBubbleAvatar | undefined;
  authorName: React.ReactNode | undefined;
}): string | undefined {
  if (avatar?.name) return avatar.name;
  return typeof authorName === 'string' ? authorName : undefined;
}

function resolvePadding(compact: boolean) {
  return compact ? { px: 'm' as const, py: 's' as const } : { px: 'm' as const, py: 'm' as const };
}

function resolveStatusLabel(status: MessageBubbleStatus): string {
  switch (status) {
    case 'sending':
      return 'Sending';
    case 'sent':
      return 'Sent';
    case 'delivered':
      return 'Delivered';
    case 'read':
      return 'Read';
    case 'failed':
      return 'Failed';
    default:
      return status;
  }
}

function isMessageBubbleStatus(
  status: MessageBubbleProps['status'],
): status is MessageBubbleStatus {
  return (
    status === 'sending' ||
    status === 'sent' ||
    status === 'delivered' ||
    status === 'read' ||
    status === 'failed'
  );
}

function resolveStatus(status: MessageBubbleProps['status']) {
  if (status == null) return null;
  return isMessageBubbleStatus(status) ? resolveStatusLabel(status) : status;
}

function resolveBubbleStyles({
  direction,
  disabled,
  hovered,
  pressed,
  selected,
  theme,
}: {
  direction: MessageBubbleDirection;
  disabled: boolean;
  hovered: boolean;
  pressed: boolean;
  selected: boolean;
  theme: ReturnType<typeof useZoraTheme>['theme'];
}) {
  const borderColor = selected ? theme.semantics.border.focus : theme.semantics.border.default;

  if (direction === 'system') {
    return {
      bg: selected ? theme.semantics.neutral.surface : 'transparent',
      borderColor,
      borderWidth: selected ? 1 : 0,
      opacity: disabled ? 0.72 : 1,
    };
  }

  const interactiveBg = pressed
    ? theme.semantics.neutral.surfaceActive
    : hovered
      ? theme.semantics.neutral.surfaceHover
      : undefined;

  return {
    bg:
      interactiveBg ??
      (direction === 'outgoing' ? theme.semantics.neutral.surface : theme.semantics.surface.raised),
    borderColor,
    borderWidth: selected ? 1 : 0,
    opacity: disabled ? 0.72 : 1,
  };
}

function MessageAvatar({
  avatar,
  authorName,
  compact,
}: {
  avatar: MessageBubbleAvatar;
  authorName: React.ReactNode | undefined;
  compact: boolean;
}) {
  const avatarName = resolveAvatarName({ avatar, authorName });

  return (
    <Avatar
      initials={avatar.initials}
      label={avatar.label ?? avatarName}
      name={avatarName}
      shape={avatar.shape}
      size={avatar.size ?? (compact ? 'xs' : 's')}
      source={avatar.source}
      color={avatar.color}
    />
  );
}

function MessageBubbleInner({
  themeId: _themeId,
  mode: _mode,
  testID,
  direction = 'incoming',
  text,
  children,
  author,
  timestamp,
  meta,
  status,
  leading,
  trailing,
  footer,
  selected = false,
  disabled = false,
  compact = false,
  accessibilityLabel,
  onPress,
}: MessageBubbleProps) {
  const { theme } = useZoraTheme();
  const padding = resolvePadding(compact);
  const isInteractive = Boolean(onPress);
  const isOutgoing = direction === 'outgoing';
  const isSystem = direction === 'system';
  const renderedStatus = resolveStatus(status);
  const authorName = author?.name;
  const authorAvatar = author?.avatar;
  const hasAuthorName = authorName != null && !isOutgoing && !isSystem;
  const hasAvatar = authorAvatar != null && !isOutgoing && !isSystem;
  const hasMetaRow = timestamp != null || meta != null || renderedStatus != null;

  const renderBubble = ({ pressed, hovered }: { pressed: boolean; hovered: boolean }) => {
    const styles = resolveBubbleStyles({ direction, disabled, hovered, pressed, selected, theme });

    return (
      <Box
        bg={styles.bg}
        borderColor={styles.borderColor}
        borderWidth={styles.borderWidth}
        px={padding.px}
        py={padding.py}
        radius={isSystem ? 'm' : 'l'}
        style={{ maxWidth: compact ? 420 : 560, opacity: styles.opacity }}
      >
        <Stack align={isSystem ? 'center' : 'flex-start'} gap={compact ? 'xxs' : 'xs'}>
          {hasAuthorName ? (
            <Text emphasis="muted" variant="caption" weight="semiBold">
              {authorName}
            </Text>
          ) : null}
          {text != null ? (
            <Text align={isSystem ? 'center' : undefined} emphasis={disabled ? 'muted' : 'default'}>
              {text}
            </Text>
          ) : null}
          {children != null ? <Box width="100%">{children}</Box> : null}
          {hasMetaRow ? (
            <Inline
              align="center"
              gap="xs"
              justify={isOutgoing ? 'flex-end' : isSystem ? 'center' : 'flex-start'}
              wrap="wrap"
            >
              {timestamp != null ? (
                <Text emphasis="subtle" variant="caption">
                  {timestamp}
                </Text>
              ) : null}
              {meta != null ? (
                <Text emphasis="subtle" variant="caption">
                  {meta}
                </Text>
              ) : null}
              {renderedStatus != null ? (
                <Text
                  color={status === 'failed' ? 'danger' : undefined}
                  emphasis={status === 'failed' ? 'default' : 'subtle'}
                  variant="caption"
                >
                  {renderedStatus}
                </Text>
              ) : null}
            </Inline>
          ) : null}
        </Stack>
      </Box>
    );
  };

  const bubbleContent = isInteractive ? (
    <ButtonBase
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
      accessibilityState={{ disabled, selected }}
      disabled={disabled}
      onPress={onPress}
      radius={isSystem ? 'm' : 'l'}
      testID={testID}
    >
      {(state) => renderBubble({ pressed: state.pressed, hovered: state.hovered })}
    </ButtonBase>
  ) : (
    <Box testID={testID}>{renderBubble({ pressed: false, hovered: false })}</Box>
  );

  return (
    <Stack gap="xs" style={{ width: '100%' }}>
      <Inline
        align="flex-end"
        gap="s"
        justify={isSystem ? 'center' : isOutgoing ? 'flex-end' : 'flex-start'}
        wrap="nowrap"
      >
        {!isOutgoing && !isSystem ? (
          <Box>
            {leading ??
              (hasAvatar ? (
                <MessageAvatar avatar={authorAvatar} authorName={authorName} compact={compact} />
              ) : null)}
          </Box>
        ) : null}
        {isOutgoing && trailing ? <Box>{trailing}</Box> : null}
        {bubbleContent}
        {isOutgoing && leading ? <Box>{leading}</Box> : null}
        {!isOutgoing && !isSystem && trailing ? <Box>{trailing}</Box> : null}
      </Inline>
      {footer != null ? (
        <Box alignSelf={isOutgoing ? 'flex-end' : isSystem ? 'center' : 'flex-start'}>{footer}</Box>
      ) : null}
    </Stack>
  );
}

export const MessageBubble = withZoraThemeScope(MessageBubbleInner);
