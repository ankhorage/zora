import React from 'react';
import { Image } from 'react-native';

import { Box, Stack } from '../../foundation';
import { useZoraTheme } from '../../theme/useZoraTheme';
import { withZoraThemeScope } from '../../theme/withZoraThemeScope';
import { Card } from '../card';
import { Heading } from '../heading';
import { Text } from '../text';
import type { MediaCardProps } from './types';

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
        <Box radius="m" style={{ overflow: 'hidden' }}>
          {image}
        </Box>
      );
    }

    if (!imageSource) {
      return null;
    }

    return (
      <Box bg={theme.semantics.neutral.surface} radius="m" style={{ overflow: 'hidden' }}>
        <Box style={{ aspectRatio: resolvedAspectRatio, width: '100%' }}>
          <Image
            accessibilityLabel={imageLabel}
            source={imageSource}
            style={{ height: '100%', width: '100%' }}
          />
        </Box>
      </Box>
    );
  };

  const hasHeader = [eyebrow, title, description, badges, actions].some((item) => item != null);

  return (
    <Card
      compact={compact}
      onPress={isInteractive ? onPress : undefined}
      testID={testID}
      tone={tone}
    >
      <Stack gap={gap}>
        {renderImage()}

        {hasHeader ? (
          <Stack
            align={{ base: 'flex-start', md: 'center' }}
            direction={{ base: 'column', md: 'row' }}
            gap="m"
            justify="space-between"
          >
            <Box flex={{ md: 1 }} width={{ base: '100%', md: 'auto' }}>
              <Stack gap="xs">
                {eyebrow ? (
                  <Text emphasis="muted" variant="caption" weight="semiBold">
                    {eyebrow}
                  </Text>
                ) : null}
                <Stack gap="xs">
                  <Heading level={compact ? 4 : 3}>{title}</Heading>
                  {badges ? <Box>{badges}</Box> : null}
                </Stack>
                {description ? (
                  <Text emphasis="muted" variant="bodySmall">
                    {description}
                  </Text>
                ) : null}
              </Stack>
            </Box>
            {actions ? <Box>{actions}</Box> : null}
          </Stack>
        ) : null}

        {children ? <Box>{children}</Box> : null}
        {footer ? <Box pt="xs">{footer}</Box> : null}
      </Stack>
    </Card>
  );
}

/***
 * Card layout with an optional media/header region and structured content slots.
 *
 * @readme
 */
export const MediaCard = withZoraThemeScope(MediaCardInner);
