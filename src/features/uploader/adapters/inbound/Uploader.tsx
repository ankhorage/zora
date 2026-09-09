import React from 'react';

import { Button } from '../../../../components/button';
import { Icon } from '../../../../components/icon';
import { Image } from '../../../../components/image';
import { Modal } from '../../../../components/modal';
import { Progress } from '../../../../components/progress';
import { Text } from '../../../../components/text';
import { Box, Stack } from '../../../../foundation';
import { FormField } from '../../../../patterns/form-field';
import { withZoraThemeScope } from '../../../../theme/withZoraThemeScope';
import type { UploadAsset, UploadType, UploaderProps } from '../../../../types/upload';
import { validateUploadAsset } from '../../application/use-cases/validateUploadAsset';
import { createUploadPicker } from '../../composition/createUploadPicker';

/*** Picks, validates, uploads, previews, and removes one generic file asset. */
export const Uploader = withZoraThemeScope(UploaderInner);

/*** Owns the interactive state for the generic uploader inbound adapter. */
function UploaderInner({
  themeId: _themeId,
  mode: _mode,
  testID,
  value,
  onChange,
  label,
  description,
  helperText,
  errorText,
  type = 'file',
  accept,
  maxSizeBytes,
  required,
  disabled = false,
  readOnly = false,
  validatePicked,
  onUpload,
  onRemove,
  aspectRatio = 1,
  interactionPolicy,
}: UploaderProps) {
  const passive = interactionPolicy === 'passive';
  const picker = React.useMemo(() => createUploadPicker(), []);
  const [internalError, setInternalError] = React.useState<string | undefined>();
  const [uploading, setUploading] = React.useState(false);
  const [removing, setRemoving] = React.useState(false);
  const [progress, setProgress] = React.useState<number | null>(null);
  const [previewOpen, setPreviewOpen] = React.useState(false);
  const mountedRef = React.useRef(true);
  const resolvedAccept = resolveUploadAccept(type, accept);
  const actionsDisabled = disabled || readOnly;
  const effectiveError = errorText ?? internalError;

  React.useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const setProgressSafe = React.useCallback((next: number | null) => {
    if (!mountedRef.current) {
      return;
    }

    setProgress(clampProgress(next));
  }, []);

  const handlePick = React.useCallback(async () => {
    if (passive || actionsDisabled || uploading || removing) {
      return;
    }

    setInternalError(undefined);

    try {
      const picked = await picker.pickAsync({ accept: resolvedAccept, type });
      if (!picked || !mountedRef.current) {
        return;
      }

      const validationError = validateUploadAsset({
        accept: resolvedAccept,
        asset: picked,
        maxSizeBytes,
        validate: validatePicked,
      });
      if (validationError) {
        setInternalError(validationError);
        return;
      }

      onChange(picked);
      if (!onUpload) {
        return;
      }

      setUploading(true);
      setProgressSafe(0);

      try {
        const uploaded = await onUpload(picked, { setProgress: setProgressSafe });
        if (!mountedRef.current) {
          return;
        }

        onChange(uploaded);
        setUploading(false);
        setProgress(null);
      } catch (error) {
        if (!mountedRef.current) {
          return;
        }

        setInternalError(formatUnknownError(error));
        setUploading(false);
        setProgress(null);
      }
    } catch (error) {
      if (mountedRef.current) {
        setInternalError(formatUnknownError(error));
      }
    }
  }, [
    actionsDisabled,
    maxSizeBytes,
    onChange,
    onUpload,
    passive,
    picker,
    removing,
    resolvedAccept,
    setProgressSafe,
    type,
    uploading,
    validatePicked,
  ]);

  const handleRemove = React.useCallback(async () => {
    if (passive || actionsDisabled || uploading || removing || !value) {
      return;
    }

    setInternalError(undefined);
    if (!onRemove) {
      onChange(null);
      return;
    }

    setRemoving(true);
    try {
      await onRemove(value);
      if (mountedRef.current) {
        onChange(null);
        setRemoving(false);
      }
    } catch (error) {
      if (mountedRef.current) {
        setInternalError(formatUnknownError(error));
        setRemoving(false);
      }
    }
  }, [actionsDisabled, onChange, onRemove, passive, removing, uploading, value]);

  const canPreviewImage = type === 'image' && resolveRenderableAssetUrl(value) !== null;

  return (
    <>
      <FormField
        description={description}
        disabled={disabled}
        errorText={effectiveError}
        helperText={helperText}
        interactionPolicy={interactionPolicy}
        invalid={Boolean(effectiveError)}
        label={label}
        readOnly={readOnly}
        required={required}
        testID={testID}
      >
        <Stack gap="m">
          <UploadPresentation asset={value} aspectRatio={aspectRatio} type={type} />

          {resolvedAccept || maxSizeBytes ? (
            <Stack gap="xs">
              {resolvedAccept ? (
                <Text emphasis="muted" variant="caption">
                  Accepted: {resolvedAccept}
                </Text>
              ) : null}
              {maxSizeBytes ? (
                <Text emphasis="muted" variant="caption">
                  Max size: {formatBytes(maxSizeBytes)}
                </Text>
              ) : null}
            </Stack>
          ) : null}

          {uploading ? (
            <Stack gap="xs">
              <Text emphasis="muted" variant="caption">
                Uploading…
              </Text>
              {progress !== null ? <Progress max={1} value={progress} /> : null}
            </Stack>
          ) : null}

          <Stack direction={{ base: 'column', md: 'row' }} gap="s">
            <Button
              disabled={actionsDisabled || uploading || removing}
              interactionPolicy={interactionPolicy}
              onPress={() => {
                void handlePick();
              }}
            >
              {value ? 'Replace file' : 'Select file'}
            </Button>

            {value ? (
              <Button
                color="danger"
                disabled={actionsDisabled || uploading || removing}
                interactionPolicy={interactionPolicy}
                loading={removing}
                variant="outline"
                onPress={() => {
                  void handleRemove();
                }}
              >
                Remove
              </Button>
            ) : null}

            {canPreviewImage ? (
              <Button
                color="neutral"
                interactionPolicy={interactionPolicy}
                variant="soft"
                onPress={() => setPreviewOpen(true)}
              >
                Preview
              </Button>
            ) : null}
          </Stack>
        </Stack>
      </FormField>

      {canPreviewImage ? (
        <Modal
          closeOnBackdrop
          interactionPolicy={interactionPolicy}
          onDismiss={() => setPreviewOpen(false)}
          title="Image preview"
          visible={previewOpen}
        >
          <Stack gap="m">
            <Image aspectRatio={aspectRatio} fit="contain" source={value} />
            <Stack direction="row" justify="flex-end">
              <Button
                color="neutral"
                interactionPolicy={interactionPolicy}
                variant="soft"
                onPress={() => setPreviewOpen(false)}
              >
                Close
              </Button>
            </Stack>
          </Stack>
        </Modal>
      ) : null}
    </>
  );
}

