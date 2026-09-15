import React from 'react';
import { Image } from 'react-native';

import type { MediaCardProps } from '../../../../types/media-card';
import { View } from '../../../layout/public';
import { withZoraThemeScope } from '../../../theme/adapters/inbound/withZoraThemeScope';
import { useZoraTheme } from '../../../theme/composition/useZoraTheme';
import { Heading } from '../../../typography/public';
import { Text } from '../../../typography/public';
import { Card } from '../../public';
/***
 * Card layout with an optional media/header region and structured content slots.
 */
export const MediaCard = withZoraThemeScope(MediaCardInner);

function resolveImageAspectRatio(
  imageAspectRatio: NonNullable<MediaCardProps['imageAspectRatio']>,
) {
  if (!Number.isFinite(imageAspectRatio) || imageAspectRatio <= 0) {
    return 16 / 9;
  }

  return imageAspectRatio;
}

function MediaCardInner({
  themeId: _themeId,
  mode: _mode,
  interactionPolicy,
  testID,
  imageSource,
  imageLabel,
  image,
  imageAspectRatio = 16 / 9,
  title,
  description,
  eyebrow,
  badges,
  actions,
  footer,
  children,
  tone = 'default',
  compact = false,
  onPress,
}: MediaCardProps) {
  const { theme } = useZoraTheme();
  const gap = compact ? 's' : 'm';
  const isInteractive = Boolean(onPress) && !actions;
  const resolvedAspectRatio = resolveImageAspectRatio(imageAspectRatio);

  const renderImage = () => {
    if (image) {
      return (
        <View radius="m" style={{ overflow: 'hidden' }}>
          {image}
        </View>
      );
    }

    if (!imageSource) {
      return null;
    }

    return (
      <View bg={theme.semantics.neutral.surface} radius="m" style={{ overflow: 'hidden' }}>
        <View style={{ aspectRatio: resolvedAspectRatio, width: '100%' }}>
          <Image
            accessibilityLabel={imageLabel}
            source={imageSource}
            style={{ height: '100%', width: '100%' }}
          />
        </View>
      </View>
    );
  };

  const hasHeader = [eyebrow, title, description, badges, actions].some((item) => item != null);

  return (
    <Card
      compact={compact}
      interactionPolicy={interactionPolicy}
      onPress={isInteractive ? onPress : undefined}
      testID={testID}
      tone={tone}
    >
      <View gap={gap}>
        {renderImage()}

        {hasHeader ? (
          <View
            align={{ base: 'flex-start', md: 'center' }}
            direction={{ base: 'column', md: 'row' }}
            gap="m"
            justify="space-between"
          >
            <View flex={{ md: 1 }} width={{ base: '100%', md: 'auto' }}>
              <View gap="xs">
                {eyebrow ? (
                  <Text emphasis="muted" variant="caption" weight="semiBold">
                    {eyebrow}
                  </Text>
                ) : null}
                <View gap="xs">
                  <Heading level={compact ? 4 : 3}>{title}</Heading>
                  {badges ? <View>{badges}</View> : null}
                </View>
                {description ? (
                  <Text emphasis="muted" variant="bodySmall">
                    {description}
                  </Text>
                ) : null}
              </View>
            </View>
            {actions ? <View>{actions}</View> : null}
          </View>
        ) : null}

        {children ? <View>{children}</View> : null}
        {footer ? <View pt="xs">{footer}</View> : null}
      </View>
    </Card>
  );
}
