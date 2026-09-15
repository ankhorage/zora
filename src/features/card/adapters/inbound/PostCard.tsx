import React from 'react';
import { Image as ReactNativeImage } from 'react-native';

import type {
  PostAction,
  PostAuthor,
  PostCardMedia,
  PostCardProps,
  PostCommentPreview,
} from '../../../../types/post-card';
import { Avatar } from '../../../avatar/public';
import { Button } from '../../../button/public';
import { Divider, View } from '../../../layout/public';
import { withZoraThemeScope } from '../../../theme/adapters/inbound/withZoraThemeScope';
import { useZoraTheme } from '../../../theme/composition/useZoraTheme';
import { Text } from '../../../typography/public';
import { Card } from '../../public';
/***
 * Social-style post card pattern with author, content, media, and actions.
 *

 */
export const PostCard = withZoraThemeScope(PostCardInner);

function resolveAuthorName(author: PostAuthor): string | undefined {
  return typeof author.name === 'string' ? author.name : author.avatar?.name;
}

function resolveMediaAspectRatio(aspectRatio: number | undefined): number {
  if (aspectRatio === undefined || !Number.isFinite(aspectRatio) || aspectRatio <= 0) {
    return 16 / 9;
  }

  return aspectRatio;
}

function isPostCardMediaList(
  media: NonNullable<PostCardProps['media']>,
): media is readonly PostCardMedia[] {
  return Array.isArray(media);
}

function normalizeMedia(media: PostCardProps['media']): readonly PostCardMedia[] {
  if (!media) {
    return [];
  }

  if (isPostCardMediaList(media)) {
    return media;
  }

  return [media];
}

function PostCardAuthor({ author, compact = false }: { author: PostAuthor; compact?: boolean }) {
  const avatarName = resolveAuthorName(author);
  const { avatar } = author;

  return (
    <View direction="row" align="center" gap="s" wrap="nowrap">
      <Avatar
        initials={avatar?.initials}
        label={avatar?.label ?? avatarName}
        name={avatarName}
        shape={avatar?.shape}
        size={avatar?.size ?? (compact ? 's' : 'm')}
        source={avatar?.source}
        color={avatar?.color}
      />
      <View flex={1}>
        <View gap="xxs">
          <Text variant="bodySmall" weight="semiBold">
            {author.name}
          </Text>
          {author.subtitle ? (
            <Text emphasis="muted" variant="caption">
              {author.subtitle}
            </Text>
          ) : null}
        </View>
      </View>
    </View>
  );
}

function PostCardMediaItem({ media }: { media: PostCardMedia }) {
  const { theme } = useZoraTheme();
  const aspectRatio = resolveMediaAspectRatio(media.aspectRatio);

  if (!('source' in media)) {
    return (
      <View radius="m" style={{ overflow: 'hidden' }}>
        {media.children}
      </View>
    );
  }

  return (
    <View bg={theme.semantics.neutral.surface} radius="m" style={{ overflow: 'hidden' }}>
      <View style={{ aspectRatio, width: '100%' }}>
        <ReactNativeImage
          accessibilityLabel={media.label}
          source={media.source}
          style={{ height: '100%', width: '100%' }}
        />
      </View>
    </View>
  );
}

function PostActionLabel({ action }: { action: PostAction }) {
  if (!action.count) {
    return <>{action.label}</>;
  }

  return (
    <>
      {action.label} {action.count}
    </>
  );
}

function PostCardActions({ actions }: { actions: readonly PostAction[] }) {
  if (actions.length === 0) {
    return null;
  }

  return (
    <View direction="row" align="center" gap="s" wrap="wrap">
      {actions.map((action) => (
        <Button
          key={action.id}
          disabled={action.disabled}
          variant={action.selected ? 'soft' : 'ghost'}
          leadingIcon={action.icon}
          onPress={action.onPress}
          size="s"
          color={action.selected ? 'primary' : 'neutral'}
        >
          <PostActionLabel action={action} />
        </Button>
      ))}
    </View>
  );
}

function PostCommentPreviewItem({ comment }: { comment: PostCommentPreview }) {
  return (
    <View direction="row" align="flex-start" gap="s" wrap="nowrap">
      {comment.author ? <PostCardAuthor author={comment.author} compact /> : null}
      <View flex={1}>
        <View gap="xxs">
          <Text variant="bodySmall">{comment.text}</Text>
          {comment.meta ? (
            <Text emphasis="subtle" variant="caption">
              {comment.meta}
            </Text>
          ) : null}
          {comment.action ? <View>{comment.action}</View> : null}
        </View>
      </View>
    </View>
  );
}

function PostCardComments({ comments }: { comments: readonly PostCommentPreview[] }) {
  if (comments.length === 0) {
    return null;
  }

  return (
    <View gap="s">
      {comments.map((comment) => (
        <PostCommentPreviewItem key={comment.id} comment={comment} />
      ))}
    </View>
  );
}

function PostCardInner({
  themeId: _themeId,
  mode: _mode,
  interactionPolicy,
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
  const hasBody = text != null || children != null || mediaItems.length > 0;
  const hasEngagement = actions.length > 0 || comments.length > 0;

  return (
    <Card
      compact={compact}
      interactionPolicy={interactionPolicy}
      onPress={isInteractive ? onPress : undefined}
      testID={testID}
      tone={tone}
    >
      <View gap={gap}>
        <View direction="row" align="center" gap="m" justify="space-between" wrap="nowrap">
          <View flex={1}>
            <PostCardAuthor author={author} compact={compact} />
          </View>
          {headerAction ? <View>{headerAction}</View> : null}
        </View>

        {hasBody ? (
          <View gap={gap}>
            {text ? <Text variant="body">{text}</Text> : null}
            {children ? <View>{children}</View> : null}
            {mediaItems.length > 0 ? (
              <View gap="s">
                {mediaItems.map((item, index) => (
                  <PostCardMediaItem key={`${index}`} media={item} />
                ))}
              </View>
            ) : null}
          </View>
        ) : null}

        {hasEngagement ? <Divider /> : null}
        <PostCardActions actions={actions} />
        <PostCardComments comments={comments} />
        {footer ? <View pt="xs">{footer}</View> : null}
      </View>
    </Card>
  );
}