/*** Renders image previews or generic file metadata without exposing picker-specific assets. */
function UploadPresentation({
  asset,
  aspectRatio,
  type,
}: {
  asset: UploadAsset | null;
  aspectRatio: number;
  type: UploadType;
}) {
  if (type === 'image') {
    return <Image aspectRatio={aspectRatio} source={asset} />;
  }

  return (
    <Box borderWidth={1} p="m" radius="m">
      <Stack direction="row" gap="s">
        <Icon name={resolveUploadIcon(type)} size={22} />
        <Stack gap="xs">
          <Text variant="label" weight="semiBold">
            {asset?.fileName ?? 'No file selected'}
          </Text>
          {asset?.contentType ? (
            <Text emphasis="muted" variant="caption">
              {asset.contentType}
            </Text>
          ) : null}
        </Stack>
      </Stack>
    </Box>
  );
}

/*** Resolves the native picker default while allowing accept to remain the precise restriction. */
function resolveUploadAccept(type: UploadType, accept: string | undefined): string | undefined {
  if (accept) {
    return accept;
  }

  if (type === 'image') {
    return 'image/*';
  }

  if (type === 'video') {
    return 'video/*';
  }

  return undefined;
}

/*** Resolves an upload asset URL when it can be rendered directly. */
function resolveRenderableAssetUrl(asset: UploadAsset | null): string | null {
  if (!asset) {
    return null;
  }

  switch (asset.kind) {
    case 'local':
      return asset.uri;
    case 'url':
      return asset.url;
    case 'storage':
      return asset.publicUrl ?? null;
  }
}

/*** Resolves a generic icon for the selected upload mode. */
function resolveUploadIcon(type: UploadType): string {
  switch (type) {
    case 'video':
      return 'videocam-outline';
    case 'document':
      return 'document-text-outline';
    case 'file':
    case 'image':
      return 'attach-outline';
  }
}

/*** Clamps progress callbacks into the normalized 0..1 range. */
function clampProgress(value: number | null): number | null {
  if (value === null || !Number.isFinite(value)) {
    return null;
  }

  return Math.max(0, Math.min(1, value));
}

/*** Converts unknown picker/upload failures into user-facing text. */
function formatUnknownError(error: unknown): string {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  if (typeof error === 'string' && error.trim().length > 0) {
    return error;
  }

  return 'Something went wrong.';
}

/*** Formats an upload byte limit for concise helper text. */
function formatBytes(value: number): string {
  if (!Number.isFinite(value) || value <= 0) {
    return '0 B';
  }

  const units = ['B', 'KB', 'MB', 'GB'] as const;
  let size = value;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex += 1;
  }

  const unit = units.at(unitIndex) ?? 'B';
  const rounded = unitIndex === 0 ? Math.round(size) : Math.round(size * 10) / 10;
  return `${rounded} ${unit}`;
}
