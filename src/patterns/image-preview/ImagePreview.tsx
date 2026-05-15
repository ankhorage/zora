import React from 'react';

import { Image } from '../../components/image';
import { Text } from '../../components/text';
import { Box, Stack } from '../../foundation';
import { useZoraTheme } from '../../theme/useZoraTheme';
import { withZoraThemeScope } from '../../theme/withZoraThemeScope';
import type { ImagePreviewProps, ZoraImageAsset } from './types';

function resolveRenderableUrl(asset: ZoraImageAsset | null | undefined): string | null {
  if (!asset) return null;

  if (asset.kind === 'url') {
    return asset.url;
  }

  return asset.publicUrl ?? null;
}

function resolveSafeAspectRatio(value: number | undefined): number {
  if (!value || !Number.isFinite(value) || value <= 0) {
    return 1;
  }

  return value;
}

function ImagePreviewInner({
  themeId: _themeId,
  mode: _mode,
  testID,
  asset,
  aspectRatio,
  fit = 'cover',
  emptyTitle = 'No image',
  emptyDescription = 'Select an image to preview it here.',
}: ImagePreviewProps) {
  const { theme } = useZoraTheme();
  const renderableUrl = resolveRenderableUrl(asset);
  const resolvedAspectRatio = resolveSafeAspectRatio(aspectRatio);

  return (
    <Box
      bg={theme.semantics.neutral.surface}
      borderColor={theme.semantics.neutral.divider}
      borderWidth={1}
      radius="l"
      testID={testID}
      style={{ overflow: 'hidden' }}
    >
      {renderableUrl ? (
        <Box style={{ aspectRatio: resolvedAspectRatio, width: '100%' }}>
          <Image
            alt={asset?.alt}
            fit={fit}
            source={renderableUrl}
            style={{ height: '100%', width: '100%' }}
          />
        </Box>
      ) : (
        <Box p="l">
          <Stack gap="xs">
            <Text variant="label" weight="semiBold">
              {emptyTitle}
            </Text>
            <Text color="muted" variant="bodySmall">
              {emptyDescription}
            </Text>
          </Stack>
        </Box>
      )}
    </Box>
  );
}

export const ImagePreview = withZoraThemeScope(ImagePreviewInner);
