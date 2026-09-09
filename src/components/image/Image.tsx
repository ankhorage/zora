import { Image as SurfaceImage, type SurfaceImageSource } from '@ankhorage/surface';
import React from 'react';

import { Box } from '../../foundation';
import { useZoraTheme } from '../../theme/useZoraTheme';
import { withZoraThemeScope } from '../../theme/withZoraThemeScope';
import type { UploadAsset } from '../../types/upload';
import { Icon } from '../icon';
import type { ImageProps } from './types';

/*** Displays an image asset and owns its missing, unrenderable, and failed presentation states. */
export const Image = withZoraThemeScope(ImageInner);

/*** Renders the resolved image source or the canonical ZORA image placeholder. */
function ImageInner({
  themeId: _themeId,
  mode: _mode,
  interactionPolicy: _interactionPolicy,
  source,
  fallbackSource,
  alt,
  accessibilityLabel,
  width,
  height,
  aspectRatio,
  radius,
  onError,
  ...props
}: ImageProps) {
  const { theme } = useZoraTheme();
  const resolvedSource = resolveImageSource(source);
  const sourceKey = resolveImageSourceKey(source);
  const firstFailureKeyRef = React.useRef<string | null>(null);
  const [failedSourceKey, setFailedSourceKey] = React.useState<string | null>(null);
  const showPlaceholder = resolvedSource === null || failedSourceKey === sourceKey;
  const placeholderLabel = alt ?? accessibilityLabel;

  if (showPlaceholder) {
    return (
      <Box
        accessibilityLabel={placeholderLabel}
        accessibilityRole={placeholderLabel ? 'image' : undefined}
        accessible={Boolean(placeholderLabel)}
        bg={theme.semantics.neutral.surface}
        borderColor={theme.semantics.neutral.divider}
        borderWidth={1}
        height={height}
        overflow="hidden"
        radius={radius}
        width={width}
        style={{
          alignItems: 'center',
          aspectRatio: aspectRatio ?? 1,
          justifyContent: 'center',
        }}
      >
        <Icon color={theme.semantics.content.muted} name="image-outline" size={24} />
      </Box>
    );
  }

  return (
    <SurfaceImage
      {...props}
      accessibilityLabel={accessibilityLabel}
      alt={alt}
      aspectRatio={aspectRatio}
      fallbackSource={fallbackSource}
      height={height}
      onError={(event) => {
        onError?.(event);

        if (!sourceKey) {
          return;
        }

        if (fallbackSource && firstFailureKeyRef.current !== sourceKey) {
          firstFailureKeyRef.current = sourceKey;
          return;
        }

        setFailedSourceKey(sourceKey);
      }}
      radius={radius}
      source={resolvedSource}
      width={width}
    />
  );
}

/*** Resolves a generic upload asset into a source understood by the Surface Image primitive. */
function resolveImageSource(
  source: ImageProps['source'],
): SurfaceImageSource | null | undefined {
  if (!isUploadAsset(source)) {
    return source;
  }

  switch (source.kind) {
    case 'local':
      return source.uri;
    case 'url':
      return source.url;
    case 'storage':
      return source.publicUrl ?? null;
  }
}

/*** Produces a stable-enough key for tracking image failures across source changes. */
function resolveImageSourceKey(source: ImageProps['source']): string | null {
  if (source === null || source === undefined) {
    return null;
  }

  if (isUploadAsset(source)) {
    switch (source.kind) {
      case 'local':
        return `local:${source.uri}`;
      case 'url':
        return `url:${source.url}`;
      case 'storage':
        return `storage:${source.bucket}:${source.path}:${source.publicUrl ?? ''}`;
    }
  }

  if (typeof source === 'string' || typeof source === 'number') {
    return `source:${String(source)}`;
  }

  if (!Array.isArray(source) && 'uri' in source && typeof source.uri === 'string') {
    return `source:${source.uri}`;
  }

  return 'source:opaque';
}

/*** Identifies the generic ZORA upload asset shape without leaking picker-specific types. */
function isUploadAsset(source: ImageProps['source']): source is UploadAsset {
  return (
    typeof source === 'object' &&
    source !== null &&
    !Array.isArray(source) &&
    'kind' in source &&
    (source.kind === 'local' || source.kind === 'url' || source.kind === 'storage')
  );
}
