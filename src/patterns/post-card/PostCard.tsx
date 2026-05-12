import React from 'react';
import { Image as ReactNativeImage } from 'react-native';

import { Avatar } from '../../components/avatar';
import { Button } from '../../components/button';
import { Card } from '../../components/card';
import { Text } from '../../components/text';
import { Box, Divider, Inline, Stack } from '../../foundation';
import { useZoraTheme } from '../../theme/useZoraTheme';
import { withZoraThemeScope } from '../../theme/withZoraThemeScope';
import type {
  PostAction,
  PostAuthor,
  PostCardMedia,
  PostCardProps,
  PostCommentPreview,
} from './types';

function resolveAuthorName(author: PostAuthor): string | undefined {
  return typeof author.name === 'string' ? author.name : author.avatar?.name;
}

function resolveMediaAspectRatio(aspectRatio: number | undefined): number {
  if (aspectRatio === undefined || !Number.isFinite(aspectRatio) || aspectRatio <= 0) {
    return 16 / 9;
  }

  return aspectRatio;
}

function normalizeMedia(media: PostCardProps['media']): readonly PostCardMedia[] {
  if (!media) {
    return [];
  }

  return Array.isArray(media) ? media : [media];
}

function PostCardAuthor({ author, compact = false }: { author: PostAuthor; compact?: boolean }) {
  const avatarName = resolveAuthorName(author);
  const avatar = author.avatar;

  return (
    <Inline align="center" gap="s" wrap="nowrap">
      <Avatar
        initials={avatar?.initials}
        label={avatar?.label ?? avatarName}
        name={avatarName}
        shape={avatar?.shape}
        size={avatar?.size ?? (compact ? 's' : 'm')}
        source={avatar?.source}
        tone={avatar?.tone}
      />
      <Box flex={1}>
        <Stack gap="xxs">
          <Text variant="bodySmall" weight="semiBold">
            {author.name}
          </Text>
          {author.subtitle ? (
            <Text tone="muted" variant="caption">
              {author.subtitle}
            </Text>
          ) : null}
        </Stack>
      </Box>
    </Inline>
  );
}

function PostCardMediaItem({ media }: { media: PostCardMedia }) {
  const { theme } = useZoraTheme();
  const aspectRatio = resolveMediaAspectRatio(media.aspectRatio);

  if (media.children) {
    return (
      <Box radius="m" style={{ overflow: 'hidden' }}>
        {media.children}
      </Box>
    );
  }

  return (
    <Box bg={theme.semantics.neutral.surface} radius="m" style={{ overflow: 'hidden' }}>
      <Box style={{ aspectRatio, width: '100%' }}>
        <ReactNativeImage
          accessibilityLabel={media.label}
          source={media.source}
          style={{ height: '100%', width: '100%' }}
        />
      </Box>
    </Box>
  );
}

function PostCardActions({ actions }: { actions: readonly PostAction[] }) {
  if (actions.length === 0) {
    return null;
  }

  return (
    <Inline align="center" gap="s" wrap="wrap">
      {actions.map((action) => (
        <Button
          key={action.id}
          disabled={action.disabled}
          emphasis={action.selected ? 'soft' : 'ghost'}
          leadingIcon={action.icon}
          onPress={action.onPress}
          size="s"
          tone={action.selected ? 'primary' : 'neutral'}
        >
          {action.count ? `${action.label} ${String(action.count)}` : action.label}
        </Button>
      ))}
    </Inline>
  );
}

function PostCommentPreviewItem({ comment }: { comment: PostCommentPreview }) {
  return (
    <Inline align="flex-start" gap="s" wrap="nowrap">
      {comment.author ? <PostCardAuthor author={comment.author} compact /> : null}
      <Box flex={1}>
        <Stack gap="xxs">
          <Text variant="bodySmall">{comment.text}</Text>
          {comment.meta ? (
            <Text tone="subtle" variant="caption">
              {comment.meta}
            </Text>
          ) : null}
          {comment.action ? <Box>{comment.action}</Box> : null}
        </Stack>
      </Box>
    </Inline>
  );
}

function PostCardComments({ comments }: { comments: readonly PostCommentPreview[] }) {
  if (comments.length === 0) {
    return null;
  }

  return (
    <Stack gap="s">
      {comments.map((comment) => (
        <PostCommentPreviewItem key={comment.id} comment={comment} />
      ))}
    </Stack>
  );
}

function PostCardInner({
  themeId: _themeId,
  mode: _mode,
  testID,
  author,
  text,
  children,
  media,
  actions = [],
  comments = [],
  headerAction,
  footer,
  tone = 'default',
  compact = false,
  onPress,
}: PostCardProps) {
  const mediaItems = normalizeMedia(media);
  const gap = compact ? 's' : 'm';
  const isInteractive = Boolean(onPress) && !headerAction;
  const hasBody = text || children || mediaItems.length > 0;
  const hasEngagement = actions.length > 0 || comments.length > 0;

  return (
    <Card compact={compact} onPress={isInteractive ? onPress : undefined} testID={testID} tone={tone}>
      <Stack gap={gap}>
        <Inline align="center" gap="m" justify="space-between" wrap="nowrap">
          <Box flex={1}>
            <PostCardAuthor author={author} compact={compact} />
          </Box>
          {headerAction ? <Box>{headerAction}</Box> : null}
        </Inline>

        {hasBody ? (
          <Stack gap={gap}>
            {text ? <Text variant="body">{text}</Text> : null}
            {children ? <Box>{children}</Box> : null}
            {mediaItems.length > 0 ? (
              <Stack gap="s">
                {mediaItems.map((item, index) => (
                  <PostCardMediaItem key={`${index}`} media={item} />
                ))}
              </Stack>
            ) : null}
          </Stack>
        ) : null}

        {hasEngagement ? <Divider /> : null}
        <PostCardActions actions={actions} />
        <PostCardComments comments={comments} />
        {footer ? <Box pt="xs">{footer}</Box> : null}
      </Stack>
    </Card>
  );
}

export const PostCard = withZoraThemeScope(PostCardInner);
